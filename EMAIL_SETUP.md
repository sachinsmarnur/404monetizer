# Email Setup for Password Reset

This document explains how to set up email functionality for the password reset feature.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration for Password Reset
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
```

## Gmail Setup

If you're using Gmail, follow these steps:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password as `SMTP_PASSWORD`

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp.live.com
SMTP_PORT=587
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
```

## Database Migration

Before using the password reset functionality, run the database migration to add the required columns:

```sql
-- Run this SQL command in your database
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(6) NULL,
ADD COLUMN reset_token_expires TIMESTAMP NULL;

-- Create index for faster lookup
CREATE INDEX idx_users_reset_token ON users(reset_token);
```

Alternatively, you can run the migration file:
```bash
mysql -u your_username -p your_database < src/db/migration_password_reset.sql
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the sign-in page: `http://localhost:3000/auth/sign-in`
3. Click "Forgot password?" to test the flow
4. Check your email server logs to verify emails are being sent

## Security Notes

- Reset codes expire after 15 minutes
- Each reset request generates a new 6-digit code
- Previous codes are invalidated when a new one is requested
- Successful password reset clears the reset token
- The system doesn't reveal whether an email exists in the database

## Troubleshooting

### "Authentication failed" error
- Verify your SMTP credentials
- For Gmail, ensure you're using an app password, not your regular password
- Check that 2FA is enabled on your Google account

### "Connection timeout" error
- Verify the SMTP host and port
- Check your firewall settings
- Some networks block SMTP ports

### Emails not being received
- Check spam/junk folders
- Verify the FROM_EMAIL is properly configured
- Test with different email providers 