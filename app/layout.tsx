import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYRO — Whitelist & Creator Access",
  description:
    "Fitness is now a competitive sport. Real-time 1v1 AI battles. Join the VYRO whitelist.",
  icons: {
    icon: "/icons/favicon-32.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..900&family=Outfit:wght@400..900&display=swap"
          rel="stylesheet"
        />
        {/* Scroll-entrance animations are applied by JS; without it, show everything. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="font-body text-white">{children}</body>
    </html>
  );
}
