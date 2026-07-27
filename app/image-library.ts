import { publicQuotes, topics } from "./data";

export const collectionImageFormats = [
  { slug: "square", label: "Square", width: 1080, height: 1080 },
  { slug: "portrait", label: "Portrait", width: 1080, height: 1350 },
  { slug: "landscape", label: "Landscape", width: 1200, height: 630 },
  { slug: "pinterest", label: "Pinterest", width: 1000, height: 1500 },
  { slug: "open-graph", label: "Open Graph", width: 1200, height: 630 },
] as const;

export function collectionImages(topicSlug: string) {
  const topic = topics.find((item) => item.slug === topicSlug);
  const quote = publicQuotes.find((item) => item.topics.includes(topicSlug));
  if (!topic || !quote) return [];
  return collectionImageFormats.map((format) => ({
    ...format,
    src: `/images/quote-collections/${topic.slug}-quotes-${quote.authorSlug}-${format.slug}.webp`,
    alt: `${topic.label} quote by ${quote.author}: “${quote.text}”`,
    license: "Original artwork © 2026 Quotes.org.in; quotation text public domain",
  }));
}
