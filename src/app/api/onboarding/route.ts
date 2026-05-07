import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude/client'
import { buildOnboardingSummaryPrompt } from '@/lib/claude/prompts'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await request.json()

    // Generate AI user summary
    let aiSummary = ''
    try {
      const prompt = buildOnboardingSummaryPrompt(data)
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      })
      const content = message.content[0]
      if (content.type === 'text') aiSummary = content.text
    } catch (e) {
      console.error('AI summary generation failed, continuing without it:', e)
    }

    // Update profile with all onboarding data
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: data.display_name,
        age_range: data.age_range,
        gender_identity: data.gender_identity,
        life_situation: data.life_situation,
        goals: data.goals,
        challenges: data.challenges,
        feedback_style: data.feedback_style,
        ai_user_summary: aiSummary,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Onboarding save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
