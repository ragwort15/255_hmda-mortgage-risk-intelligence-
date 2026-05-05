"""HMDA Mortgage Risk Intelligence — Flask prediction API.

Loads the trained XGBoost model (xgb_model.pkl) and serves POST /api/predict.

Run:
    python backend/app.py

The model expects the 11 "safe" features (no protected-class attributes).
"""

import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

APP_DIR = Path(__file__).resolve().parent
MODEL_PATH = APP_DIR / "xgb_model.pkl"
DIST_DIR = APP_DIR / "static_dist"

# Order matters: must match the training feature order used in Colab.
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

# Upper bound for "Manual Review"; denial verdict when prob >= DENY_THRESHOLD_HIGH.
DENY_THRESHOLD_HIGH = 0.25
DENY_THRESHOLD_REVIEW = 0.15

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def _load_model():
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)


MODEL = _load_model()


def _verdict(prob: float) -> str:
    if prob < DENY_THRESHOLD_REVIEW:
        return "Approved"
    if prob < DENY_THRESHOLD_HIGH:
        return "Manual Review"
    return "Flagged for Denial"


def _shap_values(model, X: pd.DataFrame) -> dict:
    """Per-prediction SHAP values via the booster's pred_contribs.

    Returns a dict mapping feature name to its contribution. The last column
    XGBoost emits is the bias term, which we drop.
    """
    try:
        booster = model.get_booster() if hasattr(model, "get_booster") else model
        import xgboost as xgb

        dmat = xgb.DMatrix(X)
        contribs = booster.predict(dmat, pred_contribs=True)[0]
        feature_contribs = contribs[:-1]
        return {
            name: float(value)
            for name, value in zip(FEATURE_ORDER, feature_contribs)
        }
    except Exception:
        return {name: 0.0 for name in FEATURE_ORDER}


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": MODEL is not None,
            "model_path": str(MODEL_PATH),
        }
    )


@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return ("", 204)

    if MODEL is None:
        return (
            jsonify(
                {
                    "error": "Model not loaded",
                    "detail": f"Place xgb_model.pkl at {MODEL_PATH}",
                }
            ),
            503,
        )

    payload = request.get_json(force=True, silent=True) or {}
    missing = [f for f in FEATURE_ORDER if f not in payload]
    if missing:
        return (
            jsonify({"error": "Missing features", "missing": missing}),
            400,
        )

    row = {f: float(payload[f]) for f in FEATURE_ORDER}
    X = pd.DataFrame([row], columns=FEATURE_ORDER)

    proba = MODEL.predict_proba(X)[0]
    deny_prob = float(proba[1]) if proba.shape[0] > 1 else float(proba[0])

    return jsonify(
        {
            "deny_probability": deny_prob,
            "verdict": _verdict(deny_prob),
            "shap_values": _shap_values(MODEL, X),
            "threshold": DENY_THRESHOLD_HIGH,
        }
    )


def _register_frontend_routes():
    """Serve Vite build from static_dist/ when present (Docker / single-host deploy)."""
    if not DIST_DIR.is_dir():
        return

    from flask import send_file, send_from_directory
    from werkzeug.exceptions import NotFound

    @app.route("/assets/<path:filename>")
    def vite_assets(filename):
        return send_from_directory(DIST_DIR / "assets", filename)

    @app.get("/")
    def spa_index():
        return send_file(DIST_DIR / "index.html")

    @app.get("/<path:path>")
    def spa_fallback(path):
        base = DIST_DIR.resolve()
        target = (DIST_DIR / path).resolve()
        try:
            target.relative_to(base)
        except ValueError:
            raise NotFound()
        if target.is_file():
            return send_from_directory(DIST_DIR, path)
        return send_file(DIST_DIR / "index.html")


_register_frontend_routes()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
