-- Enable RLS on tables
ALTER TABLE playlist_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for playlist_categories
CREATE POLICY "Enable all operations for authenticated users on playlist_categories"
ON "public"."playlist_categories"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add RLS policies for playlist_songs
CREATE POLICY "Enable all operations for authenticated users on playlist_songs"
ON "public"."playlist_songs"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);