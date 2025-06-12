-- Migration to add is_external_access column to analytics_events table
-- This tracks whether an analytics event came from external access or dashboard preview

ALTER TABLE analytics_events 
ADD COLUMN IF NOT EXISTS is_external_access BOOLEAN DEFAULT true 
AFTER event_data;

-- Create index for better performance when filtering by external access
CREATE INDEX IF NOT EXISTS idx_analytics_events_external_access 
ON analytics_events(is_external_access);