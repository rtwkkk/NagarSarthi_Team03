import os
import sys

# Add the project root to sys.path
sys.path.append(os.getcwd())

from app.services.data_generator import generate_data
from app.services.preprocessing import preprocess
from app.services.sarima_model import run_sarima

def test_pipeline():
    print("Starting Step 1: Data Generation...")
    try:
        df_raw = generate_data()
        print(f"Step 1 Success: Generated {len(df_raw)} records.")
    except Exception as e:
        print(f"Step 1 Failed: {e}")
        return

    print("Starting Step 2: Preprocessing...")
    try:
        df_processed = preprocess()
        print(f"Step 2 Success: Processed data has {len(df_processed)} rows.")
    except Exception as e:
        print(f"Step 2 Failed: {e}")
        return

    print("Starting Step 3: SARIMA Modeling...")
    try:
        alerts = run_sarima()
        print(f"Step 3 Success: Generated {len(alerts)} alerts.")
        for alert in alerts[:3]:
            print(f"  - {alert}")
    except Exception as e:
        print(f"Step 3 Failed: {e}")
        return

    print("\nFull Pipeline Verified Successfully!")

if __name__ == "__main__":
    test_pipeline()
