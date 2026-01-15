import pandas as pd

def preprocess():
    df = pd.read_csv("app/data/raw/jharkhand_incidents_raw_500.csv")

    df["datetime"] = pd.to_datetime(df["date"] + " " + df["time"])
    df["day_of_week"] = df["datetime"].dt.dayofweek
    df["month"] = df["datetime"].dt.month

    daily = (
        df.groupby(["area_name", df["datetime"].dt.date])
        .size()
        .reset_index(name="incident_count")
    )

    daily.rename(columns={"level_1": "date"}, inplace=True) # or datetime
    if "datetime" in daily.columns:
        daily.rename(columns={"datetime": "date"}, inplace=True)
    
    daily["date"] = pd.to_datetime(daily["date"])

    # Ensure all dates are present for each area (fill gaps with 0)
    all_areas = daily["area_name"].unique()
    all_dates = pd.date_range(start=daily["date"].min(), end=daily["date"].max())
    
    idx = pd.MultiIndex.from_product([all_areas, all_dates], names=["area_name", "date"])
    daily = daily.set_index(["area_name", "date"]).reindex(idx, fill_value=0).reset_index()

    daily = daily.sort_values(["area_name", "date"])

    daily["incidents_last_7_days"] = (
        daily.groupby("area_name")["incident_count"]
        .transform(lambda x: x.rolling(7, min_periods=1).sum())
    )

    daily["incidents_last_30_days"] = (
        daily.groupby("area_name")["incident_count"]
        .transform(lambda x: x.rolling(30, min_periods=1).sum())
    )

    daily.to_csv("app/data/processed/jharkhand_step2_prepared.csv", index=False)
    return daily