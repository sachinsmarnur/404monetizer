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

interface PageDetailsRow extends RowDataPacket {
  id: number;
  title: string;
  user_id: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const resolvedParams = await params;
    const pageId = parseInt(resolvedParams.pageId);

    // Verify the page belongs to the user and get page details
    const [pages] = await db.query<PageDetailsRow[]>(
      'SELECT id, title, user_id FROM pages WHERE id = ? AND user_id = ?',
      [pageId, userId]
    );

    if (!Array.isArray(pages) || pages.length === 0) {
      return new NextResponse('Page not found or unauthorized', { status: 404 });
    }

    const page = pages[0];

    // Get today's analytics
    const today = new Date().toISOString().split('T')[0];
    const [todayAnalytics] = await db.query<AnalyticsRow[]>(
      `SELECT 
        COALESCE(SUM(views), 0) as views,
        COALESCE(SUM(conversions), 0) as conversions,
        COALESCE(SUM(revenue), 0) as revenue
      FROM analytics 
      WHERE user_id = ? AND page_id = ? AND date = ?`,
      [userId, pageId, today]
    );

    // Get total analytics for this page
    const [totalAnalytics] = await db.query<AnalyticsRow[]>(
      `SELECT 
        COALESCE(SUM(views), 0) as views,
        COALESCE(SUM(conversions), 0) as conversions,
        COALESCE(SUM(revenue), 0) as revenue
      FROM analytics 
      WHERE user_id = ? AND page_id = ?`,
      [userId, pageId]
    );

    // Get analytics over time (last 30 days)
    const [analyticsOverTime] = await db.query(
      `SELECT 
        DATE(date) as date,
        SUM(views) as views,
        SUM(conversions) as conversions,
        SUM(revenue) as revenue
      FROM analytics 
      WHERE user_id = ? AND page_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(date)
      ORDER BY date`,
      [userId, pageId]
    );

    // Get event counts for this page
    const [eventCounts] = await db.query(
      `SELECT 
        event_type,
        COUNT(*) as count
      FROM analytics_events 
      WHERE page_id = ?
      GROUP BY event_type`,
      [pageId]
    );

    // Get top referrers
    const [topReferrers] = await db.query(
      `SELECT 
        referrer_url,
        SUM(views) as views
      FROM analytics 
      WHERE user_id = ? AND page_id = ? AND referrer_url IS NOT NULL
      GROUP BY referrer_url
      ORDER BY views DESC
      LIMIT 10`,
      [userId, pageId]
    );

    // Get device breakdown
    const [deviceBreakdown] = await db.query(
      `SELECT 
        device_type,
        SUM(views) as views
      FROM analytics 
      WHERE user_id = ? AND page_id = ?
      GROUP BY device_type`,
      [userId, pageId]
    );

    // Get country breakdown
    const [countryBreakdown] = await db.query(
      `SELECT 
        country,
        SUM(views) as views
      FROM analytics 
      WHERE user_id = ? AND page_id = ? AND country IS NOT NULL
      GROUP BY country
      ORDER BY views DESC
      LIMIT 10`,
      [userId, pageId]
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

    const response = {
      page: {
        id: page.id,
        title: page.title
      },
      today: todayData,
      total: totalData,
      chartData: analyticsOverTime,
      events: eventCounts,
      referrers: topReferrers,
      devices: deviceBreakdown,
      countries: countryBreakdown
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Failed to fetch analytics' }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 