import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionControls } from "../../components";
import { moods, publicQuotes } from "../../data";
import { PageShell } from "../../site-shell";
import { breadcrumbData, StructuredData } from "../../structured-data";
import { RelatedCollections } from "../../related-collections";
import { moodDescriptions } from "../../seo-content";

export function generateStaticParams() { return moods.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mood = moods.find((item) => item.slug === slug);
  return mood ? { title: `${mood.label} Quotes with Sources`, description: moodDescriptions[slug] || mood.note, alternates: { canonical: `/moods/${slug}` } } : {};
}

export default async function MoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mood = moods.find((item) => item.slug === slug);
  if (!mood) notFound();
  const selected = publicQuotes.filter((quote) => quote.moods.includes(slug));
  return <PageShell><StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Moods", path: "/moods" }, { name: mood.label, path: `/moods/${slug}` }])} /><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / <a href="/moods">Moods</a> / {mood.label}</div><p className="eyebrow">Source-checked collection</p><h1>{mood.label} quotes</h1><p>{mood.note}. Every quotation includes the work and source used during review.</p></section><section className="content"><RelatedCollections quotes={selected} excludeMood={slug} /><CollectionControls quotes={selected} /></section></PageShell>;
}
