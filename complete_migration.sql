-- Complete migration for landing_pages table
-- Run this in your Supabase SQL Editor to add all missing columns

-- Add page_content column if it doesn't exist
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS page_content JSONB;

-- Add page_style column if it doesn't exist
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS page_style JSONB;

-- Add template_id column if it doesn't exist
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'default';

-- Add original_prompt column if it doesn't exist
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS original_prompt TEXT;

-- Add published column if it doesn't exist
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;



-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_landing_pages_owner_id ON landing_pages(owner_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_template_id ON landing_pages(template_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_published ON landing_pages(published);

-- Verify all columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'landing_pages' 
ORDER BY ordinal_position; 