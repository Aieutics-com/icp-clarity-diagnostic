import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

export const metadata: Metadata = {
  title: "ICP Clarity Diagnostic — Aieutics",
  description:
    "18 questions to test whether your Ideal Customer Profile is specific enough to sell, validated enough to trust, and connected to your value proposition and pricing.",
  openGraph: {
    title: "ICP Clarity Diagnostic",
    description:
      "How clear is your buyer profile? A self-assessment for startup founders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Almarai:wght@300;400;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <p className="licence-notice" style={{fontSize:12,lineHeight:1.5,opacity:0.55,textAlign:"center",maxWidth:720,margin:"0 auto",padding:"16px 24px 24px",position:"relative",zIndex:10}}>© 2026 Alexandra Najdanovic, Aieutics. Licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" rel="license">CC BY-NC-ND 4.0</a>. Internal use by organisations is permitted; use in paid client work or resale requires a licence: <a href="https://www.aieutics.com">contact us</a>.</p>
        <Analytics />
      </body>
    </html>
  );
}
