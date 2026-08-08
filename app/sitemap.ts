import type { MetadataRoute } from "next";
import { authorReadiness } from "./author-readiness";
import { authors, latestReviewDate, moods, recentDatesUtc, topics } from "./data";
import { occasionCollections } from "./editorial-content";
import { occasionReadiness } from "./occasion-readiness";

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
    "/indian-quotes", "/hindi-quotes", "/quote-of-the-day",
    "/tools/quote-image-generator", "/editorial-policy", "/verification",
    "/copyright", "/privacy", "/terms", "/contact",
  ];
  const dated = recentDatesUtc(30).map((date) => `/quote-of-the-day/${date}`);
  const urls = [
    ...staticPages,
    ...topics.map((item) => `/topics/${item.slug}`),
    ...indexableAuthors,
    ...moods.map((item) => `/moods/${item.slug}`),
    ...approvedOccasions,
    ...dated,
  ];
  return urls.map((path) => ({
    url: `${base}${path}`,
    lastModified: path.startsWith("/quote-of-the-day/")
      ? new Date(path.split("/").at(-1)!)
      : new Date(latestReviewDate),
    changeFrequency: path === "/quote-of-the-day" ? "daily" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/quote-of-the-day/") ? 0.6 : 0.7,
  }));
}
