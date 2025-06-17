import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { cachedOperations, cacheKeys, cache } from './cache';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserJwtPayload extends JwtPayload {
  userId: string | number;
}

export async function verifyAuth(request: NextRequest | Request): Promise<string | number | null> {
  const startTime = Date.now();
  
  try {
    // First try NextAuth token
    const session = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (session?.userId) {
      const userId = typeof session.userId === 'string' ? parseInt(session.userId, 10) : session.userId;
      
      // Cache the auth result for 5 minutes to reduce repeated verifications
      const cacheKey = `auth:${userId}:${Date.now() - (Date.now() % (5 * 60 * 1000))}`;
      cache.set(cacheKey, userId, 5 * 60 * 1000);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Auth verified via NextAuth in ${Date.now() - startTime}ms`);
      }
      
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
      if (process.env.NODE_ENV === 'development') {
        console.log(`Auth failed: No token found in ${Date.now() - startTime}ms`);
      }
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    const userId = typeof decoded.userId === 'string' ? parseInt(decoded.userId, 10) : decoded.userId;
    
    // Cache the auth result
    const cacheKey = `auth:${userId}:${Date.now() - (Date.now() % (5 * 60 * 1000))}`;
    cache.set(cacheKey, userId, 5 * 60 * 1000);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Auth verified via JWT in ${Date.now() - startTime}ms`);
    }
    
    return userId;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Auth verification failed in ${Date.now() - startTime}ms:`, error);
    }
    return null;
  }
}

// Enhanced user verification with caching
export async function verifyUserExists(userId: string | number): Promise<boolean> {
  try {
    const user = await cachedOperations.getUserById(userId);
    return user !== null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('User existence verification failed:', error);
    }
    return false;
  }
}

// Get cached user data
export async function getCachedUser(userId: string | number) {
  return await cachedOperations.getUserById(userId);
}

// Invalidate user cache (call when user data changes)
export function invalidateUserAuth(userId: string | number) {
  cachedOperations.invalidateUser(userId);
  
  // Also clear auth cache entries
  const now = Date.now();
  const currentWindow = now - (now % (5 * 60 * 1000));
  cache.delete(`auth:${userId}:${currentWindow}`);
  cache.delete(`auth:${userId}:${currentWindow - (5 * 60 * 1000)}`); // Previous window
} 