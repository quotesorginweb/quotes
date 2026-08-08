import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionControls } from "../../components";
import { occasionCollections } from "../../editorial-content";
import { occasionReadiness } from "../../occasion-readiness";
import { PageShell } from "../../site-shell";
import { RelatedCollections } from "../../related-collections";

export function generateStaticParams() {
  return occasionCollections.filter(({ slug }) => occasionReadiness(slug).publishable).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { item, publishable } = occasionReadiness(slug);
  if (!item || !publishable) return {};
  return {
    title: `${item.label} Quotes: Verified Words for the Occasion`,
    description: item.intro,
    robots: { index: publishable, follow: true },
    alternates: { canonical: `/occasions/${slug}` },
  };
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { item, quotes, publishable } = occasionReadiness(slug);
  if (!item || !publishable) notFound();

  return <PageShell>
    <section className="page-hero occasion-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / <a href="/occasions">Occasions</a> / {item.label}</div>
      <p className="eyebrow">Published verified collection</p>
      <h1>{item.label} quotes</h1>
      <p>{item.intro}</p>
      <p><strong>How to use this collection:</strong> {item.guidance}</p>
      <p><small>{quotes.length} source-checked quotations</small></p>
    </section>
    <section className="content">
      <RelatedCollections quotes={quotes} excludeOccasion={slug} />
      <CollectionControls quotes={quotes} />
      <section className="occasion-writing-guide">
        <div><p className="eyebrow">Make it personal</p><h2>A quotation should support your message.</h2></div>
        <ol><li>Choose a line that fits the recipient and the actual occasion.</li><li>Keep the verified wording and attribution unchanged.</li><li>Add your own specific memory, hope or acknowledgement.</li><li>Check the linked source when the original context matters.</li></ol>
      </section>
      <aside className="collection-callout"><p className="eyebrow">Create an image</p><h2>Use the wording that fits your message.</h2><p>Open the <a className="text-link" href="/tools/quote-image-generator">quote image maker</a> to create a square, portrait, story or landscape card. Keep the source and attribution visible when using a published quotation.</p></aside>
    </section>
  </PageShell>;
}
