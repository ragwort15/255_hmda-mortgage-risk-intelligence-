import { API_BASE_URL } from '../config.js'

export default function SimulationBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-100/90 to-amber-50 border-b border-amber-200/90 px-4 sm:px-6 py-3 text-sm text-amber-950 flex flex-wrap items-start sm:items-center gap-2 shadow-sm">
      <span className="inline-flex items-center gap-2 font-semibold shrink-0">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200/90 text-base shadow-sm"
          aria-hidden
        >
          ⚠️
        </span>
        Simulation mode
      </span>
      <span className="text-amber-950/90 leading-snug min-w-0">
        Connect the API and set{' '}
        <code className="font-mono text-xs bg-amber-200/80 px-1.5 py-0.5 rounded-md">
          VITE_API_URL
        </code>{' '}
        when building for split deploy. Trying{' '}
        <code className="font-mono text-xs bg-amber-200/80 px-1.5 py-0.5 rounded-md break-all">
          {API_BASE_URL ||
            (typeof window !== 'undefined' ? window.location.origin : '')}
        </code>
      </span>
    </div>
  )
}
