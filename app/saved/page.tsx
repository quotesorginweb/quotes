import type { Metadata } from "next";
import { SavedQuotes } from "../components";
import { publicQuotes } from "../data";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Saved Quotes", description: "View quotations saved in this browser.", robots: { index: false, follow: true } };

export default function SavedPage() {
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Saved quotes</div><p className="eyebrow">Private to this browser</p><h1>Saved quotes</h1><p>Your list is stored only on this device. Quotes.org.in does not receive or sync it.</p></section><section className="content"><SavedQuotes quotes={publicQuotes} /></section></PageShell>;
}
