import type { Metadata } from "next";
import { occasionCollections } from "../editorial-content";
import { occasionReadiness } from "../occasion-readiness";
import { PageShell } from "../site-shell";
import { collectionPageData, StructuredData } from "../structured-data";

const description = "Find carefully sourced quotations for birthdays, weddings, graduation and seasonal moments, with guidance for adding your own message.";
export const metadata: Metadata = { title: "Quotes by Occasion", description, alternates: { canonical: "/occasions" } };

export default function Occasions() {
  const collections = occasionCollections.map((item) => ({ item, readiness: occasionReadiness(item.slug) }));
  const published = collections.filter(({ readiness }) => readiness.publishable);
  return <PageShell>
    <StructuredData data={collectionPageData({name:"Quotes by occasion",path:"/occasions",description,items:published.map(({item})=>({name:item.label,path:`/occasions/${item.slug}`})),breadcrumbs:[{name:"Home",path:"/"},{name:"Occasions",path:"/occasions"}]})} />
    <section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Occasions</div><p className="eyebrow">Messages for meaningful moments</p><h1>Quotes by occasion</h1><p>Use a verified quotation to support your own words. Only complete, source-checked collections appear here.</p></section>
    <section className="content">
      <div className="section-head"><div><p className="eyebrow">Ready to use</p><h2>Published collections</h2></div><span>{published.length} collections meet the standard</span></div>
      <div className="card-grid">{published.map(({ item, readiness }) => <a className="index-card" href={`/occasions/${item.slug}`} key={item.slug}><span className="status ok">Published · {readiness.quotes.length} verified</span><h2>{item.label} quotes</h2><p>{item.intro}</p><b>Open collection →</b></a>)}</div>
    </section>
  </PageShell>;
}
