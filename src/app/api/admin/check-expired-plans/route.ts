import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface ExpiredUser extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  plan_expires_at: string;
}

interface PageRow extends RowDataPacket {
  id: number;
  title: string;
}

// Function to send plan expired email notification
async function sendPlanExpiredEmail(email: string, name: string, expiredDate: string) {
  try {
    // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
    console.log(`Plan expired notification would be sent to ${email} for user ${name} (expired: ${expiredDate})`);
    
    // For now, we'll just log it. In production, implement actual email sending:
    /*
    await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: '404 Monetizer - Pro Plan Expired',
        template: 'plan-expired',
        data: { name, expiredDate }
      })
    });
    */
  } catch (error) {
    console.error('Failed to send plan expired email:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // For security, you might want to add API key verification here
    const adminApiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
    const expectedApiKey = process.env.ADMIN_API_KEY;
    
    if (expectedApiKey && adminApiKey !== expectedApiKey) {
      // For cron jobs, verify admin access
      const userId = await verifyAuth(request);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has admin privileges (Pro plan for now)
      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT plan FROM users WHERE id = ?',
        [userId]
      );

      if (userRows.length === 0 || userRows[0].plan !== 'pro') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    console.log('🔍 Checking for expired Pro plans...');

    // Find expired Pro users
    const [expiredUsers] = await db.execute<ExpiredUser[]>(
      'SELECT id, email, name, plan_expires_at FROM users WHERE plan = "pro" AND plan_expires_at < NOW()'
    );

    const processedUsers = [];

    for (const user of expiredUsers) {
      console.log(`📉 Processing expired plan for user: ${user.email}`);

      try {
        // Start transaction for this user
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
          // Downgrade to free plan
          await connection.execute(
            'UPDATE users SET plan = "free", plan_expires_at = NULL WHERE id = ?',
            [user.id]
          );

          // Get all user's pages (ordered by creation date)
          const [userPages] = await connection.execute<PageRow[]>(
            'SELECT id, title FROM pages WHERE user_id = ? ORDER BY created_at ASC',
            [user.id]
          );

          // Keep the first page active, suspend the rest
          if (userPages.length > 1) {
            const pagesToSuspend = userPages.slice(1).map(page => page.id);
            
            if (pagesToSuspend.length > 0) {
              await connection.execute(
                `UPDATE pages SET status = 'suspended' WHERE id IN (${pagesToSuspend.map(() => '?').join(',')})`,
                pagesToSuspend
              );
            }

            console.log(`📄 Suspended ${pagesToSuspend.length} excess pages for user ${user.email}`);
          }

          // Commit transaction
          await connection.commit();
          connection.release();

          // Send notification email
          await sendPlanExpiredEmail(user.email, user.name, user.plan_expires_at);

          processedUsers.push({
            id: user.id,
            email: user.email,
            name: user.name,
            expiredDate: user.plan_expires_at,
            suspendedPages: Math.max(0, userPages.length - 1)
          });

        } catch (error) {
          await connection.rollback();
          connection.release();
          throw error;
        }

      } catch (error) {
        console.error(`❌ Failed to process expired plan for user ${user.email}:`, error);
        // Continue with other users even if one fails
      }
    }

    console.log(`✅ Processed ${processedUsers.length} expired plans`);

    return NextResponse.json({
      success: true,
      processed: processedUsers.length,
      users: processedUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error checking plan expiration:', error);
    return NextResponse.json(
      { error: 'Failed to process expired plans' },
      { status: 500 }
    );
  }
}

// Manual trigger endpoint for testing
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin privileges
    const [userRows] = await db.execute<RowDataPacket[]>(
      'SELECT plan FROM users WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0 || userRows[0].plan !== 'pro') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Call the GET method
    return await GET(request);

  } catch (error) {
    console.error('Error in manual expiration check:', error);
    return NextResponse.json(
      { error: 'Failed to process expired plans' },
      { status: 500 }
    );
  }
} 