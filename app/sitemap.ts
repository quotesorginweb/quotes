import type { MetadataRoute } from "next";
import { authorReadiness } from "./author-readiness";
import { authors, latestReviewDate, moods, publicQuotes, topics } from "./data";
import { occasionCollections } from "./editorial-content";
import { occasionReadiness } from "./occasion-readiness";
import { quotesForSourceWork, sourceWorks } from "./source-works";

function latestFor(quotes: typeof publicQuotes) {
  const date = quotes.reduce((latest, quote) => quote.reviewedAt > latest ? quote.reviewedAt : latest, "2026-07-01");
  return new Date(`${date}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://quotes.org.in";
  const approvedOccasions = occasionCollections
    .filter((item) => occasionReadiness(item.slug).publishable)
    .map((item) => ({ path: `/occasions/${item.slug}`, lastModified: latestFor(occasionReadiness(item.slug).quotes) }));
  const indexableAuthors = authors
    .filter((author) => authorReadiness(author.slug).indexable)
    .map((author) => ({ path: `/authors/${author.slug}`, lastModified: latestFor(publicQuotes.filter((quote) => quote.authorSlug === author.slug)) }));
  const staticPages = [
    "", "/about", "/topics", "/authors", "/moods", "/occasions",
    "/indian-quotes", "/hindi-quotes", "/love-quotes", "/quote-of-the-day", "/sources",
    "/tools/quote-image-generator", "/editorial-policy", "/verification",
    "/corrections", "/copyright", "/privacy", "/terms", "/contact",
  ];
  const staticDates: Record<string, Date> = {
    "/about": new Date("2026-08-09T00:00:00Z"),
    "/tools/quote-image-generator": new Date("2026-08-09T00:00:00Z"),
    "/editorial-policy": new Date("2026-08-09T00:00:00Z"),
    "/verification": new Date("2026-08-09T00:00:00Z"),
    "/corrections": new Date("2026-08-09T00:00:00Z"),
    "/copyright": new Date("2026-08-08T00:00:00Z"),
    "/privacy": new Date("2026-08-09T00:00:00Z"),
    "/terms": new Date("2026-08-09T00:00:00Z"),
    "/contact": new Date("2026-08-09T00:00:00Z"),
  };
  const urls = [
    ...staticPages.map((path) => ({ path, lastModified: staticDates[path] || new Date(`${latestReviewDate}T00:00:00Z`) })),
    ...topics.map((item) => ({ path: `/topics/${item.slug}`, lastModified: latestFor(publicQuotes.filter((quote) => quote.topics.includes(item.slug))) })),
    ...indexableAuthors,
    ...moods.map((item) => ({ path: `/moods/${item.slug}`, lastModified: latestFor(publicQuotes.filter((quote) => quote.moods.includes(item.slug))) })),
    ...approvedOccasions,
    ...sourceWorks.map((work) => ({ path: `/sources/${work.slug}`, lastModified: latestFor(quotesForSourceWork(work)) })),
  ];
  return urls.map(({ path, lastModified }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/quote-of-the-day" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
