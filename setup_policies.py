import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv('backend/.env')
db_url = os.getenv('DATABASE_URL')
# SQLAlchemy requires postgresql:// instead of postgres://
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)

sql_commands = [
    """
    DO $$
    BEGIN
        -- Insert bucket if not exists
        IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'careerwizard') THEN
            INSERT INTO storage.buckets (id, name, public) VALUES ('careerwizard', 'careerwizard', true);
        END IF;
    END $$;
    """,
    """
    -- Drop existing policies if they exist to recreate them
    DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Public Select" ON storage.objects;
    """,
    """
    -- Create policy to allow all uploads to careerwizard bucket
    CREATE POLICY "Public Uploads"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK ( bucket_id = 'careerwizard' );
    """,
    """
    -- Create policy to allow all reads from careerwizard bucket
    CREATE POLICY "Public Select"
    ON storage.objects FOR SELECT
    TO public
    USING ( bucket_id = 'careerwizard' );
    """
]

try:
    with engine.begin() as conn:
        for cmd in sql_commands:
            conn.execute(text(cmd))
    print("Successfully configured Supabase Storage policies!")
except Exception as e:
    print(f"Error configuring policies: {e}")
