import { publicQuotes } from "./data";
import { occasionCollections } from "./editorial-content";

export const MIN_VERIFIED_OCCASION_QUOTES = 5;

export function occasionReadiness(slug: string) {
  const item = occasionCollections.find((collection) => collection.slug === slug);
  const quotes = publicQuotes.filter((quote) => quote.occasions.includes(slug));
  const approved = item?.status === "published";
  const sufficient = quotes.length >= MIN_VERIFIED_OCCASION_QUOTES;
  return {
    item,
    quotes,
    approved,
    sufficient,
    publishable: Boolean(item && approved && sufficient),
    remaining: Math.max(0, MIN_VERIFIED_OCCASION_QUOTES - quotes.length),
  };
}
