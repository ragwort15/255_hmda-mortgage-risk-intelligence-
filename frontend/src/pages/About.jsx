export default function About() {
  return (
    <div>
      <header className="mb-8 pb-2 border-b border-slate-200/80">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
          CMPE 255 · Team 17
        </p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          About this project
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">
          HMDA mortgage lending risk intelligence — explainable ML on public CFPB data.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <Card title="Team & Course">
          <Row label="Team" value="Team 17" />
          <Row label="Course" value="CMPE 255 — Data Mining" />
          <Row label="Institution" value="San Francisco State University" />
        </Card>

        <Card title="Dataset">
          <Row label="Source" value="CFPB HMDA 2024 Snapshot" />
          <Row label="Geography" value="California" />
          <Row label="Loan Type" value="Conventional · Home Purchase" />
          <Row label="Sample Size" value="159,730 applications" />
          <Row label="Class Balance" value="87.1% originated · 12.9% denied" />
        </Card>

        <Card title="Final Model">
          <Row label="Algorithm" value="XGBoost (safe feature set)" />
          <Row label="Test AUC" value="0.833" />
          <Row label="Operating Threshold" value="0.25" />
          <Row label="Deny Precision" value="0.898" />
          <Row label="Features Used" value=" 7 safe (no protected class)" />
        </Card>

        <Card title="Methodology">
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>Filtered to conventional home-purchase loans in CA</li>
            <li>
              Excluded protected-class features (race, ethnicity, sex,
              age) — fairness-by-design
            </li>
            <li>
              Compared Logistic Regression, Random Forest, and XGBoost on AUC
              and deny-class precision/recall
            </li>
            <li>
              Selected XGBoost at threshold 0.25 to prioritize precision on
              denial decisions
            </li>
            <li>SHAP values used for both global and per-prediction explanations</li>
          </ul>
        </Card>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Stack</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Axios', 'Flask', 'XGBoost', 'SHAP', 'Pandas', 'scikit-learn'].map(
            (s) => (
              <span
                key={s}
                className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200/80 font-medium shadow-sm"
              >
                {s}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-7 transition-shadow hover:shadow-card-hover">
      <h2 className="text-lg font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-100">
        {title}
      </h2>
      <div className="space-y-0">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-3 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-900 font-medium text-right leading-snug">
        {value}
      </span>
    </div>
  )
}
