import type { Metadata } from "next";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import { quotes } from "../data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editorial dashboard", robots: { index: false, follow: false } };

const queues = [
  { label: "Awaiting source review", value: quotes.filter((q) => q.verification === "unverified").length, tone: "amber" },
  { label: "Rights review", value: quotes.filter((q) => q.rights === "review-required").length, tone: "coral" },
  { label: "Published records", value: quotes.filter((q) => q.published).length, tone: "teal" },
  { label: "Open reports", value: 0, tone: "blue" },
];

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  return (
    <main id="main" className="admin-shell">
      <aside className="admin-nav">
        <a className="brand inverse" href="/"><span>Q</span> Quotes<small>.org.in</small></a>
        <p>Editorial workspace</p>
        <nav aria-label="Editorial navigation"><a className="active" href="/admin">Overview</a><a href="#quotes">Quotations</a><a href="#review">Review queue</a><a href="#rights">Rights</a><a href="#reports">Reports</a><a href="#keywords">Keyword imports</a><a href="#audit">Audit log</a></nav>
        <div className="admin-user"><strong>{user.displayName}</strong><span>Authenticated editor</span><a href={chatGPTSignOutPath("/")}>Sign out</a></div>
      </aside>
      <section className="admin-main">
        <header><div><p className="eyebrow">Editorial operations</p><h1>Good work starts with evidence.</h1><p>Review sources, rights and safety before anything reaches the public site.</p></div><a className="button" href="#new-quote">New quotation</a></header>
        <div className="queue-grid">{queues.map((item) => <article key={item.label} className={item.tone}><span>{item.label}</span><strong>{item.value}</strong><a href="#review">Open queue →</a></article>)}</div>
        <section className="admin-panel" id="quotes"><div className="panel-head"><div><p className="eyebrow">Recent records</p><h2>Quotation review</h2></div><p>Bulk publishing is intentionally unavailable.</p></div><div className="admin-table" role="table" aria-label="Quotation review queue"><div className="table-row table-head" role="row"><span>Quotation</span><span>Attribution</span><span>Verification</span><span>Rights</span><span>Status</span></div>{quotes.map((quote) => <div className="table-row" role="row" key={quote.id}><span>“{quote.text.slice(0, 58)}{quote.text.length > 58 ? "…" : ""}”<small>{quote.id}</small></span><span>{quote.author}<small>{quote.source}</small></span><span><b className={`status ${quote.verification.startsWith("verified") ? "ok" : "warn"}`}>{quote.verification.replaceAll("-", " ")}</b></span><span>{quote.rights.replaceAll("-", " ")}</span><span><b className={`status ${quote.published ? "ok" : "draft"}`}>{quote.published ? "Published" : "Draft"}</b></span></div>)}</div></section>
        <section className="admin-panel split" id="new-quote"><div><p className="eyebrow">Guarded workflow</p><h2>Publication checks</h2><ul className="check-list"><li>Exact wording recorded</li><li>Primary or reliable secondary source attached</li><li>Attribution confidence reviewed</li><li>Rights and safety status approved</li><li>Duplicate detection completed</li><li>Reviewer differs from preparer</li></ul></div><div className="admin-note"><strong>Why no quick-publish button?</strong><p>Drafts require evidence, rights review and a second-person approval. Bulk actions cannot bypass these checks.</p><a href="/editorial-policy">Read the editorial policy →</a></div></section>
      </section>
    </main>
  );
}
