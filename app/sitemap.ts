import type { MetadataRoute } from "next";
import { authors, moods, publicQuotes, recentDatesUtc, topics } from "./data";
import { occasionCollections } from "./editorial-content";
import { occasionReadiness } from "./occasion-readiness";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://quotes.org.in";
  const approvedOccasions = occasionCollections.filter((item) => occasionReadiness(item.slug).publishable).map((item) => `/occasions/${item.slug}`);
  const staticPages = ["", "/about", "/topics", "/authors", "/moods", "/occasions", "/quote-of-the-day", "/tools/quote-image-generator", "/editorial-policy", "/verification", "/copyright", "/privacy", "/terms", "/contact"];
  const dated = recentDatesUtc(30).map((date) => `/quote-of-the-day/${date}`);
  const urls = [...staticPages, ...topics.map((item) => `/topics/${item.slug}`), ...authors.map((item) => `/authors/${item.slug}`), ...moods.map((item) => `/moods/${item.slug}`), ...approvedOccasions, ...publicQuotes.map((quote) => `/quote/${quote.slug}`), ...dated];
  return urls.map((path) => ({
    url: `${base}${path}`,
    lastModified: path.startsWith("/quote/") ? new Date(publicQuotes.find((quote) => path === `/quote/${quote.slug}`)?.reviewedAt ?? "2026-07-29") : new Date("2026-07-29"),
    changeFrequency: path === "/quote-of-the-day" ? "daily" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/quote/") ? 0.6 : 0.7,
  }));
}
