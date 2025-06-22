import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
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
  Share2,
  Monitor, 
  Palette, 
  Settings, 
  Zap, 
  DollarSign, 
  BarChart3, 
  ArrowRight,
  Play,
  Pause
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

interface AnimatedPreviewProps {
  autoPlay?: boolean;
  className?: string;
}

export const Animated404Preview: React.FC<AnimatedPreviewProps> = ({ 
  autoPlay = true, 
  className = "" 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const steps = [
    {
      id: 'design',
      title: 'Design Your 404 Page',
      description: 'Choose from beautiful templates or create custom designs',
      icon: Palette,
      preview: {
        title: '404 - Page Not Found',
        subtitle: 'Oops! The page you\'re looking for doesn\'t exist.',
        hasButton: true,
        buttonText: 'Go Home',
        hasAnimation: true
      }
    },
    {
      id: 'monetize',
      title: 'Add Monetization Features',
      description: 'Include ads, affiliate links, email capture, and more',
      icon: DollarSign,
      preview: {
        title: '404 - Page Not Found',
        subtitle: 'While you\'re here, check out our latest offers!',
        hasButton: true,
        buttonText: 'View Offers',
        hasEmailCapture: true,
        hasAds: true,
        hasAnimation: true
      }
    },
    {
      id: 'configure',
      title: 'Configure Smart Features',
      description: 'Set up redirects, A/B testing, and advanced options',
      icon: Settings,
      preview: {
        title: '404 - Page Not Found',
        subtitle: 'We found some similar pages you might like:',
        hasButton: true,
        buttonText: 'Explore Similar',
        hasRecommendations: true,
        hasAnimation: true
      }
    },
    {
      id: 'deploy',
      title: 'Deploy & Track',
      description: 'Go live and monitor performance with real-time analytics',
      icon: BarChart3,
      preview: {
        title: '404 - Page Not Found',
        subtitle: 'Your optimized 404 page is now live!',
        hasButton: true,
        buttonText: 'View Analytics',
        hasAnalytics: true,
        hasAnimation: true
      }
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStepData = steps[currentStep];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const phoneVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:pl-20">
        {/* Left side - Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">See It In Action</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>

                     {steps.map((step, index) => (
             <motion.div
               key={step.id}
               variants={itemVariants}
               className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                 index === currentStep 
                   ? 'bg-primary/10 border-l-4 border-primary' 
                   : 'hover:bg-muted/50'
               }`}
               onClick={() => setCurrentStep(index)}
             >
               <div className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                 index === currentStep 
                   ? 'bg-primary border-primary text-primary-foreground' 
                   : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-primary'
               }`}>
                 <step.icon className="h-6 w-6" />
               </div>
               <div className="flex-1">
                 <h4 className="font-semibold mb-1">{step.title}</h4>
                 <p className="text-sm text-muted-foreground">{step.description}</p>
               </div>
               {index === currentStep && (
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="flex-shrink-0"
                 >
                   <Badge variant="default" className="bg-primary">
                     Active
                   </Badge>
                 </motion.div>
               )}
             </motion.div>
           ))}

          {/* Progress indicator */}
          <div className="flex gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-primary flex-1' : 'bg-muted w-2'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Right side - Preview */}
        <motion.div
          variants={phoneVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="relative mx-auto max-w-sm">
            {/* Phone frame */}
            <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-black rounded-[2rem] p-1">
                <div className="bg-white rounded-[1.5rem] overflow-hidden h-[600px]">
                  {/* Status bar */}
                  <div className="bg-gray-100 h-6 flex items-center justify-between px-4 text-xs">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                      <div className="w-1 h-2 bg-gray-400 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Browser bar */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-500">
                      yoursite.com/missing-page
                    </div>
                  </div>

                  {/* 404 Page Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4"
                    >
                      {/* Animated 404 number */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl font-bold text-gray-300 mb-2"
                      >
                        404
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg font-semibold text-gray-800"
                      >
                        {currentStepData.preview.title}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-gray-600"
                      >
                        {currentStepData.preview.subtitle}
                      </motion.p>

                      {/* Dynamic content based on step */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="w-full space-y-3"
                      >
                        {currentStepData.preview.hasEmailCapture && (
                          <div className="space-y-2">
                            <input
                              type="email"
                              placeholder="Enter your email for updates"
                              className="w-full px-3 py-2 text-xs border rounded-md"
                              readOnly
                            />
                          </div>
                        )}

                                                 {currentStepData.preview.hasAds && (
                           <div className="bg-primary/10 border border-primary/20 rounded p-2">
                             <div className="text-xs text-primary font-medium">
                               Special Offer - 50% Off!
                             </div>
                           </div>
                         )}

                        {currentStepData.preview.hasRecommendations && (
                          <div className="space-y-1">
                            <div className="bg-gray-50 rounded p-2 text-xs text-left">
                              📄 Similar Article 1
                            </div>
                            <div className="bg-gray-50 rounded p-2 text-xs text-left">
                              📄 Similar Article 2
                            </div>
                          </div>
                        )}

                                                 {currentStepData.preview.hasAnalytics && (
                           <div className="bg-primary/10 border border-primary/20 rounded p-2">
                             <div className="text-xs text-primary font-medium">
                               ✅ Analytics Active
                             </div>
                             <div className="text-xs text-primary/70">
                               Tracking conversions...
                             </div>
                           </div>
                         )}

                                                 {currentStepData.preview.hasButton && (
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                           >
                             {currentStepData.preview.buttonText}
                           </motion.button>
                         )}
                      </motion.div>

                                             {/* Floating elements for animation */}
                       {currentStepData.preview.hasAnimation && (
                         <>
                           <motion.div
                             animate={{
                               y: [0, -10, 0],
                               opacity: [0.5, 1, 0.5]
                             }}
                             transition={{
                               duration: 2,
                               repeat: Infinity,
                               ease: "easeInOut"
                             }}
                             className="absolute top-20 right-4 w-2 h-2 bg-primary/60 rounded-full"
                           />
                           <motion.div
                             animate={{
                               y: [0, -15, 0],
                               opacity: [0.3, 0.8, 0.3]
                             }}
                             transition={{
                               duration: 3,
                               repeat: Infinity,
                               ease: "easeInOut",
                               delay: 1
                             }}
                             className="absolute top-32 left-4 w-3 h-3 bg-primary/40 rounded-full"
                           />
                         </>
                       )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Floating action indicator */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
            >
              <Zap className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Animated404Preview;