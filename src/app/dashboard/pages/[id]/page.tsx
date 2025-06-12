"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Users,
  DollarSign,
  Code,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Monitor,
  Smartphone,
  Expand,
  ExternalLink,
  Mail,
  Link,
  Minimize,
  Lock,
  Heart,
  ShoppingCart,
  Star,
  FileDown,
  Crown,
} from "lucide-react";
import { TwitterX } from "@/components/icons/TwitterX";
import { toast } from "@/utils/toast";
import MonetizationFeaturesSection from "@/components/monetization/MonetizationFeatures";
import { Progress } from "@/components/ui/progress";
import { UseCodeTab } from "@/components/ui/use-code-tab";
import { PlanLock } from "@/components/ui/plan-lock";
import { ThemeType } from "@/lib/theme-styles";
import { useAuth } from "@/contexts/auth-context";
import { useSession } from "next-auth/react";
import { Page404 } from "@/types/page";
import { useRazorpay } from "@/hooks/useRazorpay";


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
  leadMagnet: {
    enabled: boolean;
    title: string;
    description: string;
    fileUrl: string;
    buttonText: string;
    emailPlaceholder: string;
    successMessage: string;
    fileType: 'pdf' | 'ebook' | 'template' | 'other';
  };
  sponsoredContent: {
    enabled: boolean;
    title: string;
    description: string;
    imageUrl: string;
    redirectUrl: string;
    buttonText: string;
    sponsorName: string;
  };
  donationButton: {
    enabled: boolean;
    title: string;
    description: string;
    donationUrl: string;
    buttonText: string;
    platform: 'paypal' | 'stripe' | 'kofi' | 'patreon' | 'custom';
    targetAmount?: number;
    currency: string;
  };
  newsletterSignup: {
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
  };
  productShowcase: {
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
  };
  socialProof: {
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
  };
  exitIntent: {
    enabled: boolean;
    title: string;
    description: string;
    offerText: string;
    buttonText: string;
    redirectUrl: string;
    delaySeconds: number;
  };
  customRedirects: boolean;
}

interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

const defaultMonetizationFeatures: MonetizationFeatures = {
  affiliateLinks: [],
  contentLock: {
    enabled: false,
    content: "",
    unlockType: "email",
    redirectUrl: ""
  },
  emailCollection: {
    enabled: false,
    title: "Subscribe to our newsletter",
    description: "Get exclusive updates and offers",
    buttonText: "Subscribe",
    emailPlaceholder: "Enter your email",
    successMessage: "Thank you for subscribing!"
  },
  countdownOffer: {
    enabled: false,
    title: "Limited Time Offer",
    description: "Don't miss out on this special deal!",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    redirectUrl: "",
    buttonText: "Claim Offer"
  },
  adSense: {
    enabled: false,
    code: "",
    placement: "top"
  },
  leadMagnet: {
    enabled: false,
    title: "Get Our Free Guide",
    description: "Download our comprehensive guide to get started",
    fileUrl: "",
    buttonText: "Download Now",
    emailPlaceholder: "Enter your email",
    successMessage: "Check your email for the download link!",
    fileType: "pdf"
  },
  sponsoredContent: {
    enabled: false,
    title: "Amazing Product",
    description: "Check out this amazing product that we recommend",
    imageUrl: "",
    redirectUrl: "",
    buttonText: "Learn More",
    sponsorName: "Brand Name"
  },
  donationButton: {
    enabled: false,
    title: "Support Our Work",
    description: "Help us continue creating amazing content",
    donationUrl: "",
    buttonText: "Donate Now",
    platform: "paypal",
    currency: "USD"
  },
  newsletterSignup: {
    enabled: false,
    title: "Subscribe to our newsletter",
    description: "Get the latest updates and exclusive content",
    buttonText: "Subscribe",
    emailPlaceholder: "Enter your email",
    provider: "custom",
    successMessage: "Thank you for subscribing!"
  },
  productShowcase: {
    enabled: false,
    title: "Our Products",
    description: "Check out our amazing products",
    products: []
  },
  socialProof: {
    enabled: false,
    title: "What Our Customers Say",
    testimonials: []
  },
  exitIntent: {
    enabled: false,
    title: "Wait! Don't Leave Yet",
    description: "Get 20% off your first order",
    offerText: "Use code SAVE20 at checkout",
    buttonText: "Claim Offer",
    redirectUrl: "",
    delaySeconds: 3
  },
  customRedirects: false
};

