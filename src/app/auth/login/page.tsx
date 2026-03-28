'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email to confirm your account.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/'
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-4">
            <span className="text-3xl">📓</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Reflect</h1>
          <p className="text-slate-400 mt-1 text-sm">Your daily journal & life coach</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="What should we call you?"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 h-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 h-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
              required
              minLength={8}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 h-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl px-4 py-3 text-sm text-teal-400">
              {success}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {mode === 'signup' && (
          <p className="text-xs text-slate-500 text-center mt-4">
            Your journal entries are private and encrypted. Only you can see them.
          </p>
        )}
      </div>
    </div>
  )
}
