import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AffiliateLinksSection } from "./AffiliateLinksSection";
import { AdSenseSection } from "./AdSenseSection";
import { ContentLockSection } from "./ContentLockSection";
import { EmailCollectionSection } from "./EmailCollectionSection";
import { CountdownOfferSection } from "./CountdownOfferSection";
import { LeadMagnetSection } from "./LeadMagnetSection";
import { SponsoredContentSection } from "./SponsoredContentSection";
import { DonationButtonSection } from "./DonationButtonSection";
import { NewsletterSignupSection } from "./NewsletterSignupSection";
import { ProductShowcaseSection } from "./ProductShowcaseSection";
import { SocialProofSection } from "./SocialProofSection";
import { ExitIntentSection } from "./ExitIntentSection";
import { MonetizationFeatures } from "@/types/page";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Link, 
  Lock, 
  Mail, 
  Clock, 
  Download, 
  Star, 
  Heart, 
  Send, 
  Package, 
  Users, 
  MousePointer,
  Zap,
  TrendingUp,
  DollarSign,
  Crown
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PlanLock } from "@/components/ui/plan-lock";

interface Props {
  features: MonetizationFeatures;
  onChange: (features: MonetizationFeatures) => void;
}

const monetizationOptions = [
  {
    id: "affiliate",
    label: "Affiliate",
    icon: Link,
    description: "Promote affiliate products",
    enabled: (features: MonetizationFeatures) => features.affiliateLinks.length > 0,
    category: "Revenue"
  },
  {
    id: "adsense",
    label: "AdSense",
    icon: Zap,
    description: "Display Google ads",
    enabled: (features: MonetizationFeatures) => features.adSense.enabled,
    category: "Revenue"
  },
  {
    id: "content-lock",
    label: "Content Lock",
    icon: Lock,
    description: "Lock content behind actions",
    enabled: (features: MonetizationFeatures) => features.contentLock.enabled,
    category: "Engagement"
  },
  {
    id: "email",
    label: "Email Collection",
    icon: Mail,
    description: "Collect email addresses",
    enabled: (features: MonetizationFeatures) => features.emailCollection.enabled,
    category: "Lead Generation"
  },
  {
    id: "countdown",
    label: "Countdown",
    icon: Clock,
    description: "Create urgency with timers",
    enabled: (features: MonetizationFeatures) => features.countdownOffer.enabled,
    category: "Conversion"
  },
  {
    id: "lead-magnet",
    label: "Lead Magnet",
    icon: Download,
    description: "Offer free downloads",
    enabled: (features: MonetizationFeatures) => features.leadMagnet.enabled,
    category: "Lead Generation"
  },
  {
    id: "sponsored",
    label: "Sponsored",
    icon: Star,
    description: "Feature sponsored content",
    enabled: (features: MonetizationFeatures) => features.sponsoredContent.enabled,
    category: "Revenue"
  },
  {
    id: "donation",
    label: "Donation",
    icon: Heart,
    description: "Accept donations",
    enabled: (features: MonetizationFeatures) => features.donationButton.enabled,
    category: "Revenue"
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: Send,
    description: "Newsletter signups",
    enabled: (features: MonetizationFeatures) => features.newsletterSignup.enabled,
    category: "Lead Generation"
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    description: "Showcase your products",
    enabled: (features: MonetizationFeatures) => features.productShowcase.enabled,
    category: "Revenue"
  },
  {
    id: "social-proof",
    label: "Social Proof",
    icon: Users,
    description: "Display testimonials",
    enabled: (features: MonetizationFeatures) => features.socialProof.enabled,
    category: "Conversion"
  },
  {
    id: "exit-intent",
    label: "Exit Intent",
    icon: MousePointer,
    description: "Capture leaving visitors",
    enabled: (features: MonetizationFeatures) => features.exitIntent.enabled,
    category: "Conversion"
  }
];

const categories = ["All", "Revenue", "Lead Generation", "Engagement", "Conversion"];

const categoryIcons = {
  "Revenue": DollarSign,
  "Lead Generation": Mail,
  "Engagement": Users,
  "Conversion": TrendingUp
};

const categoryColors = {
  "Revenue": "from-green-500/20 to-emerald-500/20 border-green-200",
  "Lead Generation": "from-blue-500/20 to-cyan-500/20 border-blue-200",
  "Engagement": "from-purple-500/20 to-pink-500/20 border-purple-200",
  "Conversion": "from-orange-500/20 to-red-500/20 border-orange-200"
};

