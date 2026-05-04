export default function About() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          About This Project
        </h1>
        <p className="text-slate-600 mt-1">
          HMDA Mortgage Lending Risk Intelligence — final project for CMPE 255.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Row label="Operating Threshold" value="0.70" />
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

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Stack
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Axios', 'Flask', 'XGBoost', 'SHAP', 'Pandas', 'scikit-learn'].map(
            (s) => (
              <span
                key={s}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium text-right">{value}</span>
    </div>
  )
}
