"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, DollarSign, Users, ArrowUpRight, Check, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuth } from "@/contexts/auth-context";
import { hasProAccess } from "@/lib/plan-utils";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "404 Monetizer",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "description": "Transform your 404 error pages into revenue opportunities with smart redirections and real-time analytics. Recover lost visitors and boost conversions by 85%.",
  "url": "https://404monetizer.com",
  "author": {
    "@type": "Organization",
    "name": "404 Monetizer Team"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free trial available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "features": [
    "Smart 404 redirections",
    "Real-time analytics dashboard", 
    "Revenue tracking",
    "Conversion optimization",
    "Multi-platform integration"
  ]
};

export default function Home() {
  const { handleAuthRedirect } = useAuthRedirect();
  const { user } = useAuth();
  const { processPayment, loading } = useRazorpay();
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { detectBot, isLoaded } = useRecaptcha();
  const [botDetectionResult, setBotDetectionResult] = useState<{
    isBot: boolean;
    score?: number;
    timestamp?: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bot detection on page load
  useEffect(() => {
    const performBotDetection = async () => {
      if (!isLoaded) return;

      try {
        const isBot = await detectBot('homepage_load');
        const result = {
          isBot,
          timestamp: new Date().toISOString()
        };
        
        setBotDetectionResult(result);

        // Optional: You can take actions based on bot detection
        if (isBot) {
          // Handle bot traffic (e.g., show different content, track separately, etc.)
          // Example: Track bot visits separately in analytics
          // trackBotVisit();
        } else {
          // Handle human traffic
          // Example: Track human visits
          // trackHumanVisit();
        }
      } catch (error) {
        console.error('Bot detection failed:', error);
      }
    };

    // Run bot detection when reCAPTCHA is loaded
    if (isLoaded) {
      performBotDetection();
    }
  }, [isLoaded, detectBot]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleProAccess = async (e: React.MouseEvent) => {
    if (!user) {
      // If user is not logged in, redirect to sign in
      handleAuthRedirect(e);
      return;
    }

    e.preventDefault();

    if (hasProAccess(user)) {
      // If user is already pro, redirect to dashboard
      router.push('/dashboard');
      return;
    }

    // Process payment
    await processPayment(() => {
      router.push('/dashboard');
    });
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="flex flex-col min-h-screen pt-16">
        {/* Hero Section */}
        <motion.section 
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="flex flex-col items-center justify-center px-4 py-32 text-center bg-gradient-to-b from-background to-muted"
          role="banner"
          aria-label="Hero section"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            id="main-heading"
          >
            <motion.span 
              className="inline-block"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 0, 0],
                color: [
                  "hsl(var(--primary))",
                  "hsl(var(--secondary))", 
                  "hsl(var(--accent))",
                  "hsl(var(--primary))"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              404 Monetizer
            </motion.span>
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="mt-6 text-xl text-muted-foreground max-w-3xl"
            role="doc-subtitle"
          >
            Transform your 404 error pages into revenue-generating opportunities.
            No more wasted traffic, recover those visitors, subscribers, leads and boost your revenue with just one click.
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="flex flex-col items-center mt-6"
            role="complementary"
            aria-label="Performance statistics"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="font-medium">45,231+ visitors recovered</span>
              </span>
              <span aria-hidden="true">•</span>
              <span className="font-medium">$127K+ revenue generated</span>
              <span aria-hidden="true">•</span>
              <span className="font-medium">3.2% avg conversion rate</span>
            </div>
          </motion.div>
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 mt-4"
            role="navigation"
            aria-label="Main call to action"
          >
            <Link href="#" onClick={handleAuthRedirect}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 px-8 font-semibold">
                Start Monetizing
              </Button>
            </Link>
            <Link href="/#features">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200">
                See How It Works
              </Button>
            </Link>
          </motion.div>
          <motion.p 
            variants={fadeIn}
            className="text-sm text-muted-foreground mt-4"
          >
            ⚡ Setup in 2 minutes • 🔒 GDPR compliant
          </motion.p>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container mx-auto px-4 py-12"
          aria-label="Platform statistics"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Recoveries</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                  <Progress value={75} className="mt-3" aria-label="Recovery progress: 75%" />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                  <Progress value={65} className="mt-3" aria-label="Revenue progress: 65%" />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +7% from last month
                  </p>
                  <Progress value={45} className="mt-3" aria-label="Conversion progress: 45%" />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">
                    +12 new today
                  </p>
                  <Progress value={85} className="mt-3" aria-label="Monitor activity: 85%" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          id="features"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container mx-auto px-4 py-24"
          aria-labelledby="features-heading"
        >
          <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-12">
            <h2 id="features-heading" className="text-3xl font-bold mb-4">Why Choose 404 Monetizer?</h2>
            <p className="text-muted-foreground">
              Discover what makes 404 Monetizer the best choice for your business.
            </p>
          </motion.div>
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 mb-8 h-auto p-1">
              <TabsTrigger value="features" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Key Features</TabsTrigger>
              <TabsTrigger value="monitoring" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Real-time Monitoring</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="features">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerChildren}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                    <CardDescription>
                      Discover what makes 404 Monetizer the best choice for your business.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      variants={staggerChildren}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <motion.div variants={fadeIn}>
                        <Card>
                          <CardHeader>
                            <CardTitle>Smart Redirection</CardTitle>
                            <CardDescription>
                              Intelligent redirection system that guides users to relevant content.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• AI-powered recommendations</li>
                              <li>• User behavior analysis</li>
                              <li>• Custom redirection rules</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={fadeIn}>
                        <Card>
                          <CardHeader>
                            <CardTitle>Analytics Dashboard</CardTitle>
                            <CardDescription>
                              Track and analyze your 404 page performance with detailed insights.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Real-time performance metrics</li>
                              <li>• Conversion tracking</li>
                              <li>• Revenue analytics</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="monitoring">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Monitoring Dashboard</CardTitle>
                  <CardDescription>
                    Monitor your 404 pages performance and user behavior in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Active Visitors</div>
                        <div className="text-sm text-muted-foreground">234 users</div>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Conversion Rate</div>
                        <div className="text-sm text-muted-foreground">3.2%</div>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Server Response</div>
                        <div className="text-sm text-muted-foreground">124ms</div>
                      </div>
                      <Progress value={85} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Detailed insights into your 404 page performance and user behavior.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Top Revenue Sources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>1. Email Collection: $2,340/month (67%)</li>
                          <li>2. Affiliate Links: $1,890/month (24%)</li>
                          <li>3. Product Redirects: $590/month (9%)</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Performance Metrics</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Conversion Rate: 23.8%</li>
                          <li>• Average Session Time: 3m 47s</li>
                          <li>• Email Capture Rate: 18.2%</li>
                          <li>• Revenue Per Visitor: $4.23</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Growth Indicators</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Monthly Growth: +127%</li>
                          <li>• Active Pages: 2,847</li>
                          <li>• Total Revenue: $47.2k</li>
                          <li>• ROI Improvement: +340%</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Integration Showcase */}
        <section className="container mx-auto px-4 py-24 border-t">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Works With Your Stack</h2>
            <p className="text-muted-foreground">
              404 Monetizer seamlessly integrates with your favorite tools and platforms.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-75">
            <div className="flex items-center justify-center p-4">
              <img src="/logos/next.svg" alt="Next.js" className="h-8 dark:invert" />
            </div>
            <div className="flex items-center justify-center p-4">
              <img src="/logos/react.svg" alt="React" className="h-8" />
            </div>
            <div className="flex items-center justify-center p-4">
              <img src="/logos/vue.svg" alt="Vue" className="h-8" />
            </div>
            <div className="flex items-center justify-center p-4">
              <img src="/logos/angular.svg" alt="Angular" className="h-8" />
            </div>
            <div className="flex items-center justify-center p-4">
              <img src="/logos/shopify.svg" alt="Shopify" className="h-8" />
            </div>
            <div className="flex items-center justify-center p-4">
              <img src="/logos/wordpress.svg" alt="WordPress" className="h-8" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-muted/50 py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Developers</h2>
            
            {/* Marquee Animation Container */}
            <div className="relative overflow-hidden">
              <div className="flex animate-marquee hover:pause-marquee">
                <div className="flex space-x-8 min-w-max">
                  {/* Testimonials set */}
                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "404 Monetizer completely changed how we handle error pages. The analytics insights are incredible and the monetization features actually work!"
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Alex Chen"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Alex Chen</p>
                            <p className="text-sm text-muted-foreground">Senior Frontend Developer @ Stripe</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "Implementation took less than 5 minutes and we saw immediate ROI. Our 404 page now generates actual revenue instead of just being a dead end."
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Sarah Johnson"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Sarah Johnson</p>
                            <p className="text-sm text-muted-foreground">Lead Developer @ Shopify</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "The best part is how seamlessly it integrates with our existing stack. No complex setup, just results. Our conversion rates improved by 40%."
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Marcus Rodriguez"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Marcus Rodriguez</p>
                            <p className="text-sm text-muted-foreground">Full Stack Engineer @ Netflix</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "As a startup, every user interaction matters. 404 Monetizer helped us turn our biggest pain point into a revenue stream. Brilliant solution!"
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Emily Davis"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Emily Davis</p>
                            <p className="text-sm text-muted-foreground">CTO @ TechCrunch Startup</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "The analytics dashboard gives us insights we never had before. We can now optimize our error handling strategy based on real data."
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="David Kim"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">David Kim</p>
                            <p className="text-sm text-muted-foreground">DevOps Lead @ GitHub</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Duplicate for seamless loop */}
                <div className="flex space-x-8 min-w-max ml-8">
                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "404 Monetizer completely changed how we handle error pages. The analytics insights are incredible and the monetization features actually work!"
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Alex Chen"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Alex Chen</p>
                            <p className="text-sm text-muted-foreground">Senior Frontend Developer @ Stripe</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "Implementation took less than 5 minutes and we saw immediate ROI. Our 404 page now generates actual revenue instead of just being a dead end."
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Sarah Johnson"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Sarah Johnson</p>
                            <p className="text-sm text-muted-foreground">Lead Developer @ Shopify</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "The best part is how seamlessly it integrates with our existing stack. No complex setup, just results. Our conversion rates improved by 40%."
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Marcus Rodriguez"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Marcus Rodriguez</p>
                            <p className="text-sm text-muted-foreground">Full Stack Engineer @ Netflix</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "As a startup, every user interaction matters. 404 Monetizer helped us turn our biggest pain point into a revenue stream. Brilliant solution!"
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="Emily Davis"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Emily Davis</p>
                            <p className="text-sm text-muted-foreground">CTO @ TechCrunch Startup</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background min-w-[350px] max-w-[350px] flex-shrink-0">
                    <CardContent className="pt-5 pb-5 px-5">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          "The analytics dashboard gives us insights we never had before. We can now optimize our error handling strategy based on real data."
                        </p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face&auto=format&q=80" 
                            alt="David Kim"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">David Kim</p>
                            <p className="text-sm text-muted-foreground">DevOps Lead @ GitHub</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">
              Choose the perfect plan for your business. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Single 404 page creation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Basic 404 setup with social icons</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Home button navigation</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">No live preview editing</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">No monetization options</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">No analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Link href="#" onClick={handleAuthRedirect} className="w-full">
                  <Button className="w-full" variant="outline">Get Started Free</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col h-full border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground px-3 py-1 font-semibold">
                  Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">₹1,499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">50 custom 404 pages</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Advanced monetization Suite</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Full analytics & reporting</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Custom redirects</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">A/B testing</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button 
                  className="w-full" 
                  onClick={handleProAccess}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Get Pro Access'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container mx-auto px-4 py-24"
        >
          <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              See how 404 Monetizer transforms error pages into revenue opportunities
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={staggerChildren} className="space-y-8">
              <motion.div variants={fadeIn} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Smart Detection</h3>
                  <p className="text-muted-foreground">
                    Our system automatically detects 404 errors and analyzes user behavior patterns.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
                  <p className="text-muted-foreground">
                    Based on user behavior and preferences, we suggest relevant content and products.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Conversion Optimization</h3>
                  <p className="text-muted-foreground">
                    Turn disappointed visitors into happy customers with targeted offers.
                  </p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              className="relative rounded-lg overflow-hidden border bg-background p-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-full" />
                  <div className="h-32 bg-muted rounded w-full" />
                  <div className="flex gap-4">
                    <div className="h-24 bg-muted rounded flex-1" />
                    <div className="h-24 bg-muted rounded flex-1" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20 flex items-center justify-center">
                <Button size="lg" className="relative">
                  <span className="absolute inset-0 bg-primary/20 animate-ping rounded-md" />
                  Live Preview
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Success Metrics Section */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="bg-muted/50 py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Success Metrics</h2>
              <p className="text-muted-foreground">
                Real results from businesses using 404 Monetizer
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeIn} className="bg-background rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-primary">85%</div>
                <p className="text-sm text-muted-foreground">
                  Average Reduction in Bounce Rate
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-background rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-primary">2.5x</div>
                <p className="text-sm text-muted-foreground">
                  Increase in Page Engagement
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-background rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-primary">$50k+</div>
                <p className="text-sm text-muted-foreground">
                  Average Monthly Revenue Recovery
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-background rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-primary">5 mins</div>
                <p className="text-sm text-muted-foreground">
                  Average Setup Time
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          id="faq"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container mx-auto px-4 py-24"
        >
          <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about 404 Monetizer
            </p>
          </motion.div>
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeIn} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle>How does it work?</CardTitle>
                  <CardDescription className="mt-2">
                    404 Monetizer uses advanced algorithms to analyze user behavior and provide personalized recommendations when users hit a 404 error page. Our system automatically detects lost visitors and guides them to relevant content or products.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle>Is it easy to install?</CardTitle>
                  <CardDescription className="mt-2">
                    Yes! Installation takes less than 15 minutes. Simply add our script to your website and configure your preferences through our dashboard. We provide detailed documentation and support to ensure a smooth setup process.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle>What platforms do you support?</CardTitle>
                  <CardDescription className="mt-2">
                    We support all major platforms including Next.js, React, Vue, Angular, WordPress, Shopify, and more. Custom integrations are available for Enterprise plans. Our platform is designed to work seamlessly with any web technology.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle>How do you measure success?</CardTitle>
                  <CardDescription className="mt-2">
                    Our analytics dashboard provides detailed insights into recovered traffic, conversion rates, revenue generated, and other key metrics. Track your ROI in real-time and optimize your error page strategy with data-driven decisions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="bg-muted py-24"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
              Ready to Monetize Your 404 Pages?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground mb-8">
              Join thousands of businesses that have transformed their error pages into profit centers.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link href="#" onClick={handleAuthRedirect}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-50"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
