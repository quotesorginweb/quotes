import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionControls } from "../../components";
import { imageFormats, occasionCollections } from "../../editorial-content";
import { MIN_VERIFIED_OCCASION_QUOTES, occasionReadiness } from "../../occasion-readiness";
import { PageShell } from "../../site-shell";

export function generateStaticParams() {
  return occasionCollections.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { item, publishable } = occasionReadiness(slug);
  if (!item) return {};
  return {
    title: `${item.label} Quotes: Verified Words for the Occasion`,
    description: item.intro,
    robots: { index: publishable, follow: true },
    alternates: { canonical: `/occasions/${slug}` },
  };
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { item, quotes, publishable, remaining } = occasionReadiness(slug);
  if (!item) notFound();

  return <PageShell>
    <section className="page-hero occasion-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / <a href="/occasions">Occasions</a> / {item.label}</div>
      <p className="eyebrow">{publishable ? "Published verified collection" : "Editorial preview · noindex"}</p>
      <h1>{item.label} quotes</h1>
      <p>{item.intro}</p>
      <p><strong>How to use this collection:</strong> {item.guidance}</p>
      <div className="occasion-readiness" aria-label="Collection publication status">
        <strong>{quotes.length} verified quotations</strong>
        <span>{publishable ? "Publication standard met" : `${remaining} more required before publication`}</span>
      </div>
    </section>
    <section className="content">
      <aside className="collection-callout">
        <p className="eyebrow">Editorial selection standard</p>
        <h2>Useful, varied and source-checked.</h2>
        <p>A public occasion collection requires at least {MIN_VERIFIED_OCCASION_QUOTES} approved quotations, more than one editorial angle, traceable wording and public-domain or cleared rights. A page stays out of search indexes and the sitemap until both the content threshold and editorial review are complete.</p>
      </aside>
      {quotes.length
        ? <><p className="results-note">{publishable ? "Published selections" : "Verified selections currently in review"}</p><CollectionControls quotes={quotes} /></>
        : <div className="quote-card"><h2>Verification is still in progress</h2><p>This dedicated page contains original editorial guidance, but no quotation will be added merely to make it appear complete. Source and rights review must finish first.</p></div>}
      <section className="occasion-writing-guide">
        <div><p className="eyebrow">Make it personal</p><h2>A quotation should support your message.</h2></div>
        <ol><li>Choose a line that fits the recipient and the actual occasion.</li><li>Keep the verified wording and attribution unchanged.</li><li>Add your own specific memory, hope or acknowledgement.</li><li>Check the linked source when the original context matters.</li></ol>
      </section>
      <section className="image-spec">
        <div><p className="eyebrow">Original image formats</p><h2>Designed for meaningful sharing.</h2><p>Once this collection is published, approved quotations can be rendered for feeds, stories, link previews and Pinterest with source-aware alternative text.</p></div>
        <div>{imageFormats.map((format) => <article key={format.label}><b>{format.label}</b><span>{format.size}</span><small>{format.use}</small></article>)}</div>
      </section>
    </section>
  </PageShell>;
}
