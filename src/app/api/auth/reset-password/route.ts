import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, resetCode, newPassword } = await req.json();

    // Validate input
    if (!email || !resetCode || !newPassword) {
      return NextResponse.json(
        { error: 'Email, reset code, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists and reset code matches
    const [users]: any = await db.execute(
      'SELECT id, email, reset_token, reset_token_expires FROM users WHERE email = ? AND reset_token = ?',
      [email, resetCode]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid reset code' },
        { status: 400 }
      );
    }

    const user = users[0];

    // Check if reset code has expired
    const now = new Date();
    const expiryTime = new Date(user.reset_token_expires);

    if (now > expiryTime) {
      // Clear expired token
      await db.execute(
        'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [user.id]
      );

      return NextResponse.json(
        { error: 'Reset code has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Get user name for success email
    const [userDetails]: any = await db.execute(
      'SELECT name FROM users WHERE id = ?',
      [user.id]
    );

    // Update password and clear reset token
    await db.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    // Send password reset success email
    try {
      if (userDetails.length > 0) {
        const { sendPasswordResetSuccessEmail } = await import('@/lib/email');
        await sendPasswordResetSuccessEmail(email, userDetails[0].name);
      }
    } catch (emailError) {
      console.error('Failed to send success email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'Password reset successfully'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 