import type { MetadataRoute } from "next";
import { authorReadiness } from "./author-readiness";
import { authors, latestReviewDate, moods, topics } from "./data";
import { occasionCollections } from "./editorial-content";
import { occasionReadiness } from "./occasion-readiness";
import { sourceWorks } from "./source-works";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://quotes.org.in";
  const approvedOccasions = occasionCollections
    .filter((item) => occasionReadiness(item.slug).publishable)
    .map((item) => `/occasions/${item.slug}`);
  const indexableAuthors = authors
    .filter((author) => authorReadiness(author.slug).indexable)
    .map((author) => `/authors/${author.slug}`);
  const staticPages = [
    "", "/about", "/topics", "/authors", "/moods", "/occasions",
    "/indian-quotes", "/hindi-quotes", "/love-quotes", "/quote-of-the-day", "/sources",
    "/tools/quote-image-generator", "/editorial-policy", "/verification",
    "/corrections", "/copyright", "/privacy", "/terms", "/contact",
  ];
  const urls = [
    ...staticPages,
    ...topics.map((item) => `/topics/${item.slug}`),
    ...indexableAuthors,
    ...moods.map((item) => `/moods/${item.slug}`),
    ...approvedOccasions,
    ...sourceWorks.map((work) => `/sources/${work.slug}`),
  ];
  return urls.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(latestReviewDate),
    changeFrequency: path === "/quote-of-the-day" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
