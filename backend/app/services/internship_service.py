import hashlib
import json
import re
import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Any

import requests
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import SessionLocal
from app.models.certificate import Certificate
from app.models.day_content import DayContent
from app.models.enrollment import Enrollment
from app.models.internship_evidence import DailyStandup, InternshipContentVersion, SkillEvidence
from app.models.internship_plan import InternshipPlan
from app.models.internship_task import InternshipTask
from app.models.internship_track import InternshipTrack
from app.models.payment import Payment
from app.models.task_submission import TaskSubmission


PLAN_SEEDS = (
    ("course", "Course Certificate", 199, 15, 0, True, ["Learning content", "Quizzes", "Course completion credential"]),
    ("15day", "15-Day Sprint Internship", 399, 15, 5, False, ["Company-style briefs", "GitHub submissions", "Automated review", "Verified evidence"]),
    ("30day", "30-Day Sprint Internship", 599, 30, 6, False, ["Phased projects", "GitHub review workflow", "Standups", "Skill passport"]),
    ("45day", "45-Day Advanced Internship", 999, 45, 9, False, ["Advanced sprints", "Priority review", "Portfolio evidence"]),
    ("3month", "3-Month Internship", 1899, 90, 12, False, ["Long-form projects", "Mentor reviews", "Career readiness"]),
    ("6month", "6-Month Internship", 3599, 180, 15, False, ["Enterprise projects", "Mentor sessions", "Hiring preparation"]),
)

TRACK_SEEDS = (
    ("webdev", "Web Development", "React, backend APIs, databases, testing and deployment", "fa-code", "#2563eb"),
    ("ds", "Data Science", "Python, analytics, visualization and machine learning", "fa-chart-simple", "#7c3aed"),
    ("aiml", "AI / ML Engineering", "Machine learning systems, evaluation and deployment", "fa-brain", "#16a34a"),
    ("uiux", "UI / UX Design", "Research, wireframes, prototypes and product thinking", "fa-pen-ruler", "#db2777"),
    ("devops", "DevOps & Cloud", "Containers, cloud foundations and delivery pipelines", "fa-server", "#ea580c"),
    ("pm", "Product Management", "PRDs, user stories, prioritization and product metrics", "fa-clipboard-list", "#0891b2"),
)

TRACK_SKILLS = {
    "aiml": ["Python", "Machine Learning", "Data Analysis", "Git", "Documentation"],
    "ds": ["Python", "SQL", "Data Analysis", "Visualization", "Statistics"],
    "webdev": ["JavaScript", "APIs", "Git", "Testing", "Documentation"],
    "devops": ["Linux", "Docker", "CI/CD", "Cloud", "Git"],
    "uiux": ["User Research", "Prototyping", "Figma", "Communication"],
    "pm": ["Product Strategy", "PRD", "Communication", "Analytics"],
}


def _markdown_title(markdown: str, fallback: str) -> str:
    headings = re.findall(r"^#{1,2}\s+(.+)$", markdown or "", flags=re.MULTILINE)
    for heading in reversed(headings[:2]):
        cleaned = re.sub(r"\s*\[[^]]+Track]\s*", "", heading).strip(" —-")
        if cleaned and not re.match(r"^(Day|Task)\s+\d+", cleaned, flags=re.I):
            return cleaned[:200]
    return fallback


def _module_for_track(db: Session, track_key: str, duration: int | None = None, require_complete: bool = False):
    rows = (
        db.query(
            DayContent.domain,
            DayContent.task_name,
            DayContent.type,
            func.count(DayContent.id).label("days"),
            func.max(DayContent.day).label("max_day"),
        )
        .filter(DayContent.domain == track_key, DayContent.content_status == "published")
        .group_by(DayContent.domain, DayContent.task_name, DayContent.type)
        .all()
    )
    if not rows:
        return None
    eligible = [row for row in rows if duration is None or int(row.max_day or 0) >= duration]
    if require_complete and not eligible:
        return None
    candidates = eligible or rows
    return sorted(candidates, key=lambda row: (int(row.max_day or 0), int(row.days or 0)), reverse=True)[0]


