import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import { formatDate, getMoodEmoji, getMoodLabel } from '@/lib/utils/date'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: sessions } = await supabase
    .from('journal_sessions')
    .select('*, journal_entries(id)')
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)
    .order('session_date', { ascending: false })
    .limit(60)

  return (
    <AppShell>
      <Header title="Journal History" subtitle={`${sessions?.length ?? 0} entries`} />
      <div className="max-w-lg mx-auto px-4 py-4">
        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-4">📖</p>
            <p className="font-medium text-slate-300">No entries yet</p>
            <p className="text-sm mt-1">Complete your first journal session to see it here.</p>
            <Link href="/journal" className="inline-block mt-4 text-amber-400 text-sm hover:underline">
              Start journaling →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <Link key={session.id} href={`/journal/${session.session_date}`}>
                <Card className="p-4 hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-200">{formatDate(session.session_date)}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-slate-500">
                          {(session.journal_entries as any[])?.length ?? 0} answers
                        </span>
                        {session.ai_themes && session.ai_themes.length > 0 && (
                          <span className="text-xs text-slate-500">
                            {session.ai_themes.slice(0, 2).join(' · ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {session.mood_score ? (
                        <div>
                          <span className="text-2xl">{getMoodEmoji(session.mood_score)}</span>
                          <p className="text-xs text-slate-500 mt-0.5">{getMoodLabel(session.mood_score)}</p>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xl">—</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
