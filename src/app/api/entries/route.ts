import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId, answers, moodScore, complete } = await request.json()

    // Upsert entries for each answer
    for (const answer of answers) {
      if (!answer.text?.trim()) continue

      const wordCount = answer.text.trim().split(/\s+/).length

      await supabase.from('journal_entries').upsert({
        session_id: sessionId,
        question_id: answer.questionId,
        user_id: user.id,
        response_text: answer.text,
        input_method: answer.inputMethod ?? 'text',
        word_count: wordCount,
      }, { onConflict: 'question_id,user_id' })
    }

    // Update session with mood and completion
    if (complete) {
      await supabase
        .from('journal_sessions')
        .update({ mood_score: moodScore, completed_at: new Date().toISOString() })
        .eq('id', sessionId)
        .eq('user_id', user.id)
    } else if (moodScore) {
      await supabase
        .from('journal_sessions')
        .update({ mood_score: moodScore })
        .eq('id', sessionId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Save entry error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
