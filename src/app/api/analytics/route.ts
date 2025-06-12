import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import type { NextRequest } from 'next/server';

// Helper function to verify page ownership
async function verifyPageOwnership(pageId: number, userId: string | number) {
  const [pages]: any = await db.query(
    'SELECT id FROM pages WHERE id = ? AND user_id = ?',
    [pageId, userId]
  );

  if (!pages || pages.length === 0) {
    throw new Error('Page not found or unauthorized');
  }
}

// GET analytics data
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get('pageId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = `
      SELECT 
        DATE(date) as date,
        SUM(views) as views,
        SUM(conversions) as conversions,
        SUM(revenue) as revenue,
        GROUP_CONCAT(DISTINCT device_type) as device_types,
        GROUP_CONCAT(DISTINCT country) as countries,
        GROUP_CONCAT(DISTINCT referrer_url) as referrers
      FROM analytics
      WHERE user_id = ?
    `;
    const params: any[] = [userId];

    if (pageId) {
      query += ' AND page_id = ?';
      params.push(pageId);
    }

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY DATE(date) ORDER BY date DESC';

    const [rows]: any = await db.query(query, params);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

// POST new analytics data
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.page_id || !data.views) {
      return NextResponse.json(
        { error: 'Page ID and views are required' },
        { status: 400 }
      );
    }

    // Verify the page belongs to the user
    await verifyPageOwnership(data.page_id, userId);

    // Insert analytics data
    const [result]: any = await db.query(
      `INSERT INTO analytics (
        user_id,
        page_id,
        views,
        conversions,
        revenue,
        date,
        referrer_url,
        device_type,
        country
      ) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
      [
        userId,
        data.page_id,
        data.views,
        data.conversions || 0,
        data.revenue || 0,
        data.referrer_url || null,
        data.device_type || 'desktop',
        data.country || null
      ]
    );

    return NextResponse.json({
      id: result.insertId,
      user_id: userId,
      ...data,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error recording analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record analytics' },
      { status: error.message === 'No token provided' ? 401 :
              error.message === 'Page not found or unauthorized' ? 404 : 500 }
    );
  }
} 