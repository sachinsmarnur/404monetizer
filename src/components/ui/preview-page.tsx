import React from "react";
import { ThemeType, generateThemeCSS } from "@/lib/theme-styles";
import {
  Main404Content,
  SocialLinksSection,
  LeadMagnetSection,
  SponsoredContentSection,
  DonationSection,
  NewsletterSection,
  ProductShowcaseSection
} from "@/components/preview/PreviewComponents";
import { SocialProof } from "@/types/page";

// Simple placeholder components for missing preview components
const EmailCollectionSection = ({ settings }: { settings: { enabled?: boolean; title?: string; description?: string; emailPlaceholder?: string; buttonText?: string }; theme?: ThemeType }) => {
  if (!settings?.enabled) return null;
  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold mb-4">{settings.title || "Join Our Newsletter"}</h3>
        <p className="text-muted-foreground mb-4">{settings.description}</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder={settings.emailPlaceholder || "Enter your email"}
            className="flex-1 px-3 py-2 border rounded-md"
            disabled
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            {settings.buttonText || "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentLockSection = ({ settings }: { settings: { enabled?: boolean; unlockType?: string }; theme?: ThemeType }) => {
  if (!settings?.enabled) return null;
  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="p-6 border-2 border-dashed border-muted-foreground rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🔒 Exclusive Content</h3>
          <p className="text-muted-foreground mb-4">Unlock this content by {settings.unlockType}</p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Unlock Content
          </button>
        </div>
      </div>
    </div>
  );
};

const CountdownOfferSection = ({ settings }: { settings: { enabled?: boolean; title?: string; description?: string; buttonText?: string }; theme?: ThemeType }) => {
  if (!settings?.enabled) return null;
  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{settings.title || "Limited Time Offer!"}</h3>
          <p className="text-muted-foreground mb-4">{settings.description}</p>
          <div className="text-2xl font-bold text-red-600 mb-4">⏰ Offer expires soon!</div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md">
            {settings.buttonText || "Claim Offer"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AffiliateLinksSection = ({ links }: { links: Array<{ id?: string; title?: string; description?: string }>; theme?: ThemeType }) => {
  if (!links?.length) return null;
  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h3 className="text-lg font-semibold mb-4 text-center">Recommended Products</h3>
        <div className="grid gap-4">
          {links.slice(0, 3).map((link, index) => (
            <div key={link.id || index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium">{link.title}</h4>
              {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
              <button className="mt-2 text-primary hover:underline">Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExitIntentSection = ({ settings }: { settings: { enabled?: boolean }; theme?: ThemeType }) => {
  if (!settings?.enabled) return null;
  return null; // Exit intent popups don't show in static preview
};

// Simple SocialProofSection component for preview
const SocialProofSection = ({ settings }: { settings: SocialProof; theme?: ThemeType }) => {
  if (!settings?.enabled || !settings.testimonials?.length) return null;
  
  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h3 className="text-lg font-semibold mb-6 text-center">{settings.title || "What Our Customers Say"}</h3>
        <div className="grid gap-4">
          {settings.testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={testimonial.id || index} className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                {testimonial.imageUrl ? (
                  <img src={testimonial.imageUrl} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">{testimonial.name[0]}</span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                    {testimonial.rating && (
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-xs ${i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface Page404 {
  title: string;
  description: string;
  theme?: ThemeType;
  socialLinks: Record<string, string>;
  monetizationFeatures: {
    leadMagnet: {
      enabled: boolean;
      title: string;
      description: string;
      emailPlaceholder: string;
      buttonText: string;
      fileType: string;
    };
    sponsoredContent: {
      enabled: boolean;
      title: string;
      description: string;
      imageUrl: string;
      buttonText: string;
      sponsorName: string;
    };
    donationButton: {
      enabled: boolean;
      title: string;
      description: string;
      buttonText: string;
      targetAmount?: number;
      currency: string;
      platform: string;
    };
    newsletterSignup: {
      enabled: boolean;
      title: string;
      description: string;
      emailPlaceholder: string;
      buttonText: string;
      provider: string;
    };
    productShowcase: {
      enabled: boolean;
      title: string;
      description: string;
      products: Array<{
        name: string;
        description: string;
        price: string;
        imageUrl?: string;
        featured?: boolean;
      }>;
    };
    socialProof: SocialProof;
    emailCollection: {
      enabled: boolean;
      title: string;
      description: string;
      emailPlaceholder: string;
      buttonText: string;
    };
    contentLock: {
      enabled: boolean;
      unlockType: string;
    };
    countdownOffer: {
      enabled: boolean;
      title: string;
      description: string;
      buttonText: string;
    };
    affiliateLinks: Array<{
      id: string;
      title: string;
      url: string;
      imageUrl?: string;
      description?: string;
    }>;
    exitIntent: {
      enabled: boolean;
      title: string;
      description: string;
      offerText: string;
      buttonText: string;
    };
  };
  customCSS?: string;
}

interface Props {
  page: Page404;
}

export function PreviewPage({ page }: Props) {
  const selectedTheme = (page.theme || 'default') as ThemeType;
  
  // Generate CSS variables for the selected theme
  const themeCSS = generateThemeCSS(selectedTheme, 'light');
  
  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        fontFamily: `var(--font-family), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      }}
    >
      {/* Inject theme CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      
      {/* Main 404 Content */}
      <Main404Content 
        title={page.title} 
        description={page.description} 
        theme={selectedTheme}
      />
      
      {/* Social Links */}
      <SocialLinksSection 
        socialLinks={page.socialLinks} 
        theme={selectedTheme}
      />
      
      {/* Monetization Sections */}
      <div className="space-y-0">
        <LeadMagnetSection 
          settings={page.monetizationFeatures.leadMagnet} 
          theme={selectedTheme}
        />
        
        <SponsoredContentSection 
          settings={page.monetizationFeatures.sponsoredContent} 
          theme={selectedTheme}
        />
        
        <DonationSection 
          settings={page.monetizationFeatures.donationButton} 
          theme={selectedTheme}
        />
        
        <NewsletterSection 
          settings={page.monetizationFeatures.newsletterSignup} 
          theme={selectedTheme}
        />
        
        <ProductShowcaseSection 
          settings={page.monetizationFeatures.productShowcase} 
          theme={selectedTheme}
        />
        
        <SocialProofSection 
          settings={page.monetizationFeatures.socialProof} 
          theme={selectedTheme}
        />
        
        <EmailCollectionSection 
          settings={page.monetizationFeatures.emailCollection} 
          theme={selectedTheme}
        />
        
        <ContentLockSection 
          settings={page.monetizationFeatures.contentLock} 
          theme={selectedTheme}
        />
        
        <CountdownOfferSection 
          settings={page.monetizationFeatures.countdownOffer} 
          theme={selectedTheme}
        />
        
        <AffiliateLinksSection 
          links={page.monetizationFeatures.affiliateLinks} 
          theme={selectedTheme}
        />
        
        <ExitIntentSection 
          settings={page.monetizationFeatures.exitIntent} 
          theme={selectedTheme}
        />
      </div>
      
      {/* Custom CSS Injection */}
      {page.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.customCSS }} />
      )}
    </div>
  );
} 