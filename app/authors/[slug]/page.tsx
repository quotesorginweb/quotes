import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authorReadiness } from "../../author-readiness";
import { QuoteCard } from "../../components";
import { authors, latestReviewDate, publicQuotes } from "../../data";
import { authorDetails } from "../../editorial-content";
import { PageShell } from "../../site-shell";
import { breadcrumbData, StructuredData } from "../../structured-data";

export function generateStaticParams() { return authors.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((item) => item.slug === slug);
  if (!author) return {};
  const readiness = authorReadiness(slug);
  return {
    title: `${author.name} Quotes and Sources`,
    description: `Verified ${author.name} quotations with source works, editorial context and attribution notes.`,
    robots: { index: readiness.indexable, follow: true },
    alternates: { canonical: `/authors/${slug}` },
  };
}

export default async function Author({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = authors.find((item) => item.slug === slug);
  const details = authorDetails[slug];
  if (!author || !details) notFound();
  const selected = publicQuotes.filter((quote) => quote.authorSlug === slug);
  const related = [...new Set(selected.flatMap((quote) => quote.topics))].slice(0, 6);
  const sourceText = slug === "bhagavad-gita";
  const readiness = authorReadiness(slug);
  const schema = { "@context": "https://schema.org", "@type": sourceText ? "CreativeWork" : "Person", name: author.name, description: author.description };

  return <PageShell>
    <StructuredData data={[schema, breadcrumbData([{ name: "Home", path: "/" }, { name: "Authors and sources", path: "/authors" }, { name: author.name, path: `/authors/${slug}` }])]} />
    <section className="page-hero author-hero">
      <div className="monogram">{sourceText ? "BG" : author.name.split(" ").map((part) => part[0]).join("")}</div>
      <div>
        <div className="breadcrumbs"><a href="/">Home</a> / <a href="/authors">Authors and sources</a> / {author.name}</div>
        <p className="eyebrow">{sourceText ? "Verified source-text record" : "Verified author record"}</p>
        <h1>{author.name}</h1>
        <p>{author.years} · {author.description}</p>
        <p><small>Substantively reviewed {new Date(`${latestReviewDate}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" })} · Quotes.org.in editorial desk</small></p>
      </div>
    </section>
    <article className="content author-layout">
      <div>
        {!readiness.indexable && <aside className="collection-callout"><p className="eyebrow">Growing verified collection</p><h2>{readiness.remaining} more sourced {readiness.remaining === 1 ? "quotation" : "quotations"} needed.</h2><p>This record remains available to readers but stays out of search indexes until it contains at least three reviewed quotations.</p></aside>}
        <h2>About {author.name}</h2><p>{details.overview}</p>
        <h2>How these quotations are verified</h2><p>{details.method}</p>
        <h2>Sources and bibliography</h2><ul>{details.bibliography.map((item) => <li key={item.url}><a className="text-link" href={item.url} rel="noreferrer">{item.title} →</a></li>)}</ul>
        <h2>Related topics</h2><div className="pills">{related.map((topic) => <a href={`/topics/${topic}`} key={topic}>{topic.replaceAll("-", " ")}</a>)}</div>
      </div>
      <aside className="author-facts"><strong>Editorial record</strong><dl><dt>Published quotations</dt><dd>{selected.length}</dd><dt>Source policy</dt><dd>Primary or reliable secondary editions</dd><dt>Rights preference</dt><dd>Public domain</dd><dt>Correction route</dt><dd>Available on every quotation</dd></dl></aside>
    </article>
    <section className="content"><p className="eyebrow">Verified quotations</p><div className="quote-list">{selected.map((quote) => <QuoteCard quote={quote} key={quote.id} />)}</div></section>
  </PageShell>;
}
