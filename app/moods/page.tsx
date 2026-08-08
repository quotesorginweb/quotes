import type { Metadata } from "next";
import { moods, publicQuotes } from "../data";
import { PageShell } from "../site-shell";
import { collectionPageData, StructuredData } from "../structured-data";

const description = "Browse verified quotations by mood, from hopeful and grateful to reflective or calm, with every source and context kept visible.";
export const metadata: Metadata = { title: "Quotes by Mood", description, alternates: { canonical: "/moods" } };

export default function MoodsPage() {
  return <PageShell><StructuredData data={collectionPageData({name:"Quotes by mood",path:"/moods",description,items:moods.map((mood)=>({name:mood.label,path:`/moods/${mood.slug}`})),breadcrumbs:[{name:"Home",path:"/"},{name:"Moods",path:"/moods"}]})}/><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Moods</div><p className="eyebrow">Choose by feeling</p><h1>Quotes by mood</h1><p>Find words that meet the moment without losing their original source or context.</p></section><section className="content card-grid">{moods.map((mood) => <a className="index-card" href={`/moods/${mood.slug}`} key={mood.slug}><h2>{mood.label}</h2><p>{mood.note}</p><b>{publicQuotes.filter((quote) => quote.moods.includes(mood.slug)).length} verified quotes →</b></a>)}</section></PageShell>;
}
