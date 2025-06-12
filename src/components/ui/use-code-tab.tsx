import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Code, 
  FileCode, 
  Globe, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  PlayCircle,
  Crown,
  Lock
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "@/utils/toast";
import { ThemeType, themeConfigs, generateThemeCSS } from "@/lib/theme-styles";
import { hasProAccess } from "@/lib/plan-utils";

interface UseCodeTabProps {
  pageId: string | number;
  domain?: string;
  page: any; // The complete page object with all settings
  user?: { plan: 'free' | 'pro' } | null; // Add user prop to check plan
}

export function UseCodeTab({ pageId, domain = "your-domain.com", page, user }: UseCodeTabProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  // Check if user has access to analytics (Pro plan)
  const hasAnalyticsAccess = user && hasProAccess(user);
  
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success({
        description: "Copied to clipboard!"
      });
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard");
    }
  };

  const pageUrl = `https://404monetizer.com/view/${pageId}`;

  // Generate complete HTML that exactly matches the live preview
  const generateCompleteHTML = () => {
    const monetizationFeatures = page?.monetizationFeatures || {};
    
    // Get the selected font and theme - ensure real-time updates
    const selectedFont = page?.font || 'Inter';
    const selectedTheme = page?.theme || 'default';
    
    // Generate CSS variables from theme config
    const themeConfig = themeConfigs[selectedTheme as ThemeType];
    // Always use the theme config CSS variables - this ensures proper styling for all themes including default
    const cssVars = themeConfig?.cssVars.light || themeConfigs.default.cssVars.light;
    
    // Map font to Google Fonts URL
    const generateFontUrl = (fontName: string) => {
      const fontMap: Record<string, string> = {
        'Inter': 'Inter:wght@300;400;500;600;700;900',
        'Roboto': 'Roboto:wght@300;400;500;700;900',
        'Open Sans': 'Open+Sans:wght@300;400;500;600;700;800',
        'Lato': 'Lato:wght@300;400;700;900',
        'Poppins': 'Poppins:wght@300;400;500;600;700;800;900',
        'Montserrat': 'Montserrat:wght@300;400;500;600;700;800;900',
        'Source Sans Pro': 'Source+Sans+Pro:wght@300;400;600;700;900',
        'Nunito': 'Nunito:wght@300;400;500;600;700;800;900',
        'Raleway': 'Raleway:wght@300;400;500;600;700;800;900',
        'Ubuntu': 'Ubuntu:wght@300;400;500;700'
      };
      return fontMap[fontName] || 'Inter:wght@300;400;500;600;700;900';
    };

    // Generate CSS variables string
    const generateCSSVariables = () => {
      return Object.entries(cssVars)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n        ');
    };

    // Generate monetization features HTML in exact order from view page
    const monetizationHTML = () => {
      let html = '';

      // 1. Content Lock Feature (first in view page)
      if (monetizationFeatures.contentLock?.enabled) {
        html += `
        <div class="py-12 bg-muted/50 border-y">
          <div class="max-w-2xl mx-auto px-6">
            <div class="bg-card border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <div class="p-6 text-center">
                <div class="flex items-center justify-center gap-2 mb-4">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <h3 class="text-xl font-semibold">Content Locked</h3>
                </div>
                <p class="text-muted-foreground mb-6">${monetizationFeatures.contentLock.content || "This content is locked unlock to continue"}</p>
              </div>
              <div class="px-6 pb-6 text-center space-y-4">
                ${monetizationFeatures.contentLock.unlockType === 'email' ? `
                  <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input type="email" placeholder="Enter your email" class="flex-1 px-3 py-2 border border-input rounded-md bg-background">
                    <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer">Unlock Content</button>
                  </div>
                ` : `
                  <button onclick="unlockContent(this)" class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer">Click to Unlock</button>
                `}
              </div>
            </div>
          </div>
        </div>`;
      }

      // 2. Countdown Offer Feature
      if (monetizationFeatures.countdownOffer?.enabled) {
        html += `
        <div class="py-8 sm:py-12 bg-muted/30 border-y">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div class="bg-card border shadow-lg rounded-lg">
              <div class="p-6">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl">⏰</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold mb-3 text-foreground">${monetizationFeatures.countdownOffer.title}</h3>
                <p class="text-sm sm:text-base text-muted-foreground mb-6">${monetizationFeatures.countdownOffer.description}</p>
              </div>
              <div class="px-6 pb-6" data-expiry="${monetizationFeatures.countdownOffer.expiryDate}">
                <div class="grid grid-cols-4 gap-3 sm:gap-4 mb-6 max-w-2xl mx-auto">
                  <div class="bg-muted/50 border rounded-lg p-4 sm:p-6 text-center min-h-20 min-w-16">
                    <div class="text-xl sm:text-3xl font-bold text-foreground mb-1" id="days">03</div>
                    <div class="text-xs sm:text-sm text-muted-foreground">Days</div>
                  </div>
                  <div class="bg-muted/50 border rounded-lg p-4 sm:p-6 text-center min-h-20 min-w-16">
                    <div class="text-xl sm:text-3xl font-bold text-foreground mb-1" id="hours">11</div>
                    <div class="text-xs sm:text-sm text-muted-foreground">Hours</div>
                  </div>
                  <div class="bg-muted/50 border rounded-lg p-4 sm:p-6 text-center min-h-20 min-w-16">
                    <div class="text-xl sm:text-3xl font-bold text-foreground mb-1" id="minutes">43</div>
                    <div class="text-xs sm:text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div class="bg-muted/50 border rounded-lg p-4 sm:p-6 text-center min-h-20 min-w-16">
                    <div class="text-xl sm:text-3xl font-bold text-foreground mb-1" id="seconds">24</div>
                    <div class="text-xs sm:text-sm text-muted-foreground">Seconds</div>
                  </div>
                </div>
                <button onclick="window.open('${monetizationFeatures.countdownOffer.redirectUrl}', '_blank')" 
                        class="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                  ${monetizationFeatures.countdownOffer.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 3. AdSense - Top Placement
      if (monetizationFeatures.adSense?.enabled && monetizationFeatures.adSense.placement === 'top') {
        const adSenseCode = monetizationFeatures.adSense.code;
        
        html += `
        <div class="w-full bg-muted/30 border-b">
          <div class="max-w-4xl mx-auto px-6 py-4">
            <div class="bg-gradient-to-r from-muted to-muted/50 rounded-lg border">
              <div class="p-4 text-center">
                <span class="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs mb-2">Advertisement</span>
                <div class="min-h-20 flex items-center justify-center">
                  ${adSenseCode ? adSenseCode : '<div class="text-muted-foreground text-sm">Ad Content Area - TOP Placement</div>'}
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 4. Email Collection Feature
      if (monetizationFeatures.emailCollection?.enabled) {
        const getEmailCollectionThemeStyles = (theme: string) => {
          const styles = {
            default: {
              iconBg: 'background-color: rgba(0, 0, 0, 0.1);',
              iconColor: 'color: black;',
              titleColor: 'color: black;',
              buttonStyle: 'background-color: black; color: white;'
            },
            rose: {
              iconBg: 'background-color: rgba(244, 63, 94, 0.1);',
              iconColor: 'color: rgb(244, 63, 94);',
              titleColor: 'color: rgb(244, 63, 94);',
              buttonStyle: 'background-color: rgb(244, 63, 94); color: white;'
            },
            teal: {
              iconBg: 'background-color: rgba(13, 148, 136, 0.1);',
              iconColor: 'color: rgb(13, 148, 136);',
              titleColor: 'color: rgb(13, 148, 136);',
              buttonStyle: 'background-color: rgb(13, 148, 136); color: white;'
            },
            blue: {
              iconBg: 'background-color: rgba(59, 130, 246, 0.1);',
              iconColor: 'color: rgb(59, 130, 246);',
              titleColor: 'color: rgb(59, 130, 246);',
              buttonStyle: 'background-color: rgb(59, 130, 246); color: white;'
            },
            olivegreen: {
              iconBg: 'background-color: rgba(107, 142, 35, 0.1);',
              iconColor: 'color: rgb(107, 142, 35);',
              titleColor: 'color: rgb(107, 142, 35);',
              buttonStyle: 'background-color: rgb(107, 142, 35); color: white;'
            },
            amber: {
              iconBg: 'background-color: rgba(245, 158, 11, 0.1);',
              iconColor: 'color: rgb(245, 158, 11);',
              titleColor: 'color: black;',
              buttonStyle: 'background-color: rgb(245, 158, 11); color: rgb(69, 26, 3);'
            },
            turquoise: {
              iconBg: 'background-color: rgba(6, 182, 212, 0.1);',
              iconColor: 'color: rgb(6, 182, 212);',
              titleColor: 'color: rgb(6, 182, 212);',
              buttonStyle: 'background-color: rgb(6, 182, 212); color: white;'
            }
          };
          return styles[theme as keyof typeof styles] || styles.default;
        };
        
        const emailThemeStyles = getEmailCollectionThemeStyles(selectedTheme);
        
        html += `
        <div style="padding: 3rem 0; background-color: hsl(var(--muted) / 0.5); border-top: 1px solid hsl(var(--border)); border-bottom: 1px solid hsl(var(--border));">
          <div style="max-width: 42rem; margin: 0 auto; padding: 0 1.5rem; text-align: center;">
            <div style="background-color: hsl(var(--card)); border: 1px solid hsl(var(--border)); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); border-radius: 0.5rem;">
              <div style="padding: 1.5rem;">
                <div style="width: 4rem; height: 4rem; ${emailThemeStyles.iconBg} border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                  <svg style="height: 2rem; width: 2rem; ${emailThemeStyles.iconColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; ${emailThemeStyles.titleColor}">${monetizationFeatures.emailCollection.title}</h3>
                <p style="color: hsl(var(--muted-foreground)); margin-bottom: 0;">${monetizationFeatures.emailCollection.description}</p>
              </div>
              <div style="padding: 0 1.5rem 1.5rem;">
                <form onsubmit="handleEmailSubmit(event)" style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 28rem; margin: 0 auto;" class="email-collection-form">
                  <input name="email" type="email" placeholder="${monetizationFeatures.emailCollection.emailPlaceholder}" required style="flex: 1; padding: 0.75rem; border: 1px solid hsl(var(--input)); border-radius: 0.375rem; background-color: hsl(var(--background)); color: hsl(var(--foreground)); outline: none;" />
                  <button type="submit" style="padding: 0.75rem 1rem; ${emailThemeStyles.buttonStyle} border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; border: none;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${monetizationFeatures.emailCollection.buttonText}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <style>
          @media (min-width: 640px) {
            .email-collection-form {
              flex-direction: row !important;
            }
          }
        </style>`;
      }

      // 5. Newsletter Signup Feature
      if (monetizationFeatures.newsletterSignup?.enabled) {
        // Get theme-specific colors using CSS variables for dynamic theming
        const getNewsletterThemeStyles = (theme: string) => {
          const styles = {
            default: {
              iconBg: 'background-color: rgba(0, 0, 0, 0.1);',
              iconColor: 'color: black;',
              titleColor: 'color: black;',
              buttonStyle: 'background-color: black; color: white;',
              buttonHover: ':hover { background-color: rgb(31, 41, 55); }'
            },
            rose: {
              iconBg: 'background-color: rgba(244, 63, 94, 0.1);',
              iconColor: 'color: rgb(244, 63, 94);',
              titleColor: 'color: rgb(244, 63, 94);',
              buttonStyle: 'background-color: rgb(244, 63, 94); color: white;',
              buttonHover: ':hover { background-color: rgb(225, 29, 72); }'
            },
            teal: {
              iconBg: 'background-color: rgba(13, 148, 136, 0.1);',
              iconColor: 'color: rgb(13, 148, 136);',
              titleColor: 'color: rgb(13, 148, 136);',
              buttonStyle: 'background-color: rgb(13, 148, 136); color: white;',
              buttonHover: ':hover { background-color: rgb(15, 118, 110); }'
            },
            blue: {
              iconBg: 'background-color: rgba(59, 130, 246, 0.1);',
              iconColor: 'color: rgb(59, 130, 246);',
              titleColor: 'color: rgb(59, 130, 246);',
              buttonStyle: 'background-color: rgb(59, 130, 246); color: white;',
              buttonHover: ':hover { background-color: rgb(37, 99, 235); }'
            },
            olivegreen: {
              iconBg: 'background-color: rgba(107, 142, 35, 0.1);',
              iconColor: 'color: rgb(107, 142, 35);',
              titleColor: 'color: rgb(107, 142, 35);',
              buttonStyle: 'background-color: rgb(107, 142, 35); color: white;',
              buttonHover: ':hover { background-color: rgb(95, 125, 30); }'
            },
            amber: {
              iconBg: 'background-color: rgba(245, 158, 11, 0.1);',
              iconColor: 'color: rgb(245, 158, 11);',
              titleColor: 'color: rgb(245, 158, 11);',
              buttonStyle: 'background-color: rgb(245, 158, 11); color: rgb(69, 26, 3);',
              buttonHover: ':hover { background-color: rgb(217, 119, 6); }'
            },
            turquoise: {
              iconBg: 'background-color: rgba(6, 182, 212, 0.1);',
              iconColor: 'color: rgb(6, 182, 212);',
              titleColor: 'color: rgb(6, 182, 212);',
              buttonStyle: 'background-color: rgb(6, 182, 212); color: white;',
              buttonHover: ':hover { background-color: rgb(8, 145, 178); }'
            }
          };
          return styles[theme as keyof typeof styles] || styles.default;
        };
        
        const themeStyles = getNewsletterThemeStyles(selectedTheme);
        
        html += `
        <div style="padding: 3rem 0; background-color: hsl(var(--muted) / 0.5); border-top: 1px solid hsl(var(--border)); border-bottom: 1px solid hsl(var(--border));">
          <div style="max-width: 42rem; margin: 0 auto; padding: 0 1.5rem; text-align: center;">
            <div style="background-color: hsl(var(--card)); border: 1px solid hsl(var(--border)); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); border-radius: 0.5rem;">
              <div style="padding: 1.5rem;">
                <div style="width: 4rem; height: 4rem; ${themeStyles.iconBg} border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                  <svg style="height: 2rem; width: 2rem; ${themeStyles.iconColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; ${themeStyles.titleColor}">${monetizationFeatures.newsletterSignup.title}</h3>
                <p style="color: hsl(var(--muted-foreground)); margin-bottom: 0;">${monetizationFeatures.newsletterSignup.description}</p>
              </div>
              <div style="padding: 0 1.5rem 1.5rem;">
                <div class="newsletter-form" style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 28rem; margin: 0 auto;">
                  <input type="email" placeholder="${monetizationFeatures.newsletterSignup.emailPlaceholder}" style="flex: 1; padding: 0.75rem; border: 1px solid hsl(var(--input)); border-radius: 0.375rem; background-color: hsl(var(--background)); color: hsl(var(--foreground)); outline: none;" />
                  <button style="padding: 0.75rem 1rem; ${themeStyles.buttonStyle} border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; border: none;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${monetizationFeatures.newsletterSignup.buttonText}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style>
          @media (min-width: 640px) {
            .newsletter-form {
              flex-direction: row !important;
            }
          }
        </style>`;
      }

      // 6. Lead Magnet Feature
      if (monetizationFeatures.leadMagnet?.enabled) {
        // Get theme-specific colors for lead magnet (only text, not background)
        const getLeadMagnetThemeStyles = (theme: string) => {
          const styles = {
            default: {
              iconBg: 'background-color: rgba(0, 0, 0, 0.1);',
              iconColor: 'color: rgb(0, 0, 0);',
              titleColor: 'color: rgb(0, 0, 0);',
              buttonStyle: 'background-color: rgb(0, 0, 0); color: white;',
              badgeStyle: 'background-color: rgb(0, 0, 0); color: white;'
            },
            rose: {
              iconBg: 'background-color: rgba(244, 63, 94, 0.1);',
              iconColor: 'color: rgb(244, 63, 94);',
              titleColor: 'color: rgb(244, 63, 94);',
              buttonStyle: 'background-color: rgb(244, 63, 94); color: white;',
              badgeStyle: 'background-color: rgb(244, 63, 94); color: white;'
            },
            teal: {
              iconBg: 'background-color: rgba(13, 148, 136, 0.1);',
              iconColor: 'color: rgb(13, 148, 136);',
              titleColor: 'color: rgb(13, 148, 136);',
              buttonStyle: 'background-color: rgb(13, 148, 136); color: white;',
              badgeStyle: 'background-color: rgb(13, 148, 136); color: white;'
            },
            blue: {
              iconBg: 'background-color: rgba(59, 130, 246, 0.1);',
              iconColor: 'color: rgb(59, 130, 246);',
              titleColor: 'color: rgb(59, 130, 246);',
              buttonStyle: 'background-color: rgb(59, 130, 246); color: white;',
              badgeStyle: 'background-color: rgb(59, 130, 246); color: white;'
            },
            olivegreen: {
              iconBg: 'background-color: rgba(107, 142, 35, 0.1);',
              iconColor: 'color: rgb(107, 142, 35);',
              titleColor: 'color: rgb(107, 142, 35);',
              buttonStyle: 'background-color: rgb(107, 142, 35); color: white;',
              badgeStyle: 'background-color: rgb(107, 142, 35); color: white;'
            },
            amber: {
              iconBg: 'background-color: rgba(245, 158, 11, 0.1);',
              iconColor: 'color: rgb(245, 158, 11);',
              titleColor: 'color: rgb(245, 158, 11);',
              buttonStyle: 'background-color: rgb(245, 158, 11); color: rgb(69, 26, 3);',
              badgeStyle: 'background-color: rgb(245, 158, 11); color: rgb(69, 26, 3);'
            },
            turquoise: {
              iconBg: 'background-color: rgba(6, 182, 212, 0.1);',
              iconColor: 'color: rgb(6, 182, 212);',
              titleColor: 'color: rgb(6, 182, 212);',
              buttonStyle: 'background-color: rgb(6, 182, 212); color: white;',
              badgeStyle: 'background-color: rgb(6, 182, 212); color: white;'
            }
          };
          return styles[theme as keyof typeof styles] || styles.default;
        };
        
        const leadMagnetThemeStyles = getLeadMagnetThemeStyles(selectedTheme);
        
        html += `
        <div class="py-12 bg-gradient-to-r from-primary/5 to-primary/10 border-y">
          <div class="max-w-2xl mx-auto px-6 text-center">
            <div class="bg-card/10 backdrop-blur-sm border shadow-lg rounded-lg">
              <div class="p-6">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="${leadMagnetThemeStyles.iconBg}">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="${leadMagnetThemeStyles.iconColor}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold mb-3" style="${leadMagnetThemeStyles.titleColor}">${monetizationFeatures.leadMagnet.title}</h3>
                <p class="text-muted-foreground mb-6">${monetizationFeatures.leadMagnet.description}</p>
              </div>
              <div class="px-6 pb-6 space-y-4">
                <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" placeholder="${monetizationFeatures.leadMagnet.emailPlaceholder}" class="flex-1 px-3 py-2 border border-input rounded-md bg-background">
                  <button class="px-4 py-2 rounded-md font-medium cursor-pointer" style="${leadMagnetThemeStyles.buttonStyle}">${monetizationFeatures.leadMagnet.buttonText}</button>
                </div>
                <span class="inline-block px-2 py-1 rounded text-xs" style="${leadMagnetThemeStyles.badgeStyle}">
                  ${monetizationFeatures.leadMagnet.fileType.toUpperCase()} Download
                </span>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 7. Affiliate Links
      if (monetizationFeatures.affiliateLinks?.length > 0) {
        const affiliateHTML = monetizationFeatures.affiliateLinks.slice(0, 6).map((link: any) => `
          <div class="bg-card border rounded-lg hover:shadow-lg transition-all hover:scale-105 cursor-pointer flex flex-col min-h-96 w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px]" onclick="window.open('${link.url}', '_blank')">
            ${link.imageUrl ? `
              <div class="aspect-video overflow-hidden rounded-t-lg flex-shrink-0">
                <img src="${link.imageUrl}" alt="${link.title}" class="w-full h-full object-cover">
              </div>
            ` : ''}
            <div class="p-4 sm:p-6 flex flex-col flex-grow">
              <h4 class="text-base sm:text-lg font-semibold mb-2 sm:line-clamp-2 leading-tight">${link.title}</h4>
              ${link.description ? `
                <p class="text-sm text-muted-foreground mb-4 sm:line-clamp-3 flex-grow">${link.description}</p>
              ` : ''}
              <button class="w-full mt-auto text-sm py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer">
                <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span class="truncate">View Product</span>
              </button>
            </div>
          </div>
        `).join('');

        html += `
        <div class="py-8 sm:py-12 bg-muted/30">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="text-center mb-6 sm:mb-8">
              <h3 class="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">Recommended Products</h3>
              <p class="text-sm sm:text-base text-muted-foreground">Check out these amazing deals</p>
            </div>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
              ${affiliateHTML}
            </div>
          </div>
        </div>`;
      }

      // 8. Sponsored Content
      if (monetizationFeatures.sponsoredContent?.enabled) {
        // Get theme-specific colors for sponsored content
        const getSponsoredThemeStyles = (theme: string) => {
          const styles = {
            default: {
              backgroundColor: 'background-color: rgba(0, 0, 0, 0.05);',
              titleColor: 'color: rgb(0, 0, 0);',
              badgeStyle: 'background-color: rgba(0, 0, 0, 0.1); color: rgb(0, 0, 0);',
              buttonStyle: 'background-color: rgb(0, 0, 0); color: white;'
            },
            rose: {
              backgroundColor: 'background-color: rgba(244, 63, 94, 0.05);',
              titleColor: 'color: rgb(244, 63, 94);',
              badgeStyle: 'background-color: rgba(244, 63, 94, 0.1); color: rgb(244, 63, 94);',
              buttonStyle: 'background-color: rgb(244, 63, 94); color: white;'
            },
            teal: {
              backgroundColor: 'background-color: rgba(13, 148, 136, 0.05);',
              titleColor: 'color: rgb(13, 148, 136);',
              badgeStyle: 'background-color: rgba(13, 148, 136, 0.1); color: rgb(13, 148, 136);',
              buttonStyle: 'background-color: rgb(13, 148, 136); color: white;'
            },
            blue: {
              backgroundColor: 'background-color: rgba(59, 130, 246, 0.05);',
              titleColor: 'color: rgb(59, 130, 246);',
              badgeStyle: 'background-color: rgba(59, 130, 246, 0.1); color: rgb(59, 130, 246);',
              buttonStyle: 'background-color: rgb(59, 130, 246); color: white;'
            },
            olivegreen: {
              backgroundColor: 'background-color: rgba(107, 142, 35, 0.05);',
              titleColor: 'color: rgb(107, 142, 35);',
              badgeStyle: 'background-color: rgba(107, 142, 35, 0.1); color: rgb(107, 142, 35);',
              buttonStyle: 'background-color: rgb(107, 142, 35); color: white;'
            },
            amber: {
              backgroundColor: 'background-color: rgba(245, 158, 11, 0.05);',
              titleColor: 'color: rgb(245, 158, 11);',
              badgeStyle: 'background-color: rgba(245, 158, 11, 0.1); color: rgb(245, 158, 11);',
              buttonStyle: 'background-color: rgb(245, 158, 11); color: rgb(69, 26, 3);'
            },
            turquoise: {
              backgroundColor: 'background-color: rgba(6, 182, 212, 0.05);',
              titleColor: 'color: rgb(6, 182, 212);',
              badgeStyle: 'background-color: rgba(6, 182, 212, 0.1); color: rgb(6, 182, 212);',
              buttonStyle: 'background-color: rgb(6, 182, 212); color: white;'
            }
          };
          return styles[theme as keyof typeof styles] || styles.default;
        };
        
        const sponsoredThemeStyles = getSponsoredThemeStyles(selectedTheme);
        
        html += `
        <div class="py-12 border-y" style="${sponsoredThemeStyles.backgroundColor}">
          <div class="max-w-4xl mx-auto px-6">
            <div class="bg-card border shadow-lg rounded-lg">
              <div class="p-6">
                <div class="flex items-start gap-2 mb-4">
                  <span class="px-2 py-1 rounded text-xs font-medium" style="${sponsoredThemeStyles.badgeStyle}">Sponsored</span>
                </div>
              </div>
              <div class="px-6 pb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 class="text-2xl font-semibold mb-3" style="${sponsoredThemeStyles.titleColor}">${monetizationFeatures.sponsoredContent.title}</h3>
                    <p class="text-muted-foreground text-base mb-6">${monetizationFeatures.sponsoredContent.description}</p>
                    <button onclick="window.open('${monetizationFeatures.sponsoredContent.redirectUrl}', '_blank')" 
                            class="px-6 py-3 rounded-md font-medium text-lg cursor-pointer" style="${sponsoredThemeStyles.buttonStyle}">
                      ${monetizationFeatures.sponsoredContent.buttonText}
                    </button>
                    <p class="text-sm text-muted-foreground mt-3">By ${monetizationFeatures.sponsoredContent.sponsorName}</p>
                  </div>
                  ${monetizationFeatures.sponsoredContent.imageUrl ? `
                    <div class="aspect-square overflow-hidden rounded-lg">
                      <img src="${monetizationFeatures.sponsoredContent.imageUrl}" alt="${monetizationFeatures.sponsoredContent.title}" class="w-full h-full object-cover">
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 9. Donation Button Feature
      if (monetizationFeatures.donationButton?.enabled) {
        html += `
        <div class="py-12 bg-muted/30 border-y">
          <div class="max-w-2xl mx-auto px-6 text-center">
            <div class="bg-card border shadow-lg rounded-lg">
              <div class="p-6">
                <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold mb-3">${monetizationFeatures.donationButton.title}</h3>
                <p class="text-muted-foreground mb-6">${monetizationFeatures.donationButton.description}</p>
              </div>
              <div class="px-6 pb-6 space-y-4">
                ${monetizationFeatures.donationButton.targetAmount ? `
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span>Goal Progress</span>
                      <span>${monetizationFeatures.donationButton.currency} ${monetizationFeatures.donationButton.targetAmount}</span>
                    </div>
                    <div class="w-full bg-muted rounded-full h-3">
                      <div class="bg-primary h-3 rounded-full" style="width: 65%"></div>
                    </div>
                    <p class="text-sm text-muted-foreground">65% of goal reached</p>
                  </div>
                ` : ''}
                <button onclick="window.open('${monetizationFeatures.donationButton.donationUrl}', '_blank')" 
                        class="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium text-lg flex items-center gap-2 mx-auto cursor-pointer">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  ${monetizationFeatures.donationButton.buttonText}
                </button>
                <span class="inline-block px-2 py-1 border border-input rounded text-xs">
                  via ${monetizationFeatures.donationButton.platform}
                </span>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 10. Product Showcase
      if (monetizationFeatures.productShowcase?.enabled && monetizationFeatures.productShowcase.products?.length > 0) {
        const productsHTML = monetizationFeatures.productShowcase.products.slice(0, 6).map((product: any) => `
          <div class="bg-card border rounded-lg hover:shadow-lg transition-all hover:scale-105 flex flex-col min-h-96 relative w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px]">
            ${product.featured ? `
              <div class="absolute top-3 left-3 z-10">
                <span class="px-2 py-1 bg-primary text-primary-foreground rounded text-xs border border-amber-400 flex items-center gap-1">
                  <svg class="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Featured
                </span>
              </div>
            ` : ''}
            ${product.imageUrl ? `
              <div class="aspect-video overflow-hidden rounded-t-lg relative flex-shrink-0">
                <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover">
              </div>
            ` : ''}
            <div class="p-4 sm:p-6 flex flex-col flex-grow">
              <h4 class="text-base sm:text-lg font-semibold mb-2 sm:line-clamp-2 leading-tight">${product.name}</h4>
              <p class="text-sm text-muted-foreground mb-4 sm:line-clamp-3 flex-grow">${product.description}</p>
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
                <span class="text-lg sm:text-xl font-bold text-primary">${product.price}</span>
                <button onclick="window.open('${product.buyUrl}', '_blank')" 
                        class="w-full sm:w-auto text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer">
                  <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="19" cy="20" r="1" />
                  </svg>
                  <span class="truncate">Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        `).join('');

        html += `
        <div class="py-8 sm:py-12">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="text-center mb-6 sm:mb-8">
              <h3 class="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">${monetizationFeatures.productShowcase.title}</h3>
              <p class="text-sm sm:text-base text-muted-foreground">${monetizationFeatures.productShowcase.description}</p>
            </div>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
              ${productsHTML}
            </div>
          </div>
        </div>`;
      }

      // 11. Social Proof/Testimonials
      if (monetizationFeatures.socialProof?.enabled && monetizationFeatures.socialProof.testimonials?.length > 0) {
        // Get theme-specific colors for stars
        const getTestimonialThemeStyles = (theme: string) => {
          const styles = {
            default: {
              starColor: 'color: rgb(0, 0, 0);'
            },
            rose: {
              starColor: 'color: rgb(244, 63, 94);'
            },
            teal: {
              starColor: 'color: rgb(13, 148, 136);'
            },
            blue: {
              starColor: 'color: rgb(59, 130, 246);'
            },
            olivegreen: {
              starColor: 'color: rgb(107, 142, 35);'
            },
            amber: {
              starColor: 'color: rgb(245, 158, 11);'
            },
            turquoise: {
              starColor: 'color: rgb(6, 182, 212);'
            }
          };
          return styles[theme as keyof typeof styles] || styles.default;
        };
        
        const testimonialThemeStyles = getTestimonialThemeStyles(selectedTheme);
        
        const testimonialsHTML = monetizationFeatures.socialProof.testimonials.slice(0, 6).map((testimonial: any) => `
          <div class="bg-card border rounded-lg hover:shadow-lg transition-shadow w-full max-w-sm sm:max-w-[280px] lg:max-w-[320px]">
            <div class="p-6">
              <div class="flex items-center mb-4">
                ${testimonial.imageUrl ? `
                  <img src="${testimonial.imageUrl}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover mr-4">
                ` : `
                  <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                    <span class="text-lg font-semibold">${testimonial.name.charAt(0)}</span>
                  </div>
                `}
                <div>
                  <h4 class="font-semibold">${testimonial.name}</h4>
                  <p class="text-sm text-muted-foreground">${testimonial.role}</p>
                </div>
              </div>
              ${testimonial.rating ? `
                <div class="flex mb-3">
                  ${Array.from({length: 5}, (_, i) => `
                    <svg class="h-4 w-4 ${i < testimonial.rating ? 'fill-current' : ''}" style="${i < testimonial.rating ? testimonialThemeStyles.starColor : 'color: rgb(209, 213, 219);'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  `).join('')}
                </div>
              ` : ''}
              <blockquote class="text-muted-foreground italic">"${testimonial.content}"</blockquote>
            </div>
          </div>
        `).join('');

        html += `
        <div class="py-12 bg-muted/30">
          <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold mb-3 text-foreground">${monetizationFeatures.socialProof.title}</h3>
            </div>
            <div class="flex flex-wrap justify-center gap-6">
              ${testimonialsHTML}
            </div>
          </div>
        </div>`;
      }

      // 12. Exit Intent Feature
      if (monetizationFeatures.exitIntent?.enabled) {
        html += `
        <!-- Exit Intent Popup (Hidden by default) -->
        <div id="exitIntentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div class="bg-card border shadow-2xl rounded-lg max-w-md w-full mx-4 transform transition-all duration-300 scale-95" id="exitIntentPopup">
            <div class="p-6 text-center relative">
              <button onclick="closeExitIntent()" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold">&times;</button>
              <h3 class="text-2xl font-semibold mb-3 text-primary">👋 ${monetizationFeatures.exitIntent.title}</h3>
              <p class="text-muted-foreground mb-6">${monetizationFeatures.exitIntent.description}</p>
              <div class="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6">
                <p class="text-sm font-medium text-primary">${monetizationFeatures.exitIntent.offerText}</p>
              </div>
              <div class="space-y-3">
                <button onclick="window.open('${monetizationFeatures.exitIntent.redirectUrl}', '_blank'); closeExitIntent();" 
                        class="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium text-lg cursor-pointer">
                  ${monetizationFeatures.exitIntent.buttonText}
                </button>
                <button onclick="closeExitIntent()" 
                        class="w-full px-6 py-2 text-muted-foreground hover:text-foreground text-sm cursor-pointer">
                  No thanks, I'll continue browsing
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 13. AdSense - Bottom Placement
      if (monetizationFeatures.adSense?.enabled && monetizationFeatures.adSense.placement === 'bottom') {
        const adSenseCode = monetizationFeatures.adSense.code;
        
        html += `
        <div class="w-full bg-muted/30 border-t">
          <div class="max-w-4xl mx-auto px-6 py-4">
            <div class="bg-gradient-to-r from-muted to-muted/50 rounded-lg border">
              <div class="p-4 text-center">
                <span class="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs mb-2">Advertisement</span>
                <div class="min-h-20 flex items-center justify-center">
                  ${adSenseCode ? adSenseCode : '<div class="text-muted-foreground text-sm">Ad Content Area - BOTTOM Placement</div>'}
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }

      // 14. AdSense - Custom Placement (div placeholder)
      if (monetizationFeatures.adSense?.enabled && monetizationFeatures.adSense.placement === 'custom') {
        const adSenseCode = monetizationFeatures.adSense.code;
        
        html += `
        <!-- AdSense Custom Placement Container -->
        <div id="adsense-container" class="w-full bg-muted/30 border-y">
          <div class="max-w-4xl mx-auto px-6 py-4">
            <div class="bg-gradient-to-r from-muted to-muted/50 rounded-lg border">
              <div class="p-4 text-center">
                <span class="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs mb-2">Advertisement</span>
                <div class="min-h-20 flex items-center justify-center">
                  ${adSenseCode ? adSenseCode : '<div class="text-muted-foreground text-sm">Ad Content Area - CUSTOM Placement<br><small>Add this div with id="adsense-container" where you want the ad to appear</small></div>'}
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }

      return html;
    };

    // Generate social links HTML - exact match to view page footer
    const socialLinksHTML = () => {
      const socialLinks = page?.socialLinks || {};
      const activeSocials = Object.entries(socialLinks).filter(([_, url]) => url);
      if (activeSocials.length === 0) return '';

      const getSocialIcon = (platform: string) => {
        const icons: Record<string, string> = {
          facebook: `<svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>`,
          twitter: `<svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`,
          instagram: `<svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
          linkedin: `<svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="9" width="4" height="12"></rect><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="4" cy="4" r="2"></circle></svg>`,
          youtube: `<svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"></path><polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="9.75,15.02 15.5,11.75 9.75,8.48"></polygon></svg>`,
          website: `<svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="10"></circle><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2" y1="12" x2="22" y2="12"></line><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 12a15.3 15.3 0 0 0 4 0 15.3 15.3 0 0 0 4 0"></path></svg>`
        };
        return icons[platform] || `<svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>`;
      };

      const socialHTML = activeSocials.map(([platform, url]) => {
        return `
        <button onclick="window.open('${url}', '_blank')" 
                class="inline-flex items-center gap-2 px-3 py-2 border border-input rounded-md bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0 min-w-fit cursor-pointer shadow-xs h-8">
          ${getSocialIcon(platform)}
          <span class="hidden sm:inline">${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          <span class="sm:hidden">${platform.charAt(0).toUpperCase()}</span>
        </button>
        `;
      }).join('');

      return `
      <!-- Social Links Footer -->
      <div class="py-8 bg-muted border-t">
        <div class="max-w-4xl mx-auto px-6 text-center">
          <p class="text-muted-foreground mb-4">Connect with us</p>
          <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
            ${socialHTML}
          </div>
        </div>
      </div>`;
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - ${page?.title || 'Page Not Found'}</title>
    <meta name="description" content="${page?.description || "The page you're looking for doesn't exist."}">
    <meta name="robots" content="noindex, nofollow">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${generateFontUrl(selectedFont)}&display=swap" rel="stylesheet">
    
    ${monetizationFeatures.adSense?.enabled ? `
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    ` : ''}
    <style>
        :root {
        ${generateCSSVariables()}
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${selectedFont}', ui-sans-serif, system-ui, sans-serif;
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .bg-background { background-color: hsl(var(--background)); }
        .bg-card { background-color: hsl(var(--card)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .bg-primary\\/5 { background-color: hsl(var(--primary) / 0.05); }
        .bg-primary\\/10 { background-color: hsl(var(--primary) / 0.1); }
        .bg-secondary { background-color: hsl(var(--secondary)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .bg-muted\\/30 { background-color: hsl(var(--muted) / 0.3); }
        .bg-muted\\/50 { background-color: hsl(var(--muted) / 0.5); }
        .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
        .from-primary\\/5 { --tw-gradient-from: hsl(var(--primary) / 0.05); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--primary) / 0)); }
        .to-primary\\/10 { --tw-gradient-to: hsl(var(--primary) / 0.1); }
        .from-muted { --tw-gradient-from: hsl(var(--muted)); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--muted) / 0)); }
        .to-muted\\/50 { --tw-gradient-to: hsl(var(--muted) / 0.5); }
        
        .text-foreground { color: hsl(var(--foreground)); }
        .text-primary { color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .text-accent-foreground { color: hsl(var(--accent-foreground)); }
        
        .border { border: 1px solid hsl(var(--border)); }
        .border-input { border: 1px solid hsl(var(--input)); }
        .border-y { border-top: 1px solid hsl(var(--border)); border-bottom: 1px solid hsl(var(--border)); }
        .border-b { border-bottom: 1px solid hsl(var(--border)); }
        .border-t { border-top: 1px solid hsl(var(--border)); }
        .border-2 { border-width: 2px; }
        .border-dashed { border-style: dashed; }
        .border-muted-foreground\\/30 { border-color: hsl(var(--muted-foreground) / 0.3); }
        .border-amber-400 { border-color: #fbbf24; }
        
        /* Typography */
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-base { font-size: 1rem; line-height: 1.5rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-7xl { font-size: 4.5rem; line-height: 1; }
        
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .italic { font-style: italic; }
        
        /* Layout */
        .text-center { text-align: center; }
        .max-w-2xl { max-width: 42rem; }
        .max-w-4xl { max-width: 56rem; }
        .max-w-6xl { max-width: 72rem; }
        .max-w-md { max-width: 28rem; }
        .max-w-sm { max-width: 24rem; }
        .max-w-xs { max-width: 20rem; }
        .max-w-\\[280px\\] { max-width: 280px; }
        .max-w-\\[320px\\] { max-width: 320px; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .pb-6 { padding-bottom: 1.5rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-auto { margin-top: auto; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        
        /* Flexbox */
        .flex { display: flex; }
        .inline-flex { display: inline-flex; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .gap-1 { gap: 0.25rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .flex-wrap { flex-wrap: wrap; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1 1 0%; }
        .flex-grow { flex-grow: 1; }
        .flex-shrink-0 { flex-shrink: 0; }
        
        /* Grid */
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        
        /* Spacing */
        .w-3 { width: 0.75rem; }
        .w-4 { width: 1rem; }
        .w-8 { width: 2rem; }
        .w-12 { width: 3rem; }
        .w-16 { width: 4rem; }
        .w-full { width: 100%; }
        .h-3 { height: 0.75rem; }
        .h-4 { height: 1rem; }
        .h-8 { height: 2rem; }
        .h-12 { height: 3rem; }
        .h-16 { height: 4rem; }
        .h-48 { height: 12rem; }
        .h-full { height: 100%; }
        .min-w-16 { min-width: 4rem; }
        .min-w-fit { min-width: fit-content; }
        .min-h-20 { min-height: 5rem; }
        .min-h-96 { min-height: 24rem; }
        .aspect-video { aspect-ratio: 16 / 9; }
        .aspect-square { aspect-ratio: 1 / 1; }
        
        /* Position */
        .relative { position: relative; }
        .absolute { position: absolute; }
        .top-3 { top: 0.75rem; }
        .left-3 { left: 0.75rem; }
        .z-10 { z-index: 10; }
        
        /* Borders & Rounded */
        .rounded-md { border-radius: 0.375rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
        .overflow-hidden { overflow: hidden; }
        
        /* Shadow */
        .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
        
        /* Object */
        .object-cover { object-fit: cover; }
        .object-contain { object-contain; }
        
        /* Effects */
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-shadow { transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .hover\\:scale-105:hover { transform: scale(1.05); }
        .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
        .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
        .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
        .hover\\:bg-red-700:hover { background-color: rgb(185 28 28); }
        .cursor-pointer { cursor: pointer; }
        
        /* Colors */
        .bg-red-100 { background-color: rgb(254 226 226); }
        .bg-red-600 { background-color: rgb(220 38 38); }
        .bg-blue-100 { background-color: rgb(219 234 254); }
        .bg-blue-600 { background-color: rgb(37 99 235); }
        .text-red-600 { color: rgb(220 38 38); }
        .text-blue-600 { color: rgb(37 99 235); }
        .text-white { color: rgb(255 255 255); }
        
        /* Theme Colors */
        .bg-rose-100 { background-color: rgb(255 228 230); }
        .bg-rose-600 { background-color: rgb(225 29 72); }
        .text-rose-600 { color: rgb(225 29 72); }
        .hover\\:bg-rose-700:hover { background-color: rgb(190 18 60); }
        
        .bg-teal-100 { background-color: rgb(204 251 241); }
        .bg-teal-600 { background-color: rgb(13 148 136); }
        .text-teal-600 { color: rgb(13 148 136); }
        .hover\\:bg-teal-700:hover { background-color: rgb(15 118 110); }
        
        .bg-gray-100 { background-color: rgb(243 244 246); }
        .bg-black { background-color: rgb(0 0 0); }
        .text-black { color: rgb(0 0 0); }
        .hover\\:bg-gray-800:hover { background-color: rgb(31 41 55); }
        .fill-current { fill: currentColor; }
        
        /* Line clamp simulation */
        .sm\\:line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .sm\\:line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
        
        /* Backdrop */
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        
        /* Buttons */
        button, .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 2rem;
            font-weight: 600;
            border-radius: 0.375rem;
            border: none;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 1.125rem;
            line-height: 1.75rem;
            min-height: 2.75rem;
            white-space: nowrap;
        }
        
        /* Large button size matching Button size="lg" */
        button.btn-lg, .btn-lg {
            padding: 0.75rem 2rem;
            font-size: 1.125rem;
            line-height: 1.75rem;
            min-height: 2.75rem;
        }
        
        button:hover, .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        button:active, .btn:active {
            transform: translateY(0);
        }
        
        /* Inputs */
        input[type="email"], input {
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }
        
        input:focus {
            outline: none;
            box-shadow: 0 0 0 2px hsl(var(--ring));
        }
        
        /* Responsive */
        @media (min-width: 640px) {
            .sm\\:flex-row { flex-direction: row; }
            .sm\\:gap-3 { gap: 0.75rem; }
            .sm\\:gap-6 { gap: 1.5rem; }
            .sm\\:inline { display: inline; }
            .sm\\:hidden { display: none; }
            .sm\\:max-w-\\[280px\\] { max-width: 280px; }
            .sm\\:max-w-\\[320px\\] { max-width: 320px; }
            .sm\\:mb-3 { margin-bottom: 0.75rem; }
            .sm\\:mb-8 { margin-bottom: 2rem; }
            .sm\\:p-6 { padding: 1.5rem; }
            .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .sm\\:py-12 { padding-top: 3rem; padding-bottom: 3rem; }
            .sm\\:text-base { font-size: 1rem; line-height: 1.5rem; }
            .sm\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .sm\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .sm\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .sm\\:w-auto { width: auto; }
        }
        
        @media (min-width: 768px) {
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        
        @media (min-width: 1024px) {
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .lg\\:max-w-\\[320px\\] { max-width: 320px; }
        }
        
        /* Exit Intent Modal Styles */
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-50 { z-index: 50; }
        .hidden { display: none; }
        .scale-95 { transform: scale(0.95); }
        .scale-100 { transform: scale(1); }
        .duration-300 { transition-duration: 300ms; }
        .bg-black { background-color: rgb(0 0 0); }
        .bg-opacity-50 { background-color: rgb(0 0 0 / 0.5); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
        .absolute { position: absolute; }
        .top-4 { top: 1rem; }
        .right-4 { right: 1rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        
        /* Exit Intent Modal Animation */
        #exitIntentModal {
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease-out;
        }
        
        #exitIntentPopup {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Pulse animation for exit intent button */
        .pulse-animation {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Custom CSS */
        ${page?.customCSS || ''}
    </style>
    
    <script>
        // Tailwind config for custom CSS variables
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        border: "hsl(var(--border))",
                        input: "hsl(var(--input))",
                        ring: "hsl(var(--ring))",
                        background: "hsl(var(--background))",
                        foreground: "hsl(var(--foreground))",
                        primary: {
                            DEFAULT: "hsl(var(--primary))",
                            foreground: "hsl(var(--primary-foreground))",
                        },
                        secondary: {
                            DEFAULT: "hsl(var(--secondary))",
                            foreground: "hsl(var(--secondary-foreground))",
                        },
                        destructive: {
                            DEFAULT: "hsl(var(--destructive))",
                            foreground: "hsl(var(--destructive-foreground))",
                        },
                        muted: {
                            DEFAULT: "hsl(var(--muted))",
                            foreground: "hsl(var(--muted-foreground))",
                        },
                        accent: {
                            DEFAULT: "hsl(var(--accent))",
                            foreground: "hsl(var(--accent-foreground))",
                        },
                        popover: {
                            DEFAULT: "hsl(var(--popover))",
                            foreground: "hsl(var(--popover-foreground))",
                        },
                        card: {
                            DEFAULT: "hsl(var(--card))",
                            foreground: "hsl(var(--card-foreground))",
                        },
                    },
                    borderRadius: {
                        lg: "var(--radius)",
                        md: "calc(var(--radius) - 2px)",
                        sm: "calc(var(--radius) - 4px)",
                    },
                    fontFamily: {
                        sans: ["${selectedFont}", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
                    },
                }
            }
        }
    </script>
</head>
<body class="bg-background">
    <!-- Main 404 Content matching view page exactly -->
    <div class="text-center py-12 px-6">
        <div class="max-w-2xl mx-auto space-y-6">
            ${page?.logo ? `
            <div class="flex justify-center mb-6">
                <img src="${page.logo}" alt="Logo" class="h-16 max-w-xs object-contain">
            </div>
            ` : ''}
            
            <div class="space-y-4">
                <h1 class="text-7xl font-bold text-foreground mb-4">404</h1>
                <h2 class="text-3xl font-semibold text-foreground mb-3">
                    ${page?.title || "Page Not Found"}
                </h2>
                <p class="text-lg text-muted-foreground leading-relaxed">
                    ${page?.description || "The page you're looking for doesn't exist."}
                </p>
            </div>

            <div class="pt-4">
                <button onclick="window.location.href='/'" class="px-8 py-3 text-lg bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer shadow-xs h-10">
                    Go Back Home
                </button>
            </div>
        </div>
    </div>

    ${monetizationHTML()}

    ${socialLinksHTML()}

    <script>
        // Email submission handler
        function handleEmailSubmit(e) {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            if (email && email.includes('@')) {
                alert('Thank you for subscribing! Email: ' + email);
                e.target.querySelector('input[type="email"]').value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        }

        // Content unlock functionality
        function unlockContent(button) {
            const container = button.closest('div');
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm';
            successMsg.innerHTML = '✅ Content unlocked! This premium content is now available to you.';
            container.appendChild(successMsg);
            
            // Update button
            button.textContent = 'Content Unlocked ✓';
            button.disabled = true;
            button.className = button.className.replace('bg-primary', 'bg-green-600');
        }

        // Countdown timer functionality
        document.addEventListener('DOMContentLoaded', function() {
            const timer = document.querySelector('[data-expiry]');
            if (timer) {
                const expiry = new Date(timer.getAttribute('data-expiry')).getTime();
                
                function updateCountdown() {
                    const now = new Date().getTime();
                    const distance = expiry - now;

                    if (distance < 0) {
                        // Timer expired
                        document.getElementById('days').textContent = '00';
                        document.getElementById('hours').textContent = '00';
                        document.getElementById('minutes').textContent = '00';
                        document.getElementById('seconds').textContent = '00';
                        return;
                    }

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    document.getElementById('days').textContent = days.toString().padStart(2, '0');
                    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
                }
                
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }

            // Add form submission handlers to all forms
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                if (!form.hasAttribute('onsubmit')) {
                    form.addEventListener('submit', handleEmailSubmit);
                }
            });

            // Add click handlers for social sharing (content lock)
            const shareButtons = document.querySelectorAll('button[onclick*="Share"]');
            shareButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (navigator.share) {
                        navigator.share({
                            title: document.title,
                            url: window.location.href
                        });
                    } else {
                        // Fallback for browsers without Web Share API
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(document.title);
                        window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
                    }
                });
            });

            // Smooth scroll for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Add loading states to buttons
            const buttons = document.querySelectorAll('button[type="submit"]');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const originalText = this.textContent;
                    this.textContent = 'Loading...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                    }, 2000);
                });
            });

            // Countdown timer functionality
            function startCountdown() {
                const countdownElements = document.querySelectorAll('[data-expiry]');
                countdownElements.forEach(element => {
                    const expiryDate = new Date(element.getAttribute('data-expiry')).getTime();
                    
                    function updateTimer() {
                        const now = new Date().getTime();
                        const distance = expiryDate - now;
                        
                        if (distance > 0) {
                            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                            
                            const daysEl = element.querySelector('#days');
                            const hoursEl = element.querySelector('#hours');
                            const minutesEl = element.querySelector('#minutes');
                            const secondsEl = element.querySelector('#seconds');
                            
                            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
                            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
                        } else {
                            element.innerHTML = '<div class="text-center p-6"><h3 class="text-xl font-semibold text-red-600">Offer Expired!</h3></div>';
                        }
                    }
                    
                    updateTimer();
                    setInterval(updateTimer, 1000);
                });
            }
            
            startCountdown();

            // Content unlock functionality
            window.unlockContent = function(button) {
                button.textContent = 'Unlocked!';
                button.disabled = true;
                button.classList.add('bg-green-600', 'hover:bg-green-700');
                button.classList.remove('bg-primary', 'hover:bg-primary/90');
                
                setTimeout(() => {
                    const contentArea = button.closest('.bg-card').querySelector('.unlock-content');
                    if (contentArea) {
                        contentArea.style.display = 'block';
                        contentArea.innerHTML = '<div class="p-6 mt-4 bg-green-50 border border-green-200 rounded-lg"><p class="text-green-800">🎉 Content unlocked! Here is your exclusive content...</p></div>';
                    }
                }, 500);
            };

            // Email form handling
            window.handleEmailSubmit = function(event) {
                event.preventDefault();
                const form = event.target;
                const email = form.email.value;
                const button = form.querySelector('button[type="submit"]');
                
                if (email) {
                    const originalText = button.textContent;
                    button.textContent = 'Submitting...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        button.textContent = 'Thank you!';
                        button.classList.add('bg-green-600');
                        form.reset();
                        
                        setTimeout(() => {
                            button.textContent = originalText;
                            button.disabled = false;
                            button.classList.remove('bg-green-600');
                        }, 3000);
                    }, 1000);
                }
            };
        });

        // Exit Intent Functions
        let exitIntentShown = false;
        let exitIntentTimer = null;
        let mouseLeaveTimer = null;
        let userInteracted = false;
        
        function showExitIntent() {
            if (exitIntentShown || !document.getElementById('exitIntentModal')) return;
            exitIntentShown = true;
            
            const modal = document.getElementById('exitIntentModal');
            const popup = document.getElementById('exitIntentPopup');
            if (modal && popup) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    popup.classList.remove('scale-95');
                    popup.classList.add('scale-100');
                }, 50);
            }
        }
        
        function closeExitIntent() {
            const modal = document.getElementById('exitIntentModal');
            const popup = document.getElementById('exitIntentPopup');
            if (modal && popup) {
                popup.classList.remove('scale-100');
                popup.classList.add('scale-95');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 200);
            }
        }
        
        // Make functions globally available
        window.showExitIntent = showExitIntent;
        window.closeExitIntent = closeExitIntent;
        
        // Exit Intent Detection
        ${monetizationFeatures.exitIntent?.enabled ? `
        function detectExitIntent() {
            // Mouse leave detection (top of page)
            document.addEventListener('mouseleave', function(e) {
                if (e.clientY <= 0 && !exitIntentShown) {
                    clearTimeout(mouseLeaveTimer);
                    mouseLeaveTimer = setTimeout(() => {
                        showExitIntent();
                    }, 100);
                }
            });
            
            // Mouse enter (cancel exit intent if mouse comes back)
            document.addEventListener('mouseenter', function() {
                clearTimeout(mouseLeaveTimer);
            });
            
            // Before unload detection (page navigation/close)
            window.addEventListener('beforeunload', function(e) {
                if (!exitIntentShown) {
                    showExitIntent();
                    // Note: Modern browsers limit beforeunload customization
                    e.preventDefault();
                    e.returnValue = '';
                    return '';
                }
            });
            
            // Track user interaction
            ['click', 'scroll', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
                document.addEventListener(event, function() {
                    userInteracted = true;
                }, { once: true });
            });
            
            // Inactivity timer (if specified)
            ${monetizationFeatures.exitIntent.delay ? `
            setTimeout(() => {
                if (!userInteracted && !exitIntentShown) {
                    showExitIntent();
                }
            }, ${(monetizationFeatures.exitIntent.delay || 30) * 1000});
            ` : ''}
            
            // Close modal when clicking outside
            document.addEventListener('click', function(e) {
                const modal = document.getElementById('exitIntentModal');
                if (e.target === modal) {
                    closeExitIntent();
                }
            });
            
            // ESC key to close
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeExitIntent();
                }
            });
        }
        
        // Initialize exit intent detection after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', detectExitIntent);
        } else {
            detectExitIntent();
        }
        ` : ''}

        // AdSense Initialization
        ${monetizationFeatures.adSense?.enabled ? `
        // Initialize AdSense ads
        function initializeAdSense() {
            // Push AdSense ads to display
            if (typeof adsbygoogle !== 'undefined') {
                // Get all AdSense elements
                const adElements = document.querySelectorAll('.adsbygoogle');
                adElements.forEach((ad) => {
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (e) {
                        // Silent AdSense initialization error
                    }
                });
            }
        }
        
        // Initialize AdSense after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAdSense);
        } else {
            initializeAdSense();
        }
        ` : ''}

        ${hasAnalyticsAccess ? `
        // External Analytics Tracking with Revenue & Conversion Tracking
        // This script tracks real analytics only when the page is accessed externally
        // Tracks: page views, conversions, estimated revenue for all monetization features
        function initializeExternalTracking() {` : `
        // Analytics tracking is only available for Pro users
        // Upgrade to Pro to access detailed analytics and tracking features
        function initializeExternalTracking() {
            // Analytics disabled for free plan users
            console.log('Analytics tracking is only available with Pro plan');
            return;`}
            const pageId = '${pageId}';
            
            // Function to track events for external access
            function trackExternalEvent(eventType, eventData) {
                try {
                    // Use the production API endpoint
                    const apiEndpoint = \`https://404monetizer.com/api/pages/\${pageId}/analytics\`;
                    

                    
                    // Make the tracking request
                    fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            eventType: eventType,
                            eventData: eventData || {},
                            isExternalAccess: true // Always mark as external access
                        }),
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .catch(function(error) {
                        // Silent fail - tracking errors won't affect user experience
                    });
                } catch (error) {
                    // Silent fail - tracking errors won't affect user experience
                }
            }
            
            // Track page view on load
            function trackPageView() {
                try {
                    const deviceType = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 
                                      /Tablet|iPad/.test(navigator.userAgent) ? 'tablet' : 'desktop';
                    
                    // Capture the actual domain where the 404 page is hosted
                    const currentDomain = window.location.hostname;
                    // Use the current domain as referrer if no actual referrer exists
                    // This shows which website the 404 page is deployed on
                    const referrerUrl = document.referrer ? 
                        (new URL(document.referrer)).hostname : 
                        currentDomain;
                    
                    // Get country information
                    fetch('https://ipapi.co/json/')
                        .then(function(response) { return response.json(); })
                        .then(function(data) {
                            trackExternalEvent('page_view', {
                                timestamp: new Date().toISOString(),
                                deviceType: deviceType,
                                referrerUrl: referrerUrl,
                                userAgent: navigator.userAgent,
                                pageUrl: window.location.href,
                                country: data.country_name || null,
                                city: data.city || null,
                                region: data.region || null
                            });
                        })
                        .catch(function(error) {
                            // Fallback without country data
                            trackExternalEvent('page_view', {
                                timestamp: new Date().toISOString(),
                                deviceType: deviceType,
                                referrerUrl: referrerUrl,
                                userAgent: navigator.userAgent,
                                pageUrl: window.location.href,
                                country: null
                            });
                        });
                } catch (error) {
                    // Silent fail - tracking errors won't affect user experience  
                }
            }
            
            // Track page view when page loads
            trackPageView();
            
            // Override email form submissions to track conversions
            const originalEmailSubmit = window.handleEmailSubmit;
            window.handleEmailSubmit = function(event) {
                event.preventDefault();
                const form = event.target;
                const email = form.email.value;
                const button = form.querySelector('button[type="submit"]');
                
                if (email) {
                    // Determine the source and estimated revenue
                    let source = 'email_collection';
                    let estimatedRevenue = 1.67; // Average email lead value
                    
                    if (form.closest('.email-collection-form')) {
                        source = 'email_collection';
                        estimatedRevenue = 1.23;
                    } else if (form.closest('[class*="newsletter"]')) {
                        source = 'newsletter_signup';
                        estimatedRevenue = 1.00;
                    } else if (form.closest('[class*="lead-magnet"]')) {
                        source = 'lead_magnet_download';
                        estimatedRevenue = 1.25;
                    }
                    
                    // Track email collection event with revenue
                    trackExternalEvent('email_collected', {
                        email: email,
                        source: source,
                        estimatedRevenue: estimatedRevenue,
                        conversionType: 'lead_generation',
                        timestamp: new Date().toISOString()
                    });
                    
                    const originalText = button.textContent;
                    button.textContent = 'Submitting...';
                    button.disabled = true;
                    
                    setTimeout(function() {
                        button.textContent = 'Thank you!';
                        button.classList.add('bg-green-600');
                        form.reset();
                        
                        setTimeout(function() {
                            button.textContent = originalText;
                            button.disabled = false;
                            button.classList.remove('bg-green-600');
                        }, 3000);
                    }, 1000);
                }
            };
            
            // Override affiliate link clicks to track conversions
            document.addEventListener('click', function(e) {
                const target = e.target.closest('[onclick*="window.open"]');
                if (target && target.onclick) {
                    const onclickStr = target.onclick.toString();
                    const urlMatch = onclickStr.match(/window\\.open\\(['"]([^'"]+)['"]\\)/);
                    if (urlMatch) {
                        // Estimate revenue based on affiliate commission (average 5-10%)
                        let estimatedRevenue = 1.56; // Conservative estimate for affiliate commission
                        let clickType = 'affiliate_link';
                        
                        // Check if it's a product showcase vs regular affiliate link
                        if (target.closest('[class*="product"]')) {
                            clickType = 'product_click';
                            estimatedRevenue = 2.75; // Higher value for product clicks
                        } else if (target.closest('[class*="sponsor"]')) {
                            clickType = 'sponsored_click';
                            estimatedRevenue = 1.55; // Sponsored content click value
                        }
                        
                        trackExternalEvent('affiliate_click', {
                            url: urlMatch[1],
                            element: target.tagName,
                            clickType: clickType,
                            estimatedRevenue: estimatedRevenue,
                            conversionType: 'affiliate_conversion',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
                
                // Track donation button clicks
                if (target && target.textContent && target.textContent.toLowerCase().includes('donat')) {
                    trackExternalEvent('donation_click', {
                        buttonText: target.textContent,
                        estimatedRevenue: 2.97, // Average donation amount
                        conversionType: 'donation',
                        timestamp: new Date().toISOString()
                    });
                }
                
                // Track countdown offer clicks
                if (target && target.closest('[data-expiry]')) {
                    trackExternalEvent('countdown_click', {
                        offerElement: target.tagName,
                        estimatedRevenue: 1.69, // Higher value for time-sensitive offers
                        conversionType: 'offer_conversion',
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            // Override content unlock to track conversions
            const originalUnlockContent = window.unlockContent;
            window.unlockContent = function(button) {
                trackExternalEvent('content_unlock', {
                    unlockMethod: 'click',
                    estimatedRevenue: 0.58, // Value of engaged user
                    conversionType: 'engagement',
                    timestamp: new Date().toISOString()
                });
                
                if (originalUnlockContent) {
                    originalUnlockContent(button);
                }
            };
            
            // Track AdSense ad interactions (if present)
            document.addEventListener('click', function(e) {
                if (e.target.closest('.adsbygoogle') || e.target.closest('[class*="ad"]')) {
                    trackExternalEvent('ad_click', {
                        adType: 'adsense',
                        estimatedRevenue: 0.09, // Average AdSense click value
                        conversionType: 'ad_revenue',
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            // Track exit intent interactions
            const originalShowExitIntent = window.showExitIntent;
            window.showExitIntent = function() {
                trackExternalEvent('exit_intent_shown', {
                    triggerType: 'exit_detection',
                    estimatedRevenue: 0, // No direct revenue, but valuable engagement data
                    conversionType: 'engagement',
                    timestamp: new Date().toISOString()
                });
                
                if (originalShowExitIntent) {
                    originalShowExitIntent();
                }
            };
            
            const originalCloseExitIntent = window.closeExitIntent;
            window.closeExitIntent = function() {
                // Track if exit intent was dismissed (could indicate user stayed)
                trackExternalEvent('exit_intent_dismissed', {
                    action: 'dismissed',
                    estimatedRevenue: 0.89, // Value of retained user
                    conversionType: 'retention',
                    timestamp: new Date().toISOString()
                });
                
                if (originalCloseExitIntent) {
                    originalCloseExitIntent();
                }
            };
        ${hasAnalyticsAccess ? `}
        
        // Initialize external tracking after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeExternalTracking);
        } else {
            initializeExternalTracking();
        }` : `}
        
        // Analytics tracking initialization skipped for free plan
        console.log('Upgrade to Pro to enable analytics tracking');`}

        // Custom JavaScript from user
        ${page?.customJS || ''}
    </script>
</body>
</html>`;
      };



  // Memoize the complete HTML generation to update in real-time when page changes
  const integrationCode = useMemo(() => {
    return generateCompleteHTML();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageId]); // Regenerate whenever page data changes

  const testingSteps = [
    {
      icon: FileCode,
      title: "1. Save the HTML File",
      description: "Save the complete code below as '404.html' in your website's root directory (public_html, www, or htdocs folder)."
    },
    {
      icon: Globe,
      title: "2. Configure Server (Platform-Specific)",
      description: "Choose your platform below for detailed setup instructions:",
      platforms: [
        {
          name: "WordPress",
          steps: [
            "Upload '404.html' to your theme's root directory (wp-content/themes/your-theme/)",
            "Rename your theme's existing '404.php' to '404-backup.php'",
            "Create a new '404.php' file with this content:",
            "<?php header('HTTP/1.0 404 Not Found'); include('404.html'); exit; ?>",
            "Alternative: Use a plugin like 'Custom 404 Pro' to set custom 404 pages"
          ]
        },
        {
          name: "Shopify",
          steps: [
            "Go to Online Store > Themes > Actions > Edit Code",
            "Navigate to Templates section",
            "Click 'Add a new template' > Select 'page' > Name it '404'",
            "Replace the content with the HTML code above",
            "Save the file - Shopify will automatically use it for 404 errors"
          ]
        },
        {
          name: "Apache (.htaccess)",
          steps: [
            "Upload '404.html' to your website's root directory",
            "Create or edit '.htaccess' file in the root directory",
            "Add this line: ErrorDocument 404 /404.html",
            "Save the .htaccess file",
            "Ensure your hosting provider allows .htaccess overrides"
          ]
        },
        {
          name: "Nginx",
          steps: [
            "Upload '404.html' to your web root directory",
            "Edit your Nginx configuration file (usually in /etc/nginx/)",
            "Add to your server block: error_page 404 /404.html;",
            "Add location block: location = /404.html { internal; }",
            "Reload Nginx: sudo systemctl reload nginx"
          ]
        },
        {
          name: "Netlify",
          steps: [
            "Upload '404.html' to your site's publish directory",
            "Netlify automatically serves 404.html for 404 errors",
            "Alternatively, add to netlify.toml: [[redirects]] from = '/*' to = '/404.html' status = 404",
            "Deploy your site - the 404 page will be active immediately"
          ]
        },
        {
          name: "Vercel",
          steps: [
            "Place '404.html' in your project's root or public directory",
            "Vercel automatically serves 404.html for 404 errors",
            "For Next.js: place in public/404.html or create pages/404.js",
            "Deploy your project - 404 page will be live instantly"
          ]
        }
      ]
    },
    {
      icon: CheckCircle,
      title: "3. Test the Setup",
      description: "Visit a non-existent page (like yoursite.com/test-404-page) to verify all features work correctly."
    }
  ];

  const troubleshooting = [
    {
      issue: "404 page not showing or showing default server error",
      solution: "1. Verify file location: Ensure 404.html is in the correct directory for your platform\n2. Check file permissions: Set 644 permissions for the HTML file\n3. Clear cache: Clear your website and browser cache\n4. Test URL: Try accessing yoursite.com/404.html directly first\n5. Server config: Verify your server/platform is configured to serve custom 404 pages",
      category: "Setup"
    },
    {
      issue: "Styling broken or looks different from preview",
      solution: "1. Check for CSS conflicts: Your site's CSS might be overriding the 404 page styles\n2. Add !important: If needed, add !important to critical CSS rules in the HTML\n3. Verify fonts: Ensure Google Fonts are loading correctly\n4. Test isolation: Open 404.html directly in browser to see if it works standalone\n5. Inspect element: Use browser dev tools to identify conflicting styles",
      category: "Styling"
    },
    {
      issue: "Email forms not working or not submitting",
      solution: "1. Form action: Ensure your email service (Mailchimp, ConvertKit) URL is correct\n2. CORS issues: Some email services require domain whitelisting\n3. JavaScript errors: Check browser console for JS errors\n4. Test manually: Try submitting the form and check your email service dashboard\n5. Alternative: Use Netlify Forms or Formspree for simple email collection",
      category: "Functionality"
    },
    {
      issue: "Analytics not tracking visits",
      solution: "1. External access only: Analytics only track external visitors, not dashboard previews\n2. Wait time: Allow 24-48 hours for first data to appear\n3. Test real traffic: Share your 404 URL with someone else to test tracking\n4. Check console: Look for any API errors in browser developer console\n5. Verify page ID: Ensure the correct page ID is embedded in the tracking code",
      category: "Analytics"
    },
    {
      issue: "Affiliate links not working properly",
      solution: "1. Link validation: Verify all affiliate URLs are correct and active\n2. Target attribute: Ensure links open in new tabs (_blank)\n3. Cookie tracking: Some affiliate programs require specific cookie settings\n4. Test clicks: Click each link to verify they redirect correctly\n5. Platform rules: Check if your platform allows affiliate links",
      category: "Monetization"
    },
    {
      issue: "Mobile layout issues or not responsive",
      solution: "1. Viewport meta: Ensure viewport meta tag is present in the HTML head\n2. CSS media queries: Verify responsive CSS is working correctly\n3. Test devices: Test on actual mobile devices, not just browser resize\n4. Touch targets: Ensure buttons and links are large enough for mobile\n5. Loading speed: Optimize images and code for mobile connections",
      category: "Mobile"
    },
    {
      issue: "WordPress specific: Page shows theme instead of custom 404",
      solution: "1. Theme priority: WordPress themes override custom 404.html files\n2. Use 404.php: Replace or modify your theme's 404.php file instead\n3. Plugin solution: Use '404page' or 'Custom 404 Pro' WordPress plugins\n4. Functions.php: Add custom 404 handling in your theme's functions.php\n5. Child theme: Always use a child theme to prevent updates overriding changes",
      category: "WordPress"
    },
    {
      issue: "Shopify: 404 template not loading",
      solution: "1. Template name: Ensure the template is named exactly '404.liquid'\n2. Theme files: Check it's in the correct Templates folder\n3. Liquid syntax: Verify there are no Liquid syntax errors\n4. Cache clear: Clear Shopify's theme cache\n5. Theme backup: Always backup your theme before making changes",
      category: "Shopify"
    }
  ];

  return (
    <div className="space-y-6">


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="h-5 w-5 text-primary" />
              <CardTitle>Complete 404.html Code</CardTitle>
            </div>
            <div className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
              HTML/CSS/JS
            </div>
          </div>
          <CardDescription>
            Complete, self-contained HTML file with all your monetization features, styling, interactions, and automatic analytics tracking - exactly matching your live preview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={integrationCode}
                readOnly
                className="font-mono text-xs min-h-[400px] resize-none"
                placeholder="Loading complete HTML code..."
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(integrationCode, 'code')}
              >
                {copied === 'code' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Perfect Match:</p>
                  <p className="text-blue-700">This code generates the exact same layout, styling, theme colors, fonts, and functionality as your live preview - ready to deploy!</p>
                </div>
              </div>
              
              {hasAnalyticsAccess ? (
                <div className="flex items-start space-x-3 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Analytics Tracking Included:</p>
                    <p className="text-green-700">Embedded tracking script automatically records real views, conversions, and revenue only from external visitors - dashboard previews won't affect your analytics!</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <Lock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Analytics Available in Pro:</p>
                    <p className="text-amber-700">Upgrade to Pro to enable automatic tracking of page views, conversions, and revenue analytics for your 404 pages.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="testing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="testing">Setup Steps</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                <CardTitle>Setup Instructions</CardTitle>
              </div>
              <CardDescription>
                Follow these steps to deploy your complete 404 page with all features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testingSteps.map((step, index) => (
                  <div key={index} className="border rounded-lg">
                    <div className="flex items-start space-x-3 p-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                    
                    {/* Platform-specific instructions for step 2 */}
                    {step.platforms && (
                      <div className="px-3 pb-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {step.platforms.map((platform, platformIndex) => (
                            <div key={platformIndex} className="bg-muted/50 rounded-lg p-3">
                              <h5 className="font-semibold text-sm text-primary mb-2">
                                {platform.name}
                              </h5>
                              <ol className="text-xs text-muted-foreground space-y-1">
                                {platform.steps.map((stepText, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start">
                                    <span className="mr-2 text-primary font-bold">
                                      {stepIndex + 1}.
                                    </span>
                                    <span className={stepText.startsWith('<?php') || stepText.startsWith('ErrorDocument') || stepText.startsWith('error_page') ? 'font-mono bg-background px-1 rounded' : ''}>
                                      {stepText}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {hasAnalyticsAccess ? (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 mb-1">Analytics Tracking Ready!</p>
                        <p className="text-amber-700">
                          Once deployed, this HTML will automatically track real analytics from external visitors. 
                          Your dashboard previews don't count toward analytics, so you can test freely! 
                          Check your analytics dashboard after deployment to see accurate visitor data.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Crown className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">Analytics Tracking (Pro Feature)</p>
                        <p className="text-blue-700">
                          Your 404 page will work perfectly without analytics tracking. Upgrade to Pro to enable automatic visitor analytics, conversion tracking, and revenue reporting.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <CardTitle>Common Issues & Solutions</CardTitle>
              </div>
              <CardDescription>
                Having trouble? Here are solutions to common setup problems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Group troubleshooting by category */}
                {['Setup', 'Styling', 'Functionality', ...(hasAnalyticsAccess ? ['Analytics'] : []), 'Monetization', 'Mobile', 'WordPress', 'Shopify'].map(category => {
                  const categoryItems = troubleshooting.filter(item => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-xs font-medium text-muted-foreground px-2 bg-background">
                          {category} Issues
                        </span>
                        <div className="h-px bg-border flex-1" />
                      </div>
                      
                      {categoryItems.map((item, index) => (
                        <div key={index} className="border rounded-lg">
                          <div className="p-3 bg-red-50/50 border-b">
                            <h4 className="font-medium text-sm text-red-700 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">❌</span>
                              {item.issue}
                            </h4>
                          </div>
                          <div className="p-3 bg-green-50/50">
                            <div className="text-sm text-green-700">
                              <div className="flex items-start gap-2 mb-2">
                                <span className="text-green-500 mt-0.5">✅</span>
                                <span className="font-medium">Solutions:</span>
                              </div>
                              <div className="ml-6 space-y-1">
                                {item.solution.split('\n').map((line, lineIndex) => (
                                  <div key={lineIndex} className="text-xs">
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  );
}