import google.generativeai as genai
from dotenv import load_dotenv
import os
import mimetypes
import json
from app.utils.file_utils import extract_text_from_pdf, extract_text_from_docx

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash-lite")

def _resume_fallback(score: int = 65, improvements: list[str] | None = None):
    return {
        "ats_score": score,
        "skills": [],
        "strengths": [
            "Resume structure is clear",
            "Contains relevant work experience",
            "Skills section present",
            "Professional formatting",
        ],
        "improvements": improvements or [
            "Add more action verbs",
            "Include quantifiable metrics",
            "Optimize for ATS keywords",
            "Add certifications if available",
        ],
    }

def _resume_prompt():
    return """
You are an expert ATS System + Senior Hiring Manager with 15+ years of recruitment experience in top companies.
Evaluate the resume with the same rigor used in real interviews and automated screening systems.

Your analysis must consider:
- Keyword relevance to industry standards and target roles
- Technical and soft skills visibility
- Achievement quantification, impact, and metrics
- Resume structure, formatting, clarity, and ATS friendliness
- Employment consistency and role relevance

Return ONLY valid JSON in this exact format:
{
  "ats_score": <integer between 0 and 100>,
  "skills": ["skill1", "skill2", "skill3"],
  "strengths": ["point1", "point2", "point3", "point4"],
  "improvements": ["point1", "point2", "point3", "point4"]
}

Rules:
- Extract 10 to 15 concrete resume skills when available
- Keep strengths and improvements concise
- Do not include markdown or code fences
""".strip()

def _parse_resume_result(result_text: str):
    start_idx = result_text.find("{")
    end_idx = result_text.rfind("}") + 1
    if start_idx == -1 or end_idx <= start_idx:
        raise ValueError("No JSON object found in Gemini response")

    parsed = json.loads(result_text[start_idx:end_idx])
    skills = parsed.get("skills") if isinstance(parsed.get("skills"), list) else []
    strengths = parsed.get("strengths") if isinstance(parsed.get("strengths"), list) else []
    improvements = parsed.get("improvements") if isinstance(parsed.get("improvements"), list) else []

    try:
        ats_score = int(float(parsed.get("ats_score", 0)))
    except (TypeError, ValueError):
        ats_score = 0

    return {
        "ats_score": max(0, min(100, ats_score)),
        "skills": [str(item).strip() for item in skills if str(item).strip()],
        "strengths": [str(item).strip() for item in strengths if str(item).strip()],
        "improvements": [str(item).strip() for item in improvements if str(item).strip()],
    }

def _analyze_resume_text(content: str):
    response = model.generate_content(
        f"{_resume_prompt()}\n\nRESUME TEXT:\n{content[:12000]}"
    )
    return _parse_resume_result(response.text)

def _analyze_resume_pdf(file_content: bytes, filename: str | None = None):
    response = model.generate_content(
        [
            _resume_prompt(),
            {
                "mime_type": "application/pdf",
                "data": file_content,
            },
            f"Filename: {filename or 'resume.pdf'}",
        ]
    )
    return _parse_resume_result(response.text)

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
    mimetype = None

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

    extracted_length = len((content_to_send or "").strip())
    print(
        f"Resume analysis started: filename={filename or 'text-input'}, "
        f"mimetype={mimetype or 'text/plain'}, extracted_chars={extracted_length}"
    )

    try:
        if mimetype == "application/pdf" and extracted_length < 80:
            print("PDF text extraction is too small, using Gemini PDF fallback")
            return _analyze_resume_pdf(file_content, filename)

        if not content_to_send or len(content_to_send.strip()) == 0:
            return _resume_fallback(
                score=0,
                improvements=["Please provide a valid resume content"],
            )

        return _analyze_resume_text(content_to_send)
    except Exception as e:
        print(f"Error analyzing resume: {e}")

    # Fallback if AI fails
    return _resume_fallback()
















