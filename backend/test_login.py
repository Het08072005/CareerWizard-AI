import sys

from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionLocal
from app.models.activity import UserActivity
from app.models.admin import Admin
from app.models.user import User
from app.models.user_profile import StudentProfile
from app.services.auth_service import login_service


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python test_login.py <email> <password>")
    email = sys.argv[1]
    password = sys.argv[2]

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
