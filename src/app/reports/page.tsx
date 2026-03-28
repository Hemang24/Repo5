'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/layout/AppShell'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { AiReport, Profile } from '@/types'

export default function ReportsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [report, setReport] = useState<AiReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [days, setDays] = useState(7)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof)
    // Load latest report
    const { data: reports } = await supabase
      .from('ai_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
    if (reports && reports.length > 0) setReport(reports[0])
    setLoading(false)
  }

  async function generateReport() {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReport(data.report)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const content = report?.report_content

  return (
    <AppShell>
      <Header title="Insights" subtitle={profile?.display_name ?? ''} />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Generate controls */}
        <Card className="p-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Generate report for:</p>
            <div className="flex gap-2">
              {[7, 14, 30].map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-all ${days === d ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  {d} days
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          <Button fullWidth onClick={generateReport} loading={generating}>
            {generating ? 'Generating (~30s)…' : '✨ Generate Insight Report'}
          </Button>
          {generating && (
            <p className="text-xs text-slate-500 text-center">
              Claude is analyzing your journal entries. This takes about 30 seconds.
            </p>
          )}
        </Card>

        {/* Report content */}
        {!loading && !report && !generating && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-4xl mb-3">📊</p>
            <p className="font-medium text-slate-300">No report yet</p>
            <p className="text-sm mt-1">Complete at least one journal session, then generate your first report.</p>
          </div>
        )}

        {content && (
          <div className="space-y-4 fade-in">
            {report && (
              <p className="text-xs text-slate-500 text-center">
                Generated {new Date(report.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}

            {/* Summary */}
            {content.summary && (
              <Card className="p-5 bg-amber-500/5 border-amber-500/20">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">Summary</p>
                <p className="text-slate-200 leading-relaxed">{content.summary}</p>
              </Card>
            )}

            {/* Hard Truth */}
            {content.hard_truth && (
              <Card className="p-5 border-orange-500/30 bg-orange-500/5">
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2">🔍 Honest Observation</p>
                <p className="text-slate-200 leading-relaxed italic">"{content.hard_truth}"</p>
              </Card>
            )}

            {/* Patterns */}
            {content.patterns && content.patterns.length > 0 && (
              <Card className="p-5">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">Patterns Noticed</p>
                <ul className="space-y-2">
                  {content.patterns.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-purple-400 shrink-0">◆</span>{p}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Strengths */}
            {content.strengths && content.strengths.length > 0 && (
              <Card className="p-5">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-3">Genuine Strengths</p>
                <ul className="space-y-2">
                  {content.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-teal-400 shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Blind Spots */}
            {content.blind_spots && content.blind_spots.length > 0 && (
              <Card className="p-5">
                <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-3">Blind Spots</p>
                <ul className="space-y-2">
                  {content.blind_spots.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-yellow-400 shrink-0">⚠</span>{b}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Recommendations */}
            {content.recommendations && content.recommendations.length > 0 && (
              <Card className="p-5">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3">Action Steps</p>
                <ul className="space-y-3">
                  {content.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-300">
                      <span className="w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Focus Question */}
            {content.focus_question && (
              <Card className="p-5 bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sit With This</p>
                <p className="text-slate-200 text-lg font-medium leading-snug">"{content.focus_question}"</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
