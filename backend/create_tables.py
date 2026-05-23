import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine, Base
from app.models.activity import *
from app.models.interview import *
from app.models.job import *
from app.models.resume import *
from app.models.roadmap import *
from app.models.user import *
from app.models.user_profile import *
from app.models.admin import *
from app.models.internship_plan import *
from app.models.internship_track import *
from app.models.internship_task import *
from app.models.payment import *
from app.models.enrollment import *
from app.models.task_submission import *
from app.models.certificate import *

def main():
    print("Creating tables in Supabase Postgres...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    main()
