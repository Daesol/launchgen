-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload media
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow public read access to media
CREATE POLICY "Allow public read access to media" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Create policy to allow users to update their own media
CREATE POLICY "Allow users to update their own media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own media
CREATE POLICY "Allow users to delete their own media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
