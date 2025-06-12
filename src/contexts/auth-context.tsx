'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useSession, signOut } from 'next-auth/react';

interface User {
  id: string | number;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  subscription_started_at?: string;
  plan_expires_at?: string;
  email_notifications?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Function to sync token between localStorage and cookies
  const syncToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
      Cookies.set('token', token, { expires: 7 });
    } else {
      localStorage.removeItem('token');
      Cookies.remove('token');
    }
  };

  // Function to make authenticated API requests
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    let token: string | null = null;

    // For NextAuth sessions, we don't need a token - the session is handled automatically
    if (status === 'authenticated' && session?.user) {
      // For NextAuth, we can rely on the session handling
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for NextAuth
      });
    }

    // For JWT tokens
    token = localStorage.getItem('token') || Cookies.get('token') || null;
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'API request failed');
    }

    return response;
  };

  // Check authentication status on mount and when session changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check NextAuth session
        if (status === 'authenticated' && session?.user) {
          const response = await makeAuthenticatedRequest('/api/user');
          const data = await response.json();
          
          setUser({
            id: session.user.id,
            name: session.user.name || '',
            email: session.user.email || '',
            plan: (session.user.plan as 'free' | 'pro') || 'free',
            subscription_started_at: data.user.subscription_started_at,
            plan_expires_at: data.user.plan_expires_at,
            email_notifications: data.user.email_notifications ?? true
          });
          setLoading(false);
          return;
        }

        // If NextAuth is loading, wait
        if (status === 'loading') {
          return;
        }

        // If no NextAuth session, check JWT token
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await makeAuthenticatedRequest('/api/user');
        const data = await response.json();
        
        setUser({
          ...data.user,
          email_notifications: data.user.email_notifications ?? true
        });
        syncToken(token);
      } catch (error) {
        console.error('Auth check error:', error);
        syncToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [session, status]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const refreshUser = async () => {
    try {
      // First check NextAuth session
      if (status === 'authenticated' && session?.user) {
        const response = await makeAuthenticatedRequest('/api/user');
        const data = await response.json();
        
        setUser({
          id: session.user.id,
          name: session.user.name || '',
          email: session.user.email || '',
          plan: (session.user.plan as 'free' | 'pro') || 'free',
          subscription_started_at: data.user.subscription_started_at,
          plan_expires_at: data.user.plan_expires_at,
          email_notifications: data.user.email_notifications ?? true
        });
        return;
      }

      // If no NextAuth session, check JWT token
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        return;
      }

      const response = await makeAuthenticatedRequest('/api/user');
      const data = await response.json();
      
      setUser({
        ...data.user,
        email_notifications: data.user.email_notifications ?? true
      });
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      syncToken(data.token);
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/auth/sign-in?registered=true');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clear NextAuth session if it exists
      if (status === 'authenticated') {
        await signOut({ redirect: false });
      }
      
      // Clear JWT token
      syncToken(null);
      setUser(null);
      await router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
    makeAuthenticatedRequest,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoggingOut && <LoadingScreen message="Signing out..." />}
      {children}
    </AuthContext.Provider>
  );
} 