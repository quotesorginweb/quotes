import type { Metadata } from "next";
import { CollectionControls } from "../components";
import { authors, publicQuotes } from "../data";
import { PageShell } from "../site-shell";
import { breadcrumbData, StructuredData } from "../structured-data";

export const metadata: Metadata = {
  title: "Indian Quotes with Verified Sources",
  description: "Verified quotations from Indian poets, philosophers and source texts, with editions, translations and context kept visible.",
  alternates: { canonical: "/indian-quotes" },
};

export default function IndianQuotesPage() {
  const selected = publicQuotes.filter((quote) => quote.culturalContext === "India");
  const authorSlugs = new Set(selected.map((quote) => quote.authorSlug));
  const indianAuthors = authors.filter((author) => authorSlugs.has(author.slug));
  const hindiCount = selected.filter((quote) => quote.languageCode === "hi").length;

  return <PageShell>
    <StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Indian quotes", path: "/indian-quotes" }])} />
    <section className="page-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / Indian quotes</div>
      <p className="eyebrow">Indian voices, read in context</p>
      <h1>Indian quotes with verified sources</h1>
      <p>Explore {selected.length} reviewed selections from Indian poetry, philosophy and public-domain source texts. Editions, speakers and translators remain visible instead of being flattened into anonymous internet sayings.</p>
      <p><small>{hindiCount} selections preserve their Hindi wording with an editorial English meaning.</small></p>
    </section>
    <section className="content">
      <aside className="collection-callout india-callout">
        <p className="eyebrow">Browse the voices</p>
        <h2>Authors and source texts in this collection</h2>
        <div className="pills">{indianAuthors.map((author) => <a href={`/authors/${author.slug}`} key={author.slug}>{author.name}</a>)}</div>
        <p>For Devanagari text and English meanings together, continue to the <a className="text-link" href="/hindi-quotes">Hindi quotes collection</a>.</p>
      </aside>
      <CollectionControls quotes={selected} />
    </section>
  </PageShell>;
}
