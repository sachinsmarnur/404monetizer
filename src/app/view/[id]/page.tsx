 "use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Facebook,
  X,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  ExternalLink,
  Mail,
  Lock,
  Heart,
  ShoppingCart,
  Star,
  FileDown
} from "lucide-react";
import { TwitterX } from "@/components/icons/TwitterX";

interface SocialLinks {
  [key: string]: string;
}

interface LeadMagnet {
  enabled: boolean;
  title: string;
  description: string;
  fileUrl: string;
  buttonText: string;
  emailPlaceholder: string;
  successMessage: string;
  fileType: 'pdf' | 'ebook' | 'template' | 'other';
}

interface SponsoredContent {
  enabled: boolean;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  buttonText: string;
  sponsorName: string;
}

interface DonationButton {
  enabled: boolean;
  title: string;
  description: string;
  donationUrl: string;
  buttonText: string;
  platform: 'paypal' | 'stripe' | 'kofi' | 'patreon' | 'custom';
  targetAmount?: number;
  currency: string;
}

interface NewsletterSignup {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  emailPlaceholder: string;
  provider: 'mailchimp' | 'convertkit' | 'sendinblue' | 'custom';
  apiKey?: string;
  listId?: string;
  webhookUrl?: string;
  successMessage: string;
}

interface ProductShowcase {
  enabled: boolean;
  title: string;
  description: string;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    buyUrl: string;
    featured?: boolean;
  }>;
}

interface SocialProof {
  enabled: boolean;
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    imageUrl?: string;
    rating?: number;
  }>;
}

interface ExitIntent {
  enabled: boolean;
  title: string;
  description: string;
  offerText: string;
  buttonText: string;
  redirectUrl: string;
  delaySeconds: number;
}

interface MonetizationFeatures {
  affiliateLinks: AffiliateLink[];
  contentLock: {
    enabled: boolean;
    content: string;
    unlockType: 'email' | 'click' | 'social';
    redirectUrl?: string;
  };
  emailCollection: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
    emailPlaceholder: string;
    webhookUrl?: string;
    successMessage: string;
  };
  countdownOffer: {
    enabled: boolean;
    title: string;
    description: string;
    expiryDate: string;
    redirectUrl: string;
    buttonText: string;
  };
  adSense: {
    enabled: boolean;
    code: string;
    placement: 'top' | 'bottom' | 'custom';
  };
  leadMagnet: LeadMagnet;
  sponsoredContent: SponsoredContent;
  donationButton: DonationButton;
  newsletterSignup: NewsletterSignup;
  productShowcase: ProductShowcase;
  socialProof: SocialProof;
  exitIntent: ExitIntent;
  customRedirects: boolean;
}

interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

interface Page404 {
  id?: number;
  title: string;
  description: string;
  logo: string;
  category: string;
  font: string;
  theme?: string;
  socialLinks: Record<string, string>;
  monetizationFeatures: MonetizationFeatures;
  customCSS: string;
  customJS: string;
  status?: string;
  userId: number;
}

const socialPlatforms = [
  { name: 'facebook', icon: Facebook, color: '#1877F2' },
  { name: 'twitter', icon: TwitterX, color: '#000000' },
  { name: 'instagram', icon: Instagram, color: '#E4405F' },
  { name: 'linkedin', icon: Linkedin, color: '#0A66C2' },
  { name: 'youtube', icon: Youtube, color: '#FF0000' },
  { name: 'website', icon: Globe, color: '#000000' },
];

