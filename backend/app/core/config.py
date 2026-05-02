import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(env_path)

class Settings:
    _db_url = os.getenv("DATABASE_URL", "sqlite:///./jobrecdb.db")
    
    @property
    def DATABASE_URL(self) -> str:
        if self._db_url.startswith("sqlite:///./"):
            # Resolve relative to the backend directory (two levels up from this file)
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
            db_name = self._db_url.replace("sqlite:///./", "")
            return f"sqlite:///{os.path.join(base_dir, db_name)}"
        return self._db_url

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ultra_secret_carrier_wizard_key_2024")

settings = Settings()
