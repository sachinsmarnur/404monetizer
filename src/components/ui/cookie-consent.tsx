"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasAccepted) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-6 md:right-6 lg:left-8 lg:right-8"
      >
        <Card className="border shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use essential cookies to ensure our website functions properly and optional cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <Link 
                  href="/privacy" 
                  className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
                <span className="text-muted-foreground">•</span>
                <button 
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage Preferences
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="h-9 px-4 text-xs"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="h-9 px-4 bg-primary hover:bg-primary/90 text-xs"
              >
                Accept All
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
} 