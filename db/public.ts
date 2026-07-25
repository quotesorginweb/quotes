import { and, eq } from "drizzle-orm";
import { getDb } from ".";
import { authors, quotes as quoteTable, sourceWorks } from "./schema";
import { publicQuotes as seeds, type Quote } from "../app/data";

export async function getPublishedQuotes(): Promise<Quote[]> {
  try {
    const rows = await getDb().select({
      id: quoteTable.id, slug: quoteTable.slug, text: quoteTable.exactText, normalizedText: quoteTable.normalizedText,
      author: authors.fullName, authorSlug: authors.slug, source: sourceWorks.title, sourceUrl: quoteTable.primarySourceUrl,
      verification: quoteTable.verificationStatus, rights: quoteTable.publicDomainStatus, reviewedAt: quoteTable.reviewedAt,
    }).from(quoteTable).leftJoin(authors, eq(quoteTable.authorId, authors.id)).leftJoin(sourceWorks, eq(quoteTable.sourceWorkId, sourceWorks.id))
      .where(and(eq(quoteTable.publicationStatus, "published"), eq(quoteTable.rightsReviewStatus, "approved")));
    const mapped: Quote[] = rows.map((row) => ({
      id: row.id, slug: row.slug, text: row.text, normalizedText: row.normalizedText, author: row.author || "Unknown",
      authorSlug: row.authorSlug || "unknown", source: row.source || "Source record", sourceUrl: row.sourceUrl || "",
      verification: row.verification as Quote["verification"], topics: [], moods: [], occasions: [], published: true,
      rights: row.rights === "public-domain" ? "public-domain" : "review-required", reviewedAt: row.reviewedAt || new Date().toISOString().slice(0, 10),
    }));
    return [...mapped, ...seeds.filter((seed) => !mapped.some((row) => row.normalizedText === seed.normalizedText))];
  } catch {
    return seeds;
  }
}

export async function findPublishedQuote(slug: string) {
  return (await getPublishedQuotes()).find((quote) => quote.slug === slug);
}
