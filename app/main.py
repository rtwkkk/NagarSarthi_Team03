import traceback
from fastapi import FastAPI, Depends
from app.core.security import verify_api_key
from app.services.data_generator import generate_data
from app.services.preprocessing import preprocess
from app.services.sarima_model import run_sarima

app = FastAPI(title="Nagar Alert Hub")

@app.get("/")
def root():
    return {"message": "Nagar Alert Hub API running"}

@app.post("/generate-data")
def step1(api_key: str = Depends(verify_api_key)):
    try:
        generate_data()
        return {"status": "STEP-1 completed"}
    except Exception as e:
        traceback.print_exc()
        return {"status": "FAILED", "error": str(e)}

@app.post("/preprocess-data")
def step2(api_key: str = Depends(verify_api_key)):
    try:
        preprocess()
        return {"status": "STEP-2 completed"}
    except Exception as e:
        traceback.print_exc()
        return {"status": "FAILED", "error": str(e)}

@app.get("/predict-future-alerts")
def step3(api_key: str = Depends(verify_api_key)):
    try:
        return run_sarima()
    except Exception as e:
        traceback.print_exc()
        return {"status": "FAILED", "error": str(e)}