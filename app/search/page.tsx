import type { Metadata } from "next";
import { QuoteCard } from "../components";
import { topics, authors } from "../data";
import { getPublishedQuotes } from "../../db/public";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Search quotations", robots: { index: false, follow: true } };
const normalize = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[“”‘’"']/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const needle = normalize(q);
  const publicQuotes = await getPublishedQuotes();
  const results = needle ? publicQuotes.filter((quote) => normalize(`${quote.text} ${quote.author} ${quote.topics.join(" ")}`).includes(needle)) : [];
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Search</div><p className="eyebrow">Search the collection</p><h1>{q ? `Results for “${q}”` : "Search quotations"}</h1><form className="search-box" action="/search"><label className="sr-only" htmlFor="search-page">Search</label><input id="search-page" name="q" defaultValue={q} /><button>Search</button></form></section><section className="content"><p className="results-note">{results.length} results</p>{results.length ? <div className="quote-list">{results.map((quote) => <QuoteCard quote={quote} key={quote.id} />)}</div> : <div className="quote-card"><h2>{q ? "No verified matches yet" : "Try a quotation, author or topic"}</h2><p>Browse <a className="text-link" href="/topics">{topics.length} topic collections</a> or <a className="text-link" href="/authors">{authors.length} verified author records</a>.</p></div>}</section></PageShell>;
}
