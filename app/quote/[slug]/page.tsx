import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCard } from "../../components";
import { publicQuotes } from "../../data";
import { PageShell } from "../../site-shell";
import { breadcrumbData, StructuredData } from "../../structured-data";

export function generateStaticParams() { return publicQuotes.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quote = publicQuotes.find((item) => item.slug === slug);
  return quote ? { title: `${quote.author}: “${quote.text.slice(0, 52)}${quote.text.length > 52 ? "…" : ""}”`, description: `${quote.text} — ${quote.author}. Source: ${quote.source}.`, alternates: { canonical: `/quote/${slug}` } } : {};
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = publicQuotes.find((item) => item.slug === slug);
  if (!quote) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Quotation", text: quote.text, creator: { "@type": quote.authorSlug === "bhagavad-gita" ? "CreativeWork" : "Person", name: quote.author }, isPartOf: { "@type": "CreativeWork", name: quote.source, url: quote.sourceUrl } };
  return <PageShell><StructuredData data={[schema, breadcrumbData([{ name: "Home", path: "/" }, { name: "Quotation", path: `/quote/${slug}` }])]} /><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Quotation</div><p className="eyebrow">Verified quotation and source</p><h1>A quotation by {quote.author}</h1><p>Reviewed {new Date(`${quote.reviewedAt}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" })}.</p></section><section className="content"><QuoteCard quote={quote} featured /><h2>Context and related collections</h2><p>This wording is published from <cite>{quote.source}</cite>. Follow the source link above to read it in context.</p><div className="pills">{quote.topics.map((topic) => <a href={`/topics/${topic}`} key={topic}>{topic.replaceAll("-", " ")}</a>)}</div></section></PageShell>;
}
