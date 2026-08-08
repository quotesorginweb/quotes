import type { Metadata } from "next";
import { sourceWorks, quotesForSourceWork } from "../source-works";
import { PageShell } from "../site-shell";
import { breadcrumbData, StructuredData } from "../structured-data";

export const metadata: Metadata = { title: "Source Works Behind the Quotes", description: "Browse verified quotations by original book, speech, play or public-domain edition.", alternates: { canonical: "/sources" } };

export default function SourcesPage() {
  return <PageShell>
    <StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Source works", path: "/sources" }])} />
    <section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Source works</div><p className="eyebrow">Books, speeches and editions</p><h1>Browse quotations by source work</h1><p>Every collection keeps the original work, edition and creator visible. Open a source record to read its verified selections together.</p></section>
    <section className="content"><div className="card-grid">{sourceWorks.map((work) => { const count = quotesForSourceWork(work).length; return <a className="index-card" href={`/sources/${work.slug}`} key={work.slug}><p className="eyebrow">{count} verified {count === 1 ? "quotation" : "quotations"}</p><h2>{work.title}</h2><p>{work.creator}</p><p>{work.description}</p><b>Open source record →</b></a>; })}</div></section>
  </PageShell>;
}
