import type { Metadata } from "next";
import { topics } from "../data";
import { PageShell } from "../site-shell";
import { collectionPageData, StructuredData } from "../structured-data";
const description = "Browse verified quotation collections by subject, with source notes, transparent attribution and original quote images for sharing.";
export const metadata: Metadata = { title: "Quote Topics", description, alternates: { canonical: "/topics" } };
export default function TopicsPage(){return <PageShell><StructuredData data={collectionPageData({name:"Quote topics",path:"/topics",description,items:topics.map((topic)=>({name:topic.label,path:`/topics/${topic.slug}`})),breadcrumbs:[{name:"Home",path:"/"},{name:"Topics",path:"/topics"}]})}/><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Topics</div><p className="eyebrow">Browse collections</p><h1>Quote topics</h1><p>Curated collections built around a distinct reader need—not every keyword variation.</p></section><section className="content card-grid">{topics.map(t=><a className="index-card" key={t.slug} href={`/topics/${t.slug}`}><h2>{t.label}</h2><p>{t.note}</p><b>Explore verified quotes →</b></a>)}</section></PageShell>}
