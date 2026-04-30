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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🏦</div>
          <h1 className="text-3xl font-bold text-white">
            HMDA Risk Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Mortgage Lending Decision Platform
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-xl p-8 space-y-5"
        >
          <h2 className="text-xl font-semibold text-slate-900">Sign In</h2>

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
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
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
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
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
            className="w-full bg-navy-700 hover:bg-navy-600 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            Sign In
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
