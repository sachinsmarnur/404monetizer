import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { sendWelcomePromoEmail } from '@/lib/email';

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      accessToken?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number;
    plan?: string;
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const [existingUsers] = await db.execute<RowDataPacket[]>(
            'SELECT id, name, email, plan FROM users WHERE email = ?',
            [user.email]
          );

          let userId: number;

          if (existingUsers.length === 0) {
            // Create new user if doesn't exist
            const [result] = await db.execute<ResultSetHeader>(
              'INSERT INTO users (name, email, password, plan) VALUES (?, ?, ?, ?)',
              [user.name, user.email, await bcrypt.hash(Math.random().toString(36), 10), 'free']
            );
            
            userId = result.insertId;

            // Send welcome email for new Google users (fallback if dashboard doesn't work)
            try {
              await sendWelcomePromoEmail(user.email!, user.name || 'User');
              
              // Record that welcome email was sent
              await db.execute<ResultSetHeader>(
                'INSERT INTO welcome_emails_sent (user_id, email, signup_method) VALUES (?, ?, ?)',
                [userId, user.email, 'google_oauth']
              );
            } catch (emailError: any) {
              console.error(`❌ Failed to send welcome email to ${user.email}:`, {
                error: emailError.message,
                code: emailError.code,
                command: emailError.command,
                response: emailError.response
              });
              // Don't fail the signin if email fails - dashboard will try again
            }
          } else {
            userId = existingUsers[0].id;
          }

          // Store the ID as a string in user object (as required by NextAuth)
          user.id = userId.toString();

          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        // Get user from database
        const [dbUsers] = await db.execute<RowDataPacket[]>(
          'SELECT id, name, email, plan FROM users WHERE email = ?',
          [user.email]
        );

        if (dbUsers.length > 0) {
          const dbUser = dbUsers[0] as RowDataPacket;
          // Store ID as number
          token.userId = dbUser.id;
          token.plan = dbUser.plan;
          
          // Store the access token
          if (account.access_token) {
            token.accessToken = account.access_token;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Ensure user ID is always a number
        session.user.id = token.userId as number;
        session.user.plan = token.plan;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign in
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 