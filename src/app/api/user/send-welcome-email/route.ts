import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { sendWelcomePromoEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify token and get user
async function getAuthenticatedUser(req: NextRequest) {
  // First try NextAuth token
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (session?.userId && session?.email) {
    return {
      userId: session.userId,
      email: session.email as string,
      name: session.name as string || 'User',
      isGoogleAuth: true
    };
  }

  // If no NextAuth session, try JWT token
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  
  // Get user details from database
  const [users] = await db.execute<RowDataPacket[]>(
    'SELECT id, name, email FROM users WHERE id = ?',
    [decoded.userId]
  );

  if (users.length === 0) {
    throw new Error('User not found');
  }

  const user = users[0];
  return {
    userId: user.id,
    email: user.email,
    name: user.name || 'User',
    isGoogleAuth: false
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    // Check if welcome email has already been sent
    const [existingWelcomeEmails] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM welcome_emails_sent WHERE user_id = ?',
      [user.userId]
    );

    if (existingWelcomeEmails.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Welcome email already sent',
        alreadySent: true
      });
    }

    // Send welcome email
    try {
      await sendWelcomePromoEmail(user.email, user.name);

      // Record that welcome email was sent
      await db.execute<ResultSetHeader>(
        'INSERT INTO welcome_emails_sent (user_id, email, signup_method) VALUES (?, ?, ?)',
        [user.userId, user.email, user.isGoogleAuth ? 'google_oauth' : 'regular']
      );

      return NextResponse.json({
        success: true,
        message: 'Welcome email sent successfully',
        alreadySent: false
      });

    } catch (emailError: any) {
      console.error(`❌ Failed to send welcome email to ${user.email}:`, {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response
      });

      return NextResponse.json({
        success: false,
        message: 'Failed to send welcome email',
        error: emailError.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in send-welcome-email:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    }, { status: 401 });
  }
} 