import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const globalShap = [
  { feature: 'DTI Ratio', value: 0.77, key: 'dti_num' },
  { feature: 'Loan Amount', value: 0.43, key: 'loan_amount' },
  { feature: 'LTV Ratio', value: 0.26, key: 'ltv_num' },
  {
    feature: 'Area Median Family Income',
    value: 0.09,
    key: 'ffiec_msa_md_median_family_income',
  },
  { feature: 'Applicant Income', value: 0.09, key: 'income' },
]

const explanations = {
  dti_num: {
    title: 'DTI Ratio',
    direction: '↑ DTI → ↑ denial risk',
    body: 'Debt-to-income is the dominant signal in the XGBoost model. Applicants whose total monthly debts exceed roughly 43% of gross income are far more likely to be denied. The relationship is non-linear — risk accelerates above 50%.',
  },
  loan_amount: {
    title: 'Loan Amount',
    direction: '↑ Loan amount (relative to income) → ↑ denial risk',
    body: 'Large loan principals raise denial probability primarily when income does not scale with them. The model captures the interaction between loan size and applicant income implicitly via tree splits.',
  },
  ltv_num: {
    title: 'LTV Ratio',
    direction: '↑ LTV → ↑ denial risk',
    body: 'Loan-to-value above 95% materially increases denial risk because the lender has less collateral cushion. LTV near 80% (the conventional conforming threshold) is the safe zone.',
  },
  ffiec_msa_md_median_family_income: {
    title: 'Area Median Family Income',
    direction: '↑ Area median income → ↓ denial risk',
    body: 'Higher MSA median income correlates with stronger local lending markets and less risky underwriting outcomes. This is a tract-level economic context feature.',
  },
  income: {
    title: 'Applicant Income',
    direction: '↑ Applicant income → ↓ denial risk',
    body: 'Higher reported income reduces denial probability, especially when paired with a moderate DTI. The model interacts income with loan amount and DTI through tree-split combinations.',
  },
}

export default function SHAPExplorer() {
  return (
    <div>
      <header className="mb-8 pb-2 border-b border-slate-200/80">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
          Explainability
        </p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          SHAP Explorer
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Mean absolute SHAP values across the test set — which features drive
          the XGBoost model globally.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Global Feature Importance
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Average absolute SHAP value · larger = more influential on the
          prediction
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={globalShap}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="feature"
              width={180}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(v) => Number(v).toFixed(3)}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {globalShap.map((_, idx) => (
                <Cell key={idx} fill="#0284c7" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Directional Impact
        </h2>
        {globalShap.map(({ key }) => {
          const e = explanations[key]
          return (
            <div
              key={key}
              className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-5 sm:p-6"
            >
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h3 className="font-semibold text-slate-900">{e.title}</h3>
                <span className="text-xs font-mono text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                  {e.direction}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{e.body}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}
