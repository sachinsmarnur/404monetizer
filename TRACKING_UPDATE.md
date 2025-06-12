# Analytics Tracking Update

## Overview
This update implements accurate analytics tracking that distinguishes between dashboard previews and real external views.

## Changes Made

### 1. Database Schema Updates
- Added `is_external_access` column to `analytics_events` table
- Created migration script in `src/db/migrations.sql`
- Added admin migration endpoint at `/api/admin/migrate`

### 2. Analytics API Enhancement
- Modified `/api/pages/[id]/analytics/route.ts` to check user authentication
- Only tracks analytics for external access (non-authenticated users or users viewing others' pages)
- Dashboard previews no longer count toward analytics
- Added `isExternalAccess` parameter to control tracking behavior

### 3. Tracking Script Integration
- Added automatic external tracking script to the UseCodeTab generated HTML
- Tracks page views, email collections, affiliate clicks, and content unlocks
- Only executes on externally deployed pages
- Uses `isExternalAccess: true` to ensure proper analytics recording

### 4. Dashboard Preview Updates  
- Modified view page to mark tracking as `isExternalAccess: false`
- Preview views no longer affect analytics data
- Maintains functionality for testing while protecting data integrity

## How It Works

### Dashboard Previews
- When users preview their pages from the dashboard, tracking events are sent with `isExternalAccess: false`
- The API checks if the user is authenticated and owns the page
- If true, analytics are NOT recorded but events are still logged for debugging
- Users can test functionality without skewing their metrics

### External Access (Real Analytics)
- When the generated HTML is deployed on external websites, the embedded tracking script runs
- All tracking events are sent with `isExternalAccess: true`
- The API records these events in the analytics tables
- Provides accurate metrics for real visitors

### Security & Privacy
- Tracking script uses HTTPS endpoints
- Only tracks standard metrics (views, conversions, device type, referrer)
- No sensitive user data is collected
- Gracefully handles network errors

## Migration Required

To enable this feature on existing databases, run the migration:

```sql
-- Add the new column
ALTER TABLE analytics_events 
ADD COLUMN IF NOT EXISTS is_external_access BOOLEAN DEFAULT true 
AFTER event_data;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_external_access 
ON analytics_events(is_external_access);
```

Or use the migration endpoint: `POST /api/admin/migrate` (requires authentication)

## Benefits

1. **Accurate Analytics**: Only real external visitors count toward metrics
2. **Testing Freedom**: Users can preview and test without affecting analytics
3. **Real-time Tracking**: External pages automatically track all events
4. **Data Integrity**: Clean separation between preview and production data
5. **Deployment Ready**: Generated HTML includes all necessary tracking code

## Usage

1. Users create and preview their 404 pages in the dashboard (no analytics impact)
2. Users copy the complete HTML from the "Use Code" tab
3. Users deploy the HTML to their WordPress, Shopify, or custom websites
4. Real visitors generate accurate analytics automatically
5. Users see real metrics in their dashboard analytics

This update ensures that analytics data reflects actual user engagement rather than development/testing activity. 