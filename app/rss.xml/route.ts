import { publicQuotes } from "../data";

const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function GET() {
  const items = [...publicQuotes].sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt)).slice(0, 30).map((quote) => {
    const url = `https://quotes.org.in/quote/${quote.slug}`;
    return `<item><title>${escapeXml(`${quote.author}: ${quote.text.slice(0, 72)}`)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${quote.reviewedAt}T12:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(`${quote.text} — ${quote.author}. Source: ${quote.source}.`)}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Quotes.org.in — verified quotations</title><link>https://quotes.org.in</link><description>Recently reviewed public-domain quotations with visible sources.</description><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
