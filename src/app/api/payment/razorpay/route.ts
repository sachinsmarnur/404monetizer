import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { verifyAuth } from '@/lib/auth';
import { hasProAccess } from '@/lib/plan-utils';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Validate environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Initialize payment
export async function POST(request: NextRequest) {
  try {
    // Check environment variables first
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details
    const [users]: any = await db.query(
      'SELECT id, name, email, plan FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Check if user is already pro
    if (hasProAccess(user)) {
      return NextResponse.json({ error: "User is already on Pro plan" }, { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const options = {
      amount: 149900, // ₹1,499 in paise
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        user_id: userId.toString(),
        user_email: user.email,
        plan: 'pro'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      userName: user.name,
      userEmail: user.email,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again or contact support.' },
      { status: 500 }
    );
  }
}

// Verify payment and update user plan
export async function PUT(request: NextRequest) {
  try {
    // Check environment variables first
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = await request.json();

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Calculate expiration date (30 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Update user plan to pro with expiration date
    await db.query(
      'UPDATE users SET plan = ?, subscription_started_at = CURRENT_TIMESTAMP, plan_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['pro', expirationDate, userId]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified and plan upgraded successfully" 
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment. Please contact support if money was deducted.' },
      { status: 500 }
    );
  }
} 