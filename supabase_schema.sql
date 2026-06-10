CREATE TABLE IF NOT EXISTS day_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  task_name TEXT NOT NULL,
  type TEXT NOT NULL,
  day INTEGER NOT NULL,
  beginner JSONB DEFAULT '[]'::jsonb,
  intermediate JSONB DEFAULT '[]'::jsonb,
  advanced JSONB DEFAULT '[]'::jsonb,
  source JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain, task_name, type, day)
);

-- Enable RLS and add public access for easy testing (Modify for production)
ALTER TABLE day_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON day_content FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) 
VALUES ('day-resources', 'day-resources', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Give public access to bucket" ON storage.objects FOR SELECT USING ( bucket_id = 'day-resources' );
CREATE POLICY "Give public upload access to bucket" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'day-resources' );
CREATE POLICY "Give public update access to bucket" ON storage.objects FOR UPDATE USING ( bucket_id = 'day-resources' );
CREATE POLICY "Give public delete access to bucket" ON storage.objects FOR DELETE USING ( bucket_id = 'day-resources' );
