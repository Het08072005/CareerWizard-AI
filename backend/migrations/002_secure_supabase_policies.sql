-- The browser no longer writes internship content directly. Keep public resource reads,
-- while all content/storage mutations go through authenticated backend APIs.
ALTER TABLE day_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all operations for all users" ON day_content;

DROP POLICY IF EXISTS "Give public upload access to bucket" ON storage.objects;
DROP POLICY IF EXISTS "Give public update access to bucket" ON storage.objects;
DROP POLICY IF EXISTS "Give public delete access to bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;

-- Resource URLs referenced by published briefs remain readable.
DROP POLICY IF EXISTS "Give public access to bucket" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to published resources" ON storage.objects;
CREATE POLICY "Give public access to published resources"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'day-resources');
