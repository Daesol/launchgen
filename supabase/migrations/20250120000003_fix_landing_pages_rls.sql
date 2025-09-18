-- Fix RLS policies for landing_pages table to allow public access to published pages

-- Enable RLS on landing_pages table
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Users can insert their own landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Users can update their own landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Users can delete their own landing pages" ON landing_pages;

-- Create policies for landing_pages table

-- Allow users to view their own landing pages (for dashboard)
CREATE POLICY "Users can view their own landing pages" ON landing_pages
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Allow users to insert their own landing pages
CREATE POLICY "Users can insert their own landing pages" ON landing_pages
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own landing pages
CREATE POLICY "Users can update their own landing pages" ON landing_pages
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to delete their own landing pages
CREATE POLICY "Users can delete their own landing pages" ON landing_pages
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Allow public access to published landing pages (for public viewing)
CREATE POLICY "Public can view published landing pages" ON landing_pages
  FOR SELECT
  USING (published = true);

-- Ensure the published column has a default value
ALTER TABLE landing_pages ALTER COLUMN published SET DEFAULT false;

-- Update any existing pages to be published by default (optional - remove if you want to manually publish)
-- UPDATE landing_pages SET published = true WHERE published IS NULL;

