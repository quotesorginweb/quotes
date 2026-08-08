import type { Metadata } from "next";
import { CollectionControls } from "../components";
import { publicQuotes } from "../data";
import { PageShell } from "../site-shell";
import { breadcrumbData, StructuredData } from "../structured-data";

export const metadata: Metadata = {
  title: "Hindi Quotes with English Meanings and Sources",
  description: "Source-checked Hindi dohas and quotations in Devanagari with clear English meanings, author records and original editions.",
  alternates: { canonical: "/hindi-quotes" },
};

export default function HindiQuotesPage() {
  const selected = publicQuotes.filter((quote) => quote.languageCode === "hi");
  return <PageShell>
    <StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Indian quotes", path: "/indian-quotes" }, { name: "Hindi quotes", path: "/hindi-quotes" }])} />
    <section className="page-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / <a href="/indian-quotes">Indian quotes</a> / Hindi quotes</div>
      <p className="eyebrow">Devanagari, meaning and source</p>
      <h1>Hindi quotes with English meanings</h1>
      <p>These {selected.length} reviewed dohas preserve the cited Hindi wording. Each English meaning is clearly labelled as editorial guidance rather than presented as a historical translation.</p>
    </section>
    <section className="content">
      <aside className="collection-callout">
        <p className="eyebrow">How to read this collection</p>
        <h2>Keep wording, meaning and edition distinct.</h2>
        <p>Open an author record for the cited edition and editorial method. Use the displayed Devanagari when quoting the original; use the English line as a meaning guide.</p>
      </aside>
      <CollectionControls quotes={selected} />
    </section>
  </PageShell>;
}
