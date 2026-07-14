import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Bug fix: allow up to 60s for this route (Claude API calls can take 15-30s)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId, answers, moodScore, complete } = await request.json()

    // Bug fix: delete + insert instead of upsert (avoids needing a DB unique constraint)
    for (const answer of answers) {
      if (!answer.text?.trim()) continue

      const wordCount = answer.text.trim().split(/\s+/).length

      // Remove any existing answer for this question in this session, then insert fresh
      await supabase
        .from('journal_entries')
        .delete()
        .eq('question_id', answer.questionId)
        .eq('session_id', sessionId)

      await supabase.from('journal_entries').insert({
        session_id: sessionId,
        question_id: answer.questionId,
        user_id: user.id,
        response_text: answer.text,
        input_method: answer.inputMethod ?? 'text',
        word_count: wordCount,
      })
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
