"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, MousePointerClick, DollarSign, BarChart, Calendar, Users, Globe, Smartphone } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import { DetailedAnalyticsModal } from "./DetailedAnalyticsModal";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageAnalyticsProps {
  pageId: string | number;
}

interface Analytics {
  page: {
    id: number;
    title: string;
  };
  today: {
    views: number;
    conversions: number;
    revenue: number | string;
  };
  total: {
    views: number;
    conversions: number;
    revenue: number;
  };
  chartData?: any[];
  events?: any[];
  referrers?: any[];
  devices?: any[];
  countries?: any[];
}

interface ModalState {
  isOpen: boolean;
  metricType: 'views' | 'conversions' | 'revenue' | 'conversion-rate';
  title: string;
}

// Enhanced Modal component that can handle both summary and page-specific data
function PageDetailedAnalyticsModal({
  isOpen,
  onClose,
  metricType,
  title,
  pageId,
}: {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'views' | 'conversions' | 'revenue' | 'conversion-rate';
  title: string;
  pageId?: string | number;
}) {
  return (
    <DetailedAnalyticsModal
      isOpen={isOpen}
      onClose={onClose}
      metricType={metricType}
      title={title}
      pageId={pageId}
    />
  );
}

export function PageAnalytics({ pageId }: PageAnalyticsProps) {
  const { analytics, error, isLoading } = usePageAnalytics(pageId);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    metricType: 'views',
    title: ''
  });

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

  const { today, total, page, referrers = [], devices = [], countries = [] } = analytics as Analytics;
  const ctr = today.views > 0 
    ? ((today.conversions / today.views) * 100).toFixed(2)
    : '0.00';

  // Convert revenue to number if it's a string
  const todayRevenue = typeof today.revenue === 'string' 
    ? parseFloat(today.revenue) || 0
    : today.revenue || 0;

  const totalRevenue = typeof total.revenue === 'string' 
    ? parseFloat(total.revenue) || 0
    : total.revenue || 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      {page && (
        <div>
          <h3 className="text-lg font-semibold">{page.title}</h3>
          <p className="text-sm text-muted-foreground">Page Analytics</p>
        </div>
      )}

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
          value={`$${Number.isFinite(todayRevenue) ? todayRevenue.toFixed(2) : '0.00'}`}
          description={`Total: $${Number.isFinite(totalRevenue) ? totalRevenue.toFixed(2) : '0.00'}`}
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
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            No analytics data available yet for this page. Analytics will appear here once visitors start viewing this 404 page.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Analytics Modal */}
      <PageDetailedAnalyticsModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        metricType={modalState.metricType}
        title={modalState.title}
        pageId={pageId}
      />
    </div>
  );
} 