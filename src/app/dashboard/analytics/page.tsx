"use client";

import { PagesList } from "@/components/analytics/PagesList";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { PlanLock } from "@/components/ui/plan-lock";
import { useAuth } from "@/contexts/auth-context";

export default function AnalyticsPage() {
  const { user } = useAuth();

  if (user?.plan === 'free') {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Analytics"
          text="View real-time analytics for your 404 pages."
        />
        <PlanLock
          title="Analytics Available in Pro"
          description="Get detailed insights into your page performance, visitor behavior, and conversion rates."
          features={[
            "Real-time visitor tracking",
            "Conversion rate analytics",
            "Revenue tracking",
            "Detailed performance metrics",
            "Export analytics data"
          ]}
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="View real-time analytics for your 404 pages."
      />
      <div className="grid gap-10">
        <PagesList />
      </div>
    </DashboardShell>
  );
} 