# Plan Expiration Cron Job Setup

## Overview
This file contains instructions for setting up automated plan expiration checking for 404 Monetizer.

## Cron Job Configuration

### Option 1: Server Cron (Recommended for VPS/Dedicated Servers)

Add this to your server's crontab to run the expiration check daily at 2 AM:

```bash
# Edit crontab
crontab -e

# Add this line to check expired plans daily at 2 AM
0 2 * * * curl -X GET "https://your-domain.com/api/admin/check-expired-plans" -H "Authorization: Bearer YOUR_ADMIN_API_KEY" >> /var/log/plan-expiration.log 2>&1
```

### Option 2: External Cron Service (Recommended for Shared Hosting)

Use services like:
- **EasyCron** (https://www.easycron.com/)
- **Cron-job.org** (https://cron-job.org/)
- **UptimeRobot** (can be used for HTTP monitoring with alerts)

Configure to call:
- **URL**: `https://your-domain.com/api/admin/check-expired-plans`
- **Method**: GET
- **Headers**: `Authorization: Bearer YOUR_ADMIN_API_KEY`
- **Schedule**: Daily at 2:00 AM (or any preferred time)

### Option 3: Vercel Cron Jobs (For Vercel Deployments)

Create a `vercel.json` file in your project root:

```json
{
  "crons": [
    {
      "path": "/api/admin/check-expired-plans",
      "schedule": "0 2 * * *"
    }
  ]
}
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Optional: API key for cron job security
ADMIN_API_KEY=your-secure-random-api-key-here
```

## Manual Testing

You can manually trigger the expiration check by:

1. **API Call** (if you have admin/pro access):
   ```bash
   curl -X POST "https://your-domain.com/api/admin/check-expired-plans" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN"
   ```

2. **Browser** (if logged in as admin/pro user):
   Visit: `https://your-domain.com/api/admin/check-expired-plans`

## What the Cron Job Does

1. **Finds Expired Plans**: Queries database for Pro users with `plan_expires_at < NOW()`
2. **Downgrades Users**: Changes plan from 'pro' to 'free'
3. **Suspends Excess Pages**: Keeps first page active, suspends additional pages
4. **Sends Notifications**: Logs email notifications (implement actual email service)
5. **Returns Report**: Provides summary of processed users

## Monitoring

- Check logs in `/var/log/plan-expiration.log`
- Monitor the API response for successful processing
- Set up alerts if the cron job fails to run

## Database Migration

Before setting up the cron job, ensure you've run the database migration:

```sql
-- Run this SQL to add expiration fields to existing database
ALTER TABLE users 
ADD COLUMN subscription_started_at TIMESTAMP NULL AFTER plan,
ADD COLUMN plan_expires_at TIMESTAMP NULL AFTER subscription_started_at;

CREATE INDEX idx_users_plan_expires_at ON users(plan_expires_at);
```

## Troubleshooting

1. **Permission Issues**: Ensure the cron job has proper authentication
2. **Database Connection**: Verify database connection in production
3. **Timezone Issues**: Ensure server timezone matches your business timezone
4. **Email Notifications**: Implement actual email service in production

## Security Notes

- Use a strong `ADMIN_API_KEY` if implementing API key authentication
- Limit access to the expiration check endpoint
- Monitor for unusual activity in the logs
- Consider implementing rate limiting for the endpoint 