import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "404 Monetizer - Transform Error Pages into Revenue",
  description: "Convert your 404 error pages into revenue opportunities with smart redirections and targeted recommendations.",
  keywords: ["404 pages", "error pages", "monetization", "revenue", "web optimization"],
  authors: [{ name: "404 Monetizer" }],
  creator: "404 Monetizer",
  publisher: "404 Monetizer",
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.svg?v=1', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg?v=1', sizes: '180x180', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg?v=1',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
}; 