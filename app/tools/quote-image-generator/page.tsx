import type { Metadata } from "next";
import { ImageGenerator } from "../../components";
import { publicQuotes } from "../../data";
import { PageShell } from "../../site-shell";

export const metadata: Metadata = {
  title: "Free Quote Image Generator",
  description: "Create and download a custom quote image in your browser using verified quotations, accessible layouts and multiple sharing formats.",
  alternates: { canonical: "/tools/quote-image-generator" },
};

export default async function Generator({ searchParams }: { searchParams: Promise<{ quote?: string }> }) {
  const slug = (await searchParams).quote;
  const selected = slug ? publicQuotes.find((quote) => quote.slug === slug) : undefined;
  return <PageShell>
    <section className="page-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / Tools / Quote image generator</div>
      <p className="eyebrow">Original image tool</p>
      <h1>Quote image generator</h1>
      <p>{selected ? "This verified quotation and attribution are ready to style." : "Create a clean, original quote image."} Text stays in your browser and is never published automatically.</p>
      {selected && <p><a className="text-link" href={`/quote/${selected.slug}`}>Return to the verified quote and source →</a></p>}
    </section>
    <section className="content"><ImageGenerator initialQuote={selected?.text} initialAuthor={selected?.author} /></section>
  </PageShell>;
}