def _sync_tasks(db: Session, track: InternshipTrack, duration: int) -> None:
    module = _module_for_track(db, track.track_key, duration, require_complete=True)
    if not module:
        db.query(InternshipTask).filter_by(track_id=track.id, plan_duration=duration).update(
            {InternshipTask.is_active: False}, synchronize_session=False
        )
        return
    contents = (
        db.query(DayContent)
        .filter(
            DayContent.domain == module.domain,
            DayContent.task_name == module.task_name,
            DayContent.type == module.type,
            DayContent.day <= duration,
        )
        .order_by(DayContent.day)
        .all()
    )
    for content in contents:
        payloads = (content.beginner or []) + (content.intermediate or []) + (content.advanced or [])
        markdown = next((item.get("markdown", "") for item in payloads if item.get("markdown")), "")
        task = (
            db.query(InternshipTask)
            .filter_by(track_id=track.id, plan_duration=duration, task_number=content.day)
            .first()
        )
        if task:
            continue
        db.add(InternshipTask(
            track_id=track.id,
            plan_duration=duration,
            task_number=content.day,
            phase=max(1, min(3, ((content.day - 1) * 3 // max(duration, 1)) + 1)),
            title=_markdown_title(markdown, f"Day {content.day} Sprint Work"),
            description=(markdown[:1200] if markdown else f"Complete the published Day {content.day} brief."),
            beginner_reqs=[], inter_reqs=[], advanced_reqs=[],
            tech_tags=TRACK_SKILLS.get(track.track_key, ["Professional Skills"]),
            resources=content.source or [],
            expected_output="Complete the acceptance criteria and submit evidence when requested.",
        ))


def seed_internship_catalog() -> None:
    """Seed missing catalog records only; never overwrite administrator-managed data."""
    db = SessionLocal()
    try:
        db.execute(text("SELECT pg_advisory_xact_lock(hashtext('careerwizard_internship_catalog'))"))
        for plan_key, name, price, days, tasks, course, features in PLAN_SEEDS:
            if not db.query(InternshipPlan).filter_by(plan_key=plan_key).first():
                db.add(InternshipPlan(plan_key=plan_key, name=name, price=price, duration_days=days,
                                      total_tasks=tasks, is_course_only=course, features=features))
        for track_key, name, description, icon, color in TRACK_SEEDS:
            if not db.query(InternshipTrack).filter_by(track_key=track_key).first():
                db.add(InternshipTrack(track_key=track_key, name=name, description=description,
                                       icon=icon, color_hex=color))
        db.flush()
        for track in db.query(InternshipTrack).filter_by(is_active=True).all():
            for duration in (15, 30, 45, 90, 180):
                _sync_tasks(db, track, duration)
        # Establish revision 1 for legacy content without changing its payload.
        for content in db.query(DayContent).all():
            if db.query(InternshipContentVersion).filter_by(day_content_id=content.id).first():
                continue
            snapshot = {"domain": content.domain, "task_name": content.task_name, "type": content.type,
                        "day": content.day, "beginner": content.beginner or [],
                        "intermediate": content.intermediate or [], "advanced": content.advanced or [],
                        "source": content.source or []}
            digest = hashlib.sha256(json.dumps(snapshot, sort_keys=True, default=str).encode()).hexdigest()
            content.content_hash = content.content_hash or digest
            db.add(InternshipContentVersion(day_content_id=content.id, revision=1, content_hash=digest,
                                            snapshot=snapshot, change_note="Initial preserved revision"))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def content_availability(db: Session, track_key: str, duration: int) -> dict[str, Any]:
    module = _module_for_track(db, track_key, duration)
    available_days = int(module.max_day or 0) if module else 0
    return {
        "available": bool(module and available_days >= duration),
        "available_days": available_days,
        "required_days": duration,
        "module_name": module.task_name if module else None,
    }


def get_active_enrollment(db: Session, student_id) -> Enrollment | None:
    return (
        db.query(Enrollment)
        .filter(Enrollment.student_id == student_id, Enrollment.status.in_(["active", "completed"]))
        .order_by(Enrollment.created_at.desc())
        .first()
    )


def get_enrollment_content(db: Session, enrollment: Enrollment) -> list[dict[str, Any]]:
    track = db.query(InternshipTrack).filter_by(id=enrollment.track_id).first()
    if not track:
        return []
    module = _module_for_track(db, track.track_key, enrollment.total_days)
    if not module:
        return []
    rows = (
        db.query(DayContent)
        .filter_by(domain=module.domain, task_name=module.task_name, type=module.type)
        .filter(DayContent.day <= enrollment.total_days, DayContent.content_status == "published")
        .order_by(DayContent.day)
        .all()
    )
    submissions = {
        sub.day_number: sub
        for sub in db.query(TaskSubmission)
        .filter_by(enrollment_id=enrollment.id)
        .order_by(TaskSubmission.submission_attempt.asc())
        .all()
    }
    tasks = {
        task.task_number: task
        for task in db.query(InternshipTask).filter_by(track_id=track.id, plan_duration=enrollment.total_days).all()
    }
    level_key = enrollment.difficulty_level
    result = []
    for row in rows:
        level_payload = getattr(row, level_key, None) or []
        item = level_payload[0] if level_payload else {}
        markdown = item.get("markdown", "")
        item_type = item.get("type", "learn")
        submission = submissions.get(row.day)
        task = tasks.get(row.day)
        if submission:
            status = "done" if submission.passed else submission.status
        elif row.day == enrollment.current_day:
            status = "active"
        elif row.day < enrollment.current_day:
            status = "available"
        else:
            status = "locked"
        result.append({
            "day": row.day,
            "title": _markdown_title(markdown, task.title if task else f"Day {row.day}"),
            "content_type": item_type,
            "enabled": item.get("enabled", True),
            "markdown": markdown,
            "resources": row.source or [],
            "phase": task.phase if task else max(1, min(3, ((row.day - 1) * 3 // enrollment.total_days) + 1)),
            "tags": task.tech_tags if task else TRACK_SKILLS.get(track.track_key, []),
            "status": status,
            "submission": serialize_submission(submission) if submission else None,
            "next_review_at": row.next_review_at.isoformat() if row.next_review_at else None,
        })
    return result


def serialize_submission(submission: TaskSubmission) -> dict[str, Any]:
    return {
        "id": str(submission.id),
        "day_number": submission.day_number,
        "github_url": submission.github_url,
        "attempt": submission.submission_attempt,
        "status": submission.status,
        "evaluation_status": submission.evaluation_status,
        "total_score": submission.total_score,
        "passed": submission.passed,
        "feedback": submission.ai_feedback,
        "improvements": submission.improvements or [],
        "highlight": submission.highlight,
        "reviewer_metadata": submission.reviewer_metadata or {},
        "submitted_at": submission.submitted_at.isoformat() if submission.submitted_at else None,
        "reviewed_at": submission.reviewed_at.isoformat() if submission.reviewed_at else None,
    }


def _github_repo_snapshot(github_url: str) -> dict[str, Any]:
    owner, repo = [part for part in re.sub(r"\.git$", "", github_url).split("github.com/", 1)[1].split("/") if part][:2]
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "CareerWizard-Reviewer/1.0"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    base = f"https://api.github.com/repos/{owner}/{repo}"
    repo_response = requests.get(base, headers=headers, timeout=10)
    if repo_response.status_code == 404:
        raise ValueError("GitHub repository was not found or is not public")
    repo_response.raise_for_status()
    repo_data = repo_response.json()
    contents_response = requests.get(f"{base}/git/trees/{repo_data['default_branch']}?recursive=1", headers=headers, timeout=10)
    contents_response.raise_for_status()
    paths = [node.get("path", "") for node in contents_response.json().get("tree", []) if node.get("type") == "blob"]
    commits_response = requests.get(f"{base}/commits?per_page=10", headers=headers, timeout=10)
    commits = commits_response.json() if commits_response.ok else []
    return {"repo": repo_data, "paths": paths, "commit_count_sample": len(commits)}


def automated_repository_review(github_url: str) -> dict[str, Any]:
    snapshot = _github_repo_snapshot(github_url)
    repo, paths = snapshot["repo"], snapshot["paths"]
    lower_paths = [path.lower() for path in paths]
    has_readme = any(path.startswith("readme") for path in lower_paths)
    has_tests = any("test" in path.split("/")[-1] or "/tests/" in f"/{path}/" for path in lower_paths)
    has_source = any(path.endswith((".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".ipynb")) for path in lower_paths)
    has_config = any(path.endswith(("requirements.txt", "package.json", "pyproject.toml", "dockerfile")) for path in lower_paths)
    secret_files = [path for path in lower_paths if path.endswith(".env") or "credentials" in path or "secret" in path]
    correctness = min(25, (15 if has_source else 0) + (10 if has_tests else 0))
    approach = min(25, 8 + min(snapshot["commit_count_sample"], 10) + (7 if has_config else 0))
    quality = min(25, (12 if has_source else 0) + (8 if has_tests else 0) + (5 if not secret_files else 0))
    documentation = min(25, (18 if has_readme else 0) + (7 if repo.get("description") else 0))
    improvements = []
    if not has_tests: improvements.append("Add automated tests covering the acceptance criteria.")
    if not has_readme: improvements.append("Add a README with setup, architecture, decisions and results.")
    if not has_config: improvements.append("Commit reproducible dependency and runtime configuration.")
    if secret_files: improvements.append("Remove committed secret/credential files and rotate exposed credentials.")
    total = correctness + approach + quality + documentation
    return {
        "correctness": correctness, "approach": approach, "quality": quality,
        "documentation": documentation, "total": total, "passed": total >= 60 and not secret_files,
        "feedback": "Repository structure, documentation, tests and commit evidence were inspected. A project-specific viva is still required for final skill verification.",
        "improvements": improvements,
        "highlight": "Good reproducibility and repository hygiene." if has_readme and has_config else None,
        "metadata": {"provider": "github_repository_review_v1", "files_reviewed": len(paths),
                     "recent_commits_reviewed": snapshot["commit_count_sample"], "potential_secret_files": secret_files},
    }


def apply_review(db: Session, submission: TaskSubmission, review: dict[str, Any], method: str) -> None:
    submission.ai_score_correctness = review["correctness"]
    submission.ai_score_approach = review["approach"]
    submission.ai_score_quality = review["quality"]
    submission.ai_score_docs = review["documentation"]
    submission.total_score = review.get("total", sum(review[key] for key in ("correctness", "approach", "quality", "documentation")))
    submission.passed = bool(review.get("passed", submission.total_score >= 60))
    submission.status = "approved" if submission.passed else "changes_requested"
    submission.evaluation_status = "completed"
    submission.ai_feedback = review["feedback"]
    submission.improvements = review.get("improvements", [])
    submission.highlight = review.get("highlight")
    submission.reviewer_metadata = {**review.get("metadata", {}), "verification_method": method}
    submission.reviewed_at = datetime.now(timezone.utc)
    enrollment = db.query(Enrollment).filter_by(id=submission.enrollment_id).first()
    task = db.query(InternshipTask).filter_by(id=submission.task_id).first()
    if submission.passed and enrollment and task:
        for skill in task.tech_tags or []:
            evidence = db.query(SkillEvidence).filter_by(submission_id=submission.id, skill_name=skill).first()
            if not evidence:
                db.add(SkillEvidence(student_id=submission.student_id, enrollment_id=enrollment.id,
                                     submission_id=submission.id, skill_name=skill,
                                     proficiency_score=submission.total_score, evidence_url=submission.github_url,
                                     verified=method == "human_review", verification_method=method,
                                     metadata_json={"viva_required": method != "human_review"}))
        enrollment.current_day = min(enrollment.total_days, max(enrollment.current_day, submission.day_number + 1))
        enrollment.current_phase = max(1, min(3, ((enrollment.current_day - 1) * 3 // max(enrollment.total_days, 1)) + 1))
    scores = [value for (value,) in db.query(TaskSubmission.total_score).filter_by(enrollment_id=enrollment.id).filter(TaskSubmission.total_score.isnot(None)).all()]
    if scores:
        enrollment.avg_score = Decimal(sum(scores) / len(scores))
    db.flush()
    content = get_enrollment_content(db, enrollment)
    submission_days = [item for item in content if item["content_type"] in {"task", "group"} and item["enabled"]]
    if submission_days and all(item.get("submission") and item["submission"].get("passed") for item in submission_days):
        enrollment.status = "completed"
        enrollment.completed_at = datetime.now(timezone.utc)
        if not db.query(Certificate).filter_by(enrollment_id=enrollment.id).first():
            plan = db.query(InternshipPlan).filter_by(id=enrollment.plan_id).first()
            track = db.query(InternshipTrack).filter_by(id=enrollment.track_id).first()
            verified_count = db.query(func.count(SkillEvidence.id)).filter_by(enrollment_id=enrollment.id, verified=True).scalar() or 0
            db.add(Certificate(enrollment_id=enrollment.id, student_id=enrollment.student_id,
                               certificate_uid=f"CW-{datetime.now(timezone.utc):%Y%m}-{uuid.uuid4().hex[:10].upper()}",
                               type="proof_of_work", track_name=track.name if track else "Internship",
                               plan_name=plan.name if plan else "Sprint Internship",
                               final_score=round(float(enrollment.avg_score or 0)), is_verified=verified_count > 0))


def calculate_readiness(db: Session, student_id) -> dict[str, Any]:
    evidences = db.query(SkillEvidence).filter_by(student_id=student_id).all()
    grouped: dict[str, list[SkillEvidence]] = {}
    for evidence in evidences:
        grouped.setdefault(evidence.skill_name, []).append(evidence)
    skills = []
    for name, items in grouped.items():
        latest = max(items, key=lambda item: item.demonstrated_at)
        scores = [float(item.proficiency_score) for item in items]
        skills.append({"skill": name, "proficiency": round(sum(scores) / len(scores), 1),
                       "evidence_count": len(items), "verified": any(item.verified for item in items),
                       "latest_evidence_at": latest.demonstrated_at.isoformat()})
    technical = round(sum(item["proficiency"] for item in skills) / len(skills), 1) if skills else 0
    standups = db.query(DailyStandup).filter_by(student_id=student_id).all()
    communication = round(sum(float(s.communication_score or 0) for s in standups) / len(standups), 1) if standups else 0
    readiness = round(technical * 0.8 + communication * 0.2, 1) if skills else 0
    return {"career_readiness_score": readiness, "technical_score": technical,
            "communication_score": communication, "verified_skills": sum(1 for item in skills if item["verified"]),
            "skills": sorted(skills, key=lambda item: item["proficiency"], reverse=True),
            "explanation": "Readiness combines demonstrated project skills (80%) and standup communication (20%). Automated evidence remains provisional until human or viva verification."}


def score_standup(yesterday: str, today_text: str, blockers: str | None) -> int:
    content = f"{yesterday} {today_text} {blockers or ''}".strip()
    score = 45
    score += 15 if len(yesterday.split()) >= 5 else 0
    score += 20 if len(today_text.split()) >= 5 else 0
    score += 10 if blockers is not None else 0
    score += 10 if len(content) >= 100 else 0
    return min(score, 100)
