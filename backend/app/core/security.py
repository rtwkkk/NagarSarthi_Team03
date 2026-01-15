import os
from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NAGAR_API_KEY")

# Fallback for development if .env is missing or variable is unset
if not API_KEY:
    API_KEY = "NAGAR_ALERT_SECRET_123"

api_key_header = APIKeyHeader(
    name="X-API-KEY",
    auto_error=False
)

def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key == API_KEY:
        return api_key

    raise HTTPException(
        status_code=403,
        detail="Invalid or missing API Key"
    )