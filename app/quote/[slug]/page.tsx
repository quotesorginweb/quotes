import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCard } from "../../components";
import { moods, publicQuotes } from "../../data";
import { occasionReadiness } from "../../occasion-readiness";
import { PageShell } from "../../site-shell";
import { breadcrumbData, StructuredData } from "../../structured-data";
import { sourceWorkForQuote } from "../../source-works";

export function generateStaticParams() { return publicQuotes.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quote = publicQuotes.find((item) => item.slug === slug);
  if (!quote) return {};
  const canonicalTopic = quote.topics[0] ?? "life";
  return {
    title: `${quote.author}: “${quote.text.slice(0, 52)}${quote.text.length > 52 ? "…" : ""}”`,
    description: `${quote.text} — ${quote.author}. Source: ${quote.source}.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/topics/${canonicalTopic}` },
  };
}

export default async function QuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quote = publicQuotes.find((item) => item.slug === slug);
  if (!quote) notFound();

  const relatedMoods = moods.filter((mood) => quote.moods.includes(mood.slug));
  const relatedOccasions = quote.occasions
    .map((occasion) => occasionReadiness(occasion))
    .filter((readiness) => readiness.publishable && readiness.item)
    .map((readiness) => readiness.item!);
  const relatedQuotes = publicQuotes.filter((candidate) => candidate.id !== quote.id && candidate.topics.some((topic) => quote.topics.includes(topic))).slice(0, 3);
  const sourceWork = sourceWorkForQuote(quote.source);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: quote.text,
    creator: { "@type": quote.authorSlug === "bhagavad-gita" ? "CreativeWork" : "Person", name: quote.author },
    isPartOf: { "@type": "CreativeWork", name: quote.source, url: quote.sourceUrl },
  };

  return <PageShell>
    <StructuredData data={[schema, breadcrumbData([{ name: "Home", path: "/" }, { name: "Quotation", path: `/quote/${slug}` }])]} />
    <section className="page-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / Quotation</div>
      <p className="eyebrow">Verified quotation and source</p>
      <h1>A quotation by {quote.author}</h1>
      <p>Reviewed {new Date(`${quote.reviewedAt}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" })}.</p>
    </section>
    <section className="content">
      <QuoteCard quote={quote} featured detailLink={false} />
      <h2>Context and related collections</h2>
      <p>This wording is published from <cite>{quote.source}</cite>. Follow the source link above to read it in context.</p>
      <div className="pills">
        {sourceWork && <a href={`/sources/${sourceWork.slug}`}>{sourceWork.title} source record</a>}
        {quote.occasions.some((occasion) => ["wedding", "anniversary", "valentines-day"].includes(occasion)) && <a href="/love-quotes">Love quotes</a>}
        {quote.topics.map((topic) => <a href={`/topics/${topic}`} key={topic}>{topic.replaceAll("-", " ")}</a>)}
        {relatedMoods.map((mood) => <a href={`/moods/${mood.slug}`} key={`mood-${mood.slug}`}>{mood.label} mood</a>)}
        {relatedOccasions.map((occasion) => <a href={`/occasions/${occasion.slug}`} key={`occasion-${occasion.slug}`}>{occasion.label}</a>)}
      </div>
      <aside className="collection-callout">
        <p className="eyebrow">Create with verified wording</p>
        <h2>Turn this quotation into an original image.</h2>
        <p>The image maker opens with the reviewed text and attribution already filled in.</p>
        <a className="button" href={`/tools/quote-image-generator?quote=${quote.slug}`}>Create an image →</a>
      </aside>
      <section>
        <p className="eyebrow">Related verified quotations</p>
        <h2>Continue exploring</h2>
        <div className="quote-list">{relatedQuotes.map((related) => <QuoteCard quote={related} key={related.id} />)}</div>
      </section>
    </section>
  </PageShell>;
}
