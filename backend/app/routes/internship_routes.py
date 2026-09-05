import hashlib
import uuid
from datetime import date, datetime, timedelta, timezone

import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin, get_current_user
from app.core.config import settings
from app.db.database import get_db
from app.models.certificate import Certificate
from app.models.enrollment import Enrollment
from app.models.internship_evidence import DailyStandup, SkillEvidence
from app.models.internship_plan import InternshipPlan
from app.models.internship_task import InternshipTask
from app.models.internship_track import InternshipTrack
from app.models.payment import Payment
from app.models.task_submission import TaskSubmission
from app.schemas.internship_schema import AdminReviewCreate, DifficultyUpdate, EnrollmentCreate, StandupCreate, SubmissionCreate
from app.services.internship_service import (
    apply_review,
    automated_repository_review,
    calculate_readiness,
    content_availability,
    get_active_enrollment,
    get_enrollment_content,
    score_standup,
    serialize_submission,
)


router = APIRouter(prefix="/internships", tags=["Internships"])


def _catalog(db: Session):
    plans = db.query(InternshipPlan).filter_by(is_active=True).order_by(InternshipPlan.duration_days).all()
    tracks = db.query(InternshipTrack).filter_by(is_active=True).order_by(InternshipTrack.name).all()
    availability = {}
    for track in tracks:
        for plan in plans:
            state = content_availability(db, track.track_key, plan.duration_days)
            if plan.is_course_only:
                state = {**state, "available": False, "message": "Course-only content is not published for this track"}
            availability[f"{track.id}:{plan.id}"] = state
    return {
        "plans": [
            {"id": str(plan.id), "key": plan.plan_key, "name": plan.name, "price": plan.price,
             "duration_days": plan.duration_days, "total_tasks": plan.total_tasks,
             "is_course_only": plan.is_course_only, "features": plan.features or []}
            for plan in plans
        ],
        "tracks": [
            {"id": str(track.id), "key": track.track_key, "name": track.name,
             "description": track.description, "icon": track.icon, "color_hex": track.color_hex}
            for track in tracks
        ],
        "levels": [
            {"key": "beginner", "name": "Beginner", "description": "Guided requirements and foundational scope."},
            {"key": "intermediate", "name": "Intermediate", "description": "Production-oriented implementation and trade-offs."},
            {"key": "advanced", "name": "Advanced", "description": "Architecture, tests, performance and deployment depth."},
        ],
        "availability": availability,
        "enrollment_mode": settings.INTERNSHIP_ENROLLMENT_MODE,
    }


def _enrollment_summary(db: Session, enrollment: Enrollment):
    plan = db.query(InternshipPlan).filter_by(id=enrollment.plan_id).first()
    track = db.query(InternshipTrack).filter_by(id=enrollment.track_id).first()
    content = get_enrollment_content(db, enrollment)
    completed = sum(1 for item in content if item.get("submission") and item["submission"].get("passed"))
    task_days = sum(1 for item in content if item["content_type"] in {"task", "group"})
    return {
        "id": str(enrollment.id), "status": enrollment.status,
        "plan": {"id": str(plan.id), "name": plan.name, "key": plan.plan_key} if plan else None,
        "track": {"id": str(track.id), "name": track.name, "key": track.track_key} if track else None,
        "difficulty_level": enrollment.difficulty_level, "current_day": enrollment.current_day,
        "current_phase": enrollment.current_phase, "total_days": enrollment.total_days,
        "avg_score": float(enrollment.avg_score or 0), "streak_days": enrollment.streak_days,
        "started_at": enrollment.started_at.isoformat(), "deadline_at": enrollment.deadline_at.isoformat(),
        "completed_tasks": completed, "total_submission_days": task_days,
        "progress_percent": round(min(100, (enrollment.current_day - 1) / max(enrollment.total_days, 1) * 100), 1),
    }


@router.get("/catalog")
def catalog(db: Session = Depends(get_db)):
    return _catalog(db)


