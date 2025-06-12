import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page404 } from "@/types/page";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM pages WHERE id = ? AND user_id = ?",
      [resolvedParams.id, userId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const page = rows[0];

    // Parse JSON fields safely
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

    return NextResponse.json({
      ...page,
      social_links: parseSafeJson(page.social_links, {}),
      monetization_features: parseSafeJson(page.monetization_features, {}),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching page:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Access monetization features using the snake_case key that frontend sends
    const monetizationFeatures = body.monetization_features;

    // Validate monetization features
    if (monetizationFeatures) {
      // Validate affiliate links
      if (monetizationFeatures.affiliateLinks) {
        for (const link of monetizationFeatures.affiliateLinks) {
          if (!link.title || !link.url) {
            return NextResponse.json(
              { error: "Invalid affiliate link data" },
              { status: 400 }
            );
          }
        }
      }

      // Validate AdSense
      if (monetizationFeatures.adSense?.enabled && !monetizationFeatures.adSense.code) {
        return NextResponse.json(
          { error: "AdSense code is required when enabled" },
          { status: 400 }
        );
      }

      // Validate content lock
      if (monetizationFeatures.contentLock?.enabled && !monetizationFeatures.contentLock.content) {
        return NextResponse.json(
          { error: "Locked content is required when content lock is enabled" },
          { status: 400 }
        );
      }

      // Validate email collection
      if (monetizationFeatures.emailCollection?.enabled) {
        const { title, description, buttonText, emailPlaceholder } = monetizationFeatures.emailCollection;
        if (!title || !description || !buttonText || !emailPlaceholder) {
          return NextResponse.json(
            { error: "All email collection fields are required when enabled" },
            { status: 400 }
          );
        }
      }

      // Validate countdown offer
      if (monetizationFeatures.countdownOffer?.enabled) {
        const { title, description, expiryDate, buttonText, redirectUrl } = monetizationFeatures.countdownOffer;
        if (!title || !description || !expiryDate || !buttonText || !redirectUrl) {
          return NextResponse.json(
            { error: "All countdown offer fields are required when enabled" },
            { status: 400 }
          );
        }
      }
    }

    // Update the page
    await db.query(
      `UPDATE pages 
       SET title = ?, 
           description = ?, 
           logo = ?, 
           category = ?, 
           font = ?,
           theme = ?,
           social_links = ?, 
           monetization_features = ?, 
           custom_css = ?, 
           custom_js = ?, 
           status = ?
       WHERE id = ? AND user_id = ?`,
      [
        body.title,
        body.description,
        body.logo,
        body.category,
        body.font,
        body.theme,
        JSON.stringify(body.social_links),
        JSON.stringify(monetizationFeatures),
        body.custom_css,
        body.custom_js,
        body.status,
        resolvedParams.id,
        userId,
      ]
    );

    return NextResponse.json({ message: "Page updated successfully" });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.query("DELETE FROM pages WHERE id = ? AND user_id = ?", [
      resolvedParams.id,
      userId,
    ]);

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 