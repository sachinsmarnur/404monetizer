import "./globals.css";
import LayoutClient from "./layout-client";
import { metadata, viewport } from "./metadata";
import { config } from "@/lib/config";

export { metadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaSiteKey = config.recaptcha.siteKey;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SVG favicon for modern browsers */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" />
        {/* Fallback for older browsers */}
        <link rel="shortcut icon" href="/favicon.svg" />
        
        {/* Google reCAPTCHA v3 */}
        {recaptchaSiteKey && (
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
            async
            defer
          ></script>
        )}
      </head>
      <body>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
