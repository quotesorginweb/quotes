import type { Metadata } from "next";
import { moods, publicQuotes } from "../data";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Quotes by Mood", description: "Browse sourced quotations by the feeling or perspective you need.", alternates: { canonical: "/moods" } };

export default function MoodsPage() {
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Moods</div><p className="eyebrow">Choose by feeling</p><h1>Quotes by mood</h1><p>Find words that meet the moment without losing their original source or context.</p></section><section className="content card-grid">{moods.map((mood) => <a className="index-card" href={`/moods/${mood.slug}`} key={mood.slug}><h2>{mood.label}</h2><p>{mood.note}</p><b>{publicQuotes.filter((quote) => quote.moods.includes(mood.slug)).length} verified quotes →</b></a>)}</section></PageShell>;
}
