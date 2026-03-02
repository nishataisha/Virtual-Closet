import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-blush opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full bg-gold opacity-20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm mx-4 relative z-10">
        {/* Logo area */}
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-salmon mb-2">✦ your personal</p>
          <h1 className="font-display text-6xl font-light text-bistre tracking-tight">Closet</h1>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        {/* Card */}
        <div className="bg-white border border-blush rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-2xl text-bistre mb-1">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="font-body text-xs text-salmon tracking-widest uppercase mb-6">
            {isSignUp ? 'Start your collection' : 'Sign in to continue'}
          </p>

          {error && (
            <p className="text-xs font-body text-paprika bg-blush/30 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <div className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/60 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-blush rounded-xl px-4 py-3 text-sm font-body bg-cream focus:outline-none focus:border-salmon transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/60 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-blush rounded-xl px-4 py-3 text-sm font-body bg-cream focus:outline-none focus:border-salmon transition-colors"
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-garnet text-cream rounded-xl text-xs font-body tracking-widest uppercase hover:bg-bistre transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-xs font-body text-bistre/50 hover:text-garnet transition-colors mt-4"
          >
            {isSignUp ? 'Already have an account? Sign in →' : "New here? Create an account →"}
          </button>
        </div>
      </div>
    </div>
  )
}
