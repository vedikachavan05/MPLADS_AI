import pandas as pd
import os

files = {
    "Recommended Works": "recommendedworks.csv",
    "Completed Works": "completedworks.csv",
    "MP Summary": "mpnames.csv"
}

for name, filename in files.items():
    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    path = filename

    if not os.path.exists(path):
        print("FILE NOT FOUND:", filename)
        continue

    df = pd.read_csv(path, low_memory=False)

    print("Rows:", len(df))
    print("Columns:", len(df.columns))
    print("\nColumn names:")
    print(list(df.columns))

    print("\nHouse distribution:")
    if "House" in df.columns:
        print(df["House"].value_counts(dropna=False))
    else:
        print("House column not found")

    print("\nMissing values:")
    print(df.isna().sum())

    if "Work ID" in df.columns:
        print("\nUnique Work IDs:", df["Work ID"].nunique())
        print("Duplicate Work IDs:", df["Work ID"].duplicated().sum())

    for date_col in ["Recommendation Date", "Completed Date"]:
        if date_col in df.columns:
            dates = pd.to_datetime(df[date_col], errors="coerce")
            print(f"\n{date_col}:")
            print("Earliest:", dates.min())
            print("Latest:", dates.max())

print("\n" + "=" * 60)
print("RECOMMENDED ↔ COMPLETED WORK ID MATCH")
print("=" * 60)

recommended = pd.read_csv("recommendedworks.csv", low_memory=False)
completed = pd.read_csv("completedworks.csv", low_memory=False)

if "Work ID" in recommended.columns and "Work ID" in completed.columns:
    recommended_ids = set(recommended["Work ID"].dropna().astype(str))
    completed_ids = set(completed["Work ID"].dropna().astype(str))

    matched = recommended_ids & completed_ids

    print("Recommended unique Work IDs:", len(recommended_ids))
    print("Completed unique Work IDs:", len(completed_ids))
    print("Matched Work IDs:", len(matched))
    print("Recommended without Completed match:",
          len(recommended_ids - completed_ids))
    print("Completed without Recommended match:",
          len(completed_ids - recommended_ids))
else:
    print("Work ID column missing from one of the datasets.")

print("\nVALIDATION COMPLETE")