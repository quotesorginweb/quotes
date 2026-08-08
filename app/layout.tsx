import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "./analytics";
import { StructuredData } from "./structured-data";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL("https://quotes.org.in"),
  title: {
    default: "Verified Quotes with Sources | Quotes.org.in",
    template: "%s | Quotes.org.in",
  },
  description: "Discover carefully sourced quotations by topic, mood, occasion and author. Copy, share and create original quote images.",
  openGraph: {
    type: "website",
    siteName: "Quotes.org.in",
    title: "Verified words, thoughtfully sourced",
    description: "Discover quotations with transparent attribution, context and original images.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Quotes.org.in — verified words, thoughtfully sourced" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <StructuredData data={[
          { "@context": "https://schema.org", "@type": "Organization", name: "Quotes.org.in", url: "https://quotes.org.in", logo: "https://quotes.org.in/favicon.svg" },
          { "@context": "https://schema.org", "@type": "WebSite", name: "Quotes.org.in", url: "https://quotes.org.in", potentialAction: { "@type": "SearchAction", target: "https://quotes.org.in/search?q={search_term_string}", "query-input": "required name=search_term_string" } },
        ]} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
