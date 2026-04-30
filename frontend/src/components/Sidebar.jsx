import { NavLink } from 'react-router-dom'

const links = [
  { to: '/predict', label: 'Risk Predictor', icon: '🎯' },
  { to: '/models', label: 'Model Comparison', icon: '📊' },
  { to: '/shap', label: 'SHAP Explorer', icon: '🔍' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
]

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-navy-900 text-slate-200 flex-col">
      <div className="px-6 py-6 border-b border-navy-700">
        <div className="text-xl font-bold text-white">🏦 HMDA Risk</div>
        <div className="text-xs text-slate-400 mt-1">
          Mortgage Lending Intelligence
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="px-4 py-4 border-t border-navy-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-white text-sm font-semibold">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {user.username}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {user.role}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-xs text-slate-300 hover:text-white bg-navy-700 hover:bg-navy-600 rounded-md py-1.5 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}

      <div className="px-6 py-3 border-t border-navy-700 text-[11px] text-slate-500">
        Team 17 · CMPE 255 · SFSU
      </div>
    </aside>
  )
}
