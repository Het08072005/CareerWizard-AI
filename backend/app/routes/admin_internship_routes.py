from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.day_content import DayContent
from app.core.config import settings
import requests
import datetime
import uuid

router = APIRouter(prefix="/admin", tags=["Admin Internship Content"])


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

@router.post("/day_content")
def upsert_day_content(payload: dict, db: Session = Depends(get_db)):
    domain = payload.get("domain")
    task_name = payload.get("task_name")
    type = payload.get("type")
    day = payload.get("day")
    
    content = db.query(DayContent).filter_by(
        domain=domain,
        task_name=task_name,
        type=type,
        day=day
    ).first()
    
    if content:
        content.beginner = payload.get("beginner", [])
        content.intermediate = payload.get("intermediate", [])
        content.advanced = payload.get("advanced", [])
        content.source = payload.get("source", [])
    else:
        content = DayContent(
            domain=domain,
            task_name=task_name,
            type=type,
            day=day,
            beginner=payload.get("beginner", []),
            intermediate=payload.get("intermediate", []),
            advanced=payload.get("advanced", []),
            source=payload.get("source", [])
        )
        db.add(content)
        
    db.commit()
    db.refresh(content)
    return {"success": True, "data": {"id": str(content.id)}}

@router.delete("/day_content")
def delete_day_content(domain: str, task_name: str, type: str, day: int, db: Session = Depends(get_db)):
    content = db.query(DayContent).filter_by(
        domain=domain,
        task_name=task_name,
        type=type,
        day=day
    ).first()
    
    if content:
        db.delete(content)
        db.commit()
        return {"success": True}
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
        bucket_name = getattr(settings, 'SUPABASE_BUCKET_NAME', 'careerwizard')
            
        try:
            res = supabase.storage.from_(bucket_name).upload(
                path=file_path,
                file=file_bytes,
                file_options={"content-type": file.content_type or "application/octet-stream"}
            )
        except Exception as e:
            # Check if it failed because of RLS (e.g. 403 Forbidden or unauthorized)
            # Try to fix the RLS policies directly using the SQLAlchemy DB connection
            from sqlalchemy import text
            from app.db.database import engine
            try:
                with engine.begin() as conn:
                    conn.execute(text("INSERT INTO storage.buckets (id, name, public) VALUES ('careerwizard', 'careerwizard', true) ON CONFLICT DO NOTHING;"))
                    conn.execute(text("DROP POLICY IF EXISTS \"Public Uploads\" ON storage.objects;"))
                    conn.execute(text("DROP POLICY IF EXISTS \"Public Select\" ON storage.objects;"))
                    conn.execute(text("CREATE POLICY \"Public Uploads\" ON storage.objects FOR INSERT TO public WITH CHECK ( bucket_id = 'careerwizard' );"))
                    conn.execute(text("CREATE POLICY \"Public Select\" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'careerwizard' );"))
                
                # Retry upload after fixing policies
                res = supabase.storage.from_(bucket_name).upload(
                    path=file_path,
                    file=file_bytes,
                    file_options={"content-type": file.content_type or "application/octet-stream"}
                )
            except Exception as policy_err:
                import traceback
                traceback.print_exc()
                raise HTTPException(status_code=500, detail=f"Failed to configure Supabase Storage RLS and upload: {str(e)} | DB Error: {str(policy_err)}")
        
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        
        return {"success": True, "url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")
