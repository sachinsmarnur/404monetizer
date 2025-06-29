"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutGrid, 
  FileText, 
  BarChart2, 
  Settings, 
  FileWarning, 
  Menu, 
  Bell,
  ChevronDown,
  LogOut,
  User,
  Crown,
  Package,
  PenTool
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/auth-context";
import { TextAvatar } from "@/components/ui/text-avatar";
import { useRazorpay } from "@/hooks/useRazorpay";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hasProAccess, isPlanExpiringSoon, isPlanExpired, getDaysUntilExpiration, formatExpirationDate } from "@/lib/plan-utils";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "404 Pages",
    href: "/dashboard/pages",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    title: "Blog Post Enhancer",
    href: "/dashboard/blog-enhancer",
    icon: PenTool,
  },
  {
    title: "WordPress Plugins",
    href: "/dashboard/wordpress-plugins",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { processPayment, loading } = useRazorpay();
  
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FileWarning className="h-6 w-6 text-primary" />
          <span>404 Monetizer</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Plan Status and Upgrade Section */}
        {user && (
          <div className="mt-6 px-3 space-y-3">
            {/* Plan Expiration Warning */}
            {isPlanExpiringSoon(user) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs font-medium text-amber-800">
                  ⚠️ Plan expires in {getDaysUntilExpiration(user)} days
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Expires: {formatExpirationDate(user)}
                </div>
              </div>
            )}

            {/* Plan Expired Warning */}
            {isPlanExpired(user) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-xs font-medium text-red-800">
                  ❌ Pro plan expired
                </div>
                <div className="text-xs text-red-600 mt-1">
                  Expired: {formatExpirationDate(user)}
                </div>
              </div>
            )}

            {/* Upgrade to Pro button for non-pro users */}
            {!hasProAccess(user) && (
              <Button 
                onClick={() => processPayment()} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
              >
                <Crown className="h-4 w-4 mr-2" />
                {loading ? 'Processing...' : isPlanExpired(user) ? 'Renew Pro Plan' : 'Upgrade to Pro'}
              </Button>
            )}

            {/* Pro Status for active pro users */}
            {hasProAccess(user) && user.plan === 'pro' && !isPlanExpiringSoon(user) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xs font-medium text-green-800 flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Plan Active
                </div>
                {user.plan_expires_at && (
                  <div className="text-xs text-green-600 mt-1">
                    Expires: {formatExpirationDate(user)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile nav when route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background/80 backdrop-blur-sm lg:block lg:w-72 fixed inset-y-0">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu for the dashboard
                </SheetDescription>
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Logo for mobile */}
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <FileWarning className="h-6 w-6 text-primary" />
                <span>404 Monetizer</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Menu */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <TextAvatar name={user?.name || "?"} />
                    <span className="hidden md:inline-block">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
} 