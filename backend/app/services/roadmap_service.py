import json
from dotenv import load_dotenv
from app.schemas.roadmap_schema import Month, Week, RoadmapResponse
from app.services.ai_gateway import get_ai_gateway
import logging

load_dotenv()

MODEL_NAME = "models/gemini-2.5-flash"
logger = logging.getLogger(__name__)



# Fallback Roadmap (if AI fails)

def _get_fallback_roadmap(domain: str, months: int) -> RoadmapResponse:
    """Return a simple default roadmap if AI fails."""
    default_months = []
    for i in range(1, months + 1):
        default_months.append(
            Month(
                month=f"Month {i}",
                goal="Learn essential skills",
                isComplete=(i == 1),
                weeks=[
                    Week(
                        title="Weeks 1-2",
                        topics=["Topic A", "Topic B"],
                        miniProject=["Mini Project 1", "Mini Project 2"],
                        resources=["YouTube: FreeCodeCamp", "Tool: Official Docs"]
                    ),
                    Week(
                        title="Weeks 3-4",
                        topics=["Topic C", "Topic D"],
                        miniProject=["Mini Project 3"],
                        resources=["YouTube: Traversy Media", "Tool: GitHub Resources"]
                    )
                ],
                skillsToMaster=["Skill 1", "Skill 2"]
            )
        )
    return RoadmapResponse(domain=domain, months=default_months)



# Main Roadmap Generator

async def generate_roadmap_ai(domain: str, months: int) -> RoadmapResponse:
    """
    Generate a professional AI-based roadmap using Gemini API.
    Uses advanced prompt with projects, topics, YouTube channels, and tools.
    """
    prompt = f"""
You are an AI that MUST output STRICT VALID JSON ONLY. 
Never include explanations, notes, or markdown.

TASK:
Generate a deeply detailed, industry-level  {months}-month roadmap month wise easy to hard for the domain "{domain}".
This roadmap should reflect real skills, tools, workflows, and learning paths used by top engineers.

GENERAL RULES:
- Output ONLY JSON.
- Generate EXACTLY {months} months.
- Month 1 → "isComplete": true
- All other months → "isComplete": false
- All content MUST be realistic, advanced, and domain-relevant.
- NO generic content.

JSON FORMAT (STRICT):
{{
  "months": [
    {{
      "month": "Month X: Title",
      "goal": "Main measurable objective",
      "isComplete": true/false,
      "weeks": [
        {{
          "title": "Weeks 1-2",
          "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
          "miniProject": [
            "Project idea 1",
            "Project idea 2",
            "Project idea 3",
            "Project idea 4"
          ],
          "resources": [
            "YouTube: TechWorld with Nana",
            "YouTube: Fireship",
            "YouTube: FreeCodeCamp",
            "Course: Coursera – Specialization relevant to {domain}",
            "Tool: Official documentation"
          ]
        }},
        {{
          "title": "Weeks 3-4",
          "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
          "miniProject": [
            "Project idea 1",
            "Project idea 2",
            "Project idea 3",
            "Project idea 4"
          ],
          "resources": [
            "YouTube: Hitesh Choudhary",
            "YouTube: NetNinja",
            "YouTube: Traversy Media",
            "Website: Awesome-{domain} GitHub List",
            "Tool: Official documentation"
          ]
        }}
      ],
      "skillsToMaster": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
    }}
  ]
}}

CONTENT GENERATION RULES:
- Topics: 5–8 deep, domain-specific topics per week.
- Mini-projects: 3–4 realistic, advanced project ideas.
- Resources: 2–3 YouTube channels + 1–2 courses + official docs/tools.
- Skills to Master: minimum 4 real-world skills per month.
"""

    try:
        result_json = get_ai_gateway().generate_text(prompt, model=MODEL_NAME, json_mode=True)

        # Extract JSON portion
        start = result_json.find("{")
        end = result_json.rfind("}") + 1
        json_str = result_json[start:end]

        data = json.loads(json_str)

        # Parse months into Pydantic models
        months_list = []
        for m in data["months"]:
            weeks_list = [
                Week(
                    title=w["title"],
                    topics=w["topics"],
                    miniProject=w["miniProject"],
                    resources=w["resources"]
                ) for w in m["weeks"]
            ]
            months_list.append(
                Month(
                    month=m["month"],
                    goal=m["goal"],
                    isComplete=m["isComplete"],
                    weeks=weeks_list,
                    skillsToMaster=m["skillsToMaster"]
                )
            )

        return RoadmapResponse(domain=domain, months=months_list)

    except Exception as exc:
        logger.warning("AI roadmap generation failed: %s", exc.__class__.__name__)
        return _get_fallback_roadmap(domain, months)
