import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCard } from "../../components";
import { quoteForDate, recentDatesUtc, todayUtc } from "../../data";
import { PageShell } from "../../site-shell";
import { breadcrumbData, StructuredData } from "../../structured-data";

const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && value <= todayUtc();
const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" });

export function generateStaticParams() { return recentDatesUtc(30).map((date) => ({ date })); }

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  return validDate(date) ? { title: `Quote of the Day for ${formatDate(date)}`, description: `The verified daily quotation for ${formatDate(date)}, with source and attribution.`, robots: { index: false, follow: true }, alternates: { canonical: "/quote-of-the-day" } } : {};
}

export default async function DailyDate({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!validDate(date)) notFound();
  const quote = quoteForDate(date);
  const previous = new Date(Date.parse(`${date}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
  const next = new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
  return <PageShell><StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Quote of the day", path: "/quote-of-the-day" }, { name: date, path: `/quote-of-the-day/${date}` }])} /><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / <a href="/quote-of-the-day">Daily archive</a> / {formatDate(date)}</div><p className="eyebrow">Daily quotation · UTC</p><h1>Quote of the day for {formatDate(date)}</h1></section><section className="content"><QuoteCard quote={quote} featured /><nav className="date-nav" aria-label="Daily quote dates"><a href={`/quote-of-the-day/${previous}`}>← Previous day</a>{next <= todayUtc() && <a href={`/quote-of-the-day/${next}`}>Next day →</a>}</nav></section></PageShell>;
}
