import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {CollectionControls} from "../../components";
import {publicQuotes,topics} from "../../data";
import {PageShell} from "../../site-shell";

const collectionContext:Record<string,string>={
  gratitude:"Gratitude is more than forced positivity. These quotations recognise friendship, generosity and the value of receiving help with attention and sincerity.",
  teamwork:"Good teamwork depends on trust, shared effort and responsibility. The selections preserve their original dramatic or philosophical context rather than turning every line into corporate advice.",
  leadership:"Leadership is treated here as character expressed through action. A dedicated work-focused subgroup highlights modest speech, courage, service and collective purpose.",
  positive:"This collection favours grounded hope over empty reassurance: words that acknowledge difficulty while leaving room for friendship, learning and deliberate action.",
  family:"Family can mean ancestry, household, community or chosen kinship. These sourced quotations explore belonging without assuming every reader has the same family experience.",
  change:"Change can be chosen, resisted or imposed. These quotations offer perspective for transitions without pretending that every difficult change is automatically beneficial.",
  "short-motivational":"Short quotations are useful when the source remains visible. Every line here is concise enough for a note or image while retaining its author, work and location.",
};

export function generateStaticParams(){return topics.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const topic=topics.find(item=>item.slug===slug);if(!topic)return{};return{title:`${topic.label} Quotes: Verified Sayings and Sources`,description:`A curated collection of verified ${topic.label.toLowerCase()} quotes with authors and source notes.`,alternates:{canonical:`/topics/${slug}`}}}
export default async function TopicPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const topic=topics.find(item=>item.slug===slug);if(!topic)notFound();const selected=publicQuotes.filter(quote=>quote.topics.includes(slug));const work=selected.filter(quote=>quote.occasions.includes("work"));return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / <a href="/topics">Topics</a> / {topic.label}</div><p className="eyebrow">Verified collection</p><h1>{topic.label} quotes</h1><p>{collectionContext[slug]||topic.note}. Each quotation includes a traceable source and approved rights status.</p><p><small>Reviewed 27 July 2026 · Quotes.org.in editorial desk · {selected.length} verified quotations</small></p></section><section className="content">{slug==="leadership"&&<aside className="collection-callout"><p className="eyebrow">Leadership quotes for work</p><h2>Character that becomes visible in action.</h2><p>{work.length} quotations in this collection are especially relevant to responsibility, teamwork and conduct at work. Use them to frame discussion—not as substitutes for clear goals or fair management.</p></aside>}{selected.length?<CollectionControls quotes={selected}/>:<div className="quote-card"><h2>Collection in editorial review</h2><p>We have not published filler or unverified quotations to make this page look complete. Verified entries will appear after source and rights review.</p></div>}</section></PageShell>}
