import sys

from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionLocal
from app.models.activity import UserActivity
from app.models.admin import Admin
from app.models.user import User
from app.models.user_profile import StudentProfile
from app.services.auth_service import login_service


def main():
    email = sys.argv[1] if len(sys.argv) > 1 else "het80630@gmail.com"
    password = sys.argv[2] if len(sys.argv) > 2 else "1111"

    db = SessionLocal()
    try:
        result = login_service(db, email, password)
        print("Login successful")
        print(f"user_id: {result['user_id']}")
        print(f"name: {result['name']}")
        print(f"email: {result['email']}")
    except SQLAlchemyError as error:
        print("Database error")
        print(error)
    except Exception as error:
        detail = getattr(error, "detail", str(error))
        print("Login failed")
        print(detail)
    finally:
        db.close()


if __name__ == "__main__":
    main()
