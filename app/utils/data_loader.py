import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "alert_data.json"

def load_alert_data():
    with open(DATA_PATH, "r", encoding="utf-8") as file:
        return json.load(file)
