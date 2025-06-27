import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { sendWelcomePromoEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rate limiting storage (in production, use Redis)
const ipRateLimiter = new Map<string, number[]>();
const emailRateLimiter = new Map<string, number[]>();

// Rate limiting helper
function checkRateLimit(limiter: Map<string, number[]>, key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const requests = limiter.get(key) || [];
  
  // Clean old requests outside the window
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  validRequests.push(now);
  limiter.set(key, validRequests);
  
  // Clean up old entries periodically (basic memory management)
  if (Math.random() < 0.01) { // 1% chance to cleanup
    for (const [k, times] of limiter.entries()) {
      const validTimes = times.filter(time => now - time < windowMs);
      if (validTimes.length === 0) {
        limiter.delete(k);
      } else {
        limiter.set(k, validTimes);
      }
    }
  }
  
  return true;
}

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const { email, password } = await req.json();

    // Get client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
              req.headers.get('x-real-ip') || 
              'unknown';

    // Rate limiting checks
    const ipWindowMs = 15 * 60 * 1000; // 15 minutes
    const emailWindowMs = 30 * 60 * 1000; // 30 minutes
    
    // IP-based rate limiting: 10 login attempts per 15 minutes
    if (!checkRateLimit(ipRateLimiter, ip, 10, ipWindowMs)) {
      return NextResponse.json(
        { error: 'Too many login attempts from this IP. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email-based rate limiting: 5 attempts per 30 minutes per email
    if (!checkRateLimit(emailRateLimiter, email.toLowerCase(), 5, emailWindowMs)) {
      return NextResponse.json(
        { error: 'Too many login attempts for this email. Please try again in 30 minutes.' },
        { status: 429 }
      );
    }

    // Get user from database
    const [users]: any = await db.execute(
      'SELECT id, name, email, password, plan FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password with performance monitoring
    const verifyStartTime = Date.now();
    const isValidPassword = await bcrypt.compare(password, user.password);
    const verifyDuration = Date.now() - verifyStartTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password verification took ${verifyDuration}ms`);
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from user object
    delete user.password;

    const totalDuration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Login completed in ${totalDuration}ms`);
    }

    // Check if we need to send welcome email (first login after signup)
    try {
      const [existingWelcomeEmails] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM welcome_emails_sent WHERE user_id = ?',
        [user.id]
      );

      if (existingWelcomeEmails.length === 0) {
        // This is the first login - send welcome email
        console.log(`📧 Sending welcome email to ${user.email} (first login)`);
        console.log(`📧 SMTP_FROM_EMAIL configured: ${process.env.SMTP_FROM_EMAIL ? '✅ YES' : '❌ NO'}`);
        
        try {
          await sendWelcomePromoEmail(user.email, user.name);
          console.log(`✅ Welcome email sent successfully to ${user.email}`);
          
          // Record that welcome email was sent
          await db.execute<ResultSetHeader>(
            'INSERT INTO welcome_emails_sent (user_id, email, signup_method) VALUES (?, ?, ?)',
            [user.id, user.email, 'regular']
          );
        } catch (emailError: any) {
          console.error(`❌ Failed to send welcome email to ${user.email}:`, {
            error: emailError.message,
            code: emailError.code,
            command: emailError.command,
            response: emailError.response
          });
          // Don't fail the login if email fails - just log it
        }
      }
    } catch (welcomeEmailError) {
      console.error('Error checking/sending welcome email:', welcomeEmailError);
      // Don't fail the login if welcome email check fails
    }

    return NextResponse.json({
      token,
      user
    });
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.error(`Login failed after ${totalDuration}ms:`, error);
    }
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
} 