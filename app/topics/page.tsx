import type { Metadata } from "next";
import { topics } from "../data";
import { PageShell } from "../site-shell";
export const metadata: Metadata = { title: "Quote Topics", description: "Browse verified quotation collections by subject.", alternates: { canonical: "/topics" } };
export default function TopicsPage(){return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Topics</div><p className="eyebrow">Browse collections</p><h1>Quote topics</h1><p>Curated collections built around a distinct reader need—not every keyword variation.</p></section><section className="content card-grid">{topics.map(t=><a className="index-card" key={t.slug} href={`/topics/${t.slug}`}><h2>{t.label}</h2><p>{t.note}</p><b>Explore verified quotes →</b></a>)}</section></PageShell>}
