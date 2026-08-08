import { authors, publicQuotes } from "./data";

export const MIN_INDEXABLE_AUTHOR_QUOTES = 3;

export function authorReadiness(slug: string) {
  const author = authors.find((item) => item.slug === slug);
  const quotes = publicQuotes.filter((quote) => quote.authorSlug === slug);
  return {
    author,
    quotes,
    indexable: Boolean(author && quotes.length >= MIN_INDEXABLE_AUTHOR_QUOTES),
    remaining: Math.max(0, MIN_INDEXABLE_AUTHOR_QUOTES - quotes.length),
  };
}
