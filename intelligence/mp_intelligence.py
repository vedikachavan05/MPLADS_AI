from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pandas as pd


# Load MP summary data
mp_df = pd.read_csv("data/mpnames.csv")


# Clean column names
mp_df.columns = mp_df.columns.str.strip()


# Clean text columns
text_columns = [
    "MP Name",
    "Constituency",
    "State",
    "House"
]

for column in text_columns:
    mp_df[column] = (
        mp_df[column]
        .astype(str)
        .str.strip()
    )


# Convert numeric columns
numeric_columns = [
    "Allocated Amount (₹)",
    "Amount Recommended (₹)",
    "Total Expenditure (₹)",
    "Utilization %",
    "Completed Works",
    "Recommended Works",
    "Completion Rate %",
    "Balance Not Yet Paid to Vendors (₹)",
    "Transaction Count",
    "Successful Payments",
    "Pending Payments"
]

for column in numeric_columns:
    mp_df[column] = pd.to_numeric(
        mp_df[column],
        errors="coerce"
    )


# Basic information
print("MP Intelligence data loaded successfully")
print("Total MPs:", len(mp_df))
print("Columns:", list(mp_df.columns))
print("Missing values:")
print(mp_df.isnull().sum())

print("\nUtilization % statistics:")
print(mp_df["Utilization %"].describe())

print("\nCompletion Rate % statistics:")
print(mp_df["Completion Rate %"].describe())

print("\nPending Payments statistics:")
print(mp_df["Pending Payments"].describe())

print("\nBalance Not Yet Paid to Vendors statistics:")
print(mp_df["Balance Not Yet Paid to Vendors (₹)"].describe())

print("\nTransaction Count statistics:")
print(mp_df["Transaction Count"].describe())

#Adding IQR to find overall utlization rate 

q1 = mp_df["Utilization %"].quantile(0.25)
q3 = mp_df["Utilization %"].quantile(0.75)

iqr = q3 - q1

lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

#printed IQR for finding utlization outliers in dataset 


utilization_outliers = mp_df[
    (mp_df["Utilization %"] < lower_bound) |
    (mp_df["Utilization %"] > upper_bound)
]
'''
print("\nUtilization IQR:")
print("Q1:", q1)
print("Q3:", q3)
print("IQR:", iqr)
print("Lower Bound:", lower_bound)
print("Upper Bound:", upper_bound)
print("Outlier MPs:", len(utilization_outliers))
'''

mp_df["utilization_signal"] = (
    mp_df["Utilization %"] < lower_bound
)

print("\nUtilization signals:")
print(mp_df["utilization_signal"].value_counts())
'''
q1_completion = mp_df["Completion Rate %"].quantile(0.25)
q3_completion = mp_df["Completion Rate %"].quantile(0.75)

iqr_completion = q3_completion - q1_completion

lower_bound_completion = q1_completion - 1.5 * iqr_completion

print("\nCompletion Rate IQR:")
print("Q1:", q1_completion)
print("Q3:", q3_completion)
print("Lower Bound:", lower_bound_completion)
'''
# finding Uppper BOund for pending payments 
q1_pending = mp_df["Pending Payments"].quantile(0.25)
q3_pending = mp_df["Pending Payments"].quantile(0.75)

iqr_pending = q3_pending - q1_pending

upper_bound_pending = q3_pending + 1.5 * iqr_pending

print("\nPending Payments IQR:")
print("Q1:", q1_pending)
print("Q3:", q3_pending)
print("Upper Bound:", upper_bound_pending)

mp_df["pending_payment_signal"] = (
    mp_df["Pending Payments"] > upper_bound_pending
)

print("\nPending Payment signals:")
print(mp_df["pending_payment_signal"].value_counts())


#finding remaining vendor balances
q1_balance = mp_df["Balance Not Yet Paid to Vendors (₹)"].quantile(0.25)
q3_balance = mp_df["Balance Not Yet Paid to Vendors (₹)"].quantile(0.75)

iqr_balance = q3_balance - q1_balance

upper_bound_balance = q3_balance + 1.5 * iqr_balance

print("\nBalance IQR:")
print("Q1:", q1_balance)
print("Q3:", q3_balance)
print("Upper Bound:", upper_bound_balance)

mp_df["balance_signal"] = (
    mp_df["Balance Not Yet Paid to Vendors (₹)"] > upper_bound_balance
)

print("\nBalance signals:")
print(mp_df["balance_signal"].value_counts())

mp_df["signal_count"] = (
    mp_df["utilization_signal"].astype(int)
    + mp_df["pending_payment_signal"].astype(int)
    + mp_df["balance_signal"].astype(int)
)

print("\nSignal count distribution:")
print(mp_df["signal_count"].value_counts().sort_index())

#was finding features correlation
'''
print("\nFeature Correlation:")
print(
    mp_df[numeric_columns].corr().round(2)
)
'''
ml_features = mp_df[
    numeric_columns
].copy()

print("\nML feature shape:")
print(ml_features.shape)

print("\nMissing values in ML features:")
print(ml_features.isnull().sum())

#using standscaler for LOF as it needs scaling to avoind disortion 
scaler = StandardScaler()

ml_features_scaled = scaler.fit_transform(ml_features)

print("\nScaled ML feature shape:")
print(ml_features_scaled.shape)

#creating an isolation forest
model = IsolationForest(
    n_estimators=200,
    contamination="auto",
    random_state=42
)


model.fit(ml_features_scaled)

ml_predictions = model.predict(ml_features_scaled)
mp_df["ml_anomaly_signal"] = (
    ml_predictions == -1
)

ml_scores = model.decision_function(ml_features_scaled)


mp_df["ml_anomaly_score"] = ml_scores

#predicting the feature matrix values 


