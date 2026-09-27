import pandas as pd
from sklearn.ensemble import IsolationForest

# 1. Loading original CSV files

df17 = pd.read_csv("data/mplad17.csv")
df18 = pd.read_csv("data/mplad18.csv")

# 2. Fixed column name in 17th dataset

df17 = df17.rename(columns={
    "Unnamed: 15": "n_recommended"
})

# 3. Removed exact duplicate rows

df17 = df17.drop_duplicates()
df18 = df18.drop_duplicates()
# 4. Display cleaned dataset sizes


print("After cleaning:")

print("17th Lok Sabha:", df17.shape)
print("18th Lok Sabha:", df18.shape)


# 5. Checking  missing values

print("\nMissing values - 17th:")
print(df17.isnull().sum())

print("\nMissing values - 18th:")
print(df18.isnull().sum())

# Calculating  Fund Utilization %
#fund_utilization_pct=fund utilization percentage
#allocated_cr=allocated amounts in cr 
#expenditure_cr=expenditure amounts in cr

df17["fund_utilization_pct"] = (
    df17["expenditure_cr"] / df17["allocated_cr"]
) * 100

df18["fund_utilization_pct"] = (
    df18["expenditure_cr"] / df18["allocated_cr"]
) * 100


print("\n17th Lok Sabha - Fund Utilization:")
print(
    df17[
        [
            "constituency_name",
            "allocated_cr",
            "expenditure_cr",
            "fund_utilization_pct"
        ]
    ].head(10)
)




print("\n18th Lok Sabha - Fund Utilization:")
print(
    df18[
        [
            "constituency_name",
            "allocated_cr",
            "expenditure_cr",
            "fund_utilization_pct"
        ]
    ].head(10)
)

# Calculating Sanction Rate %
#sanction_rate_pct=sanction rate percentage
#sanctioned_cr=sanctioned amount in cr 
#recommended_cr=recommended amount in cr


df17["sanction_rate_pct"] = (
    df17["sanctioned_cr"] / df17["recommended_cr"]
) * 100

df18["sanction_rate_pct"] = (
    df18["sanctioned_cr"] / df18["recommended_cr"]
) * 100


print("\n17th Lok Sabha - Sanction Rate:")
print(
    df17[
        [
            "constituency_name",
            "recommended_cr",
            "sanctioned_cr",
            "sanction_rate_pct"
        ]
    ].head(10)
)


print("\n18th Lok Sabha - Sanction Rate:")
print(
    df18[
        [
            "constituency_name",
            "recommended_cr",
            "sanctioned_cr",
            "sanction_rate_pct"
        ]
    ].head(10)
)

# Calculating Work Completion Rate %
#work_completetion_rate_pct=work completetion rate
#n_completed=no of completed works
#n_sanctioned=no of sanctioned works



df17["work_completion_rate_pct"] = (
    df17["n_completed"] / df17["n_sanctioned"]
) * 100

df18["work_completion_rate_pct"] = (
    df18["n_completed"] / df18["n_sanctioned"]
) * 100


print("\n17th Lok Sabha - Work Completion Rate:")
print(
    df17[
        [
            "constituency_name",
            "n_sanctioned",
            "n_completed",
            "work_completion_rate_pct"
        ]
    ].head(10)
)


print("\n18th Lok Sabha - Work Completion Rate:")
print(
    df18[
        [
            "constituency_name",
            "n_sanctioned",
            "n_completed",
            "work_completion_rate_pct"
        ]
    ].head(10)
)

# -------------------------------
# 6. Statistical Summary
# -------------------------------

