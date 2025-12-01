import sys
import os
import json
from sqlalchemy.orm import Session
from sqlalchemy import func
import google.generativeai as genai
from app.schemas.interview_schema import InterviewCreate, InterviewAnswer
from app.services.interview_service import create_interview_question
from app.db.database import Base, engine, SessionLocal
from app.models.interview import InterviewQuestion

# ---------------------------
# 1. Configure Gemini
# ---------------------------
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# ---------------------------
# 2. Initialize DB
# ---------------------------
print("⏳ Initializing database tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created/verified successfully.")
except Exception as e:
    print(f"❌ Error creating tables: {e}")
    sys.exit(1)

# ---------------------------
# 3. Roles & Primary Skills
# ---------------------------
# ROLES = {
#     "Frontend Developer": "React",
#     "Backend Developer": "Python",
#     "Full Stack Developer": "React",
#     "AI Engineer": "Python",
#     "Machine Learning Engineer (ML)": "Python",
#     "Generative AI Engineer (GenAI)": "Python",
#     "Data Scientist": "Python",
#     "MLOps Engineer": "Python",
#     "Deep Learning Engineer": "Python",
#     "Computer Vision Engineer": "Python",
#     "DevOps Engineer": "Python",
#     "Mobile Developer": "React Native",
#     "QA Engineer": "Testing",
#     "Product Manager": "Strategy",
#     "UI/UX Designer": "Design"
# }

ROLES = {  "Generative AI Engineer (GenAI)": "Python" }


CATEGORIES = ["Fundamentals", "Async", "Coding", "System Design", "Behavioral"]
TAGS = ["JavaScript", "Python", "React", "Async", "Coding", "System Design", "API", "Fundamentals"]

# ---------------------------
# 4. RAW INPUT QUESTIONS
# ---------------------------
RAW_INPUT = """
Unique GenAI Behavioral Interview Questions (Intern/Senior)
Problem-Solving & Technical Thinking

“Can you walk me through a time when a generative model you worked on didn’t behave as expected? How did you approach fixing it?”

“Imagine you only have a small dataset, but you need to fine-tune a large language model. What would you do?”

“Tell me about a time you had to experiment with multiple architectures to get the output you wanted.”

“Have you ever faced a situation where your model’s outputs were inconsistent? How did you debug it?”

“Describe a project where you had to make trade-offs between model accuracy and computational efficiency.”

Learning & Curiosity

“Generative AI is evolving fast. How do you make sure you stay current with new models and techniques?”

“Tell me about a time you learned a new AI framework or tool on your own for a project.”

“Have you ever tried an AI model for a side project or hackathon? What was your approach?”

“Can you share an example where learning something new directly helped improve your AI work?”

“Have you ever explored research papers or preprints to implement a technique that wasn’t in tutorials?”

Collaboration & Communication

“Tell me about a time you had to explain complex AI outputs to a non-technical teammate or manager.”

“Describe a situation where you disagreed with a teammate about a model or approach. How did you resolve it?”

“Have you worked on a project where multiple people were fine-tuning the same model? How did you coordinate?”

“Can you give an example of helping a teammate understand or debug your AI workflow?”

“Have you ever worked with designers or product managers to integrate a generative model into an application?”

Ethics & Responsibility

“Generative AI can produce unsafe content. How would you handle or prevent this in your models?”

“Tell me about a time you identified bias in a dataset or model. What did you do?”

“Have you ever had to make a decision to limit a model’s capabilities for ethical reasons?”

Initiative & Innovation

“Can you describe a project where you tried a novel idea with generative AI that hadn’t been done before?”

“Tell me about a time you suggested an improvement to a workflow or model architecture, and what happened next.”
"""

# ---------------------------
# 5. Gemini Prompt
# ---------------------------
PROMPT = f"""
You are an AI assistant that generates structured interview questions with complete answers.

Input questions:
\"\"\"{RAW_INPUT}\"\"\"

Rules:
1. Only assign role from this fixed list: {list(ROLES.keys())}
2. Each role should only have ONE primary skill: {ROLES}
3. Only assign category from: {CATEGORIES}
4. Only use tags from: {TAGS}
5. Determine difficulty: easy | medium | hard
6. Generate an interview-level answer 2-3 lines suitable to impress an interviewer, including short explanation and optional code
7. Output JSON array of objects exactly like:

[
  {{
    "role": "Frontend Developer",
    "skills": "React",
    "category": "Fundamentals",
    "difficulty": "easy",
    "title": "question title",
    "tags": ["tag1", "tag2"],
    "answer": {{
      "explanation": "Provide detailed explanation suitable for interviews",
      "code": "Optional code snippet if applicable"
    }}
  }}
]

- ALWAYS return valid JSON only
- Ensure every question has a proper interview-level explanation and optional code
"""

# ---------------------------
# 6. Generate Structured Questions
# ---------------------------
print("🤖 Generating structured questions using Gemini AI...")
response = model.generate_content(PROMPT)
generated_text = response.text.strip()

# Strip backticks or markdown formatting if present
if generated_text.startswith("```json"):
    generated_text = generated_text[len("```json"):].rstrip("```").strip()
elif generated_text.startswith("```"):
    generated_text = generated_text[3:].rstrip("```").strip()

try:
    questions_json = json.loads(generated_text)
    print("✅ AI generated structured questions.")
except Exception as e:
    print(f"❌ AI output invalid JSON: {e}")
    print("AI returned:")
    print(generated_text)
    sys.exit(1)

# ---------------------------
# 7. Insert into DB (no duplicates)
# ---------------------------
def seed_database_ai():
    db: Session = SessionLocal()
    print("\n⏳ Seeding AI-generated questions...")

    try:
        count_inserted = 0
        seen_titles = set()  # Track titles in this batch to avoid duplicates

        for q in questions_json:
            # Normalize title
            title_clean = q["title"].strip().lower()

            # Skip if duplicate in same batch
            if title_clean in seen_titles:
                continue

            # Skip if duplicate in DB
            if db.query(InterviewQuestion).filter(func.lower(InterviewQuestion.title) == title_clean).first():
                continue

            # Override skill with primary skill
            primary_skill = ROLES.get(q["role"], q["skills"])
            question_in = InterviewCreate(
                role=q["role"],
                skills=primary_skill,
                category=q["category"],
                title=q["title"].strip(),
                difficulty=q["difficulty"],
                tags=q["tags"],
                answer=InterviewAnswer(
                    explanation=q["answer"]["explanation"],
                    code=q["answer"].get("code")
                )
            )

            create_interview_question(db, question_in)
            seen_titles.add(title_clean)
            count_inserted += 1

        db.commit()
        print(f"✅ Inserted {count_inserted} new questions.")
        total_count = db.query(InterviewQuestion).count()
        print(f"📊 Total questions in DB: {total_count}")

    except Exception as e:
        print(f"❌ Error during DB seeding: {e}")
        db.rollback()
    finally:
        db.close()

# ---------------------------
# 8. Run Seeder
# ---------------------------
if __name__ == "__main__":
    seed_database_ai()
    print("\n🎉 Done! Run API using: uvicorn main:app --reload")


































