import type { Metadata } from "next";
import { QuoteCard } from "../components";
import { quoteForDate, recentDatesUtc, todayUtc } from "../data";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Quote of the Day", description: "A stable, source-verified quotation for each UTC calendar date.", alternates: { canonical: "/quote-of-the-day" } };

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" });
}

export default async function Daily() {
  const date = todayUtc();
  const quote = quoteForDate(date);
  const archive = recentDatesUtc(14);
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Quote of the day</div><p className="eyebrow">Daily archive · UTC</p><h1>Quote of the day</h1><p>One editorially approved quotation per UTC calendar date. Each dated page remains stable as the library grows.</p></section><section className="content"><h2>{formatDate(date)}</h2><QuoteCard quote={quote} featured /><section className="daily-archive"><p className="eyebrow">Recent days</p><h2>Browse the archive</h2><div className="archive-links">{archive.map((item) => <a href={`/quote-of-the-day/${item}`} key={item}>{formatDate(item)}</a>)}</div></section></section></PageShell>;
}
