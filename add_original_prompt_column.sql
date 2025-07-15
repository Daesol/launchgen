-- Add original_prompt column to landing_pages table
-- Run this in your Supabase SQL Editor

-- Add original_prompt column if it doesn't exist
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS original_prompt TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'landing_pages' 
AND column_name = 'original_prompt'; 