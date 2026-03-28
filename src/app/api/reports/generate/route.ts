import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude/client'
import { buildReportPrompt } from '@/lib/claude/prompts'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { days = 7 } = await request.json()

    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Fetch sessions in range
    const { data: sessions } = await supabase
      .from('journal_sessions')
      .select(`*, journal_questions(*), journal_entries(*)`)
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .gte('session_date', startDate)
      .lte('session_date', endDate)
      .order('session_date', { ascending: true })

    if (!sessions || sessions.length < 1) {
      return NextResponse.json({ error: 'Not enough entries to generate a report. Complete at least 1 journal session first.' }, { status: 400 })
    }

    const sessionsWithData = sessions.map((s: any) => ({
      ...s,
      questions: s.journal_questions ?? [],
      entries: s.journal_entries ?? [],
    }))

    const periodLabel = `${days === 7 ? 'Last 7 days' : `Last ${days} days`} (${startDate} to ${endDate})`
    const prompt = buildReportPrompt(profile, sessionsWithData, periodLabel)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected AI response')

    let reportContent
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      reportContent = JSON.parse(jsonMatch ? jsonMatch[0] : content.text)
    } catch {
      throw new Error('Failed to parse report from AI response')
    }

    // Save report
    const { data: report, error: saveError } = await supabase
      .from('ai_reports')
      .insert({
        user_id: user.id,
        report_type: days <= 7 ? 'weekly' : 'monthly',
        period_start: startDate,
        period_end: endDate,
        report_content: reportContent,
      })
      .select()
      .single()

    if (saveError) throw saveError

    return NextResponse.json({ report })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
