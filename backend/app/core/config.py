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
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ultra_secret_carrier_wizard_key_2024")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")

settings = Settings()
