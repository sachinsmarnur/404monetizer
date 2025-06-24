"use client";

import { Inter, Roboto, Open_Sans, Lato, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileWarning } from "lucide-react";
import { TextAvatar } from "@/components/ui/text-avatar";
import { SessionProvider } from "next-auth/react";
import { CookieConsent } from "@/components/ui/cookie-consent";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const openSans = Open_Sans({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const montserrat = Montserrat({ subsets: ["latin"] });

// Create CSS variables for the fonts
const fontVariables = `
  :root {
    --font-inter: ${inter.style.fontFamily};
    --font-roboto: ${roboto.style.fontFamily};
    --font-open-sans: ${openSans.style.fontFamily};
    --font-lato: ${lato.style.fontFamily};
    --font-poppins: ${poppins.style.fontFamily};
    --font-montserrat: ${montserrat.style.fontFamily};
  }
`;

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FileWarning className="h-6 w-6" />
          <span>404 Monetizer</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!user ? (
            <>
              <Link href="/auth/sign-in">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <TextAvatar name={user?.name || "?"} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard');
  const isViewPage = pathname.startsWith('/view');
  const shouldShowFooter = !isAuthPage && !isDashboard && !isViewPage;
  const shouldShowHeader = !isDashboard && !isViewPage;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
      <div className={inter.className}>
        <ToastProvider>
          <SessionProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="relative min-h-screen">
                  {shouldShowHeader && <Header />}
                  <main className={shouldShowHeader ? "pt-14" : ""}>
                    {children}
                  </main>
                  {shouldShowFooter && <Footer />}
                </div>
                <CookieConsent />
                {!isDashboard && <Toaster />}
              </ThemeProvider>
            </AuthProvider>
          </SessionProvider>
        </ToastProvider>
      </div>
    </>
  );
} 