import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude/client'
import { buildQuestionPrompt } from '@/lib/claude/prompts'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId, sessionDate } = await request.json()

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Fetch last 7 sessions with questions + entries
    const { data: recentSessions } = await supabase
      .from('journal_sessions')
      .select(`
        *,
        journal_questions(*),
        journal_entries(*)
      `)
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('session_date', { ascending: false })
      .limit(7)

    const sessionsWithData = (recentSessions ?? []).map((s: any) => ({
      ...s,
      questions: s.journal_questions ?? [],
      entries: s.journal_entries ?? [],
    }))

    // Generate questions with Claude
    const prompt = buildQuestionPrompt(profile, sessionsWithData, 3)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    let questions
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/)
      questions = JSON.parse(jsonMatch ? jsonMatch[0] : content.text)
    } catch {
      throw new Error('Failed to parse questions from AI response')
    }

    // Save questions to DB
    const questionsToInsert = questions.map((q: any, i: number) => ({
      session_id: sessionId,
      user_id: user.id,
      question_text: q.question,
      category: q.category,
      sequence_order: i + 1,
      rationale: q.rationale,
    }))

    const { data: savedQuestions, error: insertError } = await supabase
      .from('journal_questions')
      .insert(questionsToInsert)
      .select()

    if (insertError) throw insertError

    return NextResponse.json({ questions: savedQuestions })
  } catch (error: any) {
    console.error('Question generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
