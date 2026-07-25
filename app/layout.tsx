import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quotes.org.in"),
  title: {
    default: "Quotes.org.in — Verified Quotes, Sources & Original Images",
    template: "%s | Quotes.org.in",
  },
  description: "Discover carefully sourced quotations by topic, mood, occasion and author. Copy, share and create original quote images.",
  openGraph: {
    type: "website",
    siteName: "Quotes.org.in",
    title: "Verified words, thoughtfully sourced",
    description: "Discover quotations with transparent attribution, context and original images.",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${lora.variable}`}
      >
        <a className="skip-link" href="#main">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
