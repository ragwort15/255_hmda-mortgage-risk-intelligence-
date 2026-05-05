import { NavLink } from 'react-router-dom'

const links = [
  { to: '/predict', label: 'Risk Predictor', icon: '🎯' },
  { to: '/models', label: 'Model Comparison', icon: '📊' },
  { to: '/shap', label: 'SHAP Explorer', icon: '🔍' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
]

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-navy-900 to-navy-800 text-slate-200 flex-col shadow-xl ring-1 ring-white/5">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-xl font-bold text-white tracking-tight">🏦 HMDA Risk</div>
        <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Mortgage Lending Intelligence
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] ${
                isActive
                  ? 'bg-white/[0.08] text-white border-sky-400 shadow-inner'
                  : 'border-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
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
            className="w-full text-xs font-medium text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/10 rounded-lg py-2 transition-colors border border-white/10"
          >
            Sign out
          </button>
        </div>
      )}

      <div className="px-6 py-3 border-t border-white/10 text-[11px] text-slate-500">
        Team 17 · CMPE 255 · SFSU
      </div>
    </aside>
  )
}
