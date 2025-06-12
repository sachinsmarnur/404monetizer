import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Download, 
  Heart, 
  Mail, 
  Star, 
  ExternalLink, 
  Lock, 
  Gift, 
  Users,
  MousePointer,
  Share2
} from "lucide-react";
import { ThemeType } from "@/lib/theme-styles";

// Helper function to get theme-based colors
const getThemeColors = (theme: ThemeType = 'default') => {
  const themeColorMap = {
    default: {
      primary: 'bg-black hover:bg-gray-800',
      primaryText: 'text-white',
      accent: 'text-black',
      border: 'border-gray-200',
      background: 'bg-gray-100',
      destructive: 'bg-black hover:bg-gray-800',
      success: 'bg-green-600 hover:bg-green-700',
      warning: 'bg-amber-600 hover:bg-amber-700',
      info: 'bg-blue-600 hover:bg-blue-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
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
  
  return themeColorMap[theme];
};

// Helper function to get social icon colors
const getSocialIconStyle = (platform: string) => {
  const styles = {
    facebook: "bg-blue-600 hover:bg-blue-700",
    twitter: "bg-black hover:bg-gray-800", 
    instagram: "bg-pink-600 hover:bg-pink-700",
    linkedin: "bg-blue-700 hover:bg-blue-800",
    youtube: "bg-red-600 hover:bg-red-700",
    website: "bg-gray-600 hover:bg-gray-700"
  };
  return styles[platform as keyof typeof styles] || "bg-gray-600 hover:bg-gray-700";
};

// Main 404 Content
export function Main404Content({ title, description, theme = 'default' }: { title: string; description: string; theme?: ThemeType }) {
  const colors = getThemeColors(theme);
  
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          {title || "Page Not Found"}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {description || "The page you're looking for doesn't exist."}
        </p>
        <Button size="lg" className={`gap-2 ${colors.primary} ${colors.primaryText}`}>
          <ExternalLink className="h-4 w-4" />
          Go Back Home
        </Button>
      </div>
    </div>
  );
}

// Social Links Section
export function SocialLinksSection({ socialLinks, theme = 'default' }: { socialLinks: any; theme?: ThemeType }) {
  const activeSocials = Object.entries(socialLinks).filter(([_, url]) => url);
  
  if (activeSocials.length === 0) return null;

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {activeSocials.map(([platform, url]) => (
            <Button
              key={platform}
              variant="outline"
              size="sm"
              className={`gap-2 ${getSocialIconStyle(platform)} text-white border-none hover:scale-105 transition-transform`}
              asChild
            >
              <a href={url as string} target="_blank" rel="noopener noreferrer">
                <Share2 className="h-4 w-4" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Lead Magnet Component
export function LeadMagnetSection({ settings, theme = 'default' }: { settings: any; theme?: ThemeType }) {
  if (!settings.enabled) return null;

  const colors = getThemeColors(theme);

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className={`border-2 ${colors.border} shadow-lg`}>
          <CardHeader className="text-center">
            <div className={`mx-auto w-12 h-12 ${colors.background} rounded-full flex items-center justify-center mb-4`}>
              <Download className={`h-6 w-6 ${colors.accent}`} />
            </div>
            <CardTitle className="text-xl">{settings.title}</CardTitle>
            <CardDescription className="text-base">
              {settings.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder={settings.emailPlaceholder}
                type="email"
                className="flex-1"
              />
              <Button className={`gap-2 ${colors.primary} ${colors.primaryText}`}>
                <Download className="h-4 w-4" />
                {settings.buttonText}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {settings.fileType.toUpperCase()}
              </Badge>
              <span>Free download • No spam</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sponsored Content Component
export function SponsoredContentSection({ settings, theme = 'default' }: { settings: any; theme?: ThemeType }) {
  if (!settings.enabled) return null;

  const colors = getThemeColors(theme);

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Alert className="border-amber-200 bg-amber-50">
          <Star className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Sponsored Content
          </AlertDescription>
        </Alert>
        <Card className="mt-4 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {settings.imageUrl && (
                <div className="w-full md:w-1/3">
                  <img
                    src={settings.imageUrl}
                    alt={settings.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">{settings.title}</h3>
                <p className="text-muted-foreground mb-4">{settings.description}</p>
                <Button className={`gap-2 ${colors.primary} ${colors.primaryText}`}>
                  <ExternalLink className="h-4 w-4" />
                  {settings.buttonText}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Sponsored by {settings.sponsorName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Donation Button Component
export function DonationSection({ settings, theme = 'default' }: { settings: any; theme?: ThemeType }) {
  if (!settings.enabled) return null;

  const colors = getThemeColors(theme);

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto px-4">
        <Card className={`text-center shadow-lg ${colors.border}`}>
          <CardHeader>
            <div className={`mx-auto w-12 h-12 ${colors.background} rounded-full flex items-center justify-center mb-4`}>
              <Heart className={`h-6 w-6 ${colors.accent}`} />
            </div>
            <CardTitle className="text-xl">{settings.title}</CardTitle>
            <CardDescription className="text-base">
              {settings.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.targetAmount && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goal: {settings.currency} {settings.targetAmount}</span>
                  <span>75% reached</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}
            <Button className={`w-full gap-2 ${colors.destructive} ${colors.primaryText}`}>
              <Heart className="h-4 w-4" />
              {settings.buttonText}
            </Button>
            <Badge variant="outline" className="text-xs">
              Powered by {settings.platform}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Newsletter Signup Component
export function NewsletterSection({ settings, theme = 'default' }: { settings: any; theme?: ThemeType }) {
  if (!settings.enabled) return null;

  const colors = getThemeColors(theme);

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg border bg-card">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 ${colors.background} rounded-full flex items-center justify-center mb-4`}>
              <Mail className={`h-8 w-8 ${colors.accent}`} />
            </div>
            <CardTitle className={`text-2xl ${colors.accent}`}>{settings.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {settings.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder={settings.emailPlaceholder}
                type="email"
                className="flex-1"
              />
              <Button className={`${colors.primary} ${colors.primaryText}`}>
                {settings.buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Product Showcase Component
export function ProductShowcaseSection({ settings, theme = 'default' }: { settings: any; theme?: ThemeType }) {
  if (!settings.enabled || settings.products.length === 0) return null;

  const colors = getThemeColors(theme);

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-2">{settings.title}</h3>
          <p className="text-muted-foreground">{settings.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.products.slice(0, 3).map((product: any, index: number) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              {product.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{product.name}</h4>
                  {product.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${colors.accent}`}>{product.price}</span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}