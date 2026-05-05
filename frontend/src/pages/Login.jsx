import { useState } from 'react'

const DEMO_USER = 'admin'
const DEMO_PASS = 'hmda2024'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter a username and password.')
      return
    }
    if (username === DEMO_USER && password === DEMO_PASS) {
      onLogin({ username, role: 'Risk Analyst' })
      return
    }
    if (username && password.length >= 4) {
      onLogin({ username, role: 'Guest' })
      return
    }
    setError('Invalid credentials.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-[#0f172a] to-navy-800 px-4 py-12 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.2), transparent 40%)',
        }}
      />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-4xl mb-4 shadow-lg">
            🏦
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            HMDA Risk Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Mortgage lending decision platform
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/20 border border-white/20 p-8 space-y-5"
        >
          <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/35 focus:border-sky-400"
              placeholder="admin"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/35 focus:border-sky-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-navy-700 to-navy-600 hover:from-navy-600 hover:to-navy-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-navy-900/30"
          >
            Sign in
          </button>

          <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
            Demo credentials —{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">admin</code>{' '}
            /{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">
              hmda2024
            </code>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Team 17 · CMPE 255 · San Francisco State University
        </p>
      </div>
    </div>
  )
}
