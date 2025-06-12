import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (!request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  try {
    // First try NextAuth session
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (session) {
      return NextResponse.next();
    }

    // If no NextAuth session, try JWT token
    const cookieToken = request.cookies.get('token')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    // Verify JWT token
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', verified.payload.userId as string);

    // Clone the request with modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // If token was in header but not in cookie, set it in cookie
    if (headerToken && !cookieToken) {
      response.cookies.set('token', headerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });
    }

    return response;
  } catch (error) {
    // Clear invalid token from cookie
    const response = NextResponse.redirect(new URL('/auth/sign-in', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}; 