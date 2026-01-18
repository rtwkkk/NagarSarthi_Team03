from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

class TranslatorService:
    def __init__(self):
        # Using a smaller model as a proof of concept for English-Hindi
        self.model_name = "Helsinki-NLP/opus-mt-en-hi"
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def load_model(self):
        if self.model is None:
            print(f"Loading translation model: {self.model_name} on {self.device}...")
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name).to(self.device)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
                raise

    def translate(self, text: str, src_lang: str, target_lang: str) -> str:
        # Note: opus-mt-en-hi is English to Hindi only
        # This is for proof of concept that the API works
        self.load_model()
        
        inputs = self.tokenizer(text, return_tensors="pt").to(self.device)
        translated_tokens = self.model.generate(**inputs, max_length=128)
        return self.tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

# Global instance
translator = TranslatorService()
