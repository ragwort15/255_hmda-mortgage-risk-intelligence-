"""Generate a placeholder xgb_model.pkl for local demo.

Trains a small XGBoost classifier on synthetic data shaped like the 11
HMDA features. Use this only if you can't export the real model from Colab.
The Risk Predictor and SHAP outputs will still render — they just won't
reflect real-world HMDA patterns.

Run from the repo root:
    backend/venv/bin/python backend/train_stub_model.py
"""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from xgboost import XGBClassifier

FEATURE_ORDER = [
    "dti_num",
    "ltv_num",
    "loan_amount",
    "income",
    "ffiec_msa_md_median_family_income",
    "occupancy_type",
    "lien_status",
    "total_units",
    "tract_minority_population_percent",
    "tract_to_msa_income_percentage",
    "tract_population",
]

OUT_PATH = Path(__file__).resolve().parent / "xgb_model.pkl"

rng = np.random.default_rng(42)
N = 5000

X = pd.DataFrame(
    {
        "dti_num": rng.uniform(5, 65, N),
        "ltv_num": rng.uniform(30, 100, N),
        "loan_amount": rng.lognormal(12.8, 0.5, N),
        "income": rng.lognormal(4.5, 0.5, N),
        "ffiec_msa_md_median_family_income": rng.normal(95000, 20000, N),
        "occupancy_type": rng.choice([1, 2, 3], N, p=[0.85, 0.07, 0.08]),
        "lien_status": rng.choice([1, 2], N, p=[0.95, 0.05]),
        "total_units": rng.choice([1, 2, 3, 4], N, p=[0.9, 0.05, 0.03, 0.02]),
        "tract_minority_population_percent": rng.uniform(0, 100, N),
        "tract_to_msa_income_percentage": rng.normal(105, 35, N),
        "tract_population": rng.normal(5400, 2500, N).clip(500),
    }
)[FEATURE_ORDER]

logit = (
    -1.6
    + 0.04 * (X["dti_num"] - 35)
    + 0.025 * (X["ltv_num"] - 80)
    + 0.0000015 * (X["loan_amount"] - 425000)
    - 0.005 * (X["income"] - 95)
    + 0.4 * (X["occupancy_type"] != 1).astype(int)
    + 0.3 * (X["lien_status"] != 1).astype(int)
    + 0.005 * (X["tract_minority_population_percent"] - 40)
)
prob = 1 / (1 + np.exp(-logit))
y = (rng.uniform(0, 1, N) < prob).astype(int)

print(f"Training stub XGBoost on {N} synthetic rows · deny rate = {y.mean():.2%}")

model = XGBClassifier(
    n_estimators=120,
    max_depth=4,
    learning_rate=0.1,
    objective="binary:logistic",
    eval_metric="auc",
    n_jobs=-1,
    random_state=42,
)
model.fit(X, y)

joblib.dump(model, OUT_PATH)
print(f"Saved → {OUT_PATH}")
