from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.day_content import DayContent
from app.core.config import settings
from app.core.auth import get_current_admin
import requests
import datetime
import uuid
import hashlib
import json
import logging
from datetime import timezone, timedelta
from app.schemas.internship_schema import DayContentUpsert
from app.models.internship_evidence import InternshipContentVersion

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/admin",
    tags=["Admin Internship Content"],
    dependencies=[Depends(get_current_admin)],
)


@router.get("/day_content/modules")
def list_day_content_modules(db: Session = Depends(get_db)):
    rows = (
        db.query(
            DayContent.task_name,
            DayContent.domain,
            DayContent.type,
            func.count(DayContent.id).label("saved_days"),
            func.max(DayContent.day).label("total_days"),
        )
        .group_by(DayContent.task_name, DayContent.domain, DayContent.type)
        .order_by(DayContent.task_name.asc(), DayContent.domain.asc(), DayContent.type.asc())
        .all()
    )

    return {
        "modules": [
            {
                "task_name": row.task_name,
                "domain": row.domain,
                "type": row.type,
                "saved_days": int(row.saved_days or 0),
                "total_days": int(row.total_days or 0),
            }
            for row in rows
        ]
    }

@router.get("/day_content/all")
def get_all_day_content(domain: str, task_name: str, type: str, db: Session = Depends(get_db)):
    contents = db.query(DayContent).filter_by(
        domain=domain,
        task_name=task_name,
        type=type
    ).all()
    
    return {"data": contents}

@router.get("/day_content")
def get_day_content(domain: str, task_name: str, type: str, day: int, db: Session = Depends(get_db)):
    content = db.query(DayContent).filter_by(
        domain=domain,
        task_name=task_name,
        type=type,
        day=day
    ).first()
    
    if content:
        return content
    else:
        raise HTTPException(status_code=404, detail="Content not found")

def _snapshot_content(db: Session, content: DayContent, change_note: str | None, created_by) -> None:
    snapshot = {
        "domain": content.domain, "task_name": content.task_name, "type": content.type, "day": content.day,
        "beginner": content.beginner or [], "intermediate": content.intermediate or [],
        "advanced": content.advanced or [], "source": content.source or [],
    }
    digest = hashlib.sha256(json.dumps(snapshot, sort_keys=True, default=str).encode()).hexdigest()
    latest = db.query(func.max(InternshipContentVersion.revision)).filter_by(day_content_id=content.id).scalar() or 0
    db.add(InternshipContentVersion(day_content_id=content.id, revision=latest + 1,
                                    content_hash=digest, snapshot=snapshot,
                                    change_note=change_note, created_by=created_by))


