import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/auth-context";

interface Analytics {
  page: {
    id: number;
    title: string;
  };
  today: {
    views: number;
    conversions: number;
    revenue: number;
  };
  total: {
    views: number;
    conversions: number;
    revenue: number;
  };
  chartData: Array<{
    date: string;
    views: number;
    conversions: number;
    revenue: number;
  }>;
  events?: any[];
  referrers?: any[];
  devices?: any[];
  countries?: any[];
}

export function usePageAnalytics(pageId: string | number) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { makeAuthenticatedRequest } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalytics() {
      try {
        const response = await makeAuthenticatedRequest(`/api/analytics/${pageId}`);
        const data = await response.json();
        
        if (isMounted) {
          setAnalytics(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Reset state when pageId changes
    setIsLoading(true);
    setError(null);
    setAnalytics(null);

    // Initial fetch
    fetchAnalytics();

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchAnalytics, 30000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [pageId, makeAuthenticatedRequest]);

  return { analytics, error, isLoading };
} 