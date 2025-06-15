import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

// Add CORS headers to allow external domains to track analytics
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { eventType, eventData, isExternalAccess } = body;

    if (!eventType) {
      const errorResponse = NextResponse.json(
        { error: "Event type is required" },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Validate event type
    const validEventTypes = [
      "page_view",
      "affiliate_click", 
      "content_unlock",
      "email_collected",
      "countdown_click",
      "ad_impression",
      "ad_click",
      "donation_click",
      "sponsored_click",
      "exit_intent_shown",
      "exit_intent_dismissed",
      "newsletter_signup",
      "lead_magnet_download",
      "product_click"
    ];

    if (!validEventTypes.includes(eventType)) {
      const errorResponse = NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Get the page to check if it exists and is active
    const [pages]: any = await db.query(
      "SELECT id, user_id FROM pages WHERE id = ? AND status = 'active'",
      [resolvedParams.id]
    );

    if (!pages || pages.length === 0) {
      const errorResponse = NextResponse.json(
        { error: "Page not found or inactive" },
        { status: 404 }
      );
      return addCorsHeaders(errorResponse);
    }

    const page = pages[0];

    // Check if this is a preview access (authenticated user viewing their own page)
    // Only track analytics for external access or if explicitly marked as external
    let shouldTrackAnalytics = true;
    
    if (!isExternalAccess) {
      try {
        const userId = await verifyAuth(request);
        // If user is authenticated and owns this page, don't track analytics
        if (userId && userId == page.user_id) {
          shouldTrackAnalytics = false;
        }
      } catch (error) {
        // If auth verification fails, treat as external access
        shouldTrackAnalytics = true;
      }
    }

    // Always record the detailed event for debugging, but only update analytics if it's external access
    await db.query(
      "INSERT INTO analytics_events (page_id, event_type, event_data, is_external_access) VALUES (?, ?, ?, ?)",
      [resolvedParams.id, eventType, JSON.stringify(eventData || {}), shouldTrackAnalytics]
    );

    // Only update analytics tables if this is external access
    if (shouldTrackAnalytics) {
      // For page views, also update the analytics table
      if (eventType === "page_view") {
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already an analytics entry for today
        const [existingAnalytics]: any = await db.query(
          "SELECT id, views FROM analytics WHERE user_id = ? AND page_id = ? AND date = ?",
          [page.user_id, resolvedParams.id, today]
        );

        if (existingAnalytics && existingAnalytics.length > 0) {
          // Update existing entry
          await db.query(
            "UPDATE analytics SET views = views + 1 WHERE id = ?",
            [existingAnalytics[0].id]
          );
        } else {
          // Create new entry
          await db.query(
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
            ) VALUES (?, ?, 1, 0, 0, ?, ?, ?, ?)`,
            [
              page.user_id,
              resolvedParams.id,
              today,
              eventData?.referrerUrl || null,
              eventData?.deviceType || 'desktop',
              eventData?.country || null
            ]
          );
        }
      }

      // For conversion events, update conversions and revenue
      const conversionEvents = [
        "email_collected", "affiliate_click", "countdown_click", "content_unlock", 
        "donation_click", "ad_click", "exit_intent_dismissed", "sponsored_click"
      ];
      
      if (conversionEvents.includes(eventType)) {
        const today = new Date().toISOString().split('T')[0];
        const estimatedRevenue = parseFloat(eventData?.estimatedRevenue || 0);
        
        // Check if there's already an analytics entry for today
        const [existingAnalytics]: any = await db.query(
          "SELECT id, revenue FROM analytics WHERE user_id = ? AND page_id = ? AND date = ?",
          [page.user_id, resolvedParams.id, today]
        );

        if (existingAnalytics && existingAnalytics.length > 0) {
          // Update existing entry with conversion and revenue
          await db.query(
            "UPDATE analytics SET conversions = conversions + 1, revenue = revenue + ? WHERE id = ?",
            [estimatedRevenue, existingAnalytics[0].id]
          );
        } else {
          // Create new entry with 1 conversion and estimated revenue
          await db.query(
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
            ) VALUES (?, ?, 0, 1, ?, ?, ?, ?, ?)`,
            [
              page.user_id, 
              resolvedParams.id, 
              estimatedRevenue, 
              today,
              eventData?.referrerUrl || null,
              eventData?.deviceType || 'desktop',
              eventData?.country || null
            ]
          );
        }
      }
    }

    const response = NextResponse.json({ 
      message: "Event recorded successfully",
      pageId: resolvedParams.id,
      eventType,
      tracked: shouldTrackAnalytics,
      timestamp: new Date().toISOString()
    });
    
    return addCorsHeaders(response);
  } catch (error) {
    console.error("Error recording event:", error);
    const errorResponse = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const eventType = searchParams.get("eventType");

    // Build the query
    let query = "SELECT * FROM analytics_events WHERE page_id = ?";
    const queryParams: any[] = [params.id];

    if (startDate) {
      query += " AND created_at >= ?";
      queryParams.push(startDate);
    }

    if (endDate) {
      query += " AND created_at <= ?";
      queryParams.push(endDate);
    }

    if (eventType) {
      query += " AND event_type = ?";
      queryParams.push(eventType);
    }

    query += " ORDER BY created_at DESC LIMIT 100";

    // Get the events
    const [events] = await db.query(query, queryParams);

    // Get event counts by type
    const [eventCounts] = await db.query(
      `SELECT event_type, COUNT(*) as count 
       FROM analytics_events 
       WHERE page_id = ? 
       GROUP BY event_type`,
      [params.id]
    );

    return NextResponse.json({
      events,
      eventCounts
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 