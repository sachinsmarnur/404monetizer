import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get the page to check if it exists and get monetization settings
    const [page]: any = await db.query(
      "SELECT monetization_features FROM pages WHERE id = ?",
      [resolvedParams.id]
    );

    if (!page) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    // Parse monetization features
    const monetizationFeatures = JSON.parse(page.monetization_features);
    
    // Check if email collection is enabled
    if (!monetizationFeatures.emailCollection?.enabled) {
      return NextResponse.json(
        { error: "Email collection is not enabled for this page" },
        { status: 400 }
      );
    }

    // Store the email
    await db.query(
      "INSERT INTO collected_emails (page_id, email, source) VALUES (?, ?, ?)",
      [resolvedParams.id, email, "form"]
    );

    // Record analytics event
    await db.query(
      "INSERT INTO analytics_events (page_id, event_type, event_data) VALUES (?, ?, ?)",
      [resolvedParams.id, "email_collected", JSON.stringify({ email })]
    );

    // If webhook URL is configured, send the email to it
    const webhookUrl = monetizationFeatures.emailCollection.webhookUrl;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            pageId: resolvedParams.id,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Error sending webhook:", error);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({
      message: "Email collected successfully",
      successMessage: monetizationFeatures.emailCollection.successMessage
    });
  } catch (error) {
    console.error("Error collecting email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 