import sqlite3
import os

db_path = "jobrecdb.db" 


if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE jobs ADD COLUMN apply_link VARCHAR(500)")
        print("Successfully added apply_link column to jobs table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column apply_link already exists.")
        else:
            print(f"Error: {e}")
    conn.commit()
    conn.close()
else:
    print(f"Database {db_path} not found.")
