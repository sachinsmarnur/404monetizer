import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserJwtPayload extends JwtPayload {
  userId: string | number;
}

export async function verifyAuth(request: NextRequest | Request): Promise<string | number | null> {
  try {
    // First try NextAuth token
    const session = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (session?.userId) {
      const userId = typeof session.userId === 'string' ? parseInt(session.userId, 10) : session.userId;
      return userId;
    }

    // If no NextAuth session, try JWT token
    let token: string | null = null;

    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] ?? null : null;

    // If no token in header, try cookies
    if (!token && 'cookies' in request) {
      token = (request as NextRequest).cookies.get('token')?.value ?? null;
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    const userId = typeof decoded.userId === 'string' ? parseInt(decoded.userId, 10) : decoded.userId;
    return userId;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
} 