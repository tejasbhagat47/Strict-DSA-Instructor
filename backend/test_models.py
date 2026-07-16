import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("--- CHECKING AVAILABLE MODELS ---")
try:
    for model in client.models.list():
        print(f"Model ID: {model.name} | Supported: {model.supported_actions}")
except Exception as e:
    print(f"Error listing models: {e}")