# Contact Form Setup Guide

## Overview
The contact form feature allows users to send messages directly through your website with comprehensive security measures. When a user submits the form, the system:
1. Validates the email address against fake/disposable email services
2. Prevents duplicate submissions and spam
3. Applies rate limiting to prevent abuse
4. Saves the message to the database
5. Sends professional notification emails to both admin and user

## Security Features

### 🛡️ **Anti-Spam Protection**
- **Duplicate Prevention**: Users cannot send multiple messages from the same email within 24 hours
- **Rate Limiting**: Maximum 3 requests per IP address every 15 minutes
- **Suspicious Pattern Detection**: Blocks same name/email combinations within 7 days

### 📧 **Enhanced Email Validation**
- **Format Validation**: Proper email format checking
- **Disposable Email Blocking**: Prevents temporary/throwaway email addresses
- **Suspicious Pattern Detection**: Blocks common fake email patterns (test@, fake@, etc.)
- **Domain Validation**: Blocks suspicious domains (example.com, test.com, etc.)

### 🔒 **Input Validation**
- **Length Restrictions**: 
  - Name: 2-100 characters
  - Subject: 5-200 characters  
  - Message: 10-2000 characters
- **Content Sanitization**: All inputs are trimmed and validated
- **IP Tracking**: Client IP addresses are logged for security monitoring

## Database Setup

### 1. Run the Schema Update
The contact messages table has been added to `src/db/schema.sql`. Execute this SQL to create the table:

```sql
-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
```

## Email Configuration

### 1. Required Environment Variables
Add these to your `.env.local` file:

```env
# Email Configuration (Required for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@404monetizer.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Email Provider Setup

#### For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SMTP_PASSWORD`

#### For Other Providers:
- **SendGrid**: `smtp.sendgrid.net` (port 587)
- **Mailgun**: `smtp.mailgun.org` (port 587)
- **AWS SES**: `email-smtp.region.amazonaws.com` (port 587)

## Features

### User Experience
- Professional contact form with comprehensive validation
- Real-time form submission feedback with detailed error messages
- Success/error messages with icons
- Form reset after successful submission
- Loading states during submission
- Professional error messages for security violations

### Security Messages
Users receive professional, informative messages for various security scenarios:
- **Duplicate Submission**: "Thank you for your interest! We've already received a message from this email address recently..."
- **Rate Limiting**: "Too many requests. Please try again in X minutes."
- **Invalid Email**: "We're sorry, but temporary email addresses are not allowed. Please use a valid, permanent email address."
- **Suspicious Activity**: "We've detected multiple submissions with the same details..."

### Email Templates
The system sends two professional HTML emails:

1. **Admin Notification Email**:
   - Complete contact information with IP address
   - Formatted message content
   - Quick action suggestions
   - Professional styling
   - Security information

2. **User Confirmation Email**:
   - Thank you message
   - Message summary with timestamp
   - Company branding
   - Additional contact information

### Admin Management
- API endpoint to view all contact messages
- Filter by status (new, read, replied)
- Update message status
- Pagination support
- Admin authentication required
- IP address tracking for security

## API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form (with security checks)

### Admin Endpoints (Requires Pro Plan)
- `GET /api/admin/contact` - List contact messages
- `PATCH /api/admin/contact` - Update message status

## Security Configuration

### Rate Limiting Settings
```javascript
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 requests per IP
const DUPLICATE_PREVENTION_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
```

### Blocked Email Patterns
- Disposable email domains (using `disposable-email-domains` package)
- Suspicious patterns: test@, fake@, temp@, spam@, noreply@
- Very short usernames (1-3 characters)
- Numeric-only usernames
- Suspicious domains: example.com, test.com, fake.com, localhost

## Usage

### 1. Contact Form Submission
Users can access the contact form at `/contact`. The form includes:
- Name (required, 2-100 characters)
- Email (required, validated against fake/disposable services)
- Subject (required, 5-200 characters)
- Message (required, 10-2000 characters)

### 2. Admin Access
Admin users (Pro plan) can view and manage contact messages through the admin API endpoints.

### 3. Email Notifications
Both admin and user receive immediate email notifications upon successful form submission.

## Testing

### 1. Test Form Submission
1. Fill out the contact form at `/contact`
2. Check database for new record
3. Verify admin received notification email with IP address
4. Verify user received confirmation email

### 2. Test Security Features
```bash
# Test rate limiting
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}' \
  # Repeat 4 times quickly to trigger rate limit

# Test duplicate prevention
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@gmail.com","subject":"Hello","message":"Hello world"}' \
  # Send again with same email to test duplicate prevention

# Test disposable email blocking
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@10minutemail.com","subject":"Test","message":"Test message"}'
```

### 3. Test Admin API
```bash
# Get contact messages (requires authentication)
curl -X GET "http://localhost:3000/api/admin/contact?page=1&limit=10&status=new" \
  -H "Cookie: token=your-jwt-token"

# Update message status
curl -X PATCH "http://localhost:3000/api/admin/contact" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-jwt-token" \
  -d '{"messageId": 1, "status": "read"}'
```

## Troubleshooting

### Common Issues
1. **Email not sending**: Check SMTP credentials and firewall settings
2. **Database errors**: Ensure the contact_messages table exists
3. **Admin access denied**: Verify user has Pro plan or admin privileges
4. **Rate limiting too strict**: Adjust `RATE_LIMIT_WINDOW` and `MAX_REQUESTS_PER_WINDOW`
5. **False positive email blocking**: Review and adjust suspicious patterns

### Email Testing
Use a service like [MailHog](https://github.com/mailhog/MailHog) for local email testing:
```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
```

## Security Features Details

### Input Validation
- All inputs are trimmed and length-validated
- HTML/script injection prevention
- SQL injection protection with parameterized queries
- XSS prevention in email templates

### Rate Limiting
- In-memory storage for development (use Redis in production)
- IP-based tracking with configurable windows
- Professional error messages with time remaining

### Email Security
- Comprehensive disposable email domain blocking
- Pattern-based suspicious email detection
- Domain reputation checking
- Email format validation

### Admin Features
- IP address logging for all submissions
- Security event tracking
- Admin authentication for management endpoints
- Audit trail with timestamps

## Production Considerations

### Scaling
1. **Replace in-memory rate limiting** with Redis or similar
2. **Implement distributed rate limiting** for multiple servers
3. **Add database connection pooling** for high traffic
4. **Use dedicated email service** (SendGrid, Mailgun, etc.)

### Enhanced Security
1. **Add CAPTCHA** for additional bot protection
2. **Implement IP geolocation** blocking for suspicious regions
3. **Add webhook notifications** for security events
4. **Set up monitoring** for unusual activity patterns

### Monitoring
1. **Email deliverability monitoring**
2. **Security event logging**
3. **Performance metrics tracking**
4. **Error rate monitoring**

## Customization

### Security Settings
Adjust security parameters in `src/app/api/contact/route.ts`:
```javascript
// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // Adjust as needed
const MAX_REQUESTS_PER_WINDOW = 3; // Adjust as needed
const DUPLICATE_PREVENTION_WINDOW = 24 * 60 * 60 * 1000; // Adjust as needed

// Add custom suspicious patterns
const suspiciousPatterns = [
  // Add your custom patterns here
];

// Add custom suspicious domains
const suspiciousDomains = [
  // Add your custom domains here
];
```

### Email Templates
The email templates can be customized in the same file:
- Company branding and styling
- Contact information
- Security notifications
- Additional content sections

### Form Fields
To add custom fields:
1. Update database schema
2. Add API validation logic
3. Update frontend form
4. Modify email templates
5. Update security validations
 