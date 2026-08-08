import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionControls } from "../../components";
import { RelatedCollections } from "../../related-collections";
import { quotesForSourceWork, sourceWorks } from "../../source-works";
import { PageShell } from "../../site-shell";
import { breadcrumbData, StructuredData } from "../../structured-data";
import { sourceSeoTitles } from "../../seo-content";

export function generateStaticParams() { return sourceWorks.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const work = sourceWorks.find((item) => item.slug === slug); return work ? { title: sourceSeoTitles[slug] || `${work.title} Quotes`, description: work.description, alternates: { canonical: `/sources/${slug}` } } : {}; }

export default async function SourceWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = sourceWorks.find((item) => item.slug === slug);
  if (!work) notFound();
  const quotes = quotesForSourceWork(work);
  return <PageShell>
    <StructuredData data={[{ "@context": "https://schema.org", "@type": "CreativeWork", name: work.title, creator: { "@type": "Person", name: work.creator }, url: work.sourceUrl }, breadcrumbData([{ name: "Home", path: "/" }, { name: "Source works", path: "/sources" }, { name: work.title, path: `/sources/${slug}` }])]} />
    <section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / <a href="/sources">Source works</a> / {work.title}</div><p className="eyebrow">Verified source-work record</p><h1>{work.title}</h1><p>{work.description}</p><p>By <a className="text-link" href={`/authors/${work.creatorSlug}`}>{work.creator}</a> · <a className="text-link" href={work.sourceUrl} rel="noreferrer">Read the edition used for verification</a></p><p><small>{quotes.length} published source-checked quotations</small></p></section>
    <section className="content"><RelatedCollections quotes={quotes} /><CollectionControls quotes={quotes} /></section>
  </PageShell>;
}
