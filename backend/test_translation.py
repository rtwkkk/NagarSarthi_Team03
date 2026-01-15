import requests
import json

def test_translation():
    url = "http://localhost:8000/translate"
    payload = {
        "text": "Welcome to Nagar Alert Hub",
        "src_lang": "en",
        "target_lang": "hi"
    }
    
    print(f"Testing translation: '{payload['text']}' to {payload['target_lang']}...")
    try:
        # Note: The server must be running for this to work
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            result = response.json()
            print(f"Success! Translated text: {result['translated_text']}")
        else:
            print(f"Failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error connecting to server: {e}")
        print("Make sure the FastAPI server is running with 'uvicorn app.main:app --reload' in the backend directory.")

if __name__ == "__main__":
    test_translation()
