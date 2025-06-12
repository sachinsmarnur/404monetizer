import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [users]: any = await db.execute(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json({
        message: 'If an account with that email exists, we sent a reset code.'
      });
    }

    const user = users[0];

    // Generate 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 15 minutes from now
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

    // Update user with reset token
    await db.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, expiryTime, user.id]
    );

    // Send email with reset code
    try {
      // Dynamic import to handle potential module loading issues
      const { sendPasswordResetEmail } = await import('@/lib/email');
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Continue anyway to not reveal email service issues
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we sent a reset code.'
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 