from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()
 

def get_db():
	"""FastAPI dependency that yields a DB session and ensures it's closed."""
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()

