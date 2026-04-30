export default function SimulationBanner() {
  return (
    <div className="bg-amber-100 border-b border-amber-300 px-6 py-2.5 text-sm text-amber-900 flex items-center gap-2">
      <span className="font-semibold">⚠️ Simulation Mode</span>
      <span>
        — connect your Colab backend at{' '}
        <code className="bg-amber-200 px-1.5 py-0.5 rounded">
          http://localhost:5001
        </code>{' '}
        for live predictions.
      </span>
    </div>
  )
}
