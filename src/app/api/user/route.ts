import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  plan: string;
  subscription_started_at: string | null;
  plan_expires_at: string | null;
  email_notifications: boolean;
}

interface CountRow extends RowDataPacket {
  count: number;
}

interface AnalyticsRow extends RowDataPacket {
  total_views: number;
  total_conversions: number;
  total_revenue: number;
}

// Helper function to verify token
async function verifyToken(request: NextRequest) {
  // First try NextAuth token
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (session?.userId) {
    return { userId: session.userId };
  }

  // If no NextAuth session, try JWT token
  const headersList = request.headers;
  const authHeader = headersList.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  return jwt.verify(token, JWT_SECRET) as { userId: number };
}

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [users] = await db.execute<UserRow[]>(
      'SELECT id, name, email, plan, subscription_started_at, plan_expires_at, email_notifications FROM users WHERE id = ?',
      [userId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        subscription_started_at: user.subscription_started_at,
        plan_expires_at: user.plan_expires_at,
        email_notifications: user.email_notifications
      }
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  let connection;
  try {
    const userId = await verifyAuth(request);

    // Get a connection from the pool
    connection = await db.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    try {
      // First, verify the user exists
      const [users] = await connection.query<UserRow[]>(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      // Delete in order to respect foreign key constraints
      // We need to delete child records first, then parent records
      
      // 1. Delete collected emails for all user's pages
      const [emailsResult] = await connection.query<ResultSetHeader>(
        'DELETE FROM collected_emails WHERE page_id IN (SELECT id FROM pages WHERE user_id = ?)',
        [userId]
      );

      // 2. Delete analytics events for all user's pages
      const [eventsResult] = await connection.query<ResultSetHeader>(
        'DELETE FROM analytics_events WHERE page_id IN (SELECT id FROM pages WHERE user_id = ?)',
        [userId]
      );

      // 3. Delete analytics data for all user's pages
      const [analyticsPageResult] = await connection.query<ResultSetHeader>(
        'DELETE FROM analytics WHERE page_id IN (SELECT id FROM pages WHERE user_id = ?)',
        [userId]
      );

      // 4. Delete analytics data directly linked to user
      const [analyticsUserResult] = await connection.query<ResultSetHeader>(
        'DELETE FROM analytics WHERE user_id = ?',
        [userId]
      );

      // 5. Delete user's pages
      const [pagesResult] = await connection.query<ResultSetHeader>(
        'DELETE FROM pages WHERE user_id = ?',
        [userId]
      );

      // 6. Finally, delete the user
      const [userResult] = await connection.query<ResultSetHeader>(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      if (userResult.affectedRows === 0) {
        throw new Error('Failed to delete user - user may not exist');
      }

      // If we get here, everything succeeded, so commit the transaction
      await connection.commit();

      return NextResponse.json({ 
        success: true,
        message: 'Account and all associated data deleted successfully',
        deletedData: {
          user: 1,
          pages: pagesResult.affectedRows,
          emails: emailsResult.affectedRows,
          events: eventsResult.affectedRows,
          analytics: analyticsPageResult.affectedRows + analyticsUserResult.affectedRows
        }
      });

    } catch (error) {
      // If anything fails, roll back the transaction
      await connection.rollback();
      console.error('Transaction rolled back due to error:', error);
      throw error;
    }
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user account';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'No token provided' ? 401 : 
              errorMessage === 'User not found' ? 404 : 500 }
    );
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email_notifications } = body;

    // Validate input
    if (name !== undefined && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Name cannot be empty' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name.trim());
    }

    if (email_notifications !== undefined) {
      updates.push('email_notifications = ?');
      values.push(email_notifications);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    values.push(userId);

    await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Fetch updated user
    const [users] = await db.execute<UserRow[]>(
      'SELECT id, name, email, plan, subscription_started_at, plan_expires_at, email_notifications FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        subscription_started_at: user.subscription_started_at,
        plan_expires_at: user.plan_expires_at,
        email_notifications: user.email_notifications
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 