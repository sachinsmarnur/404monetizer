import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const secretKey = config.recaptcha.secretKey;
    if (!secretKey) {
      console.error('reCAPTCHA secret key not configured');
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Verify the token with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'reCAPTCHA verification failed',
          details: verifyData['error-codes'] 
        },
        { status: 400 }
      );
    }

    // Check the score (reCAPTCHA v3 provides scores from 0.0 to 1.0)
    const score = verifyData.score || 0;
    const threshold = 0.5; // Adjust this threshold based on your needs
    const isBot = score < threshold;

    // Log for monitoring (remove in production or implement proper logging)
    console.log(`reCAPTCHA verification - Score: ${score}, Action: ${action}, Bot: ${isBot}`);

    return NextResponse.json({
      success: true,
      score,
      isBot,
      action: verifyData.action,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 