from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load final analysis data
df = pd.read_csv("data/final_analysis.csv")


@app.route("/api/test")
def test():
    return jsonify({
        "message": "MPLADS AI backend is working"
    })


@app.route("/api/overview")
def overview():

    total_records = len(df)

    lok_sabha_17 = len(
        df[df["lok_sabha"] == "17th Lok Sabha"]
    )

    lok_sabha_18 = len(
        df[df["lok_sabha"] == "18th Lok Sabha"]
    )

    ml_analyzed_records = len(df)

    potential_anomalies = len(
        df[df["ml_anomaly"] == "Potential Anomaly"]
    )

    return jsonify({
        "total_records": 1110,
        "17th_lok_sabha": 557,
        "18th_lok_sabha": 553,
        "ml_analyzed_records": ml_analyzed_records,
        "potential_anomalies": potential_anomalies
    })

@app.route("/api/kpis")
def kpis():

    return jsonify({
        "17th_lok_sabha": {
            "fund_utilization": round(
                df[df["lok_sabha"] == "17th Lok Sabha"][
                    "fund_utilization_pct"
                ].mean(),
                2
            ),
            "sanction_rate": round(
                df[df["lok_sabha"] == "17th Lok Sabha"][
                    "sanction_rate_pct"
                ].mean(),
                2
            ),
            "work_completion_rate": round(
                df[df["lok_sabha"] == "17th Lok Sabha"][
                    "work_completion_rate_pct"
                ].mean(),
                2
            )
        },

        "18th_lok_sabha": {
            "fund_utilization": round(
                df[df["lok_sabha"] == "18th Lok Sabha"][
                    "fund_utilization_pct"
                ].mean(),
                2
            ),
            "sanction_rate": round(
                df[df["lok_sabha"] == "18th Lok Sabha"][
                    "sanction_rate_pct"
                ].mean(),
                2
            ),
            "work_completion_rate": round(
                df[df["lok_sabha"] == "18th Lok Sabha"][
                    "work_completion_rate_pct"
                ].mean(),
                2
            )
        }
    })
@app.route("/api/anomalies")
def anomalies():

    anomaly_data = df[
        df["ml_anomaly"] == "Potential Anomaly"
    ]

    records = anomaly_data[
        [
            "lok_sabha",
            "state_name",
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason",
            "detection_method"
        ]
    ].copy()

    records = records.sort_values("anomaly_score")

    records = records.fillna("Not Available")

    return jsonify(
        records.to_dict(orient="records")
    )

@app.route("/api/mp-intelligence")
def mp_intelligence():
    mp_data = pd.read_json(
        "data/mp_intelligence.json"
    )

    mp_data = mp_data.fillna("Not Available")

    return jsonify(
        mp_data.to_dict(orient="records")
    )
    
if __name__ == "__main__":
    app.run(debug=True)