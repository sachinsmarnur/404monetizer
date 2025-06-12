"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

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

export default function AboutPage() {
  const { handleAuthRedirect } = useAuthRedirect();

  return (
    <div className="min-h-screen pt-16">
      <motion.div
        key="about-page"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <motion.section
          variants={staggerChildren}
          className="bg-muted/50 py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">About 404 Monetizer</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Transforming lost visitors into opportunities, one 404 page at a time. Built with passion by a developer who believes every error is a chance to create something better.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={staggerChildren}
          className="py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Mission & Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built with a clear vision: every lost visitor is an opportunity waiting to be discovered. 
                Here's what drives the development of 404 Monetizer.
              </p>
            </motion.div>
            <motion.div 
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              <motion.div variants={fadeIn}>
                <Card className="h-full">
                  <CardHeader>
                    <Users className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>Customer Success First</CardTitle>
                    <CardDescription>
                      Every feature is built with your success in mind. Personal attention to user feedback and continuous improvement based on real-world needs.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="h-full">
                  <CardHeader>
                    <Target className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>Quality & Innovation</CardTitle>
                    <CardDescription>
                      Combining professional test automation experience with development passion to deliver reliable, innovative solutions that actually work.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={staggerChildren}
          className="bg-muted/50 py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Founder</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The visionary behind 404 Monetizer, combining technical expertise with entrepreneurial passion.
              </p>
            </motion.div>
            <motion.div 
              variants={staggerChildren}
              className="flex justify-center"
            >
              <motion.div variants={fadeIn} className="max-w-md">
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-primary/20 bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">SM</span>
                    </div>
                    <CardTitle className="text-2xl">Sachin S Marnur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Test Automation Engineer by profession and Developer by passion.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sachin combines his extensive experience in test automation with his passion for development 
                      to create innovative solutions. As the founder of 404 Monetizer, he's dedicated to 
                      helping businesses transform their error pages into revenue-generating opportunities.
                    </p>
                    <div className="pt-4">
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                        <span className="px-3 py-1 bg-primary/10 rounded-full">Test Automation</span>
                        <span className="px-3 py-1 bg-primary/10 rounded-full">Full Stack Development</span>
                        <span className="px-3 py-1 bg-primary/10 rounded-full">SaaS Solutions</span>
                        <span className="px-3 py-1 bg-primary/10 rounded-full">Entrepreneurship</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={staggerChildren}
          className="py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of businesses already using 404 Monetizer to transform their error pages.
              </p>
              <Link href="#" onClick={handleAuthRedirect}>
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Start Free Trial <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
} 