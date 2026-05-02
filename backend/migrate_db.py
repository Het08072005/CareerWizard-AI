import sqlite3
import os
from app.core.config import settings

def run_migration():
    db_url = settings.DATABASE_URL
    db_path = db_url.replace('sqlite:///', '')
    
    if not os.path.isabs(db_path):
        db_path = os.path.abspath(os.path.join(os.getcwd(), db_path))
        
    print(f"Connecting to database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add is_api column
    try:
        cursor.execute("ALTER TABLE jobs ADD COLUMN is_api BOOLEAN DEFAULT 0")
        print("Added column: is_api")
    except sqlite3.OperationalError as e:
        print(f"Column is_api might already exist: {e}")
        
    # Add created_at column
    try:
        cursor.execute("ALTER TABLE jobs ADD COLUMN created_at DATETIME")
        print("Added column: created_at")
    except sqlite3.OperationalError as e:
        print(f"Column created_at might already exist: {e}")
        
    # Mark existing jobs with apply_link as API jobs
    cursor.execute("UPDATE jobs SET is_api = 1 WHERE apply_link IS NOT NULL AND apply_link != '#'")
    print(f"Updated {cursor.rowcount} rows to is_api=1")
    
    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    run_migration()
