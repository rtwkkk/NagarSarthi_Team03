import traceback
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.security import verify_api_key
from app.services.data_generator import generate_data
from app.services.preprocessing import preprocess
from app.services.sarima_model import run_sarima
from app.services.translator import translator
from app.schemas import TranslationRequest, TranslationResponse

app = FastAPI(title="Nagar Alert Hub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/translate", response_model=TranslationResponse)
def translate(request: TranslationRequest):
    try:
        translated_text = translator.translate(
            request.text, 
            request.src_lang, 
            request.target_lang
        )
        return TranslationResponse(
            translated_text=translated_text,
            src_lang=request.src_lang,
            target_lang=request.target_lang
        )
    except Exception as e:
        traceback.print_exc()
        return TranslationResponse(
            translated_text=f"ERROR: {str(e)}",
            src_lang=request.src_lang,
            target_lang=request.target_lang
        )
