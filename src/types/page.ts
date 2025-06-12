import { ThemeType } from "@/lib/theme-styles";

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

export interface ContentLock {
  enabled: boolean;
  content: string;
  unlockType: 'email' | 'click' | 'social';
  redirectUrl?: string;
}

export interface EmailCollection {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  emailPlaceholder: string;
  webhookUrl?: string;
  successMessage: string;
}

export interface CountdownOffer {
  enabled: boolean;
  title: string;
  description: string;
  expiryDate: string;
  redirectUrl: string;
  buttonText: string;
}

export interface AdSense {
  enabled: boolean;
  code: string;
  placement: 'top' | 'bottom' | 'custom';
}

export interface LeadMagnet {
  enabled: boolean;
  title: string;
  description: string;
  fileUrl: string;
  buttonText: string;
  emailPlaceholder: string;
  successMessage: string;
  fileType: 'pdf' | 'ebook' | 'template' | 'other';
}

export interface SponsoredContent {
  enabled: boolean;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  buttonText: string;
  sponsorName: string;
}

export interface DonationButton {
  enabled: boolean;
  title: string;
  description: string;
  donationUrl: string;
  buttonText: string;
  platform: 'paypal' | 'stripe' | 'kofi' | 'patreon' | 'custom';
  targetAmount?: number;
  currency: string;
}

export interface NewsletterSignup {
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

export interface ProductShowcase {
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

export interface SocialProof {
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

export interface ExitIntent {
  enabled: boolean;
  title: string;
  description: string;
  offerText: string;
  buttonText: string;
  redirectUrl: string;
  delaySeconds: number;
}

export interface MonetizationFeatures {
  affiliateLinks: AffiliateLink[];
  contentLock: ContentLock;
  emailCollection: EmailCollection;
  countdownOffer: CountdownOffer;
  adSense: AdSense;
  leadMagnet: LeadMagnet;
  sponsoredContent: SponsoredContent;
  donationButton: DonationButton;
  newsletterSignup: NewsletterSignup;
  productShowcase: ProductShowcase;
  socialProof: SocialProof;
  exitIntent: ExitIntent;
  customRedirects: boolean;
}

export interface Page404 {
  id?: number;
  title: string;
  description: string;
  logo: string;
  category: string;
  font: string;
  theme: ThemeType;
  socialLinks: {
    [key: string]: string;
  };
  monetizationFeatures: MonetizationFeatures;
  customCSS: string;
  customJS: string;
  status?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
} 