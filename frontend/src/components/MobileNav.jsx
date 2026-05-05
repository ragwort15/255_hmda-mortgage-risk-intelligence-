import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/predict', label: 'Risk Predictor', icon: '🎯' },
  { to: '/models', label: 'Models', icon: '📊' },
  { to: '/shap', label: 'SHAP', icon: '🔍' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
]

export default function MobileNav({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="md:hidden fixed top-0 inset-x-0 z-[100] border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <span className="font-semibold text-navy-900 text-sm">🏦 HMDA Risk</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-14 bg-slate-900/40 z-[90] md:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="relative z-50 border-t border-slate-200 bg-white px-3 py-3 shadow-lg">
            <ul className="space-y-1">
              {links.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-navy-900 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    <span>{icon}</span>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            {user && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="px-3 text-xs text-slate-500 truncate">
                  {user.username} · {user.role}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onLogout()
                  }}
                  className="mt-2 w-full text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl py-2.5"
                >
                  Sign out
                </button>
              </div>
            )}
          </nav>
        </>
      )}
    </header>
  )
}
