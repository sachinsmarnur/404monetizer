"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageAnalytics } from "./PageAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

interface Page {
  id: number;
  title: string;
  description: string | null;
  views: number;
  conversions: number;
  status: string;
}

export function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const { makeAuthenticatedRequest } = useAuth();

  const fetchPagesWithAnalytics = async () => {
    try {
      // First fetch all pages
      const pagesResponse = await makeAuthenticatedRequest('/api/pages');
      const pagesData = await pagesResponse.json();
      
      if (!Array.isArray(pagesData)) {
        throw new Error('Invalid pages data received');
      }

      // Initialize pages with zero analytics
      const pagesWithAnalytics = pagesData.map(page => ({
        id: page.id,
        title: page.title || 'Untitled Page',
        description: page.description,
        views: 0,
        conversions: 0,
        status: page.status || 'draft'
      }));

      // Try to fetch analytics for each page individually
      for (const page of pagesWithAnalytics) {
        try {
          const analyticsResponse = await makeAuthenticatedRequest(`/api/analytics/${page.id}`);
          const analyticsData = await analyticsResponse.json();
          page.views = analyticsData.total?.views || 0;
          page.conversions = analyticsData.total?.conversions || 0;
        } catch (analyticsError) {
          // Continue with zero analytics if analytics fetch fails
          // Silently fail as analytics might not be available for all pages
        }
      }

      setPages(pagesWithAnalytics);
      
      // Select the first page by default if none selected
      if (pagesWithAnalytics.length > 0 && !selectedPage) {
        setSelectedPage(pagesWithAnalytics[0].id);
      }
      
      setError(null);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching pages:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAnalytics = async () => {
    setIsClearing(true);
    try {
      const response = await makeAuthenticatedRequest('/api/analytics/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear analytics');
      }

      toast({
        title: "Analytics Cleared",
        description: "All your analytics data has been successfully cleared.",
      });

      // Close the dialog
      setClearDialogOpen(false);

      // Refresh the page data to show updated analytics
      await fetchPagesWithAnalytics();
      
      // If there's a selected page, this will trigger a refresh of the PageAnalytics component
      if (selectedPage) {
        // Force re-render by temporarily clearing and resetting selected page
        const currentPage = selectedPage;
        setSelectedPage(null);
        setTimeout(() => setSelectedPage(currentPage), 100);
      }

    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to clear analytics',
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Helper function to truncate text properly
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    fetchPagesWithAnalytics();
  }, []); // Remove selectedPage dependency to prevent unnecessary refetches

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-[400px]" />;
  }

  if (pages.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          You haven&apos;t created any pages yet. <Link href="/dashboard/pages/new" className="underline">Create your first page</Link> to see analytics.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clear Analytics Button */}
      <div className="flex justify-end">
        <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Analytics
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Analytics Data</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all your analytics data including views, conversions, and revenue data for all your pages. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAnalytics}
                disabled={isClearing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isClearing ? "Clearing..." : "Clear All Data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedPage === page.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "border-border hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedPage(page.id)}
                  >
                    <div className="space-y-3">
                      {/* Header with title and status */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-3">
                          <h4 className="font-semibold text-sm leading-tight">
                            {page.title}
                          </h4>
                        </div>
                        <Badge 
                          variant={page.status === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs font-medium shrink-0",
                            page.status === 'active' 
                              ? "bg-green-100 text-green-700 hover:bg-green-100" 
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          )}
                        >
                          {page.status}
                        </Badge>
                      </div>

                      {/* Description - only show if it's short enough or truncate smartly */}
                      {page.description && (
                        <div className="text-xs text-muted-foreground">
                          {page.description.length > 50 ? (
                            <span title={page.description}>
                              {truncateText(page.description, 50)}
                            </span>
                          ) : (
                            page.description
                          )}
                        </div>
                      )}

                      {/* Analytics data */}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {page.views} views
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {page.conversions} conversions
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedPage ? (
            <PageAnalytics pageId={selectedPage} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Select a page to view analytics
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 