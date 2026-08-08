import type { Metadata } from "next";
import { latestReviewDate } from "../data";
import { PageShell } from "../site-shell";

export const metadata: Metadata = { title: "Public Corrections Log", description: "A public record of material wording, attribution and source corrections made by Quotes.org.in.", alternates: { canonical: "/corrections" } };

const corrections: { date: string; quote: string; change: string; evidence: string }[] = [];

export default function CorrectionsPage() {
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Corrections log</div><p className="eyebrow">Transparent editorial record</p><h1>Public corrections log</h1><p>Material changes to published wording, attribution, source or rights status are recorded here. Minor typography and layout changes are not logged.</p></section><section className="content"><aside className="collection-callout"><p className="eyebrow">Current status</p><h2>{corrections.length ? `${corrections.length} recorded corrections` : "No material corrections recorded"}</h2><p>The published library was last substantively reviewed on {new Date(`${latestReviewDate}T00:00:00Z`).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" })}. If evidence shows that a record is wrong, publication is paused while the wording and source are rechecked.</p></aside>{corrections.length ? <div className="audit-list">{corrections.map((item) => <article key={`${item.date}-${item.quote}`}><h2>{item.quote}</h2><p><strong>{item.date}</strong><span>{item.change}</span><a className="text-link" href={item.evidence}>Evidence →</a></p></article>)}</div> : <div className="quote-card"><h2>How future entries will appear</h2><p>Each entry will identify the affected quotation, the date, what changed and the evidence used. Removed records will remain described here even when their public quote page is no longer available.</p></div>}<p>Found an issue? <a className="text-link" href="/report">Submit a correction with source evidence →</a></p></section></PageShell>;
}
