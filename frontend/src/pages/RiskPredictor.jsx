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
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Manual Review': 'bg-amber-100 text-amber-800 border-amber-300',
  'Flagged for Denial': 'bg-rose-100 text-rose-800 border-rose-300',
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Risk Predictor</h1>
        <p className="text-slate-600 mt-1">
          Enter loan attributes to estimate origination risk using the XGBoost
          champion model.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Loan Application Inputs
          </h2>

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
            className="w-full bg-navy-700 hover:bg-navy-600 disabled:bg-slate-400 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            {loading ? 'Predicting…' : 'Predict Origination Risk'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-6">
          {!result && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-slate-500 text-sm">
              Submit a loan application on the left to see the model's verdict,
              denial probability, and SHAP feature contributions.
            </div>
          )}

          {result && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                  Verdict
                </div>
                <div
                  className={`mt-2 inline-block px-4 py-2 rounded-md border text-sm font-semibold ${verdictStyles[result.verdict]}`}
                >
                  {result.verdict}
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Denial Probability</span>
                    <span className="font-mono text-slate-900">
                      {(result.deny_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${probBarColor(result.verdict)} transition-all`}
                      style={{
                        width: `${result.deny_probability * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0%</span>
                    <span className="text-emerald-600">40%</span>
                    <span className="text-rose-600">70%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
                  SHAP Feature Contributions
                </div>
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
                <div className="text-[11px] text-slate-500 mt-2">
                  Red bars push toward denial · green bars push toward approval
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SliderField({ label, value, min, max, unit, onChange }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
        <span>{label}</span>
        <span className="font-mono text-slate-900">
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
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
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
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
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