const defaultPage: Page404 = {
  title: "",
  description: "",
  logo: "",
  category: "E-commerce",
  font: "Inter",
  theme: "default",
  socialLinks: {},
  monetizationFeatures: defaultMonetizationFeatures,
  customCSS: "",
  customJS: "",
  userId: 0
};

const socialPlatforms = [
  { name: 'facebook', icon: Facebook, color: '#1877F2' },
  { name: 'twitter', icon: TwitterX, color: '#000000' },
  { name: 'instagram', icon: Instagram, color: '#E4405F' },
  { name: 'linkedin', icon: Linkedin, color: '#0A66C2' },
  { name: 'youtube', icon: Youtube, color: '#FF0000' },
  { name: 'website', icon: Globe, color: '#000000' },
];

const themes = [
  { name: 'default' as const, label: 'Default', class: '' },
  { name: 'rose' as const, label: 'Rose', class: 'theme-rose' },
  { name: 'teal' as const, label: 'Teal', class: 'theme-teal' },
  { name: 'blue' as const, label: 'Blue', class: 'theme-blue' },
  { name: 'olivegreen' as const, label: 'Olive Green', class: 'theme-olivegreen' },
  { name: 'amber' as const, label: 'Amber', class: 'theme-amber' },
  { name: 'turquoise' as const, label: 'Turquoise', class: 'theme-turquoise' },
] as const;

type Theme = (typeof themes)[number]['name'];

interface APIResponse {
  id: number;
  title: string;
  description: string;
  logo: string;
  category: string;
  font: string;
  theme: string;
  social_links: Record<string, string>;
  monetization_features: any;
  custom_css: string;
  custom_js: string;
  status: string;
  user_id: number;
}

const isValidTheme = (theme: string | undefined): theme is ThemeType => {
  return theme !== undefined && ['default', 'rose', 'teal', 'blue', 'olivegreen', 'amber', 'turquoise'].includes(theme);
};

