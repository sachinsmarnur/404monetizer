import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { handleError, createNotFoundResponse } from "@/lib/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const [rows]: any = await db.query(
      "SELECT * FROM pages WHERE id = ? AND status = 'active'",
      [resolvedParams.id]
    );

    if (!rows || rows.length === 0) {
      return createNotFoundResponse("Page");
    }

    const page = rows[0];

    // Parse JSON fields and return the page data
    const parseSafeJson = (jsonString: string | null | undefined, fallback: any = {}) => {
      try {
        if (!jsonString || jsonString === 'undefined' || jsonString === 'null' || jsonString.trim() === '') {
          return fallback;
        }
        const parsed = JSON.parse(jsonString);
        return parsed !== null && parsed !== undefined ? parsed : fallback;
      } catch (error) {
        console.error('JSON parse error:', error, 'for string:', jsonString);
        return fallback;
      }
    };

    const responseData = {
      ...page,
      social_links: parseSafeJson(page.social_links, {}),
      monetization_features: parseSafeJson(page.monetization_features, {}),
    };

    // Ensure no undefined values in the response
    Object.keys(responseData).forEach(key => {
      if (responseData[key] === undefined) {
        responseData[key] = null;
      }
    });

    return NextResponse.json(responseData);
  } catch (error) {
    return handleError(error);
  }
} 