import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Check if user already exists
      const [existingUsers] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }

      // Insert new user
      const [result] = await db.execute<ResultSetHeader>(
        'INSERT INTO users (name, email, password, plan) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'free']
      );

      if (!config.jwt.secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: result.insertId, email },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        token,
        user: {
          id: result.insertId,
          name,
          email,
          plan: 'free'
        }
      });
    } catch (dbError: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Database error:', dbError);
      }
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Signup error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 