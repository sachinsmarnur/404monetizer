"use client";

import { useState, useEffect } from "react";
import { Eye, MousePointerClick, DollarSign, BarChart, Globe, Smartphone, Users, Trash2 } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import { DetailedAnalyticsModal } from "./DetailedAnalyticsModal";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface SummaryAnalytics {
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
  referrers?: any[];
  devices?: any[];
  countries?: any[];
}

interface ModalState {
  isOpen: boolean;
  metricType: 'views' | 'conversions' | 'revenue' | 'conversion-rate';
  title: string;
}

export function AnalyticsSummary() {
  const [analytics, setAnalytics] = useState<SummaryAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    metricType: 'views',
    title: ''
  });
  const { makeAuthenticatedRequest } = useAuth();

  const fetchSummaryAnalytics = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/analytics/summary');
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary analytics');
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

      // Refresh the analytics data
      setAnalytics({
        today: { views: 0, conversions: 0, revenue: 0 },
        total: { views: 0, conversions: 0, revenue: 0 },
        referrers: [],
        devices: [],
        countries: []
      });

      toast({
        title: "Analytics Cleared",
        description: "All your analytics data has been successfully cleared.",
      });

      // Close the dialog
      setClearDialogOpen(false);

      // Trigger a page refresh to update all components
      window.location.reload();
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

  const handleCardClick = (metricType: 'views' | 'conversions' | 'revenue' | 'conversion-rate', title: string) => {
    setModalState({
      isOpen: true,
      metricType,
      title
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    fetchSummaryAnalytics();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            This might be because no analytics data has been collected yet, or there's a database connection issue.
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[140px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  const { today, total, referrers = [], devices = [], countries = [] } = analytics;
  const ctr = today.views > 0 
    ? ((today.conversions / today.views) * 100).toFixed(2)
    : '0.00';

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

      {/* Main Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Today's Views"
          value={today.views.toLocaleString()}
          description={`Total: ${total.views.toLocaleString()}`}
          icon={<Eye />}
          className="h-full group"
          clickable={true}
          onClick={() => handleCardClick('views', "Today's Views")}
        />
        <AnalyticsCard
          title="Today's Conversions"
          value={today.conversions.toLocaleString()}
          description={`Total: ${total.conversions.toLocaleString()}`}
          icon={<MousePointerClick />}
          className="h-full group"
          clickable={true}
          onClick={() => handleCardClick('conversions', "Today's Conversions")}
        />
        <AnalyticsCard
          title="Today's Revenue"
          value={`$${Number.isFinite(today.revenue) ? today.revenue.toFixed(2) : '0.00'}`}
          description={`Total: $${Number.isFinite(total.revenue) ? total.revenue.toFixed(2) : '0.00'}`}
          icon={<DollarSign />}
          className="h-full group"
          clickable={true}
          onClick={() => handleCardClick('revenue', "Today's Revenue")}
        />
        <AnalyticsCard
          title="Conversion Rate"
          value={`${ctr}%`}
          description="Conversions / Views"
          icon={<BarChart />}
          className="h-full group"
          clickable={true}
          onClick={() => handleCardClick('conversion-rate', "Conversion Rate")}
        />
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Referrers */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {referrers.length > 0 ? (
              <div className="space-y-2">
                {referrers.slice(0, 5).map((referrer: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="truncate">
                      {referrer.referrer_url || 'Direct'}
                    </span>
                    <span className="font-medium">{referrer.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No referrer data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {devices.length > 0 ? (
              <div className="space-y-2">
                {devices.map((device: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="capitalize">
                      {device.device_type || 'Unknown'}
                    </span>
                    <span className="font-medium">{device.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No device data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Countries */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {countries.length > 0 ? (
              <div className="space-y-2">
                {countries.slice(0, 5).map((country: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{country.country || 'Unknown'}</span>
                    <span className="font-medium">{country.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No country data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      {total.views === 0 && (
        <Alert>
          <AlertDescription>
            No analytics data available yet. Your analytics will appear here once visitors start viewing your 404 pages.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Analytics Modal */}
      <DetailedAnalyticsModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        metricType={modalState.metricType}
        title={modalState.title}
      />
    </div>
  );
} 