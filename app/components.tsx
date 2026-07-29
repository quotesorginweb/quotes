"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Quote } from "./data";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  return (
    <form className={`search-box ${compact ? "compact" : ""}`} action="/search" role="search">
      <label className="sr-only" htmlFor={compact ? "header-search" : "hero-search"}>Search quotations, authors and topics</label>
      <span aria-hidden="true">⌕</span>
      <input id={compact ? "header-search" : "hero-search"} name="q" maxLength={120} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a quote, author or topic…" />
      <button type="submit">Search</button>
    </form>
  );
}

export function QuoteActions({ quote }: { quote: Quote }) {
  const [status, setStatus] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const values: string[] = JSON.parse(localStorage.getItem("quotes-favourites") || "[]");
      queueMicrotask(() => setSaved(values.includes(quote.id)));
    } catch {
      localStorage.removeItem("quotes-favourites");
    }
  }, [quote.id]);
  const copy = async () => {
    await navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}`);
    setStatus("Quote copied");
  };
  const share = async () => {
    const data = { title: `${quote.author} quote`, text: `“${quote.text}” — ${quote.author}`, url: `${location.origin}/quote/${quote.slug}` };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        return;
      }
    } else {
      await navigator.clipboard.writeText(data.url);
      setStatus("Link copied");
    }
  };
  const save = () => {
    const key = "quotes-favourites";
    const values: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    const next = values.includes(quote.id) ? values.filter((id) => id !== quote.id) : [...values, quote.id];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(!saved);
    setStatus(saved ? "Removed from saved quotes" : "Saved on this device");
    window.dispatchEvent(new Event("quotes-saved"));
  };
  return (
    <div className="quote-actions">
      <button onClick={copy}>Copy</button>
      <button onClick={share}>Share</button>
      <button onClick={save} aria-pressed={saved}>{saved ? "Saved" : "Save"}</button>
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
  const [visible, setVisible] = useState(12);
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
      <div className="quote-list">{filtered.slice(0, visible).map((quote) => <QuoteCard key={quote.id} quote={quote} />)}</div>
      {filtered.length > visible && <button className="load-more" onClick={() => setVisible((count) => count + 12)}>Show more quotes</button>}
    </>
  );
}

export function ImageGenerator({ initialQuote = "Choose the thoughts that help you act with purpose." }: { initialQuote?: string }) {
  const [text, setText] = useState(initialQuote);
  const [author, setAuthor] = useState("Your name");
  const [theme, setTheme] = useState("ocean");
  const [align, setAlign] = useState<CanvasTextAlign>("center");
  const [format, setFormat] = useState("square");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sizes: Record<string, [number, number]> = { square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], landscape: [1200, 630] };
    [canvas.width, canvas.height] = sizes[format];
    const palettes: Record<string, [string, string]> = { ocean: ["#0b2a4a", "#ffffff"], sunrise: ["#713c24", "#fff7e3"], paper: ["#f7f3ea", "#16324f"] };
    const [bg, fg] = palettes[theme];
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fg; ctx.textAlign = align; ctx.font = "600 44px Georgia";
    const x = align === "left" ? 80 : align === "right" ? canvas.width - 80 : canvas.width / 2;
    const words = text.slice(0, 220).split(" "); const lines: string[] = []; let line = "";
    for (const word of words) { const test = `${line} ${word}`.trim(); if (ctx.measureText(test).width > 850) { lines.push(line); line = word; } else line = test; }
    lines.push(line);
    const startY = Math.max(150, canvas.height / 2 - Math.min(lines.length, 6) * 34);
    lines.slice(0, 6).forEach((value, i) => ctx.fillText(value, x, startY + i * 62));
    ctx.font = "24px Arial"; ctx.fillText(`— ${author.slice(0, 60)}`, x, startY + Math.min(lines.length, 6) * 68);
    ctx.font = "16px Arial"; ctx.globalAlpha = .78; ctx.textAlign = "center"; ctx.fillText("Created with Quotes.org.in · user-entered text is unverified", canvas.width / 2, canvas.height - 36); ctx.globalAlpha = 1;
  };
  useEffect(draw, [text, author, theme, align, format]);
  const download = () => { draw(); const link = document.createElement("a"); link.download = "quotes-org-in-card.png"; link.href = canvasRef.current!.toDataURL("image/png"); link.click(); };
  return (
    <div className="generator">
      <div className="generator-controls">
        <label>Quotation<textarea maxLength={220} value={text} onChange={(e) => setText(e.target.value)} /></label>
        <label>Attribution<input maxLength={60} value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
        <label>Template<select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="ocean">Ocean</option><option value="sunrise">Sunrise</option><option value="paper">Paper</option></select></label>
        <label>Format<select value={format} onChange={(e) => setFormat(e.target.value)}><option value="square">Square</option><option value="portrait">Portrait</option><option value="story">Story</option><option value="landscape">Landscape</option></select></label>
        <label>Alignment<select value={align} onChange={(e) => setAlign(e.target.value as CanvasTextAlign)}><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></select></label>
        <button className="primary" onClick={download}>Download PNG</button>
        <p className="fine-print">Your text stays in this browser and is not published.</p>
      </div>
      <div className="canvas-wrap"><canvas ref={canvasRef} width="1080" height="1080" aria-label="Quote image preview" /></div>
    </div>
  );
}

export function ReportForm({ quoteId, context = "quote" }: { quoteId?: string; context?: "quote" | "contact" }) {
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
    <label>{context === "contact" ? "Quote ID or page (optional)" : "Quote ID"}<input name="quoteId" defaultValue={quoteId} readOnly={Boolean(quoteId)} required={context === "quote"} /></label>
    <label>Reason<select name="reason" required>{context === "quote" && <><option value="incorrect-author">Incorrect author</option><option value="incorrect-wording">Incorrect wording</option><option value="incorrect-source">Incorrect source</option></>}<option value="rights-concern">Rights concern</option>{context === "contact" && <><option value="licensing-request">Licensing request</option><option value="general-enquiry">General enquiry</option></>}</select></label>
    <label>{context === "contact" ? "Message" : "Suggested correction"}<textarea name="suggestedCorrection" maxLength={2000} required={context === "contact"} /></label>
    <label>Source evidence<input name="sourceEvidence" type="url" maxLength={1000} placeholder="https://…" /></label>
    <label>Email (optional)<input name="reporterEmail" type="email" maxLength={254} /></label>
    <label className="website-field" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button className="primary" disabled={busy}>{busy ? "Submitting…" : "Submit report"}</button>
    <p className="fine-print">We use these details only to review and respond to your message. See our <a className="text-link" href="/privacy">privacy notice</a>.</p>
    <p role="status" aria-live="polite">{status}</p>
  </form>;
}

export function SavedQuotes({ quotes }: { quotes: Quote[] }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  useEffect(() => {
    const read = () => {
      try {
        setSavedIds(JSON.parse(localStorage.getItem("quotes-favourites") || "[]"));
      } catch {
        localStorage.removeItem("quotes-favourites");
        setSavedIds([]);
      }
    };
    read();
    window.addEventListener("quotes-saved", read);
    return () => window.removeEventListener("quotes-saved", read);
  }, []);
  const saved = quotes.filter((quote) => savedIds.includes(quote.id));
  return saved.length
    ? <div className="quote-list">{saved.map((quote) => <QuoteCard quote={quote} key={quote.id} />)}</div>
    : <div className="quote-card"><h2>No saved quotes yet</h2><p>Use the Save button on any quotation. Your selections remain only in this browser.</p><a className="text-link" href="/topics">Browse topics →</a></div>;
}
