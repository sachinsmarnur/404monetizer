import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Start a transaction to ensure data consistency
    await db.query('START TRANSACTION');

    try {
      // Clear analytics data for all user pages
      const [result]: any = await db.query(
        'DELETE FROM analytics WHERE user_id = ?',
        [userId]
      );

      // Also clear analytics events for all user pages
      await db.query(
        `DELETE ae FROM analytics_events ae 
         INNER JOIN pages p ON ae.page_id = p.id 
         WHERE p.user_id = ?`,
        [userId]
      );

      // Commit the transaction
      await db.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Analytics data cleared successfully',
        deletedRows: result.affectedRows
      });

    } catch (error) {
      // Rollback the transaction on error
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error clearing analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear analytics' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
} 