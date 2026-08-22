const BASE_URL = "https://quotes.org.in";

export function GET() {
  const generatedAt = new Date().toISOString();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `<sitemap><loc>${BASE_URL}/sitemap.xml</loc><lastmod>${generatedAt}</lastmod></sitemap>`,
    `<sitemap><loc>${BASE_URL}/image-sitemap.xml</loc><lastmod>${generatedAt}</lastmod></sitemap>`,
    '</sitemapindex>',
  ].join("\n");

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
