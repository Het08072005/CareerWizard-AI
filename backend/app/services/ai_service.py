import google.generativeai as genai
from dotenv import load_dotenv
import os
import mimetypes
import json
from app.utils.file_utils import extract_text_from_pdf, extract_text_from_docx

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

async def improve_text(text: str, category: str):
    """
    Enhance user text concisely (3-4 lines), strictly one polished result.
    category: "bio", "experience", "skills"
    """
    if category == "bio":
        prompt = f"""
Rewrite this professional bio in 3-4 lines, returning only a single polished text.
Instructions:
- Keep it concise, professional, and confident
- Focus strictly on user's input (no extra info)
- ATS-friendly
- Do NOT give multiple options, no quotes, no commentary

User Input:
{text}
"""
    elif category == "experience":
        prompt = f"""
Rewrite this experience description in 3-4 lines, returning only a single polished text.
Instructions:
- Use action-oriented statements
- Include only what is mentioned in input
- Keep it concise, clear, professional
- No multiple options, no quotes, no commentary

User Input:
{text}
"""
    elif category == "skills":
        prompt = f"""
Format the technical skills in 3-4 lines, returning only a single polished text.
Instructions:
- Group skills logically (Languages, Frameworks, Tools, Cloud, DB)
- Include only what the user provided
- Keep it concise, professional
- No multiple options, no quotes, no commentary

User Input:
{text}
"""
    else:
        raise ValueError("Invalid category. Must be 'bio', 'experience', or 'skills'.")

    result = model.generate_content(prompt)
    # Take first 4 non-empty lines as final text
    lines = [line.strip() for line in result.text.splitlines() if line.strip()]
    return " ".join(lines[:4])  # single direct text





async def analyze_resume_with_ai(file_content: bytes = None, filename: str = None, text: str = None):
    content_to_send = text

    if file_content:
        if filename:
            mimetype, _ = mimetypes.guess_type(filename)
            if mimetype == "application/pdf":
                content_to_send = extract_text_from_pdf(file_content)
            elif mimetype in [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ]:
                content_to_send = extract_text_from_docx(file_content)
            else:
                content_to_send = file_content.decode('utf-8', errors='ignore')
        else:
            content_to_send = file_content.decode('utf-8', errors='ignore')

    if not content_to_send or len(content_to_send.strip()) == 0:
        return {
            "ats_score": 0,
            "strengths": [],
            "improvements": ["Please provide a valid resume content"]
        }


    prompt = f"""
You are an expert ATS System + Senior Hiring Manager with 15+ years of recruitment experience in top companies.
Evaluate the resume with the same rigor used in real interviews and automated screening systems.

Your analysis must consider:
- Keyword relevance to industry standards and target roles
- Technical and soft skills visibility
- Achievement quantification, impact, and metrics
- Resume structure, formatting, clarity, and ATS friendliness
- Employment consistency and role relevance
- Missing competencies or skills that weaken the candidate’s profile
- Modern hiring expectations for competitive applicants
- Suggestions for projects, certifications, or experiences to strengthen the profile

Return the evaluation ONLY in the following JSON format:
{{
    "ats_score": "<number>",
    "strengths": ["point1", "point2", "point3", "point4"],
    "improvements": [
        "point1 - clearly mention what to fix, what skills to add, what projects or experiences to include",
        "point2 - clearly mention what to fix, what skills to add, what projects or experiences to include",
        "point3 - clearly mention what to fix, what skills to add, what projects or experiences to include",
        "point4 - clearly mention what to fix, what skills to add, what projects or experiences to include"
    ]
}}

Rules:
- Each strength must be ONE line only.
- Each improvement must be ONE line only and actionable.
- Improvements must clearly mention:
    1. What to fix or improve
    2. Missing skills or competencies relevant to the target role
    3. Projects, certifications, or experiences to add that align with the candidate’s skills
- Do not add any explanation outside the JSON.

Now analyze the resume below:

RESUME:
{content_to_send[:2000]}
"""


    try:
        response = model.generate_content(prompt)
        result_text = response.text

        start_idx = result_text.find('{')
        end_idx = result_text.rfind('}') + 1
        if start_idx != -1 and end_idx > start_idx:
            json_str = result_text[start_idx:end_idx]
            result = json.loads(json_str)
            return result
    except Exception as e:
        print(f"Error analyzing resume: {e}")

    # Fallback if AI fails
    return {
        "ats_score": 65,
        "strengths": [
            "Resume structure is clear",
            "Contains relevant work experience",
            "Skills section present",
            "Professional formatting"
        ],
        "improvements": [
            "Add more action verbs",
            "Include quantifiable metrics",
            "Optimize for ATS keywords",
            "Add certifications if available"
        ]
    }
















