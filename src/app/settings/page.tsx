'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/layout/AppShell'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FEEDBACK_STYLES, AGE_RANGES, type Profile } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [feedbackStyle, setFeedbackStyle] = useState('balanced')
  const [ageRange, setAgeRange] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data)
          setDisplayName(data.display_name)
          setFeedbackStyle(data.feedback_style)
          setAgeRange(data.age_range ?? '')
        }
      })
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      display_name: displayName,
      feedback_style: feedbackStyle,
      age_range: ageRange,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <AppShell>
      <Header title="Settings" />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        <Card className="p-5 space-y-4">
          <h2 className="font-semibold text-slate-200">Profile</h2>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 h-11 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Age range</label>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map(r => (
                <button key={r.value} type="button"
                  onClick={() => setAgeRange(r.value)}
                  className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${ageRange === r.value ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h2 className="font-semibold text-slate-200">Feedback Style</h2>
          <p className="text-sm text-slate-400">How direct do you want your AI insights?</p>
          {FEEDBACK_STYLES.map(s => (
            <button key={s.value} type="button"
              onClick={() => setFeedbackStyle(s.value)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${feedbackStyle === s.value ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800 border-slate-700'}`}>
              <div className="font-medium text-slate-100 text-sm">{s.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.description}</div>
            </button>
          ))}
        </Card>

        {profile && (
          <Card className="p-5 space-y-2">
            <h2 className="font-semibold text-slate-200">Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">🔥 {profile.streak_count}</p>
                <p className="text-xs text-slate-400 mt-1">Day streak</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-teal-400">{profile.longest_streak}</p>
                <p className="text-xs text-slate-400 mt-1">Longest streak</p>
              </div>
            </div>
          </Card>
        )}

        <Button fullWidth size="lg" loading={saving} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </Button>

        <Button fullWidth variant="danger" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </AppShell>
  )
}
