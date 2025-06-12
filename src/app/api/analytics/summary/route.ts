import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { NextRequest } from 'next/server';

interface AnalyticsRow extends RowDataPacket {
  views: number;
  conversions: number;
  revenue: number;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get today's analytics across all user pages
    const today = new Date().toISOString().split('T')[0];
    const [todayAnalytics] = await db.query<AnalyticsRow[]>(
      `SELECT 
        COALESCE(SUM(views), 0) as views,
        COALESCE(SUM(conversions), 0) as conversions,
        COALESCE(SUM(revenue), 0) as revenue
      FROM analytics 
      WHERE user_id = ? AND date = ?`,
      [userId, today]
    );

    // Get total analytics across all user pages
    const [totalAnalytics] = await db.query<AnalyticsRow[]>(
      `SELECT 
        COALESCE(SUM(views), 0) as views,
        COALESCE(SUM(conversions), 0) as conversions,
        COALESCE(SUM(revenue), 0) as revenue
      FROM analytics 
      WHERE user_id = ?`,
      [userId]
    );

    // Get top referrers across all pages
    const [topReferrers] = await db.query(
      `SELECT 
        referrer_url,
        SUM(views) as views
      FROM analytics 
      WHERE user_id = ? AND referrer_url IS NOT NULL
      GROUP BY referrer_url
      ORDER BY views DESC
      LIMIT 10`,
      [userId]
    );

    // Get device breakdown across all pages
    const [deviceBreakdown] = await db.query(
      `SELECT 
        device_type,
        SUM(views) as views
      FROM analytics 
      WHERE user_id = ?
      GROUP BY device_type`,
      [userId]
    );

    // Get country breakdown across all pages
    const [countryBreakdown] = await db.query(
      `SELECT 
        country,
        SUM(views) as views
      FROM analytics 
      WHERE user_id = ? AND country IS NOT NULL
      GROUP BY country
      ORDER BY views DESC
      LIMIT 10`,
      [userId]
    );

    // Ensure numeric values in the response
    const todayData = Array.isArray(todayAnalytics) && todayAnalytics.length > 0 ? {
      views: Number(todayAnalytics[0].views),
      conversions: Number(todayAnalytics[0].conversions),
      revenue: Number(todayAnalytics[0].revenue)
    } : { views: 0, conversions: 0, revenue: 0 };

    const totalData = Array.isArray(totalAnalytics) && totalAnalytics.length > 0 ? {
      views: Number(totalAnalytics[0].views),
      conversions: Number(totalAnalytics[0].conversions),
      revenue: Number(totalAnalytics[0].revenue)
    } : { views: 0, conversions: 0, revenue: 0 };

    return NextResponse.json({
      today: todayData,
      total: totalData,
      referrers: topReferrers,
      devices: deviceBreakdown,
      countries: countryBreakdown
    });

  } catch (error: any) {
    console.error('Error fetching summary analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch summary analytics' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
} 