// Countdown Timer Hook
const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Countdown Component
const CountdownTimer = ({ expiryDate, title, description, buttonText, redirectUrl, colors }: {
  expiryDate: string;
  title: string;
  description: string;
  buttonText: string;
  redirectUrl?: string;
  colors: any;
}) => {
  const countdownTime = useCountdown(expiryDate);
  const timeUnits = [
    { label: 'Days', value: countdownTime.days.toString().padStart(2, '0') },
    { label: 'Hours', value: countdownTime.hours.toString().padStart(2, '0') },
    { label: 'Minutes', value: countdownTime.minutes.toString().padStart(2, '0') },
    { label: 'Seconds', value: countdownTime.seconds.toString().padStart(2, '0') }
  ];

  return (
    <div className="py-12 bg-muted/30 border-y">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <Card className="border shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <CardTitle className="text-2xl text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
              {timeUnits.map((unit) => (
                <Card key={unit.label} className="bg-muted/50 border">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {unit.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{unit.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              size="lg"
              className={`${colors.primary} ${colors.primaryText}`}
              onClick={() => redirectUrl && window.open(redirectUrl, '_blank')}
            >
              {buttonText}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to get theme-based colors (same as preview components)
const getThemeColors = (theme: string = 'default') => {
  const themeColorMap = {
    default: {
      primary: 'bg-black hover:bg-gray-800',
      primaryText: 'text-white',
      accent: 'text-black',
      border: 'border-gray-200',
      background: 'bg-gray-100',
    },
    rose: {
      primary: 'bg-rose-600 hover:bg-rose-700',
      primaryText: 'text-white',
      accent: 'text-rose-600',
      border: 'border-rose-200',
      background: 'bg-rose-100',
    },
    teal: {
      primary: 'bg-teal-600 hover:bg-teal-700',
      primaryText: 'text-white',
      accent: 'text-teal-600',
      border: 'border-teal-200',
      background: 'bg-teal-100',
    },
    blue: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      primaryText: 'text-white',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      background: 'bg-blue-100',
    },
    olivegreen: {
      primary: 'bg-green-700 hover:bg-green-800',
      primaryText: 'text-white',
      accent: 'text-green-700',
      border: 'border-green-200',
      background: 'bg-green-100',
    },
    amber: {
      primary: 'bg-amber-500 hover:bg-amber-600',
      primaryText: 'text-amber-900',
      accent: 'text-amber-600',
      border: 'border-amber-200',
      background: 'bg-amber-100',
    },
    turquoise: {
      primary: 'bg-cyan-500 hover:bg-cyan-600',
      primaryText: 'text-white',
      accent: 'text-cyan-500',
      border: 'border-cyan-200',
      background: 'bg-cyan-100',
    }
  };
  
  return themeColorMap[theme as keyof typeof themeColorMap] || themeColorMap.default;
};

export default function ViewPage() {
  const params = useParams();
  const [page, setPage] = useState<Page404 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackEvent = async (eventType: string, eventData?: any) => {
    try {
      const response = await fetch(`/api/pages/${params.id}/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType,
          eventData: eventData || {},
          isExternalAccess: false // Mark as internal/preview access
        }),
      });
      
      // Only try to parse JSON if the response is ok and has content
      if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
        const result = await response.json();
        // Handle successful response if needed
      }
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  };

  const trackPageView = async () => {
    try {
      const deviceType = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 
                        /Tablet|iPad/.test(navigator.userAgent) ? 'tablet' : 'desktop';
      const referrerUrl = document.referrer || null;
      let country = null;
      
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
          const data = await response.json();
          // Use the IP data if needed
        }
      } catch (e) {
        // Silent fail for geolocation
      }

      await trackEvent("page_view", {
        timestamp: new Date().toISOString(),
        deviceType,
        referrerUrl,
        country,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error("Page view tracking error:", error);
    }
  };

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch(`/api/view/${params.id}`);
        if (!response.ok) {
          throw new Error('Page not found');
        }
        
        // Check if response has JSON content before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error('Invalid response format');
        }
        
        const responseText = await response.text();
        if (!responseText || responseText === 'undefined' || responseText === 'null') {
          throw new Error('Empty response');
        }
        
        const data = JSON.parse(responseText);
        
        // Map database fields to expected interface format
        const monetizationFeatures = (() => {
          try {
            // Handle case where monetization_features might be a string, object, or null
            let features = data.monetization_features;
            
            if (typeof features === 'string') {
              features = JSON.parse(features);
            }
            
            if (!features || typeof features !== 'object') {
              features = {};
            }

            // Ensure all required properties exist with safe defaults
            return {
              affiliateLinks: features.affiliateLinks || [],
              contentLock: {
                enabled: features.contentLock?.enabled || false,
                content: features.contentLock?.content || "",
                unlockType: (features.contentLock?.unlockType as 'email' | 'click' | 'social') || "email",
                redirectUrl: features.contentLock?.redirectUrl || ""
              },
              emailCollection: {
                enabled: features.emailCollection?.enabled || false,
                title: features.emailCollection?.title || "Subscribe to our newsletter",
                description: features.emailCollection?.description || "Get exclusive updates and offers",
                buttonText: features.emailCollection?.buttonText || "Subscribe",
                emailPlaceholder: features.emailCollection?.emailPlaceholder || "Enter your email",
                webhookUrl: features.emailCollection?.webhookUrl || "",
                successMessage: features.emailCollection?.successMessage || "Thank you for subscribing!"
              },
              countdownOffer: {
                enabled: features.countdownOffer?.enabled || false,
                title: features.countdownOffer?.title || "Limited Time Offer",
                description: features.countdownOffer?.description || "Don't miss out on this special deal!",
                expiryDate: features.countdownOffer?.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                redirectUrl: features.countdownOffer?.redirectUrl || "",
                buttonText: features.countdownOffer?.buttonText || "Claim Offer"
              },
              adSense: {
                enabled: features.adSense?.enabled || false,
                code: features.adSense?.code || "",
                placement: (features.adSense?.placement as 'top' | 'bottom' | 'custom') || "top"
              },
              leadMagnet: {
                enabled: features.leadMagnet?.enabled || false,
                title: features.leadMagnet?.title || "Get Our Free Guide",
                description: features.leadMagnet?.description || "Download our comprehensive guide to get started",
                fileUrl: features.leadMagnet?.fileUrl || "",
                buttonText: features.leadMagnet?.buttonText || "Download Now",
                emailPlaceholder: features.leadMagnet?.emailPlaceholder || "Enter your email",
                successMessage: features.leadMagnet?.successMessage || "Check your email for the download link!",
                fileType: (features.leadMagnet?.fileType as 'pdf' | 'ebook' | 'template' | 'other') || "pdf"
              },
              sponsoredContent: {
                enabled: features.sponsoredContent?.enabled || false,
                title: features.sponsoredContent?.title || "Amazing Product",
                description: features.sponsoredContent?.description || "Check out this amazing product that we recommend",
                imageUrl: features.sponsoredContent?.imageUrl || "",
                redirectUrl: features.sponsoredContent?.redirectUrl || "",
                buttonText: features.sponsoredContent?.buttonText || "Learn More",
                sponsorName: features.sponsoredContent?.sponsorName || "Brand Name"
              },
              donationButton: {
                enabled: features.donationButton?.enabled || false,
                title: features.donationButton?.title || "Support Our Work",
                description: features.donationButton?.description || "Help us continue creating amazing content",
                donationUrl: features.donationButton?.donationUrl || "",
                buttonText: features.donationButton?.buttonText || "Donate Now",
                platform: (features.donationButton?.platform as 'paypal' | 'stripe' | 'kofi' | 'patreon' | 'custom') || "paypal",
                targetAmount: features.donationButton?.targetAmount,
                currency: features.donationButton?.currency || "USD"
              },
              newsletterSignup: {
                enabled: features.newsletterSignup?.enabled || false,
                title: features.newsletterSignup?.title || "Subscribe to our newsletter",
                description: features.newsletterSignup?.description || "Get the latest updates and exclusive content",
                buttonText: features.newsletterSignup?.buttonText || "Subscribe",
                emailPlaceholder: features.newsletterSignup?.emailPlaceholder || "Enter your email",
                provider: (features.newsletterSignup?.provider as 'mailchimp' | 'convertkit' | 'sendinblue' | 'custom') || "custom",
                apiKey: features.newsletterSignup?.apiKey,
                listId: features.newsletterSignup?.listId,
                webhookUrl: features.newsletterSignup?.webhookUrl,
                successMessage: features.newsletterSignup?.successMessage || "Thank you for subscribing!"
              },
              productShowcase: {
                enabled: features.productShowcase?.enabled || false,
                title: features.productShowcase?.title || "Our Products",
                description: features.productShowcase?.description || "Check out our amazing products",
                products: features.productShowcase?.products || []
              },
              socialProof: {
                enabled: features.socialProof?.enabled || false,
                title: features.socialProof?.title || "What Our Customers Say",
                testimonials: features.socialProof?.testimonials || []
              },
              exitIntent: {
                enabled: features.exitIntent?.enabled || false,
                title: features.exitIntent?.title || "Wait! Don't Leave Yet",
                description: features.exitIntent?.description || "Get 20% off your first order",
                offerText: features.exitIntent?.offerText || "Use code SAVE20 at checkout",
                buttonText: features.exitIntent?.buttonText || "Claim Offer",
                redirectUrl: features.exitIntent?.redirectUrl || "",
                delaySeconds: features.exitIntent?.delaySeconds || 3
              },
              customRedirects: features.customRedirects || false
            };
          } catch (error) {
            console.error('Error parsing monetization features:', error);
            // Return safe defaults if parsing fails
            return {
              affiliateLinks: [],
              contentLock: { enabled: false, content: "", unlockType: "email" as const, redirectUrl: "" },
              emailCollection: { enabled: false, title: "Subscribe to our newsletter", description: "Get exclusive updates and offers", buttonText: "Subscribe", emailPlaceholder: "Enter your email", webhookUrl: "", successMessage: "Thank you for subscribing!" },
              countdownOffer: { enabled: false, title: "Limited Time Offer", description: "Don't miss out on this special deal!", expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), redirectUrl: "", buttonText: "Claim Offer" },
              adSense: { enabled: false, code: "", placement: "top" as const },
              leadMagnet: { enabled: false, title: "Get Our Free Guide", description: "Download our comprehensive guide to get started", fileUrl: "", buttonText: "Download Now", emailPlaceholder: "Enter your email", successMessage: "Check your email for the download link!", fileType: "pdf" as const },
              sponsoredContent: { enabled: false, title: "Amazing Product", description: "Check out this amazing product that we recommend", imageUrl: "", redirectUrl: "", buttonText: "Learn More", sponsorName: "Brand Name" },
              donationButton: { enabled: false, title: "Support Our Work", description: "Help us continue creating amazing content", donationUrl: "", buttonText: "Donate Now", platform: "paypal" as const, currency: "USD" },
              newsletterSignup: { enabled: false, title: "Subscribe to our newsletter", description: "Get the latest updates and exclusive content", buttonText: "Subscribe", emailPlaceholder: "Enter your email", provider: "custom" as const, successMessage: "Thank you for subscribing!" },
              productShowcase: { enabled: false, title: "Our Products", description: "Check out our amazing products", products: [] },
              socialProof: { enabled: false, title: "What Our Customers Say", testimonials: [] },
              exitIntent: { enabled: false, title: "Wait! Don't Leave Yet", description: "Get 20% off your first order", offerText: "Use code SAVE20 at checkout", buttonText: "Claim Offer", redirectUrl: "", delaySeconds: 3 },
              customRedirects: false
            };
          }
        })();

        const mappedPage: Page404 = {
          id: data.id,
          title: data.title || "",
          description: data.description || "",
          logo: data.logo || "",
          category: data.category || "E-commerce",
          font: data.font || "Inter",
          theme: data.theme || "default",
          socialLinks: data.social_links || {},
          monetizationFeatures,
          customCSS: data.custom_css || "",
          customJS: data.custom_js || "",
          status: data.status || "active",
          userId: data.user_id || 0
        };
        
        setPage(mappedPage);
        await trackPageView();
      } catch (error: any) {
        console.error('Error fetching page:', error);
        setError(error.message || 'Failed to load page');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchPage();
    }
  }, [params.id]);

  const handleEmailSubmit = async (email: string) => {
    try {
      await trackEvent("email_collection", { email });
      
      // Send to webhook if configured
      if (page?.monetizationFeatures.emailCollection.webhookUrl) {
        try {
          const webhookResponse = await fetch(page.monetizationFeatures.emailCollection.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pageId: params.id })
          });
          
          // Only try to parse response if it's JSON and successful
          if (webhookResponse.ok && webhookResponse.headers.get("content-type")?.includes("application/json")) {
            await webhookResponse.json();
          }
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          // Continue execution even if webhook fails
        }
      }
      
      alert(page?.monetizationFeatures.emailCollection.successMessage || "Thank you for subscribing!");
    } catch (error) {
      console.error('Email submission error:', error);
      alert("There was an error submitting your email. Please try again.");
    }
  };

  const handleAffiliateClick = async (link: AffiliateLink) => {
    await trackEvent("affiliate_click", {
      linkTitle: link.title,
      linkUrl: link.url
    });
    window.open(link.url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Page not found'}</p>
        </div>
      </div>
    );
  }

  const selectedTheme = page.theme || 'default';
  const colors = getThemeColors(selectedTheme);

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        fontFamily: page.font === 'Inter' ? 'var(--font-inter, ui-sans-serif, system-ui, sans-serif)' :
                    page.font === 'Roboto' ? 'var(--font-roboto, ui-sans-serif, system-ui, sans-serif)' :
                    page.font === 'Open Sans' ? 'var(--font-open-sans, ui-sans-serif, system-ui, sans-serif)' :
                    page.font === 'Lato' ? 'var(--font-lato, ui-sans-serif, system-ui, sans-serif)' :
                    page.font === 'Poppins' ? 'var(--font-poppins, ui-sans-serif, system-ui, sans-serif)' :
                    page.font === 'Montserrat' ? 'var(--font-montserrat, ui-sans-serif, system-ui, sans-serif)' :
                    'var(--font-inter, ui-sans-serif, system-ui, sans-serif)'
      }}
    >
      {/* Main 404 Content */}
      <div className="text-center py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {page.logo && (
            <div className="flex justify-center mb-6">
              <img src={page.logo} alt="Logo" className="h-16 max-w-xs object-contain" />
            </div>
          )}
          
          <div className="space-y-4">
            <h1 className="text-7xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-foreground mb-3">
              {page.title || "Page Not Found"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {page.description || "The page you're looking for doesn't exist."}
            </p>
          </div>

          <div className="pt-4">
            <Button className={`px-8 py-3 text-lg ${colors.primary} ${colors.primaryText}`} onClick={() => window.history.back()}>
              Go Back Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content Lock Feature */}
      {page.monetizationFeatures.contentLock.enabled && (
        <div className="py-12 bg-muted/50 border-y">
          <div className="max-w-2xl mx-auto px-6">
            <Card className="border-2 border-dashed border-muted-foreground/30">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Lock className="h-6 w-6" />
                  Content Locked
                </CardTitle>
                <CardDescription>
                  {page.monetizationFeatures.contentLock.content || "This content is locked. Unlock to continue."}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {page.monetizationFeatures.contentLock.unlockType === 'email' && (
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input placeholder="Enter your email" type="email" className="flex-1" />
                    <Button className={`${colors.primary} ${colors.primaryText}`}>Unlock Content</Button>
                  </div>
                )}
                {page.monetizationFeatures.contentLock.unlockType === 'click' && (
                  <Button className={`${colors.primary} ${colors.primaryText}`}>Click to Unlock</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Countdown Offer Feature */}
      {page.monetizationFeatures.countdownOffer.enabled && (
        <CountdownTimer
          expiryDate={page.monetizationFeatures.countdownOffer.expiryDate}
          title={page.monetizationFeatures.countdownOffer.title}
          description={page.monetizationFeatures.countdownOffer.description}
          buttonText={page.monetizationFeatures.countdownOffer.buttonText}
          redirectUrl={page.monetizationFeatures.countdownOffer.redirectUrl}
          colors={colors}
        />
      )}

      {/* AdSense - Top Placement */}
      {page.monetizationFeatures.adSense.enabled && page.monetizationFeatures.adSense.placement === 'top' && (
        <div className="w-full bg-muted/30 border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Card className="bg-gradient-to-r from-muted to-muted/50">
              <CardContent className="p-4 text-center">
                <Badge variant="secondary" className="mb-2">Advertisement</Badge>
                <div 
                  className="min-h-20 flex items-center justify-center text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: page.monetizationFeatures.adSense.code || 'Ad Content Area - TOP Placement' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Email Collection Feature */}
      {page.monetizationFeatures.emailCollection.enabled && (
        <div className="py-12 bg-muted/50 border-y">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className="shadow-lg border">
              <CardHeader>
                <div className={`w-16 h-16 ${colors.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Mail className={`h-8 w-8 ${colors.accent}`} />
                </div>
                <CardTitle className="text-2xl">
                  {page.monetizationFeatures.emailCollection.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {page.monetizationFeatures.emailCollection.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as any).email.value;
                  if (email) handleEmailSubmit(email);
                }}>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      name="email"
                      placeholder={page.monetizationFeatures.emailCollection.emailPlaceholder}
                      type="email"
                      className="flex-1"
                      required
                    />
                    <Button type="submit" className={`${colors.primary} ${colors.primaryText}`}>
                      {page.monetizationFeatures.emailCollection.buttonText}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Newsletter Signup Feature */}
      {page.monetizationFeatures.newsletterSignup.enabled && (
        <div className="py-12 bg-muted/50 border-y">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className={`shadow-lg ${colors.border}`}>
              <CardHeader>
                <div className={`w-16 h-16 ${colors.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Mail className={`h-8 w-8 ${colors.accent}`} />
                </div>
                <CardTitle className={`text-2xl ${colors.accent}`}>
                  {page.monetizationFeatures.newsletterSignup.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {page.monetizationFeatures.newsletterSignup.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    placeholder={page.monetizationFeatures.newsletterSignup.emailPlaceholder}
                    type="email"
                    className="flex-1 bg-background border-none text-foreground"
                  />
                  <Button className={`${colors.primary} ${colors.primaryText}`}>
                    {page.monetizationFeatures.newsletterSignup.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Lead Magnet Feature */}
      {page.monetizationFeatures.leadMagnet.enabled && (
        <div className={`py-12 bg-gradient-to-r ${colors.background} border-y ${colors.border}`}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className={`bg-background/10 backdrop-blur-sm ${colors.border} shadow-lg`}>
              <CardHeader>
                <div className={`w-16 h-16 ${colors.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <FileDown className={`h-8 w-8 ${colors.accent}`} />
                </div>
                <CardTitle className={`text-2xl ${colors.accent}`}>
                  {page.monetizationFeatures.leadMagnet.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {page.monetizationFeatures.leadMagnet.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input 
                    placeholder={page.monetizationFeatures.leadMagnet.emailPlaceholder}
                    type="email"
                    className="flex-1 bg-background border-none text-foreground"
                  />
                  <Button className={`${colors.primary} ${colors.primaryText}`}>
                    {page.monetizationFeatures.leadMagnet.buttonText}
                  </Button>
                </div>
                <Badge variant="secondary" className={`mt-4 ${colors.background} ${colors.accent}`}>
                  {page.monetizationFeatures.leadMagnet.fileType.toUpperCase()} Download
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
        
      {/* Affiliate Links */}
      {page.monetizationFeatures.affiliateLinks.length > 0 && (
        <div className="py-8 sm:py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">Recommended Products</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Check out these amazing deals</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {page.monetizationFeatures.affiliateLinks.slice(0, 6).map((link) => (
                <Card key={link.id} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer flex flex-col h-full w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px]" onClick={() => handleAffiliateClick(link)}>
                  {link.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-lg flex-shrink-0">
                      <img
                        src={link.imageUrl}
                        alt={link.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
                    <CardTitle className="text-base sm:text-lg mb-2 sm:line-clamp-2 leading-tight">{link.title}</CardTitle>
                    {link.description && (
                      <CardDescription className="mb-4 text-sm sm:line-clamp-3 flex-grow">{link.description}</CardDescription>
                    )}
                    <Button className={`w-full mt-auto text-sm py-2 ${colors.primary} ${colors.primaryText}`} variant="default">
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">View Product</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sponsored Content */}
      {page.monetizationFeatures.sponsoredContent.enabled && (
        <div className="py-12 bg-muted/50 border-y">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="shadow-lg border">
              <CardHeader>
                <div className="flex items-start gap-2 mb-4">
                  <Badge variant="secondary" className={`${colors.background} ${colors.accent}`}>
                    Sponsored
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <CardTitle className="text-2xl mb-3">
                      {page.monetizationFeatures.sponsoredContent.title}
                    </CardTitle>
                    <CardDescription className="text-base mb-6">
                      {page.monetizationFeatures.sponsoredContent.description}
                    </CardDescription>
                    <Button 
                      size="lg"
                      className={`${colors.primary} ${colors.primaryText}`}
                      onClick={() => page.monetizationFeatures.sponsoredContent.redirectUrl && window.open(page.monetizationFeatures.sponsoredContent.redirectUrl, '_blank')}
                    >
                      {page.monetizationFeatures.sponsoredContent.buttonText}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3">
                      By {page.monetizationFeatures.sponsoredContent.sponsorName}
                    </p>
                  </div>
                  {page.monetizationFeatures.sponsoredContent.imageUrl && (
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={page.monetizationFeatures.sponsoredContent.imageUrl}
                        alt={page.monetizationFeatures.sponsoredContent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Donation Button Feature */}
      {page.monetizationFeatures.donationButton.enabled && (
        <div className="py-12 bg-muted/30 border-y">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className={`border shadow-lg ${colors.border}`}>
              <CardHeader>
                <div className={`w-16 h-16 ${colors.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Heart className={`h-8 w-8 ${colors.accent}`} />
                </div>
                <CardTitle className="text-2xl text-foreground">
                  {page.monetizationFeatures.donationButton.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {page.monetizationFeatures.donationButton.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {page.monetizationFeatures.donationButton.targetAmount && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Goal Progress</span>
                      <span>{page.monetizationFeatures.donationButton.currency} {page.monetizationFeatures.donationButton.targetAmount}</span>
                    </div>
                    <Progress value={65} className="h-3" />
                    <p className="text-sm text-muted-foreground">65% of goal reached</p>
                  </div>
                )}
                <Button 
                  size="lg"
                  className={`${colors.primary} ${colors.primaryText}`}
                  onClick={() => page.monetizationFeatures.donationButton.donationUrl && window.open(page.monetizationFeatures.donationButton.donationUrl, '_blank')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {page.monetizationFeatures.donationButton.buttonText}
                </Button>
                <Badge variant="outline">
                  via {page.monetizationFeatures.donationButton.platform}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Product Showcase */}
      {page.monetizationFeatures.productShowcase.enabled && page.monetizationFeatures.productShowcase.products.length > 0 && (
        <div className="py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">
                {page.monetizationFeatures.productShowcase.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {page.monetizationFeatures.productShowcase.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {page.monetizationFeatures.productShowcase.products.slice(0, 6).map((product, index) => {
                const products = page.monetizationFeatures.productShowcase.products.slice(0, 6);
                const totalProducts = products.length;
                
                // Determine grid positioning
                let gridClasses = '';
                
                if (totalProducts === 1) {
                  // Single product - center across all columns
                  gridClasses = 'md:col-span-2 lg:col-span-3 w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px] mx-auto';
                } else if (totalProducts === 4 && index === 3) {
                  // 4th product in a set of 4 - center in second row
                  gridClasses = 'md:col-span-2 lg:col-start-2 lg:col-end-3';
                } else if (totalProducts === 7 && index === 6) {
                  // 7th product in a set of 7 - center in third row
                  gridClasses = 'md:col-span-2 lg:col-start-2 lg:col-end-3';
                } else if (index === totalProducts - 1 && totalProducts % 3 === 1 && totalProducts > 3) {
                  // Last product when there's only 1 in the final row (for 3-column layout)
                  gridClasses = 'lg:col-start-2 lg:col-end-3';
                }
                
                return (
                <Card key={product.id} className={`hover:shadow-lg transition-all hover:scale-105 flex flex-col h-full relative ${gridClasses}`}>
                  {product.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className={`${colors.primary} ${colors.primaryText} text-xs border-amber-400`}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  {product.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-lg relative flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
                    <CardTitle className="text-base sm:text-lg mb-2 sm:line-clamp-2 leading-tight">{product.name}</CardTitle>
                    <CardDescription className="mb-4 text-sm sm:line-clamp-3 flex-grow">{product.description}</CardDescription>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
                      <span className={`text-lg sm:text-xl font-bold ${colors.accent}`}>{product.price}</span>
                      <Button onClick={() => window.open(product.buyUrl, '_blank')} className={`w-full sm:w-auto text-sm ${colors.primary} ${colors.primaryText}`}>
                        <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Buy Now</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Social Proof/Testimonials */}
      {page.monetizationFeatures.socialProof.enabled && page.monetizationFeatures.socialProof.testimonials.length > 0 && (
        <div className="py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {page.monetizationFeatures.socialProof.title}
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {page.monetizationFeatures.socialProof.testimonials.slice(0, 6).map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px]">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {testimonial.imageUrl ? (
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                          <span className="text-lg font-semibold">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    {testimonial.rating && (
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating! ? `${colors.accent} fill-current` : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <blockquote className="text-muted-foreground italic">
                      "{testimonial.content}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Feature */}
      {page.monetizationFeatures.exitIntent.enabled && (
        <div className={`py-12 ${colors.background} border-y ${colors.border}`}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className={`${colors.border} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${colors.accent}`}>
                  👋 {page.monetizationFeatures.exitIntent.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {page.monetizationFeatures.exitIntent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`${colors.background} p-4 rounded-lg border ${colors.border}`}>
                  <p className={`${colors.accent} font-semibold`}>
                    {page.monetizationFeatures.exitIntent.offerText}
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className={`${colors.primary} ${colors.primaryText}`}
                  onClick={() => page.monetizationFeatures.exitIntent.redirectUrl && window.open(page.monetizationFeatures.exitIntent.redirectUrl, '_blank')}
                >
                  {page.monetizationFeatures.exitIntent.buttonText}
                </Button>
                <p className="text-xs text-muted-foreground">
                  This appears when users try to leave the page
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* AdSense - Bottom/Custom Placement */}
      {page.monetizationFeatures.adSense.enabled && (page.monetizationFeatures.adSense.placement === 'bottom' || page.monetizationFeatures.adSense.placement === 'custom') && (
        <div className="w-full bg-muted/30 border-t">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Card className="bg-gradient-to-r from-muted to-muted/50">
              <CardContent className="p-4 text-center">
                <Badge variant="secondary" className="mb-2">Advertisement</Badge>
                <div 
                  className="min-h-20 flex items-center justify-center text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: page.monetizationFeatures.adSense.code || `Ad Content Area - ${page.monetizationFeatures.adSense.placement.toUpperCase()} Placement` }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Social Links Footer */}
      {Object.keys(page.socialLinks).length > 0 && (
        <div className="py-8 bg-muted border-t">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-muted-foreground mb-4">Connect with us</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {Object.entries(page.socialLinks).map(([platform, url]) => {
                const socialPlatform = socialPlatforms.find(p => p.name === platform);
                if (!socialPlatform || !url) return null;
                const IconComponent = socialPlatform.icon;
                return (
                  <Button
                    key={platform}
                    variant="outline"
                    size="sm"
                    className="gap-2 flex-shrink-0 min-w-fit"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                    <span className="sm:hidden">
                      {platform.charAt(0).toUpperCase()}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}