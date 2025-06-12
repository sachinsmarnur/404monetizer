import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify token
async function verifyToken(req: NextRequest) {
  // First try NextAuth token
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (session?.userId) {
    return { userId: session.userId };
  }

  // If no NextAuth session, try JWT token
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  return jwt.verify(token, JWT_SECRET) as { userId: number };
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await verifyToken(req);
    const {
      name,
      email,
      current_password,
      new_password,
      email_notifications,
    } = await req.json();

    // Get current user data
    const [users]: any = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    // If changing password, verify current password
    if (new_password) {
      if (!current_password) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(current_password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }

    // If email is being changed, check if it's already in use
    if (email && email !== user.email) {
      const [existingUsers]: any = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    // Prepare update fields
    const updates: any = {};
    const params: any[] = [];
    const setClauses: string[] = [];

    if (name) {
      setClauses.push('name = ?');
      params.push(name);
      updates.name = name;
    }

    if (email) {
      setClauses.push('email = ?');
      params.push(email);
      updates.email = email;
    }

    if (new_password) {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      setClauses.push('password = ?');
      params.push(hashedPassword);
    }

    if (typeof email_notifications === 'boolean') {
      setClauses.push('email_notifications = ?');
      params.push(email_notifications);
      updates.email_notifications = email_notifications;
    }

    // Add userId to params
    params.push(userId);

    // Update user in database
    if (setClauses.length > 0) {
      await db.query(
        `UPDATE users SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        params
      );
    }

    // Return updated user data (excluding password)
    const updatedUser = {
      ...user,
      ...updates
    };
    delete updatedUser.password;
    
    return NextResponse.json({
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
} 