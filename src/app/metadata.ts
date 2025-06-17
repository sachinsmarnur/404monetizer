import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "404 Monetizer - Transform Error Pages into Revenue Streams",
  description: "Turn your 404 error pages into profit centers with 404 Monetizer. Recover lost visitors, boost conversions by 85%, and generate $50k+ monthly revenue. Smart redirections, real-time analytics, and seamless integration with all platforms.",
  keywords: [
    "404 page monetization",
    "404 monetizer",
    "404 pages",
    "error page optimization", 
    "website revenue recovery",
    "404 error",
    "404 error page solutions",
    "visitor retention tools",
    "web analytics platform",
    "conversion rate optimization",
    "bounce rate reduction",
    "404 redirect manager",
    "website profit optimization",
    "user experience enhancement",
    "revenue generation tools",
    "SEO error page solutions",
    "website traffic recovery",
    "smart 404 redirections",
    "page not found monetization",
    "e-commerce error pages",
    "SaaS analytics platform"
  ],
  authors: [{ name: "404 Monetizer Team", url: "https://404monetizer.com" }],
  creator: "404 Monetizer",
  publisher: "404 Monetizer",
  category: "Technology",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  applicationName: "404 Monetizer",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://404monetizer.com'),
  alternates: {
    canonical: 'https://404monetizer.com',
  },
  openGraph: {
    type: 'website',
    siteName: '404 Monetizer',
    title: '404 Monetizer - Transform Error Pages into Revenue Opportunities',
    description: 'Turn your 404 error pages into profit centers. Recover lost visitors, boost conversions by 85%, and generate $50k+ monthly revenue with smart redirections and real-time analytics.',
    url: 'https://404monetizer.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '404 Monetizer - Transform Error Pages into Revenue',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@404_monetizer',
    creator: '@404_monetizer',
    title: '404 Monetizer - Transform Error Pages into Revenue',
    description: 'Turn your 404 error pages into profit centers. Recover lost visitors and boost conversions by 85% with smart redirections.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=1', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
}; 