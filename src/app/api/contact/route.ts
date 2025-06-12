import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';
import * as EmailValidator from 'email-validator';
import disposableEmailDomains from 'disposable-email-domains';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 requests per 15 minutes per IP
const DUPLICATE_PREVENTION_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Enhanced email validation
function validateEmail(email: string): { isValid: boolean; reason?: string } {
  // Basic format validation
  if (!EmailValidator.validate(email)) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  // Check for disposable email domains
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return { isValid: false, reason: 'Invalid email domain' };
  }

  if (disposableEmailDomains.includes(domain)) {
    return { isValid: false, reason: 'Temporary email addresses are not allowed' };
  }

  // Block common fake/suspicious patterns
  const suspiciousPatterns = [
    /test@/i,
    /fake@/i,
    /temp@/i,
    /spam@/i,
    /noreply@/i,
    /throwaway/i,
    /^[a-z]{1,3}@/i, // Very short usernames
    /^\d+@/i, // Only numbers as username
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return { isValid: false, reason: 'Email address appears to be invalid or suspicious' };
  }

  // Block emails with suspicious domains
  const suspiciousDomains = [
    'example.com',
    'test.com',
    'fake.com',
    'localhost',
    'invalid.com',
    'nowhere.com',
  ];

  if (suspiciousDomains.includes(domain)) {
    return { isValid: false, reason: 'Email domain is not acceptable' };
  }

  return { isValid: true };
}

// Rate limiting function
function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const userRate = rateLimitStore.get(ip);

  if (!userRate) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return { allowed: true };
  }

  // Reset if window has passed
  if (now - userRate.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
    const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - userRate.lastReset)) / 60000);
    return { 
      allowed: false, 
      reason: `Too many requests. Please try again in ${timeLeft} minutes.` 
    };
  }

  // Increment count
  userRate.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // Apply rate limiting
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.reason },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Trim and validate inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    // Additional validation
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (trimmedSubject.length < 5 || trimmedSubject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Enhanced email validation
    const emailValidation = validateEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: `We're sorry, but ${emailValidation.reason}. Please use a valid, permanent email address.` },
        { status: 400 }
      );
    }

    // Check for duplicate submissions
    const connection = await db.getConnection();
    try {
      // Calculate cutoff dates in JavaScript
      const duplicatePreventionCutoff = new Date(Date.now() - DUPLICATE_PREVENTION_WINDOW);
      const suspiciousCutoff = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)); // 7 days

      // Check for recent submissions from the same email
      const [recentSubmissions] = await connection.execute(
        'SELECT id, created_at FROM contact_messages WHERE email = ? AND created_at > ?',
        [trimmedEmail, duplicatePreventionCutoff]
      );

      const submissions = recentSubmissions as any[];
      if (submissions.length > 0) {
        const lastSubmissionTime = new Date(submissions[0].created_at);
        const hoursLeft = Math.ceil((DUPLICATE_PREVENTION_WINDOW - (Date.now() - lastSubmissionTime.getTime())) / (1000 * 60 * 60));
        
        connection.release();
        return NextResponse.json(
          { 
            error: `Thank you for your interest! We've already received a message from this email address recently. To prevent spam and ensure quality service, we only accept one message per email address every 24 hours. Please try again in ${hoursLeft} hours, or if this is urgent, you can reach us directly at support@404monetizer.com.` 
          },
          { status: 400 }
        );
      }

      // Check for suspicious patterns (same name/email combination)
      const [suspiciousCheck] = await connection.execute(
        'SELECT COUNT(*) as count FROM contact_messages WHERE name = ? AND email = ? AND created_at > ?',
        [trimmedName, trimmedEmail, suspiciousCutoff]
      );

      const suspiciousCount = (suspiciousCheck as any[])[0].count;
      if (suspiciousCount > 0) {
        connection.release();
        return NextResponse.json(
          { 
            error: 'We\'ve detected multiple submissions with the same details. If you need to update your previous message or have additional questions, please reply to our email response or contact us directly at support@404monetizer.com.' 
          },
          { status: 400 }
        );
      }

      // Save to database
      const [result] = await connection.execute(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [trimmedName, trimmedEmail, trimmedSubject, trimmedMessage]
      );

      // Send email notification to admin
      const adminEmailContent = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || 'admin@404monetizer.com',
        subject: `New Contact Form Submission: ${trimmedSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #555; margin-bottom: 5px;">Contact Information:</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${trimmedName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}" style="color: #007bff;">${trimmedEmail}</a></p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${trimmedSubject}</p>
                <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ip}</p>
              </div>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 5px;">
                  <p style="line-height: 1.6; margin: 0; white-space: pre-wrap;">${trimmedMessage}</p>
                </div>
              </div>
              
              <div style="margin: 30px 0; padding: 15px; background-color: #e7f3ff; border-radius: 5px;">
                <p style="margin: 0; color: #0066cc; font-size: 14px;">
                  <strong>Quick Actions:</strong><br>
                  • Reply directly to this email to respond to ${trimmedName}<br>
                  • Visit the admin dashboard to manage this message<br>
                  • Mark as read/replied in the system
                </p>
              </div>
              
              <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; text-align: center;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  This email was automatically generated by 404 Monetizer Contact Form<br>
                  Received on ${new Date().toLocaleString()} from IP: ${ip}
                </p>
              </div>
            </div>
          </div>
        `,
      };

      // Send confirmation email to user
      const userEmailContent = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: trimmedEmail,
        subject: 'Thank you for contacting 404 Monetizer',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #007bff; margin: 0;">404 Monetizer</h1>
                <p style="color: #666; margin: 5px 0;">Turn your 404 pages into revenue</p>
              </div>
              
              <h2 style="color: #333;">Thank you for reaching out!</h2>
              
              <p style="line-height: 1.6; color: #555;">Dear ${trimmedName},</p>
              
              <p style="line-height: 1.6; color: #555;">
                Thank you for contacting us! We have received your message and our team will review it shortly. 
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${trimmedSubject}</p>
                <p style="margin: 5px 0;"><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p style="line-height: 1.6; color: #555;">
                In the meantime, feel free to explore our platform and learn more about how 404 Monetizer 
                can help you turn your error pages into profitable opportunities.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://404monetizer.com'}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Visit Our Platform
                </a>
              </div>
              
              <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                  If you have any urgent questions, you can also reach us at:<br>
                  📧 <a href="mailto:contactus@404monetizer.com" style="color: #007bff;">support@404monetizer.com</a>
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  Best regards,<br>
                  <strong>The 404 Monetizer Team</strong>
                </p>
              </div>
            </div>
          </div>
        `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(adminEmailContent),
        transporter.sendMail(userEmailContent)
      ]);

      connection.release();

      return NextResponse.json(
        { 
          message: 'Thank you for your message! We have received it successfully and will get back to you within 24 hours.',
          success: true 
        },
        { status: 200 }
      );

    } catch (dbError) {
      connection.release();
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'We apologize, but there was an issue processing your message. Please try again later or contact us directly at support@404monetizer.com.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'We apologize, but there was an unexpected error. Please try again later or contact us directly at support@404monetizer.com.' },
      { status: 500 }
    );
  }
} 