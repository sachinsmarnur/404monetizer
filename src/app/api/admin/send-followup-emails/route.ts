import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { sendFollowUpMarketingEmail } from '@/lib/email';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// Admin API key verification
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secure-admin-key';

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    const providedKey = authHeader?.replace('Bearer ', '');
    
    if (!providedKey || providedKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting follow-up email campaign...');

    // Get users who haven't received follow-up emails and registered more than 2 days ago
    const [eligibleUsers] = await db.execute<RowDataPacket[]>(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        DATEDIFF(NOW(), u.created_at) as days_since_signup
      FROM users u
      WHERE u.created_at <= DATE_SUB(NOW(), INTERVAL 2 DAY)
        AND u.id NOT IN (
          SELECT f.user_id 
          FROM followup_emails_sent f 
          WHERE f.email_type = 're_engagement'
        )
        AND u.id IN (
          SELECT w.user_id 
          FROM welcome_emails_sent w
        )
      ORDER BY u.created_at ASC
      LIMIT 100
    `);

    console.log(`📧 Found ${eligibleUsers.length} users eligible for follow-up emails`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const user of eligibleUsers) {
      try {
        console.log(`📧 Sending follow-up email to ${user.email} (${user.days_since_signup} days since signup)`);
        
        // Send follow-up email
        await sendFollowUpMarketingEmail(
          user.email,
          user.name || 'User',
          user.days_since_signup
        );

        // Record that follow-up email was sent
        await db.execute<ResultSetHeader>(
          'INSERT INTO followup_emails_sent (user_id, email, email_type, days_since_signup) VALUES (?, ?, ?, ?)',
          [user.id, user.email, 're_engagement', user.days_since_signup]
        );

        successCount++;
        console.log(`✅ Follow-up email sent successfully to ${user.email}`);

        // Add a small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (emailError: any) {
        errorCount++;
        const errorMsg = `❌ Failed to send follow-up email to ${user.email}: ${emailError.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    console.log(`📊 Follow-up email campaign completed: ${successCount} sent, ${errorCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Follow-up email campaign completed`,
      stats: {
        eligible_users: eligibleUsers.length,
        emails_sent: successCount,
        errors: errorCount,
        error_details: errors
      }
    });

  } catch (error: any) {
    console.error('❌ Error in follow-up email campaign:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to run follow-up email campaign',
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint to check eligible users without sending emails
export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    const providedKey = authHeader?.replace('Bearer ', '');
    
    if (!providedKey || providedKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get users who would be eligible for follow-up emails
    const [eligibleUsers] = await db.execute<RowDataPacket[]>(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        DATEDIFF(NOW(), u.created_at) as days_since_signup
      FROM users u
      WHERE u.created_at <= DATE_SUB(NOW(), INTERVAL 2 DAY)
        AND u.id NOT IN (
          SELECT f.user_id 
          FROM followup_emails_sent f 
          WHERE f.email_type = 're_engagement'
        )
        AND u.id IN (
          SELECT w.user_id 
          FROM welcome_emails_sent w
        )
      ORDER BY u.created_at ASC
    `);

    // Get statistics about previously sent follow-up emails
    const [stats] = await db.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total_followup_emails_sent,
        COUNT(DISTINCT user_id) as unique_users_reached,
        AVG(days_since_signup) as avg_days_since_signup,
        MAX(sent_at) as last_sent_at
      FROM followup_emails_sent
      WHERE email_type = 're_engagement'
    `);

    return NextResponse.json({
      success: true,
      eligible_users: eligibleUsers,
      eligible_count: eligibleUsers.length,
      previous_stats: stats[0] || {
        total_followup_emails_sent: 0,
        unique_users_reached: 0,
        avg_days_since_signup: 0,
        last_sent_at: null
      }
    });

  } catch (error: any) {
    console.error('❌ Error checking eligible users:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check eligible users',
      error: error.message
    }, { status: 500 });
  }
} 