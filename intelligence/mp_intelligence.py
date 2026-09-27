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

'''
utilization_outliers = mp_df[
    (mp_df["Utilization %"] < lower_bound) |
    (mp_df["Utilization %"] > upper_bound)
]

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