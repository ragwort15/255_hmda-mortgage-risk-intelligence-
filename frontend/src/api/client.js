import axios from 'axios'
import { API_BASE_URL } from '../config.js'

export const GLOBAL_SHAP_WEIGHTS = {
  dti_num: 0.77,
  loan_amount: 0.43,
  ltv_num: 0.26,
  ffiec_msa_md_median_family_income: 0.09,
  income: 0.09,
}

export const FEATURE_LABELS = {
  dti_num: 'DTI Ratio',
  ltv_num: 'LTV Ratio',
  loan_amount: 'Loan Amount',
  income: 'Applicant Income',
  ffiec_msa_md_median_family_income: 'Area Median Family Income',
  occupancy_type: 'Occupancy Type',
  lien_status: 'Lien Status',
  total_units: 'Total Units',
  tract_minority_population_percent: 'Tract Minority %',
  tract_to_msa_income_percentage: 'Tract / MSA Income %',
  tract_population: 'Tract Population',
}

const sigmoid = (x) => 1 / (1 + Math.exp(-x))

function simulatePrediction(features) {
  const dtiNorm = (features.dti_num - 35) / 15
  const ltvNorm = (features.ltv_num - 80) / 15
  const loanNorm = (Math.log10(Math.max(features.loan_amount, 1)) - 5.5) / 0.6
  const incomeNorm = -(Math.log10(Math.max(features.income, 1)) - 4.9) / 0.5
  const msaNorm = -(features.ffiec_msa_md_median_family_income - 95000) / 25000

  const occPenalty = features.occupancy_type === 1 ? 0 : 0.35
  const lienPenalty = features.lien_status === 1 ? 0 : 0.25
  const unitsPenalty = features.total_units > 1 ? 0.15 : 0

  const minorityNorm = (features.tract_minority_population_percent - 40) / 30
  const tractIncomeNorm =
    -(features.tract_to_msa_income_percentage - 100) / 40
  const popNorm = -(features.tract_population - 5000) / 4000

  const logit =
    -1.6 +
    GLOBAL_SHAP_WEIGHTS.dti_num * dtiNorm +
    GLOBAL_SHAP_WEIGHTS.ltv_num * ltvNorm +
    GLOBAL_SHAP_WEIGHTS.loan_amount * loanNorm +
    GLOBAL_SHAP_WEIGHTS.income * incomeNorm +
    GLOBAL_SHAP_WEIGHTS.ffiec_msa_md_median_family_income * msaNorm +
    occPenalty +
    lienPenalty +
    unitsPenalty +
    0.08 * minorityNorm +
    0.06 * tractIncomeNorm +
    0.04 * popNorm

  const denyProbability = sigmoid(logit)

  const shap_values = {
    dti_num: GLOBAL_SHAP_WEIGHTS.dti_num * dtiNorm,
    ltv_num: GLOBAL_SHAP_WEIGHTS.ltv_num * ltvNorm,
    loan_amount: GLOBAL_SHAP_WEIGHTS.loan_amount * loanNorm,
    income: GLOBAL_SHAP_WEIGHTS.income * incomeNorm,
    ffiec_msa_md_median_family_income:
      GLOBAL_SHAP_WEIGHTS.ffiec_msa_md_median_family_income * msaNorm,
    occupancy_type: occPenalty,
    lien_status: lienPenalty,
    total_units: unitsPenalty,
    tract_minority_population_percent: 0.08 * minorityNorm,
    tract_to_msa_income_percentage: 0.06 * tractIncomeNorm,
    tract_population: 0.04 * popNorm,
  }

  return {
    deny_probability: denyProbability,
    verdict: verdictFromProb(denyProbability),
    shap_values,
    base_value: -1.6,
  }
}

export function verdictFromProb(p) {
  if (p < 0.4) return 'Approved'
  if (p < 0.7) return 'Manual Review'
  return 'Flagged for Denial'
}

export async function predict(features) {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/predict`, features, {
      timeout: 3500,
    })
    return { ...res.data, simulated: false }
  } catch (err) {
    return { ...simulatePrediction(features), simulated: true }
  }
}
