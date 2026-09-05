import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(env_path)

class Settings:
    _db_url = os.getenv("DATABASE_URL", "sqlite:///./jobrecdb.db")
    
    @property
    def DATABASE_URL(self) -> str:
        db_url = self._db_url
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
            
        if db_url.startswith("sqlite:///./"):
            # Resolve relative to the backend directory (two levels up from this file)
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
            db_name = db_url.replace("sqlite:///./", "")
            return f"sqlite:///{os.path.join(base_dir, db_name)}"
        return db_url

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development-only-change-me")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    SUPABASE_BUCKET_NAME: str = os.getenv("SUPABASE_BUCKET_NAME", "day-resources")
    RAPIDAPI_KEY: str = os.getenv("RAPIDAPI_KEY")
    RAPIDAPI_HOST: str = os.getenv("RAPIDAPI_HOST", "jsearch.p.rapidapi.com")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN")
    AI_FAST_MODEL: str = os.getenv("AI_FAST_MODEL", "gemini-2.5-flash-lite")
    AI_QUALITY_MODEL: str = os.getenv("AI_QUALITY_MODEL", "gemini-2.5-flash")
    INTERNSHIP_ENROLLMENT_MODE: str = os.getenv("INTERNSHIP_ENROLLMENT_MODE", "beta").lower()
    CORS_ORIGINS: list[str] = [
        value.strip()
        for value in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
        ).split(",")
        if value.strip()
    ]

    def validate_production(self) -> None:
        environment = os.getenv("ENVIRONMENT", "development").lower()
        if environment == "production" and self.SECRET_KEY == "development-only-change-me":
            raise RuntimeError("SECRET_KEY must be configured in production")

settings = Settings()