export default function MonetizationFeaturesSection({ features, onChange }: Props) {
  const { user } = useAuth();
  const enabledCount = monetizationOptions.filter(option => option.enabled(features)).length;

  // Show lock screen for free users
  if (user?.plan === 'free') {
    return (
      <PlanLock
        title="Monetization Features Available in Pro"
        description="Unlock powerful monetization tools to turn your 404 pages into revenue generators."
        features={[
          "Affiliate links integration",
          "Email collection forms",
          "Lead magnets and downloads",
          "Product showcase",
          "Donation buttons",
          "Sponsored content",
          "Social proof testimonials",
          "Exit-intent popups",
          "Countdown timers",
          "Newsletter signups"
        ]}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Monetization Features
                </CardTitle>
                <CardDescription className="text-base">
                  Configure how you want to monetize your 404 page
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <span className="text-primary font-semibold">{enabledCount}</span>
              <span className="text-muted-foreground ml-1">Active</span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(1).map((category) => {
          const categoryOptions = monetizationOptions.filter(opt => opt.category === category);
          const enabledInCategory = categoryOptions.filter(opt => opt.enabled(features)).length;
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <Card key={category} className="transition-all hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mb-3 flex justify-center">
                  <div className="p-2 rounded-lg bg-muted">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {enabledInCategory}
                  </div>
                  <div className="font-medium text-foreground">
                    {category}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {categoryOptions.length} enabled
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="affiliate" className="w-full">
        <div className="flex flex-col space-y-4">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg">
              {monetizationOptions.map((option) => {
                const IconComponent = option.icon;
                const isEnabled = option.enabled(features);
                
                return (
                  <TabsTrigger
                    key={option.id}
                    value={option.id}
                    className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <div className="p-1 rounded bg-primary/10">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline">{option.label}</span>
                    {isEnabled && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          {monetizationOptions.map((option) => (
            <TabsContent key={option.id} value={option.id} className="mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <option.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {option.label}
                        </CardTitle>
                        <CardDescription>
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge 
                        variant={option.enabled(features) ? "default" : "secondary"}
                        className="px-3 py-1"
                      >
                        {option.enabled(features) ? "✓ Enabled" : "Disabled"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {option.category}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {option.id === "affiliate" && (
                    <AffiliateLinksSection
                      links={features.affiliateLinks}
                      onChange={(links) => onChange({ ...features, affiliateLinks: links })}
                    />
                  )}

                  {option.id === "adsense" && (
                    <AdSenseSection
                      settings={features.adSense}
                      onChange={(settings) => onChange({ ...features, adSense: settings })}
                    />
                  )}

                  {option.id === "content-lock" && (
                    <ContentLockSection
                      settings={features.contentLock}
                      onChange={(settings) => onChange({ ...features, contentLock: settings })}
                    />
                  )}

                  {option.id === "email" && (
                    <EmailCollectionSection
                      settings={features.emailCollection}
                      onChange={(settings) => onChange({ ...features, emailCollection: settings })}
                    />
                  )}

                  {option.id === "countdown" && (
                    <CountdownOfferSection
                      settings={features.countdownOffer}
                      onChange={(settings) => onChange({ ...features, countdownOffer: settings })}
                    />
                  )}

                  {option.id === "lead-magnet" && (
                    <LeadMagnetSection
                      settings={features.leadMagnet}
                      onChange={(settings) => onChange({ ...features, leadMagnet: settings })}
                    />
                  )}

                  {option.id === "sponsored" && (
                    <SponsoredContentSection
                      settings={features.sponsoredContent}
                      onChange={(settings) => onChange({ ...features, sponsoredContent: settings })}
                    />
                  )}

                  {option.id === "donation" && (
                    <DonationButtonSection
                      settings={features.donationButton}
                      onChange={(settings) => onChange({ ...features, donationButton: settings })}
                    />
                  )}

                  {option.id === "newsletter" && (
                    <NewsletterSignupSection
                      settings={features.newsletterSignup}
                      onChange={(settings) => onChange({ ...features, newsletterSignup: settings })}
                    />
                  )}

                  {option.id === "products" && (
                    <ProductShowcaseSection
                      settings={features.productShowcase}
                      onChange={(settings) => onChange({ ...features, productShowcase: settings })}
                    />
                  )}

                  {option.id === "social-proof" && (
                    <SocialProofSection
                      settings={features.socialProof}
                      onChange={(settings) => onChange({ ...features, socialProof: settings })}
                    />
                  )}

                  {option.id === "exit-intent" && (
                    <ExitIntentSection
                      settings={features.exitIntent}
                      onChange={(settings) => onChange({ ...features, exitIntent: settings })}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
} 