@router.get("/me")
def my_internship(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = get_active_enrollment(db, current_user.id)
    return {"enrollment": _enrollment_summary(db, enrollment) if enrollment else None, "catalog": _catalog(db)}


@router.post("/enrollments", status_code=status.HTTP_201_CREATED)
def create_enrollment(payload: EnrollmentCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    existing = get_active_enrollment(db, current_user.id)
    if existing and existing.status == "active":
        raise HTTPException(status_code=409, detail="An active internship already exists")
    plan = db.query(InternshipPlan).filter_by(id=payload.plan_id, is_active=True).first()
    track = db.query(InternshipTrack).filter_by(id=payload.track_id, is_active=True).first()
    if not plan or not track:
        raise HTTPException(status_code=404, detail="Selected plan or track is unavailable")
    if plan.is_course_only:
        raise HTTPException(status_code=409, detail="Course-only enrollment content is not published yet")
    availability = content_availability(db, track.track_key, plan.duration_days)
    if not availability["available"]:
        raise HTTPException(status_code=409, detail={"message": "This track/plan content is not fully published yet", **availability})

    payment = None
    if payload.payment_id:
        payment = db.query(Payment).filter_by(id=payload.payment_id, student_id=current_user.id, plan_id=plan.id).first()
        if not payment or payment.status not in {"paid", "authorized", "waived"}:
            raise HTTPException(status_code=402, detail="A verified payment is required")
        if db.query(Enrollment).filter_by(payment_id=payment.id).first():
            raise HTTPException(status_code=409, detail="Payment has already been used")
    elif settings.INTERNSHIP_ENROLLMENT_MODE == "beta":
        payment = Payment(student_id=current_user.id, plan_id=plan.id,
                          razorpay_order_id=f"beta-{uuid.uuid4().hex}", amount=0,
                          status="waived", payment_method="beta_access",
                          notes=f"Beta access; catalog price was INR {plan.price}", paid_at=datetime.now(timezone.utc))
        db.add(payment)
        db.flush()
    else:
        raise HTTPException(status_code=402, detail="Complete checkout before enrollment")

    now = datetime.now(timezone.utc)
    enrollment = Enrollment(student_id=current_user.id, plan_id=plan.id, track_id=track.id,
                            difficulty_level=payload.difficulty_level, payment_id=payment.id,
                            total_days=plan.duration_days, deadline_at=now + timedelta(days=plan.duration_days),
                            started_at=now)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return {"enrollment": _enrollment_summary(db, enrollment)}


@router.patch("/enrollments/{enrollment_id}/difficulty")
def update_difficulty(enrollment_id: uuid.UUID, payload: DifficultyUpdate,
                      current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(Enrollment).filter_by(id=enrollment_id, student_id=current_user.id, status="active").first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Active enrollment not found")
    enrollment.difficulty_level = payload.difficulty_level
    db.commit()
    return {"enrollment": _enrollment_summary(db, enrollment)}


@router.get("/dashboard")
def dashboard(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = get_active_enrollment(db, current_user.id)
    if not enrollment:
        return {"enrollment": None, "readiness": calculate_readiness(db, current_user.id), "tasks": [], "catalog": _catalog(db)}
    tasks = get_enrollment_content(db, enrollment)
    recent_submissions = (
        db.query(TaskSubmission).filter_by(enrollment_id=enrollment.id)
        .order_by(TaskSubmission.submitted_at.desc()).limit(5).all()
    )
    today_task = next((item for item in tasks if item["day"] == enrollment.current_day), None)
    standup = db.query(DailyStandup).filter_by(enrollment_id=enrollment.id, standup_date=date.today()).first()
    return {
        "enrollment": _enrollment_summary(db, enrollment), "readiness": calculate_readiness(db, current_user.id),
        "today": today_task, "tasks": tasks,
        "recent_submissions": [serialize_submission(item) for item in recent_submissions],
        "today_standup": {"yesterday": standup.yesterday, "today": standup.today,
                          "blockers": standup.blockers, "communication_score": float(standup.communication_score or 0)} if standup else None,
        "catalog": _catalog(db),
    }


@router.get("/tasks")
def tasks(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = get_active_enrollment(db, current_user.id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="No active internship enrollment")
    return {"enrollment": _enrollment_summary(db, enrollment), "tasks": get_enrollment_content(db, enrollment)}


@router.post("/submissions", status_code=status.HTTP_201_CREATED)
def submit_task(payload: SubmissionCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = get_active_enrollment(db, current_user.id)
    if not enrollment or enrollment.status != "active":
        raise HTTPException(status_code=404, detail="No active internship enrollment")
    content = next((item for item in get_enrollment_content(db, enrollment) if item["day"] == payload.day_number), None)
    if not content or content["content_type"] not in {"task", "group"}:
        raise HTTPException(status_code=400, detail="This day does not accept a project submission")
    if content["status"] == "locked":
        raise HTTPException(status_code=409, detail="Complete the current sprint day first")
    task = db.query(InternshipTask).filter_by(track_id=enrollment.track_id,
                                              plan_duration=enrollment.total_days,
                                              task_number=payload.day_number).first()
    if not task:
        raise HTTPException(status_code=409, detail="Published task metadata is not synchronized")
    attempts = db.query(func.count(TaskSubmission.id)).filter_by(enrollment_id=enrollment.id, task_id=task.id).scalar() or 0
    if attempts >= 3:
        raise HTTPException(status_code=409, detail="Maximum submission attempts reached; request mentor review")
    github_url = str(payload.github_url).rstrip("/")
    submission = TaskSubmission(enrollment_id=enrollment.id, student_id=current_user.id, task_id=task.id,
                                day_number=payload.day_number, github_url=github_url,
                                difficulty_chosen=enrollment.difficulty_level, submission_attempt=attempts + 1,
                                status="review", evaluation_status="running",
                                code_hash=hashlib.sha256(github_url.encode()).hexdigest())
    db.add(submission)
    db.commit()
    db.refresh(submission)
    try:
        review = automated_repository_review(github_url)
        apply_review(db, submission, review, "automated_repository_review")
        db.commit()
    except (requests.RequestException, ValueError, KeyError) as exc:
        submission.evaluation_status = "failed"
        submission.evaluation_error = str(exc)[:1000]
        submission.status = "review"
        db.commit()
        raise HTTPException(status_code=422, detail=f"Submission saved, but repository review could not complete: {exc}") from exc
    return {"submission": serialize_submission(submission)}


@router.post("/standups")
def upsert_standup(payload: StandupCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = get_active_enrollment(db, current_user.id)
    if not enrollment or enrollment.status != "active":
        raise HTTPException(status_code=404, detail="No active internship enrollment")
    if payload.standup_date > date.today():
        raise HTTPException(status_code=400, detail="Standup date cannot be in the future")
    standup = db.query(DailyStandup).filter_by(enrollment_id=enrollment.id, standup_date=payload.standup_date).first()
    if not standup:
        standup = DailyStandup(enrollment_id=enrollment.id, student_id=current_user.id, standup_date=payload.standup_date,
                               yesterday=payload.yesterday, today=payload.today, blockers=payload.blockers)
        db.add(standup)
    else:
        standup.yesterday, standup.today, standup.blockers = payload.yesterday, payload.today, payload.blockers
    standup.communication_score = score_standup(payload.yesterday, payload.today, payload.blockers)
    db.commit()
    return {"standup": {"date": standup.standup_date.isoformat(), "communication_score": float(standup.communication_score)}}


@router.get("/portfolio")
def portfolio(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = get_active_enrollment(db, current_user.id)
    submissions = db.query(TaskSubmission).filter_by(student_id=current_user.id, passed=True).order_by(TaskSubmission.reviewed_at.desc()).all()
    tasks_by_id = {task.id: task for task in db.query(InternshipTask).filter(InternshipTask.id.in_([s.task_id for s in submissions])).all()} if submissions else {}
    projects = []
    for submission in submissions:
        task = tasks_by_id.get(submission.task_id)
        projects.append({"id": str(submission.id), "title": task.title if task else f"Day {submission.day_number} Project",
                         "problem": task.description if task else "Published internship brief",
                         "github_url": submission.github_url, "score": submission.total_score,
                         "skills": task.tech_tags if task else [], "feedback": submission.ai_feedback,
                         "verified": bool(db.query(SkillEvidence).filter_by(submission_id=submission.id, verified=True).first()),
                         "completed_at": submission.reviewed_at.isoformat() if submission.reviewed_at else None})
    return {"enrollment": _enrollment_summary(db, enrollment) if enrollment else None,
            "projects": projects, "readiness": calculate_readiness(db, current_user.id)}


@router.get("/certificates")
def certificates(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Certificate).filter_by(student_id=current_user.id, revoked=False).order_by(Certificate.issued_at.desc()).all()
    return {"certificates": [{"id": str(row.id), "uid": row.certificate_uid, "type": row.type,
                               "track_name": row.track_name, "plan_name": row.plan_name, "score": row.final_score,
                               "verified": row.is_verified, "pdf_url": row.pdf_url,
                               "issued_at": row.issued_at.isoformat()} for row in rows]}


@router.post("/submissions/{submission_id}/review")
def review_submission(submission_id: uuid.UUID, payload: AdminReviewCreate,
                      _admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    submission = db.query(TaskSubmission).filter_by(id=submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    review = {"correctness": payload.correctness, "approach": payload.approach,
              "quality": payload.quality, "documentation": payload.documentation,
              "total": payload.correctness + payload.approach + payload.quality + payload.documentation,
              "feedback": payload.feedback, "improvements": payload.improvements,
              "highlight": payload.highlight, "metadata": {"reviewed_by": str(_admin.id)}}
    apply_review(db, submission, review, "human_review")
    db.commit()
    return {"submission": serialize_submission(submission)}
