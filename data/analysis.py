import pandas as pd

# -----------------------------------
# 1. Load original CSV files
# -----------------------------------

df17 = pd.read_csv("data/mplad17.csv")
df18 = pd.read_csv("data/mplad18.csv")


# -----------------------------------
# 2. Fix column name in 17th dataset
# -----------------------------------

df17 = df17.rename(columns={
    "Unnamed: 15": "n_recommended"
})


# -----------------------------------
# 3. Remove exact duplicate rows
# -----------------------------------

df17 = df17.drop_duplicates()
df18 = df18.drop_duplicates()


# -----------------------------------
# 4. Display cleaned dataset sizes
# -----------------------------------

print("After cleaning:")

print("17th Lok Sabha:", df17.shape)
print("18th Lok Sabha:", df18.shape)


# -----------------------------------
# 5. Check missing values
# -----------------------------------

print("\nMissing values - 17th:")
print(df17.isnull().sum())

print("\nMissing values - 18th:")
print(df18.isnull().sum())