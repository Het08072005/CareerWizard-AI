# import google.generativeai as genai
# from app.core.config import settings

# genai.configure(api_key=settings.GEMINI_API_KEY)

# def get_job_recommendations(skill: str):
#     model = genai.GenerativeModel("gemini-2.5-flash")

#     prompt = f"Suggest 5 job roles for someone skilled in {skill}. Output only list."

#     result = model.generate_content(prompt)
#     return result.text.split("\n")

import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def get_job_recommendations(skill: str):
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"Suggest 5 job roles for someone skilled in {skill}. Output only list."
    result = model.generate_content(prompt)
    
    # Clean split
    return [line.strip() for line in result.text.split("\n") if line.strip()]
