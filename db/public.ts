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
    return seeds.map((seed) => {
      const row = rows.find((candidate) => candidate.normalizedText === seed.normalizedText);
      if (!row) return seed;
      return {
        ...seed,
        id: row.id,
        slug: row.slug,
        text: row.text,
        author: row.author || seed.author,
        authorSlug: row.authorSlug || seed.authorSlug,
        source: row.source || seed.source,
        sourceUrl: row.sourceUrl || seed.sourceUrl,
        verification: row.verification as Quote["verification"],
        rights: row.rights === "public-domain" ? "public-domain" : seed.rights,
        reviewedAt: row.reviewedAt || seed.reviewedAt,
      };
    });
  } catch {
    return seeds;
  }
}

export async function findPublishedQuote(slug: string) {
  return (await getPublishedQuotes()).find((quote) => quote.slug === slug);
}
