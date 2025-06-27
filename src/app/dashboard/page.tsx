"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getMaxPagesForUser, getUsageMessage, hasDisabledPages } from "@/lib/plan-utils";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { user, makeAuthenticatedRequest } = useAuth();
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Calculate max pages based on plan
  const maxPages = user ? getMaxPagesForUser(user) : 1;
  const usageMessage = user ? getUsageMessage(user, totalPages) : `Pages: ${totalPages}/${maxPages}`;
  const userHasDisabledPages = user ? hasDisabledPages(user, totalPages) : false;

  useEffect(() => {
    if (user) {
      fetchPageCount();
      checkFirstTimeUser();
      sendWelcomeEmailIfNeeded();
    }
  }, [user]);

  const fetchPageCount = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await makeAuthenticatedRequest('/api/pages');
      const data = await response.json();
      setTotalPages(data.length);
    } catch (error) {
      console.error('Error fetching page count:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFirstTimeUser = () => {
    if (!user?.email) return;
    
    const storageKey = `404monetizer_visited_${user.email}`;
    const hasVisited = localStorage.getItem(storageKey);
    
    if (!hasVisited) {
      setIsFirstTimeUser(true);
      localStorage.setItem(storageKey, 'true');
    } else {
      setIsFirstTimeUser(false);
    }
  };

  const sendWelcomeEmailIfNeeded = async () => {
    if (!user?.email) return;
    
    console.log(`🔍 Dashboard: Checking welcome email for user: ${user.email}`);
    
    try {
      const response = await makeAuthenticatedRequest('/api/user/send-welcome-email', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success && !data.alreadySent) {
        console.log('✅ Dashboard: Welcome email sent successfully');
      } else if (data.alreadySent) {
        console.log('📧 Dashboard: Welcome email already sent to this user');
      } else {
        console.log('⚠️ Dashboard: Welcome email API response:', data);
      }
    } catch (error) {
      console.error('❌ Dashboard: Error sending welcome email:', error);
      // Don't show error to user - welcome email is background operation
    }
  };

  // Get first name from full name for personalized greeting
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Determine welcome message based on user status
  const getWelcomeMessage = () => {
    if (isFirstTimeUser) {
      return `Welcome ${firstName}! 👋`;
    }
    return `Welcome back, ${firstName}! 👋`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Personalized Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">
          {getWelcomeMessage()}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your 404 error pages into revenue-generating opportunities. Create beautiful, 
          engaging pages that convert lost visitors into customers, subscribers, and leads.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>
            Welcome to your 404 Page Monetizer dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  {loading || totalPages >= maxPages ? (
                    <Button disabled={true} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Page
                    </Button>
                  ) : (
                    <Link href="/dashboard/pages/new" className="w-full">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Page
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard/pages" className="w-full">
                    <Button variant="outline" className="w-full">
                      Manage Pages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    {loading ? (
                      "Loading page count..."
                    ) : (
                      usageMessage
                    )}
                  </div>
                  {userHasDisabledPages && !loading && (
                    <div className="text-xs text-red-600 font-medium">
                      Some pages are disabled due to plan downgrade
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 