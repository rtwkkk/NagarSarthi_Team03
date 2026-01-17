from fastapi import FastAPI, HTTPException
from app.utils.data_loader import load_alert_data
from app.services.alert_generator import generate_civic_alert

app = FastAPI(title="Nagar Alert Hub – AI Civic Alerts")

@app.get("/")
def root():
    return {"message": "AI Civic Alert Service is running"}

@app.get("/alerts")
def get_all_alert_data():
    return load_alert_data()

@app.post("/generate-alert/{alert_index}")
def generate_alert(alert_index: int):
    alerts = load_alert_data()

    if alert_index < 0 or alert_index >= len(alerts):
        raise HTTPException(status_code=404, detail="Invalid alert index")

    alert_data = alerts[alert_index]
    alert_text = generate_civic_alert(alert_data)

    return {
        "alert_data": alert_data,
        "generated_alert": alert_text
    }
