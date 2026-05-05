import { API_BASE_URL } from '../config.js'

export default function SimulationBanner() {
  return (
    <div className="bg-amber-100 border-b border-amber-300 px-6 py-2.5 text-sm text-amber-900 flex items-center gap-2">
      <span className="font-semibold">⚠️ Simulation Mode</span>
      <span>
        — start the API and set <code className="font-mono">VITE_API_URL</code> to match; trying{' '}
        <code className="bg-amber-200 px-1.5 py-0.5 rounded break-all">
          {API_BASE_URL ||
            (typeof window !== 'undefined' ? window.location.origin : '')}
        </code>
      </span>
    </div>
  )
}
