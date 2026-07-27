import { collectionImages } from "../image-library";
import { topics } from "../data";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function GET() {
  const base = "https://quotes.org.in";
  const urls = topics.map((topic) => {
    const images = collectionImages(topic.slug)
      .map((image) => `<image:image><image:loc>${base}${image.src}</image:loc><image:caption>${escapeXml(image.alt)}</image:caption><image:title>${escapeXml(`${topic.label} quotes — ${image.label}`)}</image:title><image:license>${base}/copyright</image:license></image:image>`)
      .join("");
    return `<url><loc>${base}/topics/${topic.slug}</loc>${images}</url>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