print("\n17th Lok Sabha - Statistical Summary:")
print(
    df17[
        [
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].describe()
)

print("\n18th Lok Sabha - Statistical Summary:")
print(
    df18[
        [
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].describe()
)

#Statistical analysis identifies unusual individual indicators, while the machine-learning
# model detects multidimensional anomaly patterns.
# -------------------------------
# 7. IQR Anomaly Detection
# 17th Lok Sabha - Fund Utilization
# -------------------------------

Q1 = df17["fund_utilization_pct"].quantile(0.25)
Q3 = df17["fund_utilization_pct"].quantile(0.75)

IQR = Q3 - Q1

lower_bound = Q1 - (1.5 * IQR)
upper_bound = Q3 + (1.5 * IQR)

print("\n17th Lok Sabha - Fund Utilization IQR:")
print("Q1:", Q1)
print("Q3:", Q3)
print("IQR:", IQR)
print("Lower Bound:", lower_bound)
print("Upper Bound:", upper_bound)

# Flag potential anomalies

df17["fund_utilization_anomaly"] = (
    (df17["fund_utilization_pct"] < lower_bound) |
    (df17["fund_utilization_pct"] > upper_bound)
)

print("\n17th Lok Sabha - Fund Utilization Anomalies:")

print(
    df17[
        [
            "constituency_name",
            "fund_utilization_pct",
            "fund_utilization_anomaly"
        ]
    ][df17["fund_utilization_anomaly"]]
)

# -------------------------------
# 8. IQR Anomaly Detection
# 18th Lok Sabha - Fund Utilization
# -------------------------------

Q1_18 = df18["fund_utilization_pct"].quantile(0.25)
Q3_18 = df18["fund_utilization_pct"].quantile(0.75)

IQR_18 = Q3_18 - Q1_18

lower_bound_18 = Q1_18 - (1.5 * IQR_18)
upper_bound_18 = Q3_18 + (1.5 * IQR_18)

print("\n18th Lok Sabha - Fund Utilization IQR:")
print("Q1:", Q1_18)
print("Q3:", Q3_18)
print("IQR:", IQR_18)
print("Lower Bound:", lower_bound_18)
print("Upper Bound:", upper_bound_18)

df18["fund_utilization_anomaly"] = (
    (df18["fund_utilization_pct"] < lower_bound_18) |
    (df18["fund_utilization_pct"] > upper_bound_18)
)

print("\n18th Lok Sabha - Fund Utilization Anomalies:")

print(
    df18[
        [
            "constituency_name",
            "fund_utilization_pct",
            "fund_utilization_anomaly"
        ]
    ][df18["fund_utilization_anomaly"]]
)

#IQR here is used calculate statistical baseline for anomalies to check if they are within range
#statistical analysis->AI model(isolation forest)->flag for anamoly


#ML model-isolation forest
features = [
    "fund_utilization_pct",
    "sanction_rate_pct",
    "work_completion_rate_pct"
]
X17 = df17[features]
X18 = df18[features]

print("\n17th Lok Sabha - Features:")
print(X17.head())

print("\n18th Lok Sabha - Features:")
print(X18.head())

X17 = X17.dropna()
X18 = X18.dropna()

print("\nValid records for 17th Lok Sabha:", len(X17))
print("Valid records for 18th Lok Sabha:", len(X18))


# 9. Isolation Forest Model

#simply creating the model

model17 = IsolationForest(
    n_estimators=200,
    contamination="auto",
    random_state=42
)

model18 = IsolationForest(
    n_estimators=200,
    contamination="auto",
    random_state=42
)

#adding indicators to model 
model17.fit(X17)
model18.fit(X18)

model17_predictions = model17.predict(X17)
model18_predictions = model18.predict(X18)

print("\n17th Lok Sabha - Model Predictions:")
print(model17_predictions[:20])

print("\n18th Lok Sabha - Model Predictions:")
print(model18_predictions[:20])


# 10. Creating ML Result Tables


df17_ml = df17.loc[X17.index].copy()
df18_ml = df18.loc[X18.index].copy()

print("\n17th Lok Sabha - ML Table:")
print(
    df17_ml[
        [
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].head(10)
)

print("\n18th Lok Sabha - ML Table:")
print(
    df18_ml[
        [
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].head(10)
)

# Adding Isolation Forest predictions

df17_ml["isolation_forest_prediction"] = model17_predictions
df18_ml["isolation_forest_prediction"] = model18_predictions

print("\n17th Lok Sabha - ML Predictions:")
print(
    df17_ml[
        [
            "constituency_name",
            "mp_name",
            "isolation_forest_prediction"
        ]
    ].head(20)
)

print("\n18th Lok Sabha - ML Predictions:")
print(
    df18_ml[
        [
            "constituency_name",
            "mp_name",
            "isolation_forest_prediction"
        ]
    ].head(20)
)

# 11. Converting ML Predictions to Labels


df17_ml["ml_anomaly"] = df17_ml["isolation_forest_prediction"].map({
    1: "Normal",
    -1: "Potential Anomaly"
})

df18_ml["ml_anomaly"] = df18_ml["isolation_forest_prediction"].map({
    1: "Normal",
    -1: "Potential Anomaly"
})

print("\n17th Lok Sabha - ML Anomaly Labels:")
print(
    df17_ml[
        [
            "constituency_name",
            "mp_name",
            "ml_anomaly"
        ]
    ].head(20)
)

print("\n18th Lok Sabha - ML Anomaly Labels:")
print(
    df18_ml[
        [
            "constituency_name",
            "mp_name",
            "ml_anomaly"
        ]
    ].head(20)
)
# -------------------------------
# 12. Count ML Anomalies
# -------------------------------

print("\n17th Lok Sabha - ML Anomaly Count:")
print(df17_ml["ml_anomaly"].value_counts())

print("\n18th Lok Sabha - ML Anomaly Count:")
print(df18_ml["ml_anomaly"].value_counts())

# -------------------------------
# 13. View Potential Anomalies
# -------------------------------

print("\n17th Lok Sabha - Potential Anomalies:")
print(
    df17_ml[
        df17_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].head(20)
)

print("\n18th Lok Sabha - Potential Anomalies:")
print(
    df18_ml[
        df18_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].head(20)
)
# -------------------------------
# 14. Detailed ML Anomalies
# -------------------------------

print("\n17th Lok Sabha - Detailed Potential Anomalies:")

print(
    df17_ml[
        df17_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].to_string(index=False)
)

print("\n18th Lok Sabha - Detailed Potential Anomalies:")

print(
    df18_ml[
        df18_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct"
        ]
    ].to_string(index=False)
)

# -------------------------------
# 15. Isolation Forest Anomaly Scores
# -------------------------------

df17_ml["anomaly_score"] = model17.decision_function(X17)
df18_ml["anomaly_score"] = model18.decision_function(X18)

print("\n17th Lok Sabha - Anomaly Scores:")
print(
    df17_ml[
        [
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "ml_anomaly"
        ]
    ].sort_values("anomaly_score").head(20).to_string(index=False)
)

print("\n18th Lok Sabha - Anomaly Scores:")
print(
    df18_ml[
        [
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "ml_anomaly"
        ]
    ].sort_values("anomaly_score").head(20).to_string(index=False)
)
# -------------------------------
# 16. Improved Anomaly Explanation
# -------------------------------

def get_iqr_bounds(series):
    
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1

    lower = Q1 - (1.5 * IQR)
    upper = Q3 + (1.5 * IQR)

    return lower, upper


def explain_anomaly(row, df):

    reasons = []

    # -------------------------------
    # Fund Utilization
    # -------------------------------

    lower, upper = get_iqr_bounds(
        df["fund_utilization_pct"]
    )

    value = row["fund_utilization_pct"]

    if value < lower:
        reasons.append(
            f"Low fund utilization ({value:.2f}%)"
        )

    elif value > upper:
        reasons.append(
            f"High fund utilization ({value:.2f}%)"
        )


    # -------------------------------
    # Sanction Rate
    # -------------------------------

    lower, upper = get_iqr_bounds(
        df["sanction_rate_pct"]
    )

    value = row["sanction_rate_pct"]

    if value < lower:
        reasons.append(
            f"Low sanction rate ({value:.2f}%)"
        )

    elif value > upper:
        reasons.append(
            f"High sanction rate ({value:.2f}%)"
        )


    # -------------------------------
    # Work Completion Rate
    # -------------------------------

    lower, upper = get_iqr_bounds(
        df["work_completion_rate_pct"]
    )

    value = row["work_completion_rate_pct"]

    if value < lower:
        reasons.append(
            f"Low work completion rate ({value:.2f}%)"
        )

    elif value > upper:
        reasons.append(
            f"High work completion rate ({value:.2f}%)"
        )


    # -------------------------------
    # No individual IQR anomaly
    # -------------------------------

    if len(reasons) == 0:
        reasons.append(
            "Unusual combination of financial and implementation indicators"
        )

    return "; ".join(reasons)


df17_ml["anomaly_reason"] = df17_ml.apply(
    lambda row: explain_anomaly(row, df17),
    axis=1
)

df18_ml["anomaly_reason"] = df18_ml.apply(
    lambda row: explain_anomaly(row, df18),
    axis=1
)


print("\n17th Lok Sabha - Improved Anomaly Explanations:")

print(
    df17_ml[
        df17_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ].head(20).to_string(index=False)
)


print("\n18th Lok Sabha - Improved Anomaly Explanations:")

print(
    df18_ml[
        df18_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ].head(20).to_string(index=False)
)
# -------------------------------
# 18. Create Final Anomaly Tables
# -------------------------------

anomalies17 = df17_ml[
    df17_ml["ml_anomaly"] == "Potential Anomaly"
].copy()

anomalies18 = df18_ml[
    df18_ml["ml_anomaly"] == "Potential Anomaly"
].copy()


# Sort from most unusual to least unusual

anomalies17 = anomalies17.sort_values(
    "anomaly_score"
)

anomalies18 = anomalies18.sort_values(
    "anomaly_score"
)


print("\n17th Lok Sabha - Top Potential Anomalies:")

print(
    anomalies17[
        [
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ].head(10).to_string(index=False)
)


print("\n18th Lok Sabha - Top Potential Anomalies:")

print(
    anomalies18[
        [
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ].head(10).to_string(index=False)
)
# -------------------------------
# 19. Combine Anomaly Results
# -------------------------------

anomalies17["lok_sabha"] = "17th Lok Sabha"
anomalies18["lok_sabha"] = "18th Lok Sabha"


all_anomalies = pd.concat(
    [anomalies17, anomalies18],
    ignore_index=True
)


print("\nCombined Potential Anomalies:")

print(
    all_anomalies[
        [
            "lok_sabha",
            "constituency_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ].head(20).to_string(index=False)
)


print("\nTotal Potential Anomalies:")
print(len(all_anomalies))
# -------------------------------
# 20. Analyze Anomaly Score Distribution
# -------------------------------

print("\n17th Lok Sabha - Score Statistics:")
print(
    df17_ml["anomaly_score"].describe()
)

print("\n18th Lok Sabha - Score Statistics:")
print(
    df18_ml["anomaly_score"].describe()
)


print("\n17th Lok Sabha - Lowest Scores:")
print(
    df17_ml[
        [
            "constituency_name",
            "anomaly_score",
            "ml_anomaly"
        ]
    ]
    .sort_values("anomaly_score")
    .head(10)
    .to_string(index=False)
)


print("\n18th Lok Sabha - Lowest Scores:")
print(
    df18_ml[
        [
            "constituency_name",
            "anomaly_score",
            "ml_anomaly"
        ]
    ]
    .sort_values("anomaly_score")
    .head(10)
    .to_string(index=False)
)

# -------------------------------
# 21. Inspect Isolation Forest Boundary
# -------------------------------

print("\n17th Lok Sabha:")

print(
    "Negative scores:",
    (df17_ml["anomaly_score"] < 0).sum()
)

print(
    "Zero scores:",
    (df17_ml["anomaly_score"] == 0).sum()
)

print(
    "Positive scores:",
    (df17_ml["anomaly_score"] > 0).sum()
)


print("\n18th Lok Sabha:")

print(
    "Negative scores:",
    (df18_ml["anomaly_score"] < 0).sum()
)

print(
    "Zero scores:",
    (df18_ml["anomaly_score"] == 0).sum()
)

print(
    "Positive scores:",
    (df18_ml["anomaly_score"] > 0).sum()
)
# -------------------------------
# 22. Indicator Status
# -------------------------------
def indicator_status(value, lower, upper):

    if pd.isna(value):
        return "Not Available"

    elif value < lower:
        return "Low"

    elif value > upper:
        return "High"

    else:
        return "Normal"

def add_indicator_status(df_ml, df):

    # Fund Utilization
    lower, upper = get_iqr_bounds(
        df["fund_utilization_pct"]
    )

    df_ml["fund_utilization_status"] = df_ml[
        "fund_utilization_pct"
    ].apply(
        lambda x: indicator_status(x, lower, upper)
    )


    # Sanction Rate
    lower, upper = get_iqr_bounds(
        df["sanction_rate_pct"]
    )

    df_ml["sanction_rate_status"] = df_ml[
        "sanction_rate_pct"
    ].apply(
        lambda x: indicator_status(x, lower, upper)
    )


    # Work Completion Rate
    lower, upper = get_iqr_bounds(
        df["work_completion_rate_pct"]
    )

    df_ml["work_completion_status"] = df_ml[
        "work_completion_rate_pct"
    ].apply(
        lambda x: indicator_status(x, lower, upper)
    )


add_indicator_status(df17_ml, df17)
add_indicator_status(df18_ml, df18)


print("\n17th Lok Sabha - Indicator Status:")

print(
    df17_ml[
        [
            "constituency_name",
            "fund_utilization_pct",
            "fund_utilization_status",
            "sanction_rate_pct",
            "sanction_rate_status",
            "work_completion_rate_pct",
            "work_completion_status"
        ]
    ].head(10).to_string(index=False)
)


print("\n18th Lok Sabha - Indicator Status:")

print(
    df18_ml[
        [
            "constituency_name",
            "fund_utilization_pct",
            "fund_utilization_status",
            "sanction_rate_pct",
            "sanction_rate_status",
            "work_completion_rate_pct",
            "work_completion_status"
        ]
    ].head(10).to_string(index=False)
)

# -------------------------------
# 23. Final Anomaly Explanation
# -------------------------------

def final_anomaly_reason(row):

    reasons = []

    if row["fund_utilization_status"] == "Low":
        reasons.append(
            f"Low fund utilization ({row['fund_utilization_pct']:.2f}%)"
        )

    elif row["fund_utilization_status"] == "High":
        reasons.append(
            f"High fund utilization ({row['fund_utilization_pct']:.2f}%)"
        )

    if row["sanction_rate_status"] == "Low":
        reasons.append(
            f"Low sanction rate ({row['sanction_rate_pct']:.2f}%)"
        )

    elif row["sanction_rate_status"] == "High":
        reasons.append(
            f"High sanction rate ({row['sanction_rate_pct']:.2f}%)"
        )

    if row["work_completion_status"] == "Low":
        reasons.append(
            f"Low work completion ({row['work_completion_rate_pct']:.2f}%)"
        )

    elif row["work_completion_status"] == "High":
        reasons.append(
            f"High work completion ({row['work_completion_rate_pct']:.2f}%)"
        )

    if reasons:
        return " | ".join(reasons)

    elif row["ml_anomaly"] == "Potential Anomaly":
        return "Unusual combination of financial and implementation indicators"

    else:
        return "No unusual pattern detected"


df17_ml["anomaly_reason"] = df17_ml.apply(
    final_anomaly_reason,
    axis=1
)

df18_ml["anomaly_reason"] = df18_ml.apply(
    final_anomaly_reason,
    axis=1
)


print("\n17th Lok Sabha - Potential Anomalies:")

print(
    df17_ml[
        df17_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "state_name",
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ]
    .sort_values("anomaly_score")
    .head(10)
    .to_string(index=False)
)


print("\n18th Lok Sabha - Potential Anomalies:")

print(
    df18_ml[
        df18_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "state_name",
            "constituency_name",
            "mp_name",
            "fund_utilization_pct",
            "sanction_rate_pct",
            "work_completion_rate_pct",
            "anomaly_score",
            "anomaly_reason"
        ]
    ]
    .sort_values("anomaly_score")
    .head(10)
    .to_string(index=False)
)
# -------------------------------
# 24. Detection Method
# -------------------------------

def detection_method(row):

    indicator_outlier = (
        row["fund_utilization_status"] in ["Low", "High"]
        or
        row["sanction_rate_status"] in ["Low", "High"]
        or
        row["work_completion_status"] in ["Low", "High"]
    )

    if row["ml_anomaly"] == "Potential Anomaly":

        if indicator_outlier:
            return "ML + Indicator Outlier"
        else:
            return "ML Multivariate"

    elif indicator_outlier:
        return "Indicator Outlier Only"

    else:
        return "No Unusual Pattern"


df17_ml["detection_method"] = df17_ml.apply(
    detection_method,
    axis=1
)

df18_ml["detection_method"] = df18_ml.apply(
    detection_method,
    axis=1
)


print("\n17th Lok Sabha - Detection Method:")

print(
    df17_ml[
        df17_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "anomaly_score",
            "anomaly_reason",
            "detection_method"
        ]
    ]
    .sort_values("anomaly_score")
    .head(10)
    .to_string(index=False)
)


print("\n18th Lok Sabha - Detection Method:")

print(
    df18_ml[
        df18_ml["ml_anomaly"] == "Potential Anomaly"
    ][
        [
            "constituency_name",
            "anomaly_score",
            "anomaly_reason",
            "detection_method"
        ]
    ]
    .sort_values("anomaly_score")
    .head(10)
    .to_string(index=False)
)
# -------------------------------
# 25. Final Analysis Dataset
# -------------------------------

df17_final = df17_ml.copy()
df18_final = df18_ml.copy()

df17_final["lok_sabha"] = "17th Lok Sabha"
df18_final["lok_sabha"] = "18th Lok Sabha"


final_data = pd.concat(
    [df17_final, df18_final],
    ignore_index=True
)


print("\nFinal Analysis Dataset:")
print("Total records:", len(final_data))

print("\nRecords by Lok Sabha:")
print(
    final_data["lok_sabha"]
    .value_counts()
)


print("\nFinal Dataset Columns:")
print(
    final_data.columns.tolist()
)
# -------------------------------
# 26. Export Final Analysis Data
# -------------------------------

final_data.to_csv(
    "data/final_analysis.csv",
    index=False
)

print("\nFinal analysis data saved successfully.")