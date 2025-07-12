-- Create analytics_events table for landing page analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- e.g. 'page_view', 'form_submit', etc.
  user_agent TEXT,
  ip_address TEXT, -- can be hashed for privacy
  referrer TEXT,
  utm_source TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_landing_page_id ON analytics_events(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at); 