print("\nML predictions:")
print(pd.Series(ml_predictions).value_counts())

strongest_anomaly = (
    mp_df[
        mp_df["ml_anomaly_signal"]
    ]
    .sort_values("ml_anomaly_score")
    .iloc[0]
)

mp_df["ml_anomaly_signal"] = (
    ml_predictions == -1
)
mp_df["utilization_reason"] = ""
#implementing loc to find individual anomly 
mp_df.loc[
    mp_df["utilization_signal"],
    "utilization_reason"
] = "Low utilization"

mp_df["pending_payment_reason"] = ""

mp_df.loc[
    mp_df["pending_payment_signal"],
    "pending_payment_reason"
] = "High pending payments"

mp_df["balance_reason"] = ""

mp_df.loc[
    mp_df["balance_signal"],
    "balance_reason"
] = "High unpaid vendor balance"

mp_df["statistical_reason"] = (
    mp_df[
        [
            "utilization_reason",
            "pending_payment_reason",
            "balance_reason"
        ]
    ]
    .apply(
        lambda row: ", ".join(
            value for value in row if value
        ),
        axis=1
    )
)
mp_df["ml_reason"] = ""


mp_df.loc[
    mp_df["ml_anomaly_signal"],
    "ml_reason"
] = "Unusual combination of operational and financial activity"
#why flagged code to check why anomly flagged based on statisticl analysis and ml_reason

mp_df["why_flagged"] = (
    mp_df[
        ["statistical_reason", "ml_reason"]
    ]
    .apply(
        lambda row: ", ".join(
            value for value in row if value
        ),
        axis=1
    )
)


#comparing statical anomaly with ml anaomalies
mp_df["statistical_signal_count"] = (
    mp_df["utilization_signal"].astype(int)
    + mp_df["pending_payment_signal"].astype(int)
    + mp_df["balance_signal"].astype(int)
)

print("\nStatistical vs ML:")
print(
    pd.crosstab(
        mp_df["statistical_signal_count"],
        mp_df["ml_anomaly_signal"]
    )
)

print("\nML anomaly feature comparison:")
print(
    mp_df.groupby("ml_anomaly_signal")[numeric_columns]
    .median()
    .T
)

print("\nMost unusual ML cases:")
print(
    mp_df[
        mp_df["ml_anomaly_signal"]
    ][
        ["MP Name", "Constituency", "House", "ml_anomaly_score"]
    ]
    .sort_values("ml_anomaly_score")
    .head(10)
)

#strongest anomly section 
print("\nStrongest ML anomaly:")
print(
    strongest_anomaly[
        ["MP Name", "Constituency", "House"] + numeric_columns
    ]
)
print("\nStrongest anomaly percentiles:")

for column in numeric_columns:
    percentile = (
        mp_df[column]
        .rank(pct=True)[strongest_anomaly.name] * 100
    )

    print(
        column,
        "→",
        round(percentile, 2),
        "percentile"
    )
    ml_evidence = []

for column in numeric_columns:
    percentile = (
        mp_df[column]
        .rank(pct=True)[strongest_anomaly.name] * 100
    )

    if percentile >= 95:
        ml_evidence.append(
            f"{column}: {round(percentile, 2)} percentile"
        )

print("\nStrongest anomaly evidence:")
print(ml_evidence)
#fetching anomly evidence 
def get_ml_evidence(row):

    evidence = []

    for column in numeric_columns:

        percentile = (
            mp_df[column].rank(pct=True)[row.name] * 100
        )

        if percentile >= 95 or percentile <= 5:

            if percentile >= 95:
                direction = "unusually high"
            else:
                direction = "unusually low"

            evidence.append({
                "metric": column,
                "value": row[column],
                "percentile": round(percentile, 2),
                "direction": direction
            })

    return evidence
mp_df["ml_evidence"] =None

for index, row in mp_df.iterrows():

    if row["ml_anomaly_signal"]:
        evidence = get_ml_evidence(row)

        mp_df.at[index, "ml_evidence"] = evidence

print("\nSample ML evidence:")

print(
    mp_df[
        mp_df["ml_anomaly_signal"]
    ][
        [
            "MP Name",
            "ml_anomaly_score",
            "ml_evidence"
        ]
    ].head(10)
)

mp_df["overall_signal"] = (
    mp_df["statistical_signal_count"] > 0
)|mp_df["ml_anomaly_signal"]

print("\nOverall signal distribution:")
print(mp_df["overall_signal"].value_counts())

print("\nOverall signal count distribution:")

print(
    mp_df[
        mp_df["overall_signal"]
    ][
        ["statistical_signal_count", "ml_anomaly_signal"]
    ].value_counts()
)

# comparing to ml signal percentages 
'''
percentile_data = pd.DataFrame(index=mp_df.index)

for column in numeric_columns:
    percentile_data[column] = (
        mp_df[column].rank(pct=True) * 100
    )

print(
    percentile_data[
        mp_df["ml_anomaly_signal"]
    ][numeric_columns]
    .median()
    .sort_values(ascending=False)
)
'''

print("\nSample flagged MPs:")

print(
    mp_df[
        mp_df["overall_signal"]
    ][
        [
            "MP Name",
            "statistical_reason",
            "ml_reason",
            "why_flagged"
        ]
    ].head(10)
)
#print("\nSample flagged MPs:")
...
# Save MP Intelligence results

output_columns = [
    "MP Name",
    "Constituency",
    "State",
    "House",
    "overall_signal",
    "statistical_signal_count",
    "statistical_reason",
    "ml_anomaly_signal",
    "ml_anomaly_score",
    "ml_reason",
    "ml_evidence"
] + numeric_columns

mp_df[output_columns].to_json(
    "data/mp_intelligence.json",
    orient="records",
    indent=2
)

print("\nMP Intelligence results saved successfully")