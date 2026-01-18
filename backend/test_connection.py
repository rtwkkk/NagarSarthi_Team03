import requests
import sys

def test_connection(url):
    print(f"Testing {url}...")
    try:
        response = requests.get(url, timeout=5)
        print(f"Success! Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("Error: Connection Refused (Server not found)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test both variants
    test_connection("http://127.0.0.1:8000/")
    test_connection("http://localhost:8000/")
