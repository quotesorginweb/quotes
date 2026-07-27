"use client";

import { useMemo, useRef, useState } from "react";
import type { Quote } from "./data";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  return (
    <form className={`search-box ${compact ? "compact" : ""}`} action="/search" role="search">
      <label className="sr-only" htmlFor={compact ? "header-search" : "hero-search"}>Search quotations, authors and topics</label>
      <span aria-hidden="true">⌕</span>
      <input id={compact ? "header-search" : "hero-search"} name="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a quote, author or topic…" />
      <button type="submit">Search</button>
    </form>
  );
}

export function QuoteActions({ quote }: { quote: Quote }) {
  const [status, setStatus] = useState("");
  const copy = async () => {
    await navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}`);
    setStatus("Quote copied");
  };
  const share = async () => {
    const data = { title: `${quote.author} quote`, text: `“${quote.text}” — ${quote.author}`, url: `${location.origin}/quote/${quote.slug}` };
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(data.url);
      setStatus("Link copied");
    }
  };
  const save = () => {
    const key = "quotes-favourites";
    const values: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([...new Set([...values, quote.id])]));
    setStatus("Saved to favourites on this device");
  };
  return (
    <div className="quote-actions">
      <button onClick={copy}>Copy</button>
      <button onClick={share}>Share</button>
      <button onClick={save}>Save</button>
      <a href={`/report?quote=${quote.id}`}>Report</a>
      <span className="sr-only" role="status" aria-live="polite">{status}</span>
    </div>
  );
}

export function QuoteCard({ quote, featured = false }: { quote: Quote; featured?: boolean }) {
  return (
    <article className={`quote-card ${featured ? "featured" : ""}`}>
      <span className="verified">✓ Source verified</span>
      <blockquote lang={quote.languageCode || "en"}>“{quote.text}”</blockquote>
      {quote.translation && <p className="quote-translation"><strong>English meaning:</strong> {quote.translation}</p>}
      <p className="attribution"><a href={`/authors/${quote.authorSlug}`}>{quote.author}</a></p>
      <p className="source"><cite>{quote.source}</cite> · <a href={quote.sourceUrl} rel="noreferrer">View source</a></p>
      <QuoteActions quote={quote} />
    </article>
  );
}

export function CollectionControls({ quotes }: { quotes: Quote[] }) {
  const [query, setQuery] = useState("");
  const [length, setLength] = useState("all");
  const filtered = useMemo(() => quotes.filter((q) => {
    const matches = `${q.text} ${q.author}`.toLowerCase().includes(query.toLowerCase());
    const words = q.text.split(/\s+/).length;
    return matches && (length === "all" || (length === "short" ? words <= 12 : words > 12));
  }), [quotes, query, length]);
  return (
    <>
      <div className="filters" aria-label="Filter quotes">
        <label>Filter <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Words or author" /></label>
        <label>Length <select value={length} onChange={(e) => setLength(e.target.value)}><option value="all">All lengths</option><option value="short">Short</option><option value="long">Longer</option></select></label>
      </div>
      <p className="results-note" aria-live="polite">{filtered.length} verified {filtered.length === 1 ? "quote" : "quotes"}</p>
      <div className="quote-list">{filtered.map((quote) => <QuoteCard key={quote.id} quote={quote} />)}</div>
    </>
  );
}

export function ImageGenerator({ initialQuote = "Choose the thoughts that help you act with purpose." }: { initialQuote?: string }) {
  const [text, setText] = useState(initialQuote);
  const [author, setAuthor] = useState("Your name");
  const [theme, setTheme] = useState("ocean");
  const [align, setAlign] = useState<CanvasTextAlign>("center");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const palettes: Record<string, [string, string]> = { ocean: ["#0b2a4a", "#087e8b"], sunrise: ["#713c24", "#e09f3e"], paper: ["#f7f3ea", "#16324f"] };
    const [bg, fg] = palettes[theme];
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fg; ctx.textAlign = align; ctx.font = "600 44px Georgia";
    const x = align === "left" ? 80 : align === "right" ? 1000 : 540;
    const words = text.slice(0, 220).split(" "); const lines: string[] = []; let line = "";
    for (const word of words) { const test = `${line} ${word}`.trim(); if (ctx.measureText(test).width > 850) { lines.push(line); line = word; } else line = test; }
    lines.push(line);
    lines.slice(0, 6).forEach((value, i) => ctx.fillText(value, x, 330 + i * 62));
    ctx.font = "24px Arial"; ctx.fillText(`— ${author.slice(0, 60)}`, x, 330 + Math.min(lines.length, 6) * 68);
    ctx.font = "16px Arial"; ctx.globalAlpha = .75; ctx.fillText("Created with Quotes.org.in · user-entered text is unverified", 540, 1040); ctx.globalAlpha = 1;
  };
  const download = () => { draw(); const link = document.createElement("a"); link.download = "quotes-org-in-card.png"; link.href = canvasRef.current!.toDataURL("image/png"); link.click(); };
  return (
    <div className="generator">
      <div className="generator-controls">
        <label>Quotation<textarea maxLength={220} value={text} onChange={(e) => setText(e.target.value)} /></label>
        <label>Attribution<input maxLength={60} value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
        <label>Template<select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="ocean">Ocean</option><option value="sunrise">Sunrise</option><option value="paper">Paper</option></select></label>
        <label>Alignment<select value={align} onChange={(e) => setAlign(e.target.value as CanvasTextAlign)}><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></select></label>
        <button className="primary" onClick={draw}>Update preview</button>
        <button onClick={download}>Download PNG</button>
        <p className="fine-print">Your text stays in this browser and is not published.</p>
      </div>
      <div className="canvas-wrap"><canvas ref={canvasRef} width="1080" height="1080" aria-label="Quote image preview" /><button onClick={draw}>Render preview</button></div>
    </div>
  );
}

export function ReportForm({ quoteId }: { quoteId: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setStatus("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/reports", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json() as { error?: string; id?: string };
    setBusy(false);
    setStatus(response.ok ? `Report received. Reference ${result.id}.` : result.error ?? "Unable to submit report.");
    if (response.ok) event.currentTarget.reset();
  };
  return <form className="generator-controls" onSubmit={submit}>
    <label>Quote ID<input name="quoteId" defaultValue={quoteId} readOnly required /></label>
    <label>Reason<select name="reason" required><option value="incorrect-author">Incorrect author</option><option value="incorrect-wording">Incorrect wording</option><option value="incorrect-source">Incorrect source</option><option value="rights-concern">Rights concern</option></select></label>
    <label>Suggested correction<textarea name="suggestedCorrection" maxLength={2000} /></label>
    <label>Source evidence<input name="sourceEvidence" type="url" maxLength={1000} placeholder="https://…" /></label>
    <label>Email (optional)<input name="reporterEmail" type="email" maxLength={254} /></label>
    <button className="primary" disabled={busy}>{busy ? "Submitting…" : "Submit report"}</button>
    <p role="status" aria-live="polite">{status}</p>
  </form>;
}
