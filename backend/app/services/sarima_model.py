import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX

def run_sarima():
    df = pd.read_csv("app/data/processed/jharkhand_step2_prepared.csv")
    df["date"] = pd.to_datetime(df["date"])

    temp_results = []

    for area in df["area_name"].unique():
        area_df = df[df["area_name"] == area].sort_values("date")
        ts = area_df.set_index("date")["incident_count"]
        ts.index.freq = 'D'

        if len(ts) < 14:
            continue

        try:
            model = SARIMAX(ts, order=(1,1,1), seasonal_order=(1,1,1,7),
                          enforce_stationarity=False, enforce_invertibility=False)
            results = model.fit(disp=False)
            forecast = results.get_forecast(7).predicted_mean.sum()
        except Exception as e:
            print(f"Error for {area}: {e}")
            continue

        temp_results.append({
            "area_name": area,
            "predicted_incidents_7_days": round(max(0, forecast), 2)
        })

    if not temp_results:
        return []

    # Assign risk levels based on distribution: 20% Low, 60% Medium, 20% High
    forecasts = [res["predicted_incidents_7_days"] for res in temp_results]
    
    # Sort and pick indices for 20th and 80th percentiles for more precise split
    sorted_temp = sorted(temp_results, key=lambda x: x["predicted_incidents_7_days"])
    n = len(sorted_temp)
    
    low_idx = int(round(0.2 * n))
    high_idx = int(round(0.8 * n))
    
    # Fallback to percentile values if we have very small data
    p20 = np.percentile(forecasts, 20)
    p80 = np.percentile(forecasts, 80)

    final_alerts = []
    for res in temp_results:
        f = res["predicted_incidents_7_days"]
        # Use rank-based assignment for better distribution, falling back to percentile if values are all same
        if f <= p20:
            risk = "LOW"
        elif f >= p80:
            risk = "HIGH"
        else:
            risk = "MEDIUM"
        
        final_alerts.append({
            "area_name": str(res["area_name"]),
            "predicted_incidents_7_days": int(round(f)),
            "risk_level": str(risk)
        })

    result_df = pd.DataFrame(final_alerts)
    if not result_df.empty:
        result_df.to_csv("app/data/predictions/future_alerts.csv", index=False)
    
    return final_alerts