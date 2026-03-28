'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/layout/AppShell'
import Header from '@/components/layout/Header'
import QuestionCard from '@/components/journal/QuestionCard'
import MoodSelector from '@/components/journal/MoodSelector'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { getTodayString, getGreeting, getMoodEmoji } from '@/lib/utils/date'
import type { JournalQuestion, JournalSession, Profile } from '@/types'

type PageState = 'loading' | 'generating' | 'journaling' | 'mood' | 'done' | 'already_done' | 'error'

interface Answer { questionId: string; text: string; inputMethod: 'text' | 'voice' }

export default function JournalPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<JournalSession | null>(null)
  const [questions, setQuestions] = useState<JournalQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof)

    const today = getTodayString()
    const { data: existingSession } = await supabase
      .from('journal_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .single()

    if (existingSession?.completed_at) {
      setSession(existingSession)
      setPageState('already_done')
      return
    }

    if (existingSession) {
      // Resume in-progress session
      setSession(existingSession)
      const { data: qs } = await supabase
        .from('journal_questions')
        .select('*')
        .eq('session_id', existingSession.id)
        .order('sequence_order')

      if (qs && qs.length > 0) {
        setQuestions(qs)
        // Load any existing answers
        const { data: existingEntries } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('session_id', existingSession.id)

        const answerMap: Record<string, string> = {}
        existingEntries?.forEach(e => { answerMap[e.question_id] = e.response_text })
        setAnswers(answerMap)
        setPageState('journaling')
        return
      }
    }

    // Create new session and generate questions
    setPageState('generating')
    try {
      let sess = existingSession
      if (!sess) {
        const { data: newSession, error: sessionError } = await supabase
          .from('journal_sessions')
          .insert({ user_id: user.id, session_date: today })
          .select()
          .single()
        if (sessionError) throw sessionError
        sess = newSession
      }
      setSession(sess)

      const res = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sess.id, sessionDate: today }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const { questions: qs } = await res.json()
      setQuestions(qs)
      setPageState('journaling')
    } catch (e: any) {
      setError(e.message)
      setPageState('error')
    }
  }

  async function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      setPageState('mood')
    }
  }

  async function handleSubmit() {
    if (!session) return
    setSaving(true)
    try {
      const answersArr = questions.map(q => ({
        questionId: q.id,
        text: answers[q.id] ?? '',
        inputMethod: 'text' as const,
      })).filter(a => a.text.trim())

      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, answers: answersArr, moodScore, complete: true }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setPageState('done')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const currentQuestion = questions[currentQ]
  const answeredCount = questions.filter(q => answers[q.id]?.trim()).length

  return (
    <AppShell>
      <Header
        title={profile ? getGreeting(profile.display_name) : 'Today'}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        right={profile && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5">
            <span>🔥</span>
            <span className="text-amber-400 text-sm font-semibold">{profile.streak_count}</span>
          </div>
        )}
      />

      <div className="max-w-lg mx-auto px-4 py-6">
        {pageState === 'loading' && (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-500 animate-pulse">Loading your journal…</div>
          </div>
        )}

        {pageState === 'generating' && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Preparing your questions…</p>
          </div>
        )}

        {pageState === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={init} variant="secondary">Try again</Button>
          </div>
        )}

        {pageState === 'journaling' && currentQuestion && (
          <div className="space-y-6">
            <ProgressBar value={currentQ + 1} max={questions.length} />
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion.question_text}
              category={currentQuestion.category}
              index={currentQ}
              total={questions.length}
              value={answers[currentQuestion.id] ?? ''}
              onChange={text => setAnswers(prev => ({ ...prev, [currentQuestion.id]: text }))}
            />
            <Button
              fullWidth
              size="lg"
              onClick={handleNext}
            >
              {currentQ < questions.length - 1 ? 'Next Question →' : 'Almost done →'}
            </Button>
            {currentQ > 0 && (
              <button
                onClick={() => setCurrentQ(q => q - 1)}
                className="w-full text-sm text-slate-500 hover:text-slate-300 py-2"
              >
                ← Previous question
              </button>
            )}
          </div>
        )}

        {pageState === 'mood' && (
          <div className="space-y-6 slide-up">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">One last thing</h2>
              <p className="text-slate-400 text-sm">How would you rate today overall?</p>
            </div>
            <MoodSelector value={moodScore} onChange={setMoodScore} />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button fullWidth size="lg" loading={saving} onClick={handleSubmit} disabled={!moodScore}>
              Complete Today's Journal ✓
            </Button>
            <button onClick={() => setPageState('journaling')} className="w-full text-sm text-slate-500 hover:text-slate-300 py-2">
              ← Back to questions
            </button>
          </div>
        )}

        {pageState === 'done' && (
          <div className="text-center space-y-6 slide-up pt-8">
            <div className="text-6xl">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Entry complete!</h2>
              <p className="text-slate-400">Great job showing up for yourself today.</p>
              {profile && profile.streak_count > 1 && (
                <p className="text-amber-400 font-medium mt-2">🔥 {profile.streak_count} day streak!</p>
              )}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left space-y-2">
              <p className="text-sm text-slate-400">Today's entry</p>
              <p className="text-slate-100">{answeredCount} question{answeredCount !== 1 ? 's' : ''} answered</p>
              {moodScore && <p className="text-slate-100">Mood: {getMoodEmoji(moodScore)} {moodScore}/8</p>}
            </div>
            <div className="space-y-3">
              <Button fullWidth variant="secondary" onClick={() => window.location.href = '/reports'}>
                View Insights →
              </Button>
              <Button fullWidth variant="ghost" onClick={() => window.location.href = '/journal/history'}>
                See Past Entries
              </Button>
            </div>
          </div>
        )}

        {pageState === 'already_done' && (
          <div className="text-center space-y-6 slide-up pt-8">
            <div className="text-5xl">✅</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">All done for today!</h2>
              <p className="text-slate-400">You've already completed today's journal. Come back tomorrow.</p>
              {profile && profile.streak_count > 0 && (
                <p className="text-amber-400 font-medium mt-2">🔥 {profile.streak_count} day streak — keep it going!</p>
              )}
            </div>
            <div className="space-y-3">
              <Button fullWidth onClick={() => window.location.href = '/reports'}>
                View My Insights →
              </Button>
              <Button fullWidth variant="secondary" onClick={() => window.location.href = '/journal/history'}>
                Past Entries
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
