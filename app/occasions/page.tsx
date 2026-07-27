import type { Metadata } from "next";
import { occasionCollections } from "../editorial-content";
import { MIN_VERIFIED_OCCASION_QUOTES, occasionReadiness } from "../occasion-readiness";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Quotes by Occasion", description: "Find carefully sourced quotations for milestones, celebrations and seasonal moments.", alternates: { canonical: "/occasions" } };

export default function Occasions() {
  const collections = occasionCollections.map((item) => ({ item, readiness: occasionReadiness(item.slug) }));
  const published = collections.filter(({ readiness }) => readiness.publishable);
  const developing = collections.filter(({ readiness }) => !readiness.publishable);
  return <PageShell>
    <section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Occasions</div><p className="eyebrow">Messages for meaningful moments</p><h1>Quotes by occasion</h1><p>Use a verified quotation to support your own words. Collections remain editorial previews until they contain at least {MIN_VERIFIED_OCCASION_QUOTES} sourced selections and pass final review.</p></section>
    <section className="content">
      <div className="section-head"><div><p className="eyebrow">Ready to use</p><h2>Published collections</h2></div><span>{published.length} collections meet the standard</span></div>
      <div className="card-grid">{published.map(({ item, readiness }) => <a className="index-card" href={`/occasions/${item.slug}`} key={item.slug}><span className="status ok">Published · {readiness.quotes.length} verified</span><h2>{item.label} quotes</h2><p>{item.intro}</p><b>Open collection →</b></a>)}</div>
      <div className="section-head occasion-development-head"><div><p className="eyebrow">Editorial pipeline</p><h2>Collections in development</h2></div><span>Noindex until ready</span></div>
      <div className="card-grid">{developing.map(({ item, readiness }) => <a className="index-card draft-card" href={`/occasions/${item.slug}`} key={item.slug}><span className="status draft">Preview · {readiness.quotes.length}/{MIN_VERIFIED_OCCASION_QUOTES} verified</span><h2>{item.label} quotes</h2><p>{item.intro}</p><b>View editorial preview →</b></a>)}</div>
    </section>
  </PageShell>;
}
