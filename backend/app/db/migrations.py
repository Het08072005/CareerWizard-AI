import hashlib
from pathlib import Path

from sqlalchemy import text

from app.db.database import engine


MIGRATIONS_DIR = Path(__file__).resolve().parents[2] / "migrations"


def run_migrations() -> None:
    """Apply checked-in SQL migrations exactly once without altering existing data."""
    with engine.begin() as connection:
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(100) PRIMARY KEY,
                checksum VARCHAR(64) NOT NULL,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """))
        connection.execute(text("SELECT pg_advisory_xact_lock(hashtext('careerwizard_schema_migrations'))"))
        applied = {
            row.version: row.checksum
            for row in connection.execute(text("SELECT version, checksum FROM schema_migrations"))
        }
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            sql = path.read_text(encoding="utf-8")
            checksum = hashlib.sha256(sql.encode("utf-8")).hexdigest()
            if path.name in applied:
                if applied[path.name] != checksum:
                    raise RuntimeError(f"Applied migration changed: {path.name}")
                continue
            connection.exec_driver_sql(sql)
            connection.execute(
                text("INSERT INTO schema_migrations(version, checksum) VALUES (:version, :checksum)"),
                {"version": path.name, "checksum": checksum},
            )
