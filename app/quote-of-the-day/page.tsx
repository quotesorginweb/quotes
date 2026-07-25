import type { Metadata } from "next";
import { QuoteCard } from "../components";
import { quoteForDate, todayUtc } from "../data";
import { getPublishedQuotes } from "../../db/public";
import { PageShell } from "../site-shell";
export const metadata: Metadata = { title: "Quote of the Day — Verified Daily Quotation", description: "A stable, source-verified quotation selected for each UTC calendar date.", alternates: { canonical: "/quote-of-the-day" } };
export default async function Daily() {
  const date = todayUtc(), available = await getPublishedQuotes();
  const quote = available.length ? available[Math.abs(Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000)) % available.length] : quoteForDate(date);
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Quote of the day</div><p className="eyebrow">Daily archive · UTC</p><h1>Quote of the day</h1><p>One editorially approved quotation per UTC calendar date. It remains stable when the page is reloaded.</p></section><section className="content"><h2>{new Date(`${date}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" })}</h2><QuoteCard quote={quote} featured /><p className="results-note">Future dates are never included in the sitemap.</p></section></PageShell>;
}