@router.post("/day_content")
def upsert_day_content(payload: DayContentUpsert, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    values = payload.model_dump()
    domain = payload.domain
    task_name = payload.task_name
    content_type = payload.type
    day = payload.day
    
    content = db.query(DayContent).filter_by(
        domain=domain,
        task_name=task_name,
        type=content_type,
        day=day
    ).first()
    
    if content:
        _snapshot_content(db, content, payload.change_note or "Content updated", admin.id)
        content.beginner = payload.beginner
        content.intermediate = payload.intermediate
        content.advanced = payload.advanced
        content.source = payload.source
    else:
        content = DayContent(
            domain=domain,
            task_name=task_name,
            type=content_type,
            day=day,
            beginner=payload.beginner,
            intermediate=payload.intermediate,
            advanced=payload.advanced,
            source=payload.source,
        )
        db.add(content)
    now = datetime.datetime.now(timezone.utc)
    content.refresh_interval_days = payload.refresh_interval_days
    content.content_status = "published"
    content.updated_at = now
    content.next_review_at = now + timedelta(days=payload.refresh_interval_days)
    canonical = {key: values[key] for key in ("domain", "task_name", "type", "day", "beginner", "intermediate", "advanced", "source")}
    content.content_hash = hashlib.sha256(json.dumps(canonical, sort_keys=True, default=str).encode()).hexdigest()
    db.commit()
    db.refresh(content)
    return {"success": True, "data": {"id": str(content.id)}}

from typing import List, Dict, Any

@router.post("/day_content/bulk")
def bulk_upsert_day_content(payload: List[DayContentUpsert], db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    for item in payload:
        domain = item.domain
        task_name = item.task_name
        content_type = item.type
        day = item.day
        
        content = db.query(DayContent).filter_by(
            domain=domain,
            task_name=task_name,
            type=content_type,
            day=day
        ).first()
        
        if content:
            _snapshot_content(db, content, item.change_note or "Bulk content update", admin.id)
            content.beginner = item.beginner
            content.intermediate = item.intermediate
            content.advanced = item.advanced
            content.source = item.source
        else:
            content = DayContent(
                domain=domain,
                task_name=task_name,
                type=content_type,
                day=day,
                beginner=item.beginner,
                intermediate=item.intermediate,
                advanced=item.advanced,
                source=item.source,
            )
            db.add(content)
        now = datetime.datetime.now(timezone.utc)
        content.refresh_interval_days = item.refresh_interval_days
        content.content_status = "published"
        content.updated_at = now
        content.next_review_at = now + timedelta(days=item.refresh_interval_days)
        content.content_hash = hashlib.sha256(json.dumps(item.model_dump(exclude={"change_note"}), sort_keys=True, default=str).encode()).hexdigest()
            
    db.commit()
    return {"success": True}


@router.get("/day_content/refresh-due")
def refresh_due_content(db: Session = Depends(get_db)):
    now = datetime.datetime.now(timezone.utc)
    rows = db.query(DayContent).filter(DayContent.next_review_at <= now).order_by(DayContent.next_review_at).all()
    return {"data": [{"id": str(row.id), "domain": row.domain, "task_name": row.task_name,
                       "type": row.type, "day": row.day, "next_review_at": row.next_review_at}
                      for row in rows]}


@router.post("/day_content/{content_id}/mark-reviewed")
def mark_content_reviewed(content_id: uuid.UUID, db: Session = Depends(get_db)):
    content = db.query(DayContent).filter_by(id=content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    now = datetime.datetime.now(timezone.utc)
    content.updated_at = now
    content.next_review_at = now + timedelta(days=content.refresh_interval_days or 30)
    db.commit()
    return {"success": True, "next_review_at": content.next_review_at}

@router.delete("/day_content")
def delete_day_content(domain: str, task_name: str, type: str, day: int,
                       db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    content = db.query(DayContent).filter_by(
        domain=domain,
        task_name=task_name,
        type=type,
        day=day
    ).first()
    
    if content:
        _snapshot_content(db, content, "Content archived", admin.id)
        content.content_status = "archived"
        content.updated_at = datetime.datetime.now(timezone.utc)
        db.commit()
        return {"success": True, "archived": True}
    else:
        raise HTTPException(status_code=404, detail="Content not found")

@router.post("/upload_resource")
async def upload_resource(
    file: UploadFile = File(...), 
    day: int = Form(...),
    original_name: str = Form(...)
):
    try:
        file_bytes = await file.read()
        allowed_types = {
            "application/pdf", "text/plain", "text/markdown", "application/zip",
            "image/png", "image/jpeg", "image/webp", "image/gif",
        }
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=415, detail="Unsupported resource file type")
        if len(file_bytes) > 20 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Resource files must be 20 MB or smaller")
        
        # Sanitize original_name by replacing spaces and unsafe characters
        import re
        safe_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', original_name)
        file_path = f"day{day}/{int(datetime.datetime.now().timestamp())}_{safe_name}"
        
        import urllib.parse
        encoded_path = urllib.parse.quote(file_path)
        
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_KEY
        
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured in backend")
            
        from supabase import create_client, Client
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Add bucket name as a configurable setting if needed, default to careerwizard
        bucket_name = settings.SUPABASE_BUCKET_NAME
            
        try:
            res = supabase.storage.from_(bucket_name).upload(
                path=file_path,
                file=file_bytes,
                file_options={"content-type": file.content_type or "application/octet-stream"}
            )
        except Exception as exc:
            # Storage policies are infrastructure and must never be rewritten by a request.
            raise HTTPException(status_code=502, detail="Resource storage upload failed") from exc
        
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        
        return {"success": True, "url": public_url}
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected resource upload failure")
        raise HTTPException(status_code=500, detail="Resource upload failed unexpectedly") from exc