export default function CreateNewPage() {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<Page404>(defaultPage);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, makeAuthenticatedRequest } = useAuth();
  const { data: session } = useSession();
  const { processPayment, loading: paymentLoading } = useRazorpay();

  useEffect(() => {
    async function fetchPage() {
      try {
        if (params.id === 'new') {
          // Ensure new pages have default theme set
          setPage(prev => ({ ...prev, theme: "default" }));
          setLoading(false);
          return;
        }

        try {
          const pageData = await makeAuthenticatedRequest(`/api/pages/${params.id}`).then(res => res.json()) as APIResponse;

          if (!pageData) {
            toast.error({
              description: "Failed to load page"
            });
            return;
          }

          // Parse JSON fields and set defaults
          const safeMonetizationFeatures = {
            affiliateLinks: pageData.monetization_features?.affiliateLinks || [],
            contentLock: {
              enabled: pageData.monetization_features?.contentLock?.enabled ?? false,
              content: pageData.monetization_features?.contentLock?.content ?? "",
              unlockType: pageData.monetization_features?.contentLock?.unlockType ?? "email",
              redirectUrl: pageData.monetization_features?.contentLock?.redirectUrl ?? ""
            },
            emailCollection: {
              enabled: pageData.monetization_features?.emailCollection?.enabled ?? false,
              title: pageData.monetization_features?.emailCollection?.title ?? "Subscribe to our newsletter",
              description: pageData.monetization_features?.emailCollection?.description ?? "Get exclusive updates and offers",
              buttonText: pageData.monetization_features?.emailCollection?.buttonText ?? "Subscribe",
              emailPlaceholder: pageData.monetization_features?.emailCollection?.emailPlaceholder ?? "Enter your email",
              webhookUrl: pageData.monetization_features?.emailCollection?.webhookUrl,
              successMessage: pageData.monetization_features?.emailCollection?.successMessage ?? "Thank you for subscribing!"
            },
            countdownOffer: {
              enabled: pageData.monetization_features?.countdownOffer?.enabled ?? false,
              title: pageData.monetization_features?.countdownOffer?.title ?? "Limited Time Offer",
              description: pageData.monetization_features?.countdownOffer?.description ?? "Don't miss out on this special deal!",
              expiryDate: pageData.monetization_features?.countdownOffer?.expiryDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              redirectUrl: pageData.monetization_features?.countdownOffer?.redirectUrl ?? "",
              buttonText: pageData.monetization_features?.countdownOffer?.buttonText ?? "Claim Offer"
            },
            adSense: {
              enabled: pageData.monetization_features?.adSense?.enabled ?? false,
              code: pageData.monetization_features?.adSense?.code ?? "",
              placement: pageData.monetization_features?.adSense?.placement ?? "top"
            },
            leadMagnet: {
              enabled: pageData.monetization_features?.leadMagnet?.enabled ?? false,
              title: pageData.monetization_features?.leadMagnet?.title ?? "Get Our Free Guide",
              description: pageData.monetization_features?.leadMagnet?.description ?? "Download our comprehensive guide to get started",
              fileUrl: pageData.monetization_features?.leadMagnet?.fileUrl ?? "",
              buttonText: pageData.monetization_features?.leadMagnet?.buttonText ?? "Download Now",
              emailPlaceholder: pageData.monetization_features?.leadMagnet?.emailPlaceholder ?? "Enter your email",
              successMessage: pageData.monetization_features?.leadMagnet?.successMessage ?? "Check your email for the download link!",
              fileType: pageData.monetization_features?.leadMagnet?.fileType ?? "pdf"
            },
            sponsoredContent: {
              enabled: pageData.monetization_features?.sponsoredContent?.enabled ?? false,
              title: pageData.monetization_features?.sponsoredContent?.title ?? "Amazing Product",
              description: pageData.monetization_features?.sponsoredContent?.description ?? "Check out this amazing product that we recommend",
              imageUrl: pageData.monetization_features?.sponsoredContent?.imageUrl ?? "",
              redirectUrl: pageData.monetization_features?.sponsoredContent?.redirectUrl ?? "",
              buttonText: pageData.monetization_features?.sponsoredContent?.buttonText ?? "Learn More",
              sponsorName: pageData.monetization_features?.sponsoredContent?.sponsorName ?? "Brand Name"
            },
            donationButton: {
              enabled: pageData.monetization_features?.donationButton?.enabled ?? false,
              title: pageData.monetization_features?.donationButton?.title ?? "Support Our Work",
              description: pageData.monetization_features?.donationButton?.description ?? "Help us continue creating amazing content",
              donationUrl: pageData.monetization_features?.donationButton?.donationUrl ?? "",
              buttonText: pageData.monetization_features?.donationButton?.buttonText ?? "Donate Now",
              platform: pageData.monetization_features?.donationButton?.platform ?? "paypal",
              targetAmount: pageData.monetization_features?.donationButton?.targetAmount,
              currency: pageData.monetization_features?.donationButton?.currency ?? "USD"
            },
            newsletterSignup: {
              enabled: pageData.monetization_features?.newsletterSignup?.enabled ?? false,
              title: pageData.monetization_features?.newsletterSignup?.title ?? "Subscribe to our newsletter",
              description: pageData.monetization_features?.newsletterSignup?.description ?? "Get the latest updates and exclusive content",
              buttonText: pageData.monetization_features?.newsletterSignup?.buttonText ?? "Subscribe",
              emailPlaceholder: pageData.monetization_features?.newsletterSignup?.emailPlaceholder ?? "Enter your email",
              provider: pageData.monetization_features?.newsletterSignup?.provider ?? "custom",
              apiKey: pageData.monetization_features?.newsletterSignup?.apiKey,
              listId: pageData.monetization_features?.newsletterSignup?.listId,
              webhookUrl: pageData.monetization_features?.newsletterSignup?.webhookUrl,
              successMessage: pageData.monetization_features?.newsletterSignup?.successMessage ?? "Thank you for subscribing!"
            },
            productShowcase: {
              enabled: pageData.monetization_features?.productShowcase?.enabled ?? false,
              title: pageData.monetization_features?.productShowcase?.title ?? "Our Products",
              description: pageData.monetization_features?.productShowcase?.description ?? "Check out our amazing products",
              products: pageData.monetization_features?.productShowcase?.products ?? []
            },
            socialProof: {
              enabled: pageData.monetization_features?.socialProof?.enabled ?? false,
              title: pageData.monetization_features?.socialProof?.title ?? "What Our Customers Say",
              testimonials: pageData.monetization_features?.socialProof?.testimonials ?? []
            },
            exitIntent: {
              enabled: pageData.monetization_features?.exitIntent?.enabled ?? false,
              title: pageData.monetization_features?.exitIntent?.title ?? "Wait! Don't Leave Yet",
              description: pageData.monetization_features?.exitIntent?.description ?? "Get 20% off your first order",
              offerText: pageData.monetization_features?.exitIntent?.offerText ?? "Use code SAVE20 at checkout",
              buttonText: pageData.monetization_features?.exitIntent?.buttonText ?? "Claim Offer",
              redirectUrl: pageData.monetization_features?.exitIntent?.redirectUrl ?? "",
              delaySeconds: pageData.monetization_features?.exitIntent?.delaySeconds ?? 3
            },
            customRedirects: pageData.monetization_features?.customRedirects ?? false
          };

          const finalTheme: Theme = (pageData.theme && ["default", "rose", "teal", "blue", "olivegreen", "amber", "turquoise"].includes(pageData.theme)) 
            ? pageData.theme as Theme 
            : "default";

          setPage({
            id: pageData.id,
            title: pageData.title || "",
            description: pageData.description || "",
            logo: pageData.logo || "",
            category: pageData.category || "E-commerce",
            font: pageData.font || "Inter",
            theme: finalTheme,
            socialLinks: pageData.social_links || {},
            monetizationFeatures: safeMonetizationFeatures,
            customCSS: pageData.custom_css || "",
            customJS: pageData.custom_js || "",
            status: pageData.status,
            userId: pageData.user_id,
          });
        } catch (error: any) {
          console.error("Error fetching page:", error);
          toast.error({
            description: error.message || "Failed to load page"
          });
          router.push('/dashboard/pages');
        } finally {
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error in fetchPage:", error);
        setLoading(false);
      }
    }

    fetchPage();
  }, [params.id, makeAuthenticatedRequest, router]);

  const updatePage = (updates: Partial<Page404>) => {
    setPage(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Check for authentication
      if (!session?.user && !localStorage.getItem('token')) {
        toast.error({
          description: "You must be logged in to save pages"
        });
        return;
      }

      const isNewPage = params.id === 'new';
      const endpoint = isNewPage ? '/api/pages' : `/api/pages/${params.id}`;
      const method = isNewPage ? 'POST' : 'PUT';

      // Clean data structure - only send snake_case properties that the API expects
      const dataToSave = {
        title: page.title || 'Untitled Page',
        description: page.description || '',
        logo: page.logo || '',
        category: page.category || 'E-commerce',
        font: page.font || 'Inter',
        theme: page.theme as ThemeType,
        social_links: page.socialLinks || {},
        monetization_features: page.monetizationFeatures || {},
        custom_css: page.customCSS || '',
        custom_js: page.customJS || '',
        status: page.status || 'active'
      };

      const response = await makeAuthenticatedRequest(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save page: ${response.status}`);
      }

      const responseData = await response.json();

      // If this was a new page, update the URL and page state with the new ID
      if (isNewPage && responseData.id) {
        setPage(prev => ({ ...prev, id: responseData.id }));
        // Update URL without redirecting
        window.history.replaceState(null, '', `/dashboard/pages/${responseData.id}`);
      }

      toast.success({
        description: isNewPage 
          ? `Page "${page.title}" created successfully`
          : `Page "${page.title}" updated successfully`
      });

      // Redirect to pages dashboard
      router.push('/dashboard/pages');
    } catch (error: any) {
      console.error('Save error:', error);
      let errorMessage = "Failed to save page";
      
      // Handle specific error cases
      if (error.message.includes('401')) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error.message.includes('403')) {
        errorMessage = "You don't have permission to save this page.";
      } else if (error.message.includes('404')) {
        errorMessage = "Page not found. It may have been deleted.";
      } else if (error.message.includes('validation')) {
        errorMessage = "Please check all required fields are filled correctly.";
      }
      
      toast.error({
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialPlatform = (platform: string) => {
    updatePage({
      socialLinks: {
        ...page.socialLinks,
        [platform]: ''
      }
    });
  };

  const removeSocialPlatform = (platform: string) => {
    const newSocialLinks = { ...page.socialLinks };
    delete newSocialLinks[platform];
    updatePage({ socialLinks: newSocialLinks });
  };

  const updateSocialLink = (platform: string, url: string) => {
    updatePage({
      socialLinks: {
        ...page.socialLinks,
        [platform]: url
      }
    });
  };

  // Enhanced Preview Component with all monetization features
  const Preview = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isVisible, setIsVisible] = useState(true);

    // Map font names to their CSS font families using CSS variables
    const fontFamilyMap: Record<string, string> = {
      'Inter': 'var(--font-inter, ui-sans-serif, system-ui, sans-serif)',
      'Roboto': 'var(--font-roboto, ui-sans-serif, system-ui, sans-serif)',
      'Open Sans': 'var(--font-open-sans, ui-sans-serif, system-ui, sans-serif)',
      'Lato': 'var(--font-lato, ui-sans-serif, system-ui, sans-serif)',
      'Poppins': 'var(--font-poppins, ui-sans-serif, system-ui, sans-serif)',
      'Montserrat': 'var(--font-montserrat, ui-sans-serif, system-ui, sans-serif)'
    };

    const selectedFontFamily = fontFamilyMap[page.font] || fontFamilyMap['Inter'];

    const getThemeColors = (theme: string = 'default') => {
      const themeColorMap = {
        default: {
          primary: 'bg-black hover:bg-gray-800',
          primaryText: 'text-white',
          accent: 'text-black',
          border: 'border-gray-200',
          background: 'bg-gray-100',
          destructive: 'bg-black hover:bg-gray-800',
          success: 'bg-black hover:bg-gray-800',
          warning: 'bg-gray-700 hover:bg-gray-800',
          info: 'bg-blue-600 hover:bg-blue-700',
          purple: 'bg-black hover:bg-gray-700',
          orange: 'bg-black hover:bg-gray-700',
        },
        rose: {
          primary: 'bg-rose-600 hover:bg-rose-700',
          primaryText: 'text-white',
          accent: 'text-rose-600',
          border: 'border-rose-200',
          background: 'bg-rose-100',
          destructive: 'bg-red-600 hover:bg-red-700',
          success: 'bg-red-500 hover:bg-red-600',
          warning: 'bg-red-500 hover:bg-red-600',
          info: 'bg-red-500 hover:bg-red-600',
          purple: 'bg-red-600 hover:bg-red-700',
          orange: 'bg-red-600 hover:bg-red-700',
        },
        teal: {
          primary: 'bg-teal-600 hover:bg-teal-700',
          primaryText: 'text-white',
          accent: 'text-teal-600',
          border: 'border-teal-200',
          background: 'bg-teal-100',
          destructive: 'bg-teal-600 hover:bg-teal-700',
          success: 'bg-teal-600 hover:bg-teal-700',
          warning: 'bg-teal-600 hover:bg-teal-700',
          info: 'bg-teal-600 hover:bg-teal-700',
          purple: 'bg-teal-600 hover:bg-teal-700',
          orange: 'bg-teal-600 hover:bg-teal-700',
        },
        blue: {
          primary: 'bg-blue-600 hover:bg-blue-700',
          primaryText: 'text-white',
          accent: 'text-blue-600',
          border: 'border-blue-200',
          background: 'bg-blue-100',
          destructive: 'bg-blue-600 hover:bg-blue-700',
          success: 'bg-blue-600 hover:bg-blue-700',
          warning: 'bg-blue-600 hover:bg-blue-700',
          info: 'bg-blue-600 hover:bg-blue-700',
          purple: 'bg-blue-600 hover:bg-blue-700',
          orange: 'bg-blue-600 hover:bg-blue-700',
        },
        olivegreen: {
          primary: 'bg-green-700 hover:bg-green-800',
          primaryText: 'text-white',
          accent: 'text-green-700',
          border: 'border-green-200',
          background: 'bg-green-100',
          destructive: 'bg-green-700 hover:bg-green-800',
          success: 'bg-green-700 hover:bg-green-800',
          warning: 'bg-green-700 hover:bg-green-800',
          info: 'bg-green-700 hover:bg-green-800',
          purple: 'bg-green-700 hover:bg-green-800',
          orange: 'bg-green-700 hover:bg-green-800',
        },
        amber: {
          primary: 'bg-amber-500 hover:bg-amber-600',
          primaryText: 'text-amber-900',
          accent: 'text-amber-600',
          border: 'border-amber-200',
          background: 'bg-amber-100',
          destructive: 'bg-amber-500 hover:bg-amber-600',
          success: 'bg-amber-500 hover:bg-amber-600',
          warning: 'bg-amber-500 hover:bg-amber-600',
          info: 'bg-amber-500 hover:bg-amber-600',
          purple: 'bg-amber-500 hover:bg-amber-600',
          orange: 'bg-amber-500 hover:bg-amber-600',
        },
        turquoise: {
          primary: 'bg-cyan-500 hover:bg-cyan-600',
          primaryText: 'text-white',
          accent: 'text-cyan-500',
          border: 'border-cyan-200',
          background: 'bg-cyan-100',
          destructive: 'bg-cyan-500 hover:bg-cyan-600',
          success: 'bg-cyan-500 hover:bg-cyan-600',
          warning: 'bg-cyan-500 hover:bg-cyan-600',
          info: 'bg-cyan-500 hover:bg-cyan-600',
          purple: 'bg-cyan-500 hover:bg-cyan-600',
          orange: 'bg-cyan-500 hover:bg-cyan-600',
        }
      };
      
      return themeColorMap[theme as keyof typeof themeColorMap] || themeColorMap.default;
    };

    const colors = getThemeColors(page.theme);

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
    const CountdownTimer = ({ expiryDate, title, description, buttonText }: {
      expiryDate: string;
      title: string;
      description: string;
      buttonText: string;
    }) => {
      const countdownTime = useCountdown(expiryDate);
      const timeUnits = [
        { label: 'Days', value: countdownTime.days.toString().padStart(2, '0') },
        { label: 'Hours', value: countdownTime.hours.toString().padStart(2, '0') },
        { label: 'Minutes', value: countdownTime.minutes.toString().padStart(2, '0') },
        { label: 'Seconds', value: countdownTime.seconds.toString().padStart(2, '0') }
      ];

      return (
        <div className="py-8 sm:py-12 bg-muted/30 border-y">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <Card className="border shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 ${colors.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className={`text-2xl ${colors.accent}`}>⏰</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-sm mx-auto">
                  {timeUnits.map((unit) => (
                    <Card key={unit.label} className="bg-muted/50 border">
                      <CardContent className="p-2 sm:p-3 text-center">
                        <div className="text-lg sm:text-2xl font-bold text-foreground">
                          {unit.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {unit.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button size="lg" className={`w-full sm:w-auto ${colors.destructive} ${colors.primaryText}`}>
                  {buttonText}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    };

    return (
      <div 
        className="h-full w-full bg-background overflow-auto" 
        style={{ fontFamily: selectedFontFamily }}
      >
        <div className="min-h-full">
          {/* AdSense - Top Placement */}
          {page.monetizationFeatures.adSense.enabled && page.monetizationFeatures.adSense.placement === 'top' && (
            <div className="w-full bg-muted/30 border-b">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <Card className="bg-gradient-to-r from-muted to-muted/50">
                  <CardContent className="p-4 text-center">
                    <Badge variant="secondary" className="mb-2">Advertisement</Badge>
                    <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
                      Ad Content Area - {page.monetizationFeatures.adSense.placement.toUpperCase()} Placement
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

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
                <Button className={`px-8 py-3 text-lg ${colors.primary} ${colors.primaryText}`}>
                  Go Back Home
                </Button>
              </div>
            </div>
          </div>

          {/* Content Lock Feature */}
          {page.monetizationFeatures.contentLock.enabled && (
            <div className="py-12 bg-muted/50 border-y">
              <div className="max-w-2xl mx-auto px-6">
                <Card className={`border-2 border-dashed ${colors.border}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Lock className={`h-6 w-6 ${colors.accent}`} />
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
                        <Button className={`${colors.success} ${colors.primaryText}`}>Unlock Content</Button>
                      </div>
                    )}
                    {page.monetizationFeatures.contentLock.unlockType === 'click' && (
                      <Button className={`${colors.success} ${colors.primaryText}`}>Click to Unlock</Button>
                    )}
                    {page.monetizationFeatures.contentLock.unlockType === 'social' && (
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Facebook className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <TwitterX className="h-4 w-4 mr-2" />
                          Tweet
                        </Button>
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
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
            />
          )}
          
          {/* Email Collection Feature */}
          {page.monetizationFeatures.emailCollection.enabled && (
            <div className="py-12 bg-muted/50 border-y">
              <div className="max-w-2xl mx-auto px-6 text-center">
                <Card className={`shadow-lg ${colors.border}`}>
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
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <Input
                        placeholder={page.monetizationFeatures.emailCollection.emailPlaceholder}
                        type="email"
                        className="flex-1"
                      />
                      <Button className={`${colors.success} ${colors.primaryText}`}>
                        {page.monetizationFeatures.emailCollection.buttonText}
                      </Button>
                    </div>
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
                    <Card key={link.id} className="hover:shadow-lg transition-all hover:scale-105 flex flex-col h-full w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px] cursor-pointer">
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
                        <Button className={`w-full mt-auto text-sm py-2 ${colors.primary} ${colors.primaryText}`}>
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
                        <Button size="lg" className={`${colors.primary} ${colors.primaryText}`}>
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
            <div className="py-8 sm:py-12 bg-muted/30 border-y">
              <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                <Card className={`${colors.border} shadow-lg`}>
                  <CardHeader>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colors.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Heart className={`h-6 w-6 sm:h-8 sm:w-8 ${colors.accent}`} />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl text-foreground">
                      {page.monetizationFeatures.donationButton.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
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
                    <Button size="lg" className={`w-full sm:w-auto ${colors.primary} ${colors.primaryText}`}>
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
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {page.monetizationFeatures.productShowcase.products.slice(0, 6).map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-all hover:scale-105 flex flex-col h-full relative w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px] cursor-pointer">
                      {product.featured && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className={`${colors.warning} ${colors.primaryText} text-xs border-amber-400`}>
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
                        <div className="mt-auto space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-lg sm:text-xl font-bold ${colors.accent}`}>{product.price}</span>
                          </div>
                          <Button className={`w-full text-sm ${colors.primary} ${colors.primaryText}`}>
                            <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Buy Now</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                        <div className="flex items-center mb-3 sm:mb-4">
                          {testimonial.imageUrl ? (
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                              <span className="text-sm sm:text-lg font-semibold">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base truncate">{testimonial.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{testimonial.role}</p>
                          </div>
                        </div>
                        {testimonial.rating && (
                          <div className="flex mb-2 sm:mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  i < testimonial.rating! ? `${colors.accent} fill-current` : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <blockquote className="text-muted-foreground italic text-sm sm:text-base leading-relaxed flex-grow">
                          <span className="line-clamp-4">
                            "{testimonial.content}"
                          </span>
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
                    <Button size="lg" className={`${colors.primary} ${colors.primaryText}`}>
                      {page.monetizationFeatures.exitIntent.buttonText}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This popup appears when users try to leave the page
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
                    <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
                      Ad Content Area - {page.monetizationFeatures.adSense.placement.toUpperCase()} Placement
                    </div>
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
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <Card className="mb-8 border shadow-lg">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {params.id === 'new' ? 'Create New 404 Page' : 'Edit 404 Page'}
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  {params.id === 'new' ? 'Design a custom 404 page to engage your visitors' : 'Update your existing 404 page'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/pages')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Pages
                </Button>
                {page.id && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/view/${page.id}`, '_blank')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                )}
                <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Page'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Fullscreen Preview Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="h-full flex flex-col">
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5" />
                  <h3 className="font-semibold">Live Preview</h3>
                  <Badge variant="outline">{viewMode}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(false)}
                  >
                    <Minimize className="h-4 w-4" />
                    Close
                  </Button>
                </div>
              </div>
              
              {/* Fullscreen Content */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className={`h-full mx-auto overflow-hidden rounded-lg border bg-background ${
                  viewMode === "mobile" ? "max-w-sm" : "max-w-6xl"
                }`}>
                  <div className="h-full overflow-auto">
                    <Preview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-8 ${isFullscreen ? 'hidden' : 'xl:grid-cols-4'}`}>
          {/* Editor Section */}
          <div className="xl:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="general" className="gap-2">
                  <Settings className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="social" className="gap-2">
                  <Users className="h-4 w-4" />
                  Social
                </TabsTrigger>
                <TabsTrigger value="monetization" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monetization
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Code className="h-4 w-4" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="embed" className="gap-2">
                  <Link className="h-4 w-4" />
                  Use Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Configure the main content of your 404 page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a catchy title for your 404 page"
                        value={page.title}
                        onChange={(e) => updatePage({ title: e.target.value })}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Write a helpful message for visitors who land on this page"
                        value={page.description}
                        onChange={(e) => updatePage({ description: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input
                        id="logo"
                        placeholder="https://example.com/logo.png"
                        value={page.logo}
                        onChange={(e) => updatePage({ logo: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={page.category} onValueChange={(value) => updatePage({ category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="Blog">Blog</SelectItem>
                            <SelectItem value="Portfolio">Portfolio</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={page.theme || "default"} onValueChange={(value) => {
                          if (isValidTheme(value)) {
                            updatePage({ theme: value });
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="rose">Rose</SelectItem>
                            <SelectItem value="teal">Teal</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="olivegreen">Olive Green</SelectItem>
                            <SelectItem value="amber">Amber</SelectItem>
                            <SelectItem value="turquoise">Turquoise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="font">Font</Label>
                        <Select value={page.font} onValueChange={(value) => updatePage({ font: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Social Media Links
                    </CardTitle>
                    <CardDescription>
                      Add social media links to help visitors connect with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Social Platform */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {socialPlatforms
                        .filter(platform => !page.socialLinks[platform.name])
                        .map((platform) => {
                          const IconComponent = platform.icon;
                          return (
                            <Button
                              key={platform.name}
                              variant="outline"
                              size="default"
                              onClick={() => addSocialPlatform(platform.name)}
                              className="gap-2 justify-start h-10 px-4"
                            >
                              <IconComponent className="h-4 w-4" />
                              Add {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                            </Button>
                          );
                        })}
                    </div>

                    <Separator />

                    {/* Active Social Links */}
                    <div className="space-y-4">
                      {Object.entries(page.socialLinks).map(([platform, url]) => {
                        const socialPlatform = socialPlatforms.find(p => p.name === platform);
                        if (!socialPlatform) return null;

                        const IconComponent = socialPlatform.icon;
                        return (
                          <div key={platform} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-background rounded-lg border">
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder={`Enter your ${platform} URL`}
                                value={url}
                                onChange={(e) => updateSocialLink(platform, e.target.value)}
                                className="flex-1"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSocialPlatform(platform)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>

                    {Object.keys(page.socialLinks).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No social media links added yet. Click the buttons above to get started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monetization" className="space-y-6">
                <MonetizationFeaturesSection
                  features={page.monetizationFeatures}
                  onChange={(features) => updatePage({ monetizationFeatures: features })}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {user?.plan === 'free' ? (
                  <PlanLock
                    title="Advanced Features Available in Pro"
                    description="Unlock advanced customization tools to create unique and professional 404 pages with custom styling."
                    features={[
                      "Custom CSS styling",
                      "Custom JavaScript functionality",
                      "Advanced styling controls"
                    ]}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Custom Code
                      </CardTitle>
                      <CardDescription>
                        Add custom CSS and JavaScript to your page
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="customCSS">Custom CSS</Label>
                        <Textarea
                          id="customCSS"
                          placeholder="/* Add your custom CSS here */"
                          value={page.customCSS}
                          onChange={(e) => updatePage({ customCSS: e.target.value })}
                          className="min-h-[120px] font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customJS">Custom JavaScript</Label>
                        <Textarea
                          id="customJS"
                          placeholder="// Add your custom JavaScript here"
                          value={page.customJS}
                          onChange={(e) => updatePage({ customJS: e.target.value })}
                          className="min-h-[120px] font-mono"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="embed" className="space-y-6">
                <UseCodeTab pageId={Array.isArray(params.id) ? params.id[0] : params.id || ''} page={page} user={user} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="xl:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <CardTitle>Live Preview</CardTitle>
                    {user?.plan === 'free' && (
                      <Badge variant="secondary" className="ml-2">
                        <Lock className="h-3 w-3 mr-1" />
                        Pro Only
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "desktop" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("desktop")}
                      disabled={user?.plan === 'free'}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("mobile")}
                      disabled={user?.plan === 'free'}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFullscreen(true)}
                      disabled={user?.plan === 'free'}
                    >
                      <Expand className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-background relative ${
                  viewMode === "mobile" ? "max-w-sm mx-auto" : ""
                }`}>
                  {/* Preview Content */}
                  <div className={`${
                    viewMode === "mobile" ? "h-[600px]" : "h-[800px]"
                  } overflow-auto ${user?.plan === 'free' ? 'blur-lg brightness-50 contrast-50' : ''}`}>
                    <Preview />
                  </div>
                  
                  {/* Free user overlay */}
                  {user?.plan === 'free' && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center">
                      <div className="text-center space-y-4 p-6 bg-background/95 rounded-lg border shadow-lg max-w-sm">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <Crown className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Upgrade to Pro to use Live Preview</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            See real-time changes as you build your 404 page
                          </p>
                          <Button
                            onClick={() => processPayment()}
                            disabled={paymentLoading}
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            {paymentLoading ? 'Processing...' : 'Upgrade Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 