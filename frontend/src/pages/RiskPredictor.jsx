import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { predict, FEATURE_LABELS } from '../api/client'

const defaults = {
  dti_num: 35,
  ltv_num: 80,
  loan_amount: 425000,
  income: 95,
  ffiec_msa_md_median_family_income: 102000,
  occupancy_type: 1,
  lien_status: 1,
  total_units: 1,
  tract_minority_population_percent: 38,
  tract_to_msa_income_percentage: 105,
  tract_population: 5400,
}

const verdictStyles = {
  Approved:
    'bg-emerald-50 text-emerald-900 border-emerald-200/80 ring-1 ring-emerald-500/20 shadow-sm',
  'Manual Review':
    'bg-amber-50 text-amber-950 border-amber-200/80 ring-1 ring-amber-500/20 shadow-sm',
  'Flagged for Denial':
    'bg-rose-50 text-rose-950 border-rose-200/80 ring-1 ring-rose-500/20 shadow-sm',
}

const probBarColor = (verdict) =>
  verdict === 'Approved'
    ? 'bg-emerald-500'
    : verdict === 'Manual Review'
    ? 'bg-amber-500'
    : 'bg-rose-500'

export default function RiskPredictor({ onSimulationChange }) {
  const [form, setForm] = useState(defaults)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await predict(form)
    setResult(res)
    onSimulationChange(res.simulated)
    setLoading(false)
  }

  useEffect(() => {
    return () => onSimulationChange(false)
  }, [onSimulationChange])

  const waterfallData = result
    ? Object.entries(result.shap_values)
        .map(([feature, value]) => ({
          feature: FEATURE_LABELS[feature] || feature,
          value: Number(value.toFixed(4)),
        }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    : []

  return (
    <div>
      <header className="mb-8 pb-2 border-b border-slate-200/80">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
          Decision engine
        </p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Risk Predictor
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Enter loan attributes to estimate origination risk using the XGBoost
          champion model and per-loan SHAP explanations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8 space-y-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Loan application inputs
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Adjust sliders and fields — values mirror HMDA-derived features.
            </p>
          </div>

          <SliderField
            label="DTI Ratio"
            value={form.dti_num}
            min={5}
            max={65}
            unit="%"
            onChange={(v) => update('dti_num', v)}
          />

          <SliderField
            label="LTV Ratio"
            value={form.ltv_num}
            min={30}
            max={100}
            unit="%"
            onChange={(v) => update('ltv_num', v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberField
              label="Loan Amount ($)"
              value={form.loan_amount}
              step={5000}
              onChange={(v) => update('loan_amount', v)}
            />
            <NumberField
              label="Applicant Income ($000s)"
              value={form.income}
              step={1}
              onChange={(v) => update('income', v)}
            />
          </div>

          <NumberField
            label="Area Median Family Income ($)"
            value={form.ffiec_msa_md_median_family_income}
            step={1000}
            onChange={(v) =>
              update('ffiec_msa_md_median_family_income', v)
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Occupancy Type"
              value={form.occupancy_type}
              onChange={(v) => update('occupancy_type', v)}
              options={[
                { value: 1, label: 'Principal' },
                { value: 2, label: 'Second' },
                { value: 3, label: 'Investment' },
              ]}
            />
            <SelectField
              label="Lien Status"
              value={form.lien_status}
              onChange={(v) => update('lien_status', v)}
              options={[
                { value: 1, label: 'First Lien' },
                { value: 2, label: 'Subordinate' },
              ]}
            />
            <SelectField
              label="Total Units"
              value={form.total_units}
              onChange={(v) => update('total_units', v)}
              options={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
              ]}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-navy-700 to-navy-600 hover:from-navy-600 hover:to-navy-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-navy-900/25 disabled:shadow-none"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Predicting…
              </span>
            ) : (
              'Predict origination risk'
            )}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-6">
          {!result && (
            <div className="bg-white/90 rounded-2xl shadow-card border border-dashed border-slate-300/80 p-8 text-center">
              <div className="text-4xl mb-3 opacity-90">📋</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Submit the loan form to see the model <strong>verdict</strong>,
                calibrated denial probability, and{' '}
                <strong>SHAP</strong> drivers for this scenario.
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-7">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Verdict
                </div>
                <div
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold ${verdictStyles[result.verdict]}`}
                >
                  <VerdictIcon verdict={result.verdict} />
                  {result.verdict}
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                    <span>Denial probability</span>
                    <span className="font-mono text-base text-slate-900 tabular-nums">
                      {(result.deny_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/80">
                    <div
                      className={`h-full rounded-full ${probBarColor(result.verdict)} transition-all duration-500 ease-out`}
                      style={{
                        width: `${Math.min(100, result.deny_probability * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="relative flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                    <span>0%</span>
                    <span className="text-emerald-600">15%</span>
                    <span className="text-amber-600">25%</span>
                    <span>100%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                    Reference bands: review vs deny operating thresholds (15% · 25%).
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-7">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  SHAP feature contributions
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Directional push toward approval vs denial for this prediction.
                </p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={waterfallData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={140}
                      tick={{ fontSize: 11 }}
                    />
                    <ReferenceLine x={0} stroke="#94a3b8" />
                    <Tooltip
                      formatter={(v) => Number(v).toFixed(3)}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="value">
                      {waterfallData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.value >= 0 ? '#ef4444' : '#10b981'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-[11px] text-slate-500 mt-3 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Toward denial
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Toward approval
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function VerdictIcon({ verdict }) {
  if (verdict === 'Approved') return <span aria-hidden>✓</span>
  if (verdict === 'Manual Review') return <span aria-hidden>◆</span>
  return <span aria-hidden>!</span>
}

function SliderField({ label, value, min, max, unit, onChange }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
      <div className="flex justify-between text-sm font-medium text-slate-800 mb-2">
        <span>{label}</span>
        <span className="font-mono text-slate-900 tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

function NumberField({ label, value, step, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-shadow"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-shadow"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
