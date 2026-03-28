import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate, getMoodEmoji, getMoodLabel } from '@/lib/utils/date'

const categoryColors: Record<string, 'default' | 'amber' | 'teal' | 'purple' | 'red'> = {
  emotions: 'purple', productivity: 'amber', obstacles: 'red',
  time_management: 'teal', growth: 'teal', relationships: 'amber',
}

export default async function EntryDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: session } = await supabase
    .from('journal_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('session_date', date)
    .single()

  if (!session) notFound()

  const { data: questions } = await supabase
    .from('journal_questions')
    .select('*')
    .eq('session_id', session.id)
    .order('sequence_order')

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('session_id', session.id)

  const qas = (questions ?? []).map(q => ({
    question: q,
    entry: entries?.find(e => e.question_id === q.id),
  }))

  return (
    <AppShell>
      <Header
        title={formatDate(date)}
        subtitle={session.completed_at ? 'Completed' : 'In progress'}
        right={
          <Link href="/journal/history" className="text-sm text-slate-400 hover:text-slate-200">
            ← Back
          </Link>
        }
      />
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {session.mood_score && (
          <Card className="p-4 flex items-center gap-4">
            <span className="text-4xl">{getMoodEmoji(session.mood_score)}</span>
            <div>
              <p className="text-slate-400 text-sm">Overall mood</p>
              <p className="text-slate-100 font-semibold">{getMoodLabel(session.mood_score)} ({session.mood_score}/8)</p>
            </div>
          </Card>
        )}

        {qas.map(({ question, entry }) => (
          <Card key={question.id} className="p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant={categoryColors[question.category] ?? 'default'} className="mt-0.5 shrink-0">
                {question.category.replace('_', ' ')}
              </Badge>
            </div>
            <p className="font-medium text-slate-200">{question.question_text}</p>
            {entry ? (
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{entry.response_text}</p>
            ) : (
              <p className="text-slate-600 text-sm italic">Not answered</p>
            )}
            {entry?.input_method === 'voice' && (
              <p className="text-xs text-slate-600">🎤 Voice entry</p>
            )}
          </Card>
        ))}

        {session.ai_summary && (
          <Card className="p-4 bg-amber-500/5 border-amber-500/20">
            <p className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wide">AI Summary</p>
            <p className="text-slate-300 text-sm leading-relaxed">{session.ai_summary}</p>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
