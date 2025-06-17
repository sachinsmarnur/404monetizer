// Simple in-memory cache implementation
// In production, replace with Redis for better performance and persistence

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000; // Maximum number of items to store
  
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    
    // Clean up expired items every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  // Set a cache entry
  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache SET: ${key} (TTL: ${ttlMs}ms)`);
    }
  }

  // Get a cache entry
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cache MISS: ${key}`);
      }
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cache EXPIRED: ${key}`);
      }
      return null;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache HIT: ${key}`);
    }

    return item.data as T;
  }

  // Delete a cache entry
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (process.env.NODE_ENV === 'development' && deleted) {
      console.log(`Cache DELETE: ${key}`);
    }
    return deleted;
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log('Cache CLEARED');
    }
  }

  // Get cache stats
  getStats(): { size: number; hitRate?: number } {
    return {
      size: this.cache.size,
      // Hit rate tracking would require additional counters
    };
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (process.env.NODE_ENV === 'development' && cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired items`);
    }
  }

  // Cache with automatic database fallback
  async getOrSet<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttlMs = 5 * 60 * 1000
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, fetch from database
    try {
      const data = await fetchFn();
      this.set(key, data, ttlMs);
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Cache getOrSet failed for ${key}:`, error);
      }
      throw error;
    }
  }
}

// Create global cache instance
export const cache = new SimpleCache(1000);

// Cache key generators for consistent naming
export const cacheKeys = {
  user: (userId: string | number) => `user:${userId}`,
  userByEmail: (email: string) => `user:email:${email.toLowerCase()}`,
  pageAnalytics: (pageId: string) => `analytics:page:${pageId}`,
  userPages: (userId: string | number) => `pages:user:${userId}`,
  planAccess: (userId: string | number) => `plan:${userId}`,
};

// Cached database operations
export const cachedOperations = {
  // Cache user data for 10 minutes
  getUserById: async (userId: string | number) => {
    return cache.getOrSet(
      cacheKeys.user(userId),
      async () => {
        const { db } = await import('./db');
        const [users]: any = await db.execute(
          'SELECT id, name, email, plan, created_at FROM users WHERE id = ?',
          [userId]
        );
        return users[0] || null;
      },
      10 * 60 * 1000 // 10 minutes
    );
  },

  // Cache user pages for 5 minutes
  getUserPages: async (userId: string | number) => {
    return cache.getOrSet(
      cacheKeys.userPages(userId),
      async () => {
        const { db } = await import('./db');
        const [pages]: any = await db.execute(
          'SELECT * FROM pages WHERE user_id = ? ORDER BY created_at DESC',
          [userId]
        );
        return pages;
      },
      5 * 60 * 1000 // 5 minutes
    );
  },

  // Invalidate user-related caches
  invalidateUser: (userId: string | number) => {
    cache.delete(cacheKeys.user(userId));
    cache.delete(cacheKeys.userPages(userId));
    cache.delete(cacheKeys.planAccess(userId));
  },

  // Invalidate page-related caches
  invalidatePage: (pageId: string) => {
    cache.delete(cacheKeys.pageAnalytics(pageId));
  }
};

export default cache; 