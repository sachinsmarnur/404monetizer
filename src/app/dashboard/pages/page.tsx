"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Copy,
  Archive,
  MoreVertical,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  MousePointerClick,
  TrendingUp,
  Lock,
  Crown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { 
  hasProAccess, 
  getMaxPagesForUser, 
  getUsageMessage, 
  isPageAccessible, 
  hasDisabledPages,
  isPlanExpired,
  getDisabledPagesCount
} from "@/lib/plan-utils";
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
import { useRazorpay } from "@/hooks/useRazorpay";

interface Page {
  id: number;
  title: string;
  category: string;
  status: string;
  views?: number;
  conversions?: number;
  created_at: string;
  updated_at: string;
}

interface PageAnalytics {
  [pageId: number]: {
    views: number;
    conversions: number;
    revenue: number;
  };
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  const router = useRouter();
  const { makeAuthenticatedRequest, user } = useAuth();
  const { processPayment, loading: paymentLoading } = useRazorpay();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/pages');
      const data = await response.json();
      setPages(data);
      
      // Fetch analytics for each page
      await fetchPagesAnalytics(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error({
        description: "Failed to fetch pages"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPagesAnalytics = async (pages: Page[]) => {
    const analytics: PageAnalytics = {};

    for (const page of pages) {
      try {
        const response = await makeAuthenticatedRequest(`/api/analytics/${page.id}`);
        const data = await response.json();
        analytics[page.id] = {
          views: data.total?.views || 0,
          conversions: data.total?.conversions || 0,
          revenue: data.total?.revenue || 0
        };
      } catch (error) {
        console.error(`Error fetching analytics for page ${page.id}:`, error);
      }
    }

    setPageAnalytics(analytics);
  };

  const handleDuplicate = async (page: Page) => {
    try {
      const duplicatedPage = {
        ...page,
        title: `${page.title} (Copy)`,
        id: undefined
      };

      const response = await makeAuthenticatedRequest('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatedPage)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success({
          description: "Page duplicated successfully"
        });
        fetchPages();
      } else {
        throw new Error(data.error || 'Failed to duplicate page');
      }
    } catch (error) {
      console.error('Error duplicating page:', error);
      toast.error({
        description: "Failed to duplicate page"
      });
    }
  };

  const handleArchive = async (page: Page) => {
    try {
      const response = await makeAuthenticatedRequest(`/api/pages/${page.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...page,
          status: page.status === 'archived' ? 'active' : 'archived'
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success({
          description: `Page ${page.status === 'archived' ? 'unarchived' : 'archived'} successfully`
        });
        fetchPages();
      } else {
        throw new Error(data.error || 'Failed to archive page');
      }
    } catch (error) {
      console.error('Error archiving page:', error);
      toast.error({
        description: "Failed to archive page"
      });
    }
  };

  const handleDelete = async (page: Page) => {
    try {
      const response = await makeAuthenticatedRequest(`/api/pages/${page.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDeleteDialogOpen(null); // Close the dialog
        toast.success({
          description: "Page deleted successfully"
        });
        fetchPages();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error({
        description: "Failed to delete page"
      });
    }
  };

  // Sort pages by creation date (oldest first) for accessibility logic
  const sortedPages = [...pages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const filteredPages = sortedPages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = pages.length;
  const maxPages = user ? getMaxPagesForUser(user) : 1;
  const usagePercentage = (totalPages / maxPages) * 100;
  const usageMessage = user ? getUsageMessage(user, totalPages) : `You have used ${totalPages} of your ${maxPages} page limit`;
  const userHasDisabledPages = user ? hasDisabledPages(user, totalPages) : false;
  const disabledPagesCount = user ? getDisabledPagesCount(user, totalPages) : 0;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pages</h1>
            <p className="text-muted-foreground">Create and manage your 404 pages</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Create and manage your 404 pages</p>
        </div>
        {totalPages >= maxPages ? (
          <Button 
            className="w-full md:w-auto" 
            disabled={true}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Page
          </Button>
        ) : (
          <Link href="/dashboard/pages/new">
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Usage</span>
              <span className="text-sm font-normal text-muted-foreground">
                {totalPages} / {maxPages} pages
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={usagePercentage} className="w-full" />
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-sm text-muted-foreground">
                {usageMessage}
              </p>
              {userHasDisabledPages && (
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {disabledPagesCount} page{disabledPagesCount > 1 ? 's' : ''} disabled due to plan downgrade
                    </span>
                  </div>
                                      <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
                      onClick={() => processPayment()}
                      disabled={paymentLoading}
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      {paymentLoading ? 'Processing...' : 'Upgrade to Pro'}
                    </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Pages</CardTitle>
            <CardDescription>
              {filteredPages.length} page(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <ScrollArea className="h-[500px] md:h-[600px] w-full">
              <div className="space-y-3">
                {filteredPages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pages found</p>
                    {totalPages >= maxPages ? (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        disabled={true}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first page
                      </Button>
                    ) : (
                      <Link href="/dashboard/pages/new">
                        <Button variant="outline" className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first page
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  filteredPages.map((page) => {
                    const analytics = pageAnalytics[page.id] || { views: 0, conversions: 0, revenue: 0 };
                    // Find the page's position in the sorted (oldest first) array
                    const pageIndex = sortedPages.findIndex(p => p.id === page.id);
                    const pageAccessible = user ? isPageAccessible(user, pageIndex) : true;
                    
                    return (
                      <Card key={page.id} className={`p-4 relative ${!pageAccessible ? 'opacity-60 bg-muted/30 border-dashed border-muted-foreground/30' : ''}`}>
                        {!pageAccessible && (
                          <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center z-10">
                            <Lock className="h-3 w-3 mr-1" />
                            Disabled
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                              <div className="flex items-center gap-2">
                                {!pageAccessible && <Lock className="h-4 w-4 text-muted-foreground" />}
                                <h3 className={`font-semibold truncate ${!pageAccessible ? 'text-muted-foreground' : ''}`}>
                                  {page.title}
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  !pageAccessible 
                                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                    : page.status === 'active' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : page.status === 'draft'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                }`}>
                                  {!pageAccessible ? 'disabled' : page.status}
                                </span>
                                {page.category && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    !pageAccessible 
                                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                  }`}>
                                    {page.category}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className={`flex flex-wrap items-center gap-4 mt-2 text-sm ${!pageAccessible ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {pageAccessible ? analytics.views : '---'} views
                              </div>
                              <div className="flex items-center">
                                <MousePointerClick className="h-4 w-4 mr-1" />
                                {pageAccessible ? analytics.conversions : '---'} conversions
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                ${pageAccessible ? analytics.revenue.toFixed(2) : '0.00'} revenue
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!pageAccessible ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={true}
                                className="flex items-center space-x-1 opacity-50"
                              >
                                <Lock className="h-4 w-4" />
                                <span className="hidden md:inline">Locked</span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/view/${page.id}`, '_blank')}
                                disabled={user?.plan !== 'pro'}
                                className="flex items-center space-x-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="hidden md:inline">View</span>
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={!pageAccessible}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {!pageAccessible ? (
                                  <DropdownMenuItem disabled className="text-muted-foreground">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Upgrade to Pro to access
                                  </DropdownMenuItem>
                                ) : (
                                  <>
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/pages/${page.id}`)}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicate(page)}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleArchive(page)}>
                                      <Archive className="mr-2 h-4 w-4" />
                                      {page.status === 'archived' ? 'Unarchive' : 'Archive'}
                                    </DropdownMenuItem>
                                    <AlertDialog 
                                      open={deleteDialogOpen === page.id} 
                                      onOpenChange={(open) => setDeleteDialogOpen(open ? page.id : null)}
                                    >
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your
                                            page "{page.title}" and remove all associated data.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDelete(page)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 