'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { GOALS_OPTIONS, CHALLENGES_OPTIONS, FEEDBACK_STYLES, AGE_RANGES } from '@/types'

const STEPS = 5

interface OnboardingData {
  display_name: string
  age_range: string
  gender_identity: string
  life_situation: string
  goals: string[]
  challenges: string[]
  feedback_style: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<OnboardingData>({
    display_name: '',
    age_range: '',
    gender_identity: '',
    life_situation: '',
    goals: [],
    challenges: [],
    feedback_style: 'balanced',
  })

  function toggleItem(key: 'goals' | 'challenges', value: string) {
    setData(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      router.push('/journal')
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  const canNext = () => {
    if (step === 0) return data.display_name.trim().length > 1
    if (step === 2) return data.goals.length > 0
    if (step === 3) return data.challenges.length > 0
    return true
  }

  return (
    <div className="min-h-dvh bg-slate-950 flex flex-col px-4 py-6">
      <div className="max-w-sm mx-auto w-full flex flex-col flex-1">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Step {step + 1} of {STEPS}</span>
            <span className="text-xs text-amber-400 font-medium">
              {Math.round(((step + 1) / STEPS) * 100)}%
            </span>
          </div>
          <ProgressBar value={step + 1} max={STEPS} />
        </div>

        {/* Step content */}
        <div className="flex-1 fade-in" key={step}>

          {/* Step 0: Name */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className="text-amber-400 text-sm font-medium mb-1">Welcome 👋</p>
                <h2 className="text-2xl font-bold text-slate-100">Let's start with your name</h2>
                <p className="text-slate-400 text-sm mt-2">This is how Reflect will address you.</p>
              </div>
              <div>
                <input
                  type="text"
                  value={data.display_name}
                  onChange={e => setData(p => ({ ...p, display_name: e.target.value }))}
                  placeholder="First name or nickname"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 h-14 text-slate-100 text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Age range (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGES.map(r => (
                    <button key={r.value} type="button"
                      onClick={() => setData(p => ({ ...p, age_range: r.value }))}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${data.age_range === r.value ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">How do you identify? (optional)</label>
                <input
                  type="text"
                  value={data.gender_identity}
                  onChange={e => setData(p => ({ ...p, gender_identity: e.target.value }))}
                  placeholder="e.g. Man, Woman, Non-binary, prefer not to say…"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 h-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Step 1: Life Situation */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-amber-400 text-sm font-medium mb-1">Context</p>
                <h2 className="text-2xl font-bold text-slate-100">What's your life like right now?</h2>
                <p className="text-slate-400 text-sm mt-2">A sentence or two is enough. This helps personalize your questions.</p>
              </div>
              <textarea
                value={data.life_situation}
                onChange={e => setData(p => ({ ...p, life_situation: e.target.value }))}
                placeholder="e.g. I'm a 30-year-old software developer, working remotely. Going through a career change and feeling a bit lost…"
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
              <p className="text-xs text-slate-500">Skip this if you're not comfortable — you can always add it later.</p>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-amber-400 text-sm font-medium mb-1">Goals</p>
                <h2 className="text-2xl font-bold text-slate-100">What do you want to work on?</h2>
                <p className="text-slate-400 text-sm mt-2">Pick everything that resonates.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {GOALS_OPTIONS.map(g => (
                  <button key={g} type="button"
                    onClick={() => toggleItem('goals', g)}
                    className={`px-3 py-2 rounded-xl text-sm border transition-all ${data.goals.includes(g) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Challenges */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-amber-400 text-sm font-medium mb-1">Be honest</p>
                <h2 className="text-2xl font-bold text-slate-100">What gets in your way?</h2>
                <p className="text-slate-400 text-sm mt-2">Select what holds you back most. No judgment here.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CHALLENGES_OPTIONS.map(c => (
                  <button key={c} type="button"
                    onClick={() => toggleItem('challenges', c)}
                    className={`px-3 py-2 rounded-xl text-sm border transition-all ${data.challenges.includes(c) ? 'bg-red-500/20 border-red-500/60 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Feedback Style */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-amber-400 text-sm font-medium mb-1">Last step</p>
                <h2 className="text-2xl font-bold text-slate-100">How do you want your insights?</h2>
                <p className="text-slate-400 text-sm mt-2">This affects how your AI reports are written. You can change this anytime.</p>
              </div>
              <div className="space-y-3">
                {FEEDBACK_STYLES.map(s => (
                  <button key={s.value} type="button"
                    onClick={() => setData(p => ({ ...p, feedback_style: s.value }))}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${data.feedback_style === s.value ? 'bg-amber-500/10 border-amber-500 ' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}>
                    <div className="font-medium text-slate-100">{s.label}</div>
                    <div className="text-sm text-slate-400 mt-0.5">{s.description}</div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1">
              Back
            </Button>
          )}
          {step < STEPS - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex-1"
              size="lg"
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} fullWidth size="lg">
              Start Journaling
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
