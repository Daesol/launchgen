-- Add page_content and page_style columns to landing_pages table
-- This migration updates the schema to match the application code

-- Add page_content column
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS page_content JSONB;

-- Add page_style column  
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS page_style JSONB;

-- Add template_id column
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'default';

-- Add original_prompt column
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS original_prompt TEXT;

-- Add published column
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;

-- Migrate existing config_json data to page_content if it exists
-- This handles any existing data that might be in the old format
UPDATE landing_pages 
SET page_content = config_json 
WHERE config_json IS NOT NULL AND page_content IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_pages_owner_id ON landing_pages(owner_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_template_id ON landing_pages(template_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_published ON landing_pages(published); 