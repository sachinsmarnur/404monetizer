import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test basic connection
    const connection = await db.getConnection();
    
    // Test if users table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'users'"
    );
    
    // Test if we can query the users table
    const [users] = await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    );
    
    connection.release();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      tables: tables,
      userCount: users
    });
    
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      errno: error.errno
    }, { status: 500 });
  }
} 