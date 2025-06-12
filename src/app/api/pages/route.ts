import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page404 } from "@/types/page";

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // userId is already a number from verifyAuth
    const [rows]: any = await db.query(
      "SELECT * FROM pages WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    // Parse JSON fields for each page safely
    const parseSafeJson = (jsonString: string | null | undefined, fallback: any = {}) => {
      try {
        if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
          return fallback;
        }
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('JSON parse error:', error, 'for string:', jsonString);
        return fallback;
      }
    };

    const pages = rows.map((page: any) => ({
      ...page,
      social_links: parseSafeJson(page.social_links, {}),
      monetization_features: parseSafeJson(page.monetization_features, {}),
    }));

    return NextResponse.json(pages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching pages:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from either NextAuth session or JWT token
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user plan and page limits
    const [userRows]: any = await db.query(
      "SELECT plan FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPlan = userRows[0].plan;

    // Count existing pages for this user
    const [pageCountRows]: any = await db.query(
      "SELECT COUNT(*) as count FROM pages WHERE user_id = ?",
      [userId]
    );
    
    const existingPageCount = pageCountRows[0].count;

    // Check plan limits
    if (userPlan === 'free' && existingPageCount >= 1) {
      return NextResponse.json(
        { error: "Free plan allows only 1 page. Upgrade to Pro to create more pages." },
        { status: 403 }
      );
    } else if (userPlan === 'pro' && existingPageCount >= 50) {
      return NextResponse.json(
        { error: "You have reached the maximum limit of 50 pages for the Pro plan." },
        { status: 403 }
      );
    }

    // userId is already a number from verifyAuth
    const data = await request.json();

    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: "validation_error: Title is required" },
        { status: 400 }
      );
    }

    // Insert new page
    const [result]: any = await db.query(
      `INSERT INTO pages (
        user_id,
        title,
        description,
        logo,
        category,
        font,
        theme,
        social_links,
        monetization_features,
        custom_css,
        custom_js,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.title,
        data.description || '',
        data.logo || '',
        data.category || 'E-commerce',
        data.font || 'Inter',
        data.theme || 'default',
        JSON.stringify(data.social_links || {}),
        JSON.stringify(data.monetization_features || {}),
        data.custom_css || '',
        data.custom_js || '',
        data.status || 'active'
      ]
    );

    if (!result?.insertId) {
      throw new Error('Failed to insert page into database');
    }

    return NextResponse.json({
      id: result.insertId,
      user_id: userId,
      ...data,
      created_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error creating page:", error);
    
    // Handle specific error types
    if (error.message.includes('validation')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
} 