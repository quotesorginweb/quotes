export type VerificationStatus =
  | "verified-primary-source"
  | "verified-reliable-secondary-source"
  | "commonly-attributed"
  | "misattributed"
  | "unverified"
  | "rejected";

export type Quote = {
  id: string;
  slug: string;
  text: string;
  normalizedText: string;
  author: string;
  authorSlug: string;
  source: string;
  sourceUrl: string;
  verification: VerificationStatus;
  topics: string[];
  moods: string[];
  occasions: string[];
  published: boolean;
  rights: "public-domain" | "review-required";
  reviewedAt: string;
};

export const quotes: Quote[] = [
  {
    id: "q-marcus-001",
    slug: "you-have-power-over-your-mind",
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    normalizedText: "you have power over your mind not outside events realize this and you will find strength",
    author: "Marcus Aurelius",
    authorSlug: "marcus-aurelius",
    source: "Meditations, Book 12",
    sourceUrl: "https://en.wikisource.org/wiki/The_Meditations_of_the_Emperor_Marcus_Antoninus/Book_12",
    verification: "verified-primary-source",
    topics: ["motivational", "life", "strength"],
    moods: ["positive", "reflective"],
    occasions: ["work"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-20",
  },
  {
    id: "q-shakespeare-001",
    slug: "to-thine-own-self-be-true",
    text: "This above all: to thine own self be true.",
    normalizedText: "this above all to thine own self be true",
    author: "William Shakespeare",
    authorSlug: "william-shakespeare",
    source: "Hamlet, Act 1, Scene 3",
    sourceUrl: "https://www.folger.edu/explore/shakespeares-works/hamlet/read/1/3/",
    verification: "verified-primary-source",
    topics: ["life", "self-love"],
    moods: ["reflective"],
    occasions: ["graduation"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-19",
  },
  {
    id: "q-confucius-001",
    slug: "is-it-not-a-pleasure",
    text: "Is it not a pleasure, having learned something, to try it out at due intervals?",
    normalizedText: "is it not a pleasure having learned something to try it out at due intervals",
    author: "Confucius",
    authorSlug: "confucius",
    source: "Analects, Book 1",
    sourceUrl: "https://ctext.org/analects/xue-er",
    verification: "verified-reliable-secondary-source",
    topics: ["inspirational", "life"],
    moods: ["positive"],
    occasions: ["graduation", "work"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-18",
  },
  {
    id: "q-aurelius-draft",
    slug: "demonstration-unpublished-draft",
    text: "Demonstration draft retained only to test publication controls.",
    normalizedText: "demonstration draft retained only to test publication controls",
    author: "Unknown",
    authorSlug: "unknown",
    source: "No source",
    sourceUrl: "",
    verification: "unverified",
    topics: ["sensitive"],
    moods: ["sad"],
    occasions: [],
    published: false,
    rights: "review-required",
    reviewedAt: "2026-07-18",
  },
];

export const publicQuotes = quotes.filter(
  (quote) =>
    quote.published &&
    ["verified-primary-source", "verified-reliable-secondary-source"].includes(quote.verification),
);

export const topics = [
  { slug: "motivational", label: "Motivational", note: "Resolve, discipline and purposeful action", color: "gold" },
  { slug: "inspirational", label: "Inspirational", note: "Ideas that widen what feels possible", color: "blue" },
  { slug: "life", label: "Life", note: "Wisdom for choices, change and perspective", color: "teal" },
  { slug: "strength", label: "Strength", note: "Steadiness in difficult moments", color: "coral" },
  { slug: "self-love", label: "Self-love", note: "Self-respect, honesty and care", color: "violet" },
];

export const authors = [
  { slug: "marcus-aurelius", name: "Marcus Aurelius", years: "121–180 CE", description: "Roman emperor and Stoic philosopher." },
  { slug: "william-shakespeare", name: "William Shakespeare", years: "1564–1616", description: "English playwright, poet and actor." },
  { slug: "confucius", name: "Confucius", years: "c. 551–479 BCE", description: "Chinese philosopher and teacher." },
];

export function quoteForDate(date: string) {
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  return publicQuotes[Math.abs(day) % publicQuotes.length];
}

export function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}
