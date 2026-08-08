import type { Metadata } from "next";
import { QuoteCard } from "../components";
import { authors, publicQuotes, topics } from "../data";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Search quotations", robots: { index: false, follow: true } };

const normalize = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[“”‘’"']/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const rawQuery = (await searchParams).q ?? "";
  const q = rawQuery.slice(0, 120);
  const needle = normalize(q);
  const results = needle ? publicQuotes.filter((quote) => normalize([
    quote.text,
    quote.translation ?? "",
    quote.author,
    quote.source,
    quote.topics.join(" "),
    quote.moods.join(" "),
    quote.occasions.join(" "),
    quote.languageCode === "hi" ? "Hindi India" : "English",
  ].join(" ")).includes(needle)).slice(0, 50) : [];

  return <PageShell>
    <section className="page-hero">
      <div className="breadcrumbs"><a href="/">Home</a> / Search</div>
      <p className="eyebrow">Search the collection</p>
      <h1>{q ? `Results for “${q}”` : "Search quotations"}</h1>
      <p>Search quotation text, translations, authors, source works, topics, moods and occasions.</p>
      <form className="search-box" action="/search">
        <label className="sr-only" htmlFor="search-page">Search</label>
        <input id="search-page" name="q" defaultValue={q} maxLength={120} />
        <button>Search</button>
      </form>
    </section>
    <section className="content">
      <p className="results-note">{results.length} results</p>
      {results.length
        ? <div className="quote-list">{results.map((quote) => <QuoteCard quote={quote} key={quote.id} />)}</div>
        : <div className="quote-card"><h2>{q ? "No verified matches yet" : "Try a quotation, author, source, mood or topic"}</h2><p>Browse <a className="text-link" href="/topics">{topics.length} topic collections</a>, <a className="text-link" href="/authors">{authors.length} verified author records</a>, <a className="text-link" href="/indian-quotes">Indian voices</a> or <a className="text-link" href="/hindi-quotes">Hindi quotations</a>.</p></div>}
    </section>
  </PageShell>;
}
