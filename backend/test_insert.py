from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionLocal
from app.models.activity import UserActivity
from app.models.admin import Admin
from app.models.user import User
from app.models.user_profile import StudentProfile


def main():
    db = SessionLocal()
    try:
        print("Checking database connection...")
        db.execute(text("SELECT 1"))
        print("DB connection OK")

        users = db.query(User).limit(5).all()
        print(f"Fetched {len(users)} user record(s)")

        for index, user in enumerate(users, start=1):
            print(f"{index}. {user.email} | {user.full_name}")

    except SQLAlchemyError as error:
        print("DB fetch failed")
        print(error)
    finally:
        db.close()


if __name__ == "__main__":
    main()
