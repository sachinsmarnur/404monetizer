import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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
    const { name, email, password } = await req.json();

    // Get client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
              req.headers.get('x-real-ip') || 
              'unknown';

    // Rate limiting checks
    const ipWindowMs = 15 * 60 * 1000; // 15 minutes
    const emailWindowMs = 60 * 60 * 1000; // 1 hour
    
    // IP-based rate limiting: 5 signups per 15 minutes
    if (!checkRateLimit(ipRateLimiter, ip, 5, ipWindowMs)) {
      return NextResponse.json(
        { error: 'Too many signup attempts from this IP. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Email-based rate limiting: 3 attempts per hour per email
    if (!checkRateLimit(emailRateLimiter, email.toLowerCase(), 3, emailWindowMs)) {
      return NextResponse.json(
        { error: 'Too many signup attempts for this email. Please try again later.' },
        { status: 429 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash password with performance monitoring
    const hashStartTime = Date.now();
    const hashedPassword = await bcrypt.hash(password, 12); // Increased from 10 for better security
    const hashDuration = Date.now() - hashStartTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password hashing took ${hashDuration}ms`);
    }

    try {
      // Check if user already exists
      const [existingUsers] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [email.toLowerCase()] // Store emails in lowercase for consistency
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }

      // Insert new user
      const [result] = await db.execute<ResultSetHeader>(
        'INSERT INTO users (name, email, password, plan, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, email.toLowerCase(), hashedPassword, 'free']
      );

      if (!config.jwt.secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: result.insertId, email: email.toLowerCase() },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      const totalDuration = Date.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Signup completed in ${totalDuration}ms`);
      }

      return NextResponse.json({
        token,
        user: {
          id: result.insertId,
          name,
          email: email.toLowerCase(),
          plan: 'free'
        }
      });
    } catch (dbError: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Database error:', dbError);
      }
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.error(`Signup failed after ${totalDuration}ms:`, error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 