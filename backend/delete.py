
# import re
# from sqlalchemy.orm import Session
# from app.db.database import SessionLocal
# from app.models.interview import InterviewQuestion


# # --------------------------
# # 1. Normalize title
# # --------------------------
# def normalize_title(title: str) -> str:
#     t = title.strip().lower()

#     # Remove trailing dots
#     t = re.sub(r'\.+$', '', t)

#     # Remove (1), (2), (3) etc.
#     t = re.sub(r'\(\s*\d+\s*\)$', '', t)

#     # Replace multiple spaces with single
#     t = re.sub(r'\s+', ' ', t)

#     return t.strip()


# # --------------------------
# # 2. Delete duplicates for specific role
# # --------------------------
# def delete_duplicates_by_role(role: str):
#     db: Session = SessionLocal()
#     print(f"\n⏳ Checking duplicates for role: {role}")

#     try:
#         # Fetch questions for the given role
#         questions = (
#             db.query(InterviewQuestion)
#             .filter(InterviewQuestion.role == role)
#             .order_by(InterviewQuestion.title.asc(), InterviewQuestion.id.asc())
#             .all()
#         )

#         if not questions:
#             print("⚠️ No questions found for this role.")
#             return

#         seen = {}
#         duplicates = []

#         # Detect and mark duplicates
#         for q in questions:
#             clean = normalize_title(q.title)

#             if clean not in seen:
#                 seen[clean] = q.id  # first question keep
#             else:
#                 duplicates.append(q.id)  # rest delete

#         # Delete duplicates
#         if duplicates:
#             db.query(InterviewQuestion).filter(
#                 InterviewQuestion.id.in_(duplicates)
#             ).delete(synchronize_session=False)
#             db.commit()

#         print(f"🗑️ Deleted {len(duplicates)} duplicates for role: {role}")
#         remaining = db.query(InterviewQuestion).filter(
#             InterviewQuestion.role == role
#         ).count()

#         print(f"📊 Remaining questions for role '{role}': {remaining}")

#     except Exception as e:
#         print(f"❌ Error: {e}")
#         db.rollback()

#     finally:
#         db.close()


# # --------------------------
# # 3. Run script
# # --------------------------
# if __name__ == "__main__":
#     # 👉 👉 👉  Set YOUR role here
#     ROLE_TO_CLEAN = "Backend Developer"

#     delete_duplicates_by_role(ROLE_TO_CLEAN)
#     print("\n🎉 Done! Duplicate cleanup complete.")














import re
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.interview import InterviewQuestion


# --------------------------
# 1. Smart Title Normalizer
# --------------------------
def normalize_title(title: str) -> str:
    t = title.strip().lower()

    # Remove trailing dots
    t = re.sub(r'\.+$', '', t)

    # Remove (1), (2), (3), etc.
    t = re.sub(r'\(\s*\d+\s*\)$', '', t)

    # Replace multiple spaces
    t = re.sub(r'\s+', ' ', t)

    return t.strip()


# --------------------------
# 2. Delete duplicates for one role
# --------------------------
def delete_duplicates_by_role(role: str, db: Session):
    print(f"\n🔍 Checking duplicates for role: {role}")

    questions = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.role == role)
        .order_by(InterviewQuestion.title.asc(), InterviewQuestion.id.asc())
        .all()
    )

    if not questions:
        print(f"⚠️ No questions found for role: {role}")
        return

    seen = {}
    duplicates = []

    for q in questions:
        clean_title = normalize_title(q.title)

        if clean_title not in seen:
            seen[clean_title] = q.id  # keep first one
        else:
            duplicates.append(q.id)  # delete rest

    if duplicates:
        db.query(InterviewQuestion).filter(
            InterviewQuestion.id.in_(duplicates)
        ).delete(synchronize_session=False)
        db.commit()

    print(f"🗑️ Deleted {len(duplicates)} duplicates from role: {role}")

    remaining = db.query(InterviewQuestion).filter(
        InterviewQuestion.role == role
    ).count()

    print(f"📊 Remaining questions for {role}: {remaining}")


# --------------------------
# 3. Run Cleanup for ALL Roles
# --------------------------
if __name__ == "__main__":

    ROLES = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "AI Engineer",
        "Machine Learning Engineer (ML)",
        "Generative AI Engineer (GenAI)",
        "Data Scientist",
        "MLOps Engineer",
        "Deep Learning Engineer",
        "Computer Vision Engineer",
        "DevOps Engineer",
        "Mobile Developer",
        "QA Engineer",
        "Product Manager",
        "UI/UX Designer",
    ]

    db = SessionLocal()

    print("\n🚀 Starting duplicate cleanup for ALL roles...")

    for role in ROLES:
        delete_duplicates_by_role(role, db)

    db.close()

    print("\n🎉 Cleanup Complete! All duplicate questions removed role-wise.")

