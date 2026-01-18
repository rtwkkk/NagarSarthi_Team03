from pydantic import BaseModel

class TranslationRequest(BaseModel):
    text: str
    src_lang: str = "en"
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str
    src_lang: str
    target_lang: str
