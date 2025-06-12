-- Migration script to add CASCADE DELETE constraints to existing analytics table
-- Run this script on existing databases to ensure proper cascade deletion

-- First, drop existing foreign key constraints on analytics table
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing constraints if they exist (ignore errors if they don't exist)
ALTER TABLE analytics DROP FOREIGN KEY analytics_ibfk_1;
ALTER TABLE analytics DROP FOREIGN KEY analytics_ibfk_2;

-- Recreate the analytics table with proper CASCADE constraints
-- This preserves existing data while updating constraints
ALTER TABLE analytics 
ADD CONSTRAINT analytics_user_fk 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE analytics 
ADD CONSTRAINT analytics_page_fk 
FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_id ON analytics(page_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify the constraints are in place
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'analytics'
    AND REFERENCED_TABLE_NAME IS NOT NULL; 