"use client";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { PlanLock } from "@/components/ui/plan-lock";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText, Crown } from "lucide-react";

const wordpressPlugins = [
  {
    name: "Astra Pro",
    filename: "astra-pro.zip",
    description: "Complete WordPress theme with premium features and customization options",
    type: "Theme",
    version: "Latest",
    features: ["Custom Headers", "Advanced Typography", "WooCommerce Ready", "Page Builder Compatible"]
  },
  {
    name: "Elementor Pro",
    filename: "Elementor Pro v3.29.2.zip",
    description: "Advanced page builder with professional widgets and templates",
    type: "Page Builder",
    version: "v3.29.2",
    features: ["Theme Builder", "Popup Builder", "WooCommerce Builder", "Form Builder"]
  },
  {
    name: "GeneratePress Premium",
    filename: "gp-premium-2.4.0.zip",
    description: "Lightweight WordPress theme with premium modules and customization",
    type: "Theme",
    version: "v2.4.0",
    features: ["Site Library", "Elements", "Custom Colors", "Typography Control"]
  },
  {
    name: "IFSC Lookup Plugin",
    filename: "ifsc-lookup-plugin.zip",
    description: "Indian Financial System Code lookup plugin for banking applications",
    type: "Utility",
    version: "Latest",
    features: ["IFSC Code Lookup", "Bank Details", "Branch Information", "API Integration"]
  },
  {
    name: "Rank Math SEO Pro",
    filename: "seo-by-rank-math-pro.zip",
    description: "Complete SEO plugin with advanced features and analytics",
    type: "SEO",
    version: "Pro",
    features: ["Advanced SEO", "Local SEO", "WooCommerce SEO", "Video SEO"]
  }
];

function WordPressPluginCard({ plugin }: { plugin: typeof wordpressPlugins[0] }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/wordpress-plugins/${plugin.filename}`;
    link.download = plugin.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {plugin.name}
              <Badge variant="secondary" className="text-xs">
                {plugin.type}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {plugin.description}
            </CardDescription>
          </div>
          <Crown className="h-5 w-5 text-amber-500 flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Features:</div>
          <div className="grid grid-cols-1 gap-1">
            {plugin.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1 h-1 bg-primary rounded-full" />
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Version: {plugin.version}
          </div>
          <Button onClick={handleDownload} size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WordPressPluginsPage() {
  const { user } = useAuth();

  if (user?.plan === 'free') {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="WordPress Plugins"
          text="Download premium WordPress plugins and themes to enhance your website."
        />
        <PlanLock
          title="Premium WordPress Plugins Available in Pro"
          description="Access a curated collection of premium WordPress plugins and themes to supercharge your website."
          features={[
            "Elementor Pro - Advanced page builder",
            "Astra Pro - Premium WordPress theme",
            "Rank Math SEO Pro - Complete SEO solution",
            "GeneratePress Premium - Lightweight theme",
            "IFSC Lookup Plugin - Banking utility",
            "Regular updates and new plugins"
          ]}
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="WordPress Plugins"
        text="Download premium WordPress plugins and themes to enhance your website."
      />
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Crown className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Pro Feature</p>
            <p className="text-sm text-amber-700">
              These premium plugins are included with your Pro subscription. Download and use them on your websites.
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wordpressPlugins.map((plugin, index) => (
            <WordPressPluginCard key={index} plugin={plugin} />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Usage Instructions
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Download the plugin/theme zip file by clicking the Download button</p>
            <p>2. Go to your WordPress admin dashboard</p>
            <p>3. Navigate to Plugins → Add New → Upload Plugin (for plugins) or Appearance → Themes → Add New → Upload Theme (for themes)</p>
            <p>4. Upload the zip file and activate the plugin/theme</p>
            <p>5. Follow the plugin/theme specific setup instructions</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
} 