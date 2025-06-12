import "./globals.css";
import LayoutClient from "./layout-client";
import { metadata, viewport } from "./metadata";

export { metadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SVG favicon for modern browsers */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" />
        {/* Fallback for older browsers */}
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
