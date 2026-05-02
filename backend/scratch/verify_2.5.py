import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash-lite")

try:
    response = model.generate_content("Hello, say 'Model is working' if you can read this.")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
