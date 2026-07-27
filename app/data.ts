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
    id: "q-marcus-002",
    slug: "happiness-depends-on-quality-of-thoughts",
    text: "The happiness of your life depends upon the quality of your thoughts.",
    normalizedText: "the happiness of your life depends upon the quality of your thoughts",
    author: "Marcus Aurelius",
    authorSlug: "marcus-aurelius",
    source: "Meditations, Book 3, section 9",
    sourceUrl: "https://en.wikisource.org/wiki/Page:The_Emperor_Marcus_Antoninus_-_His_Conversation_with_Himself.djvu/215",
    verification: "verified-primary-source",
    topics: ["life", "motivational", "self-love"],
    moods: ["positive", "reflective"],
    occasions: ["work"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-confucius-002",
    slug: "others-may-serve-as-my-teachers",
    text: "When I walk along with two others, they may serve me as my teachers.",
    normalizedText: "when i walk along with two others they may serve me as my teachers",
    author: "Confucius",
    authorSlug: "confucius",
    source: "Analects, Book 7 (Shu Er)",
    sourceUrl: "https://ctext.org/analects/shu-er",
    verification: "verified-reliable-secondary-source",
    topics: ["inspirational", "life", "leadership"],
    moods: ["reflective"],
    occasions: ["graduation", "work"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-shakespeare-002",
    slug: "sweet-are-the-uses-of-adversity",
    text: "Sweet are the uses of adversity.",
    normalizedText: "sweet are the uses of adversity",
    author: "William Shakespeare",
    authorSlug: "william-shakespeare",
    source: "As You Like It, Act 2, Scene 1",
    sourceUrl: "https://www.folger.edu/explore/shakespeares-works/as-you-like-it/read/2/1/",
    verification: "verified-primary-source",
    topics: ["strength", "change", "inspirational"],
    moods: ["positive", "reflective"],
    occasions: ["work", "graduation"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-shakespeare-003",
    slug: "kindness-nobler-ever-than-revenge",
    text: "Kindness, nobler ever than revenge.",
    normalizedText: "kindness nobler ever than revenge",
    author: "William Shakespeare",
    authorSlug: "william-shakespeare",
    source: "As You Like It, Act 4, Scene 3",
    sourceUrl: "https://www.folger.edu/explore/shakespeares-works/as-you-like-it/read/4/3/",
    verification: "verified-primary-source",
    topics: ["kindness", "life"],
    moods: ["positive", "reflective"],
    occasions: ["friendship"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-emerson-001",
    slug: "nothing-great-achieved-without-enthusiasm",
    text: "Nothing great was ever achieved without enthusiasm.",
    normalizedText: "nothing great was ever achieved without enthusiasm",
    author: "Ralph Waldo Emerson",
    authorSlug: "ralph-waldo-emerson",
    source: "Essays, First Series — Circles",
    sourceUrl: "https://www.gutenberg.org/files/16643/16643-h/16643-h.htm",
    verification: "verified-primary-source",
    topics: ["motivational", "inspirational", "leadership"],
    moods: ["positive"],
    occasions: ["work", "graduation"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-emerson-002",
    slug: "friend-masterpiece-of-nature",
    text: "A friend may well be reckoned the masterpiece of nature.",
    normalizedText: "a friend may well be reckoned the masterpiece of nature",
    author: "Ralph Waldo Emerson",
    authorSlug: "ralph-waldo-emerson",
    source: "Essays, First Series — Friendship",
    sourceUrl: "https://www.gutenberg.org/files/2944/2944-h/2944-h.htm",
    verification: "verified-primary-source",
    topics: ["friendship", "life"],
    moods: ["positive", "grateful"],
    occasions: ["friendship"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-lincoln-001",
    slug: "with-malice-toward-none",
    text: "With malice toward none; with charity for all.",
    normalizedText: "with malice toward none with charity for all",
    author: "Abraham Lincoln",
    authorSlug: "abraham-lincoln",
    source: "Second Inaugural Address, 4 March 1865",
    sourceUrl: "https://www.loc.gov/resource/mal.4361300/?st=text",
    verification: "verified-primary-source",
    topics: ["kindness", "leadership", "life"],
    moods: ["reflective", "hopeful"],
    occasions: ["work"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
  },
  {
    id: "q-shakespeare-004",
    slug: "all-the-worlds-a-stage",
    text: "All the world’s a stage, and all the men and women merely players.",
    normalizedText: "all the worlds a stage and all the men and women merely players",
    author: "William Shakespeare",
    authorSlug: "william-shakespeare",
    source: "As You Like It, Act 2, Scene 7",
    sourceUrl: "https://www.folger.edu/explore/shakespeares-works/as-you-like-it/read/2/7/",
    verification: "verified-primary-source",
    topics: ["life", "change"],
    moods: ["reflective"],
    occasions: ["graduation", "retirement"],
    published: true,
    rights: "public-domain",
    reviewedAt: "2026-07-27",
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
  { slug: "friendship", label: "Friendship", note: "Trust, companionship and the people beside us", color: "blue" },
  { slug: "kindness", label: "Kindness", note: "Compassion, generosity and humane action", color: "teal" },
  { slug: "change", label: "Change", note: "Perspective for transitions and new chapters", color: "gold" },
  { slug: "leadership", label: "Leadership", note: "Character, responsibility and service", color: "coral" },
];

export const authors = [
  { slug: "marcus-aurelius", name: "Marcus Aurelius", years: "121–180 CE", description: "Roman emperor and Stoic philosopher." },
  { slug: "william-shakespeare", name: "William Shakespeare", years: "1564–1616", description: "English playwright, poet and actor." },
  { slug: "confucius", name: "Confucius", years: "c. 551–479 BCE", description: "Chinese philosopher and teacher." },
  { slug: "ralph-waldo-emerson", name: "Ralph Waldo Emerson", years: "1803–1882", description: "American essayist, lecturer and poet." },
  { slug: "abraham-lincoln", name: "Abraham Lincoln", years: "1809–1865", description: "Sixteenth president of the United States." },
];

export function quoteForDate(date: string) {
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  return publicQuotes[Math.abs(day) % publicQuotes.length];
}

export function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}
