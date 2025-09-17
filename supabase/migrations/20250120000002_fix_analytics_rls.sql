-- Fix analytics_events RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view analytics events for their own pages" ON analytics_events;
DROP POLICY IF EXISTS "Users can insert analytics events" ON analytics_events;

-- Enable RLS on analytics_events table
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy for reading analytics events
-- Users can only view analytics events for pages they own
CREATE POLICY "Users can view analytics events for their own pages" ON analytics_events
  FOR SELECT
  USING (
    landing_page_id IN (
      SELECT id FROM landing_pages 
      WHERE owner_id = auth.uid()
    )
  );

-- Create policy for inserting analytics events
-- Anyone can insert analytics events (for public landing pages)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT
  WITH CHECK (true);
