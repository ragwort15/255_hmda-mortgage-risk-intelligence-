import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const models = [
  {
    name: 'Logistic Regression',
    auc: 0.731,
    denyPrecision: 0.682,
    denyRecall: 0.521,
    f1: 0.591,
    note: 'Baseline · interpretable',
  },
  {
    name: 'Random Forest (safe)',
    auc: 0.834,
    denyPrecision: 0.812,
    denyRecall: 0.684,
    f1: 0.742,
    note: 'Strong ensemble',
  },
  {
    name: 'XGBoost (safe)',
    auc: 0.844,
    denyPrecision: 0.898,
    denyRecall: 0.622,
    f1: 0.735,
    note: '🏆 Champion',
    champion: true,
  },
]

const rocCurve = [
  { fpr: 0, lr: 0, rf: 0, xgb: 0 },
  { fpr: 0.05, lr: 0.18, rf: 0.32, xgb: 0.36 },
  { fpr: 0.1, lr: 0.3, rf: 0.5, xgb: 0.55 },
  { fpr: 0.2, lr: 0.46, rf: 0.66, xgb: 0.7 },
  { fpr: 0.3, lr: 0.58, rf: 0.76, xgb: 0.79 },
  { fpr: 0.4, lr: 0.67, rf: 0.83, xgb: 0.85 },
  { fpr: 0.5, lr: 0.75, rf: 0.88, xgb: 0.9 },
  { fpr: 0.6, lr: 0.81, rf: 0.92, xgb: 0.93 },
  { fpr: 0.7, lr: 0.86, rf: 0.95, xgb: 0.96 },
  { fpr: 0.85, lr: 0.93, rf: 0.98, xgb: 0.99 },
  { fpr: 1, lr: 1, rf: 1, xgb: 1 },
]

const thresholds = [
  { t: 0.4, precision: 0.624, recall: 0.781, f1: 0.694 },
  { t: 0.45, precision: 0.681, recall: 0.712, f1: 0.696 },
  { t: 0.5, precision: 0.738, recall: 0.622, f1: 0.675 },
  { t: 0.55, precision: 0.79, recall: 0.531, f1: 0.635 },
  { t: 0.6, precision: 0.836, recall: 0.432, f1: 0.57 },
  { t: 0.65, precision: 0.872, recall: 0.341, f1: 0.49 },
  { t: 0.7, precision: 0.898, recall: 0.262, f1: 0.405 },
]

export default function ModelComparison() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Model Comparison</h1>
        <p className="text-slate-600 mt-1">
          Three classifiers evaluated on the held-out HMDA 2024 California test
          set.
        </p>
      </header>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Performance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4">Model</th>
                <th className="py-2 pr-4">Test AUC</th>
                <th className="py-2 pr-4">Deny Precision</th>
                <th className="py-2 pr-4">Deny Recall</th>
                <th className="py-2 pr-4">F1</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr
                  key={m.name}
                  className={`border-b border-slate-100 ${m.champion ? 'bg-emerald-50' : ''}`}
                >
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {m.name}
                  </td>
                  <td className="py-3 pr-4 font-mono">{m.auc.toFixed(3)}</td>
                  <td className="py-3 pr-4 font-mono">
                    {m.denyPrecision.toFixed(3)}
                  </td>
                  <td className="py-3 pr-4 font-mono">
                    {m.denyRecall.toFixed(3)}
                  </td>
                  <td className="py-3 pr-4 font-mono">{m.f1.toFixed(3)}</td>
                  <td className="py-3 text-slate-600">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          ROC Curves
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          True Positive Rate vs False Positive Rate · higher area under curve
          (AUC) is better
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart
            data={rocCurve}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="fpr"
              domain={[0, 1]}
              label={{
                value: 'False Positive Rate',
                position: 'insideBottom',
                offset: -2,
                style: { fontSize: 11 },
              }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 1]}
              label={{
                value: 'True Positive Rate',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11 },
              }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="lr"
              name="Logistic Regression (0.731)"
              stroke="#94a3b8"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="rf"
              name="Random Forest (0.834)"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="xgb"
              name="XGBoost (0.844)"
              stroke="#10b981"
              dot={false}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          XGBoost Threshold Sensitivity
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Operating point selection for the deny class. Higher thresholds raise
          precision but lower recall.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4">Threshold</th>
                <th className="py-2 pr-4">Deny Precision</th>
                <th className="py-2 pr-4">Deny Recall</th>
                <th className="py-2 pr-4">F1</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((t) => (
                <tr
                  key={t.t}
                  className={`border-b border-slate-100 ${t.t === 0.7 ? 'bg-amber-50' : ''}`}
                >
                  <td className="py-2 pr-4 font-mono">{t.t.toFixed(2)}</td>
                  <td className="py-2 pr-4 font-mono">
                    {t.precision.toFixed(3)}
                  </td>
                  <td className="py-2 pr-4 font-mono">
                    {t.recall.toFixed(3)}
                  </td>
                  <td className="py-2 pr-4 font-mono">{t.f1.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Highlighted row (0.70) is the deployed operating point — chosen for
          high deny precision (0.898) to minimize false denials.
        </p>
      </section>
    </div>
  )
}
