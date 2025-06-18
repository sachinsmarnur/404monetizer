import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page404 } from "@/types/page";
import { 
  handleDatabaseError, 
  createUnauthorizedResponse, 
  createNotFoundResponse,
  createValidationErrorResponse,
  createForbiddenResponse,
  handleError 
} from "@/lib/error-handler";

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return createUnauthorizedResponse();
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
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from either NextAuth session or JWT token
    const userId = await verifyAuth(request);
    if (!userId) {
      return createUnauthorizedResponse();
    }

    // Check user plan and page limits
    const [userRows]: any = await db.query(
      "SELECT plan FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return createNotFoundResponse("User");
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
      return createForbiddenResponse("Free plan allows only 1 page. Upgrade to Pro to create more pages.");
    } else if (userPlan === 'pro' && existingPageCount >= 50) {
      return createForbiddenResponse("You have reached the maximum limit of 50 pages for the Pro plan.");
    }

    // userId is already a number from verifyAuth
    const data = await request.json();

    // Validate required fields
    if (!data.title) {
      return createValidationErrorResponse("Title is required");
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
    // Handle specific error types
    if (error.message.includes('validation')) {
      return createValidationErrorResponse(error.message);
    }
    
    return handleError(error);
  }
} 