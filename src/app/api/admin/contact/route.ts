import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { hasProAccess } from '@/lib/plan-utils';

// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database to check if they're admin
    const connection = await db.getConnection();
    const [userRows] = await connection.execute(
      'SELECT id, email, plan FROM users WHERE id = ?',
      [decoded.userId]
    );
    connection.release();

    const users = userRows as any[];
    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    // For now, we'll consider users with Pro access as admins, or you can add an admin field
    return hasProAccess(user) ? user : null;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminAccess(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const offset = (page - 1) * limit;

    const connection = await db.getConnection();
    
    try {
      // Build query based on filters
      let whereClause = '';
      let params: any[] = [];
      
      if (status !== 'all') {
        whereClause = 'WHERE status = ?';
        params.push(status);
      }

      // Get total count
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
        params
      );
      const total = (countResult as any[])[0].total;

      // Get messages with pagination
      const [messages] = await connection.execute(
        `SELECT id, name, email, subject, message, status, created_at, updated_at 
         FROM contact_messages ${whereClause}
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      connection.release();

      return NextResponse.json({
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        success: true
      });

    } catch (dbError) {
      connection.release();
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAdminAccess(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { messageId, status } = await request.json();

    if (!messageId || !status || !['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid message ID or status' },
        { status: 400 }
      );
    }

    const connection = await db.getConnection();
    
    try {
      await connection.execute(
        'UPDATE contact_messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, messageId]
      );

      connection.release();

      return NextResponse.json({
        message: 'Message status updated successfully',
        success: true
      });

    } catch (dbError) {
      connection.release();
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to update message status' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin contact update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 