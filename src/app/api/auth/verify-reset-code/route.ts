import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, resetCode } = await req.json();

    // Validate input
    if (!email || !resetCode) {
      return NextResponse.json(
        { error: 'Email and reset code are required' },
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

    return NextResponse.json({
      message: 'Reset code verified successfully',
      verified: true
    });

  } catch (error: any) {
    console.error('Verify reset code error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 