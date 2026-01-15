import pandas as pd
import random
from datetime import datetime, timedelta

def generate_data():
    areas = {
        "Bank More, Dhanbad": (23.7957, 86.4304),
        "Bistupur, Jamshedpur": (22.8046, 86.2029),
        "Ringle Road, Ranchi": (23.3441, 85.3096),
        "Main Road, Ranchi": (23.3698, 85.3250),
        "Sakchi, Jamshedpur": (22.8010, 86.2021),
        "Steel Gate, Bokaro": (23.6693, 86.1511),
        "Harmu, Ranchi": (23.3539, 85.2972),
        "Katras Road, Dhanbad": (23.8143, 86.3150),
        "Dumka Chowk": (24.2677, 87.2486),
        "Chaibasa Market": (22.5512, 85.8020)
    }

    incident_types = [
        "Traffic", "Utility", "Disaster", "Protest",
        "Crime", "Infrastructure", "Health", "Others"
    ]

    records = []
    start = datetime(2024, 1, 1)

    for _ in range(500):
        area = random.choice(list(areas.keys()))
        lat, lon = areas[area]

        dt = start + timedelta(
            days=random.randint(0, 364),
            seconds=random.randint(0, 86399)
        )

        records.append({
            "area_name": area,
            "latitude": round(lat + random.uniform(-0.01, 0.01), 6),
            "longitude": round(lon + random.uniform(-0.01, 0.01), 6),
            "incident_type": random.choice(incident_types),
            "date": dt.date(),
            "time": dt.time().strftime("%H:%M:%S")
        })

    df = pd.DataFrame(records)
    df.to_csv("app/data/raw/jharkhand_incidents_raw_500.csv", index=False)
    return df