-- Fix RLS policies for leads table to allow lead capture

-- Enable RLS on leads table (if not already enabled)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view leads for their own pages" ON leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads for their own pages" ON leads;
DROP POLICY IF EXISTS "Users can delete leads for their own pages" ON leads;

-- Create policies for leads table

-- Allow users to view leads for pages they own (for dashboard)
CREATE POLICY "Users can view leads for their own pages" ON leads
  FOR SELECT
  USING (
    page_id IN (
      SELECT id FROM landing_pages 
      WHERE owner_id = auth.uid()
    )
  );

-- Allow anyone to insert leads (for public lead capture)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update leads for pages they own
CREATE POLICY "Users can update leads for their own pages" ON leads
  FOR UPDATE
  USING (
    page_id IN (
      SELECT id FROM landing_pages 
      WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    page_id IN (
      SELECT id FROM landing_pages 
      WHERE owner_id = auth.uid()
    )
  );

-- Allow users to delete leads for pages they own
CREATE POLICY "Users can delete leads for their own pages" ON leads
  FOR DELETE
  USING (
    page_id IN (
      SELECT id FROM landing_pages 
      WHERE owner_id = auth.uid()
    )
  );
