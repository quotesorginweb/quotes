import { publicQuotes } from "./data";

export type SourceWork = {
  slug: string;
  title: string;
  creator: string;
  creatorSlug: string;
  description: string;
  sourceUrl: string;
  sourcePrefixes: string[];
};

export const sourceWorks: SourceWork[] = [
  { slug: "meditations", title: "Meditations", creator: "Marcus Aurelius", creatorSlug: "marcus-aurelius", description: "Stoic reflections on conduct, attention, duty and perspective, presented from identified public-domain translations.", sourceUrl: "https://www.gutenberg.org/ebooks/2680", sourcePrefixes: ["Meditations"] },
  { slug: "shakespeare-plays", title: "The plays and sonnets of William Shakespeare", creator: "William Shakespeare", creatorSlug: "william-shakespeare", description: "Dramatic and poetic lines kept with their plays, speakers, acts, scenes or sonnet numbers rather than treated as the author’s direct advice.", sourceUrl: "https://www.folger.edu/explore/shakespeares-works/", sourcePrefixes: ["Hamlet", "As You Like It", "The Merchant of Venice", "The Tempest", "Twelfth Night", "A Midsummer Night’s Dream", "Henry V", "Troilus and Cressida", "Measure for Measure", "Shakespeare’s Sonnets", "Romeo and Juliet", "Much Ado About Nothing", "All’s Well That Ends Well"] },
  { slug: "analects", title: "The Analects", creator: "Confucius", creatorSlug: "confucius", description: "Sayings and conversations associated with Confucius and his students, tied to book locations and a visible translation.", sourceUrl: "https://ctext.org/analects", sourcePrefixes: ["Analects"] },
  { slug: "essays-first-series", title: "Essays, First Series", creator: "Ralph Waldo Emerson", creatorSlug: "ralph-waldo-emerson", description: "Essays on self-reliance, friendship, character and the uses of thought in everyday conduct.", sourceUrl: "https://www.gutenberg.org/files/2944/2944-h/2944-h.htm", sourcePrefixes: ["Essays, First Series"] },
  { slug: "lincoln-speeches", title: "Speeches and papers of Abraham Lincoln", creator: "Abraham Lincoln", creatorSlug: "abraham-lincoln", description: "Public language on government, duty, civil war and reconciliation, checked against institutional transcripts and manuscripts.", sourceUrl: "https://www.loc.gov/collections/abraham-lincoln-papers/", sourcePrefixes: ["Second Inaugural Address", "Cooper Union Address", "House Divided Speech", "Gettysburg Address"] },
  { slug: "friendship-and-old-age", title: "Treatises on Friendship and Old Age", creator: "Marcus Tullius Cicero", creatorSlug: "marcus-tullius-cicero", description: "Public-domain translations of Cicero’s dialogues about friendship, virtue, memory and later life.", sourceUrl: "https://www.gutenberg.org/files/2808/2808-h/2808-h.htm", sourcePrefixes: ["On Friendship", "On Old Age"] },
  { slug: "a-christmas-carol", title: "A Christmas Carol", creator: "Charles Dickens", creatorSlug: "charles-dickens", description: "Seasonal language placed within Scrooge’s moral transformation and the novella’s social concerns.", sourceUrl: "https://www.gutenberg.org/files/46/46-h/46-h.htm", sourcePrefixes: ["A Christmas Carol"] },
  { slug: "gitanjali", title: "Gitanjali: Song Offerings", creator: "Rabindranath Tagore", creatorSlug: "rabindranath-tagore", description: "Tagore’s English prose-poem sequence, with numbered poems retained for context.", sourceUrl: "https://www.gutenberg.org/files/7164/7164-h/7164-h.htm", sourcePrefixes: ["Gitanjali"] },
  { slug: "complete-works-vivekananda", title: "The Complete Works of Swami Vivekananda", creator: "Swami Vivekananda", creatorSlug: "swami-vivekananda", description: "Lectures and conversations on character, education, service, confidence and Vedanta, matched across the abbreviated and full source labels used by public editions.", sourceUrl: "https://en.wikisource.org/wiki/The_Complete_Works_of_Swami_Vivekananda", sourcePrefixes: ["The Complete Works"] },
  { slug: "songs-of-kabir", title: "Songs of Kabir", creator: "Kabir", creatorSlug: "kabir", description: "Kabir’s attributed songs in Rabindranath Tagore’s named 1915 English translation.", sourceUrl: "https://www.gutenberg.org/cache/epub/6519/pg6519.html", sourcePrefixes: ["Songs of Kabir"] },
  { slug: "kavita-kaumudi-kabir", title: "Kavita Kaumudi, volume 1: Kabir dohas", creator: "Kabir", creatorSlug: "kabir", description: "Source-checked Hindi dohas attributed to Kabir in the first volume of Kavita Kaumudi, with page-level links and clearly labelled editorial English meanings.", sourceUrl: "https://hi.wikisource.org/wiki/कविता-कौमुदी_१/३_कबीर_साहब", sourcePrefixes: ["कविता-कौमुदी १"] },
  { slug: "golden-threshold", title: "The Golden Threshold", creator: "Sarojini Naidu", creatorSlug: "sarojini-naidu", description: "English lyric poetry rooted in Indian landscapes, work, family, love and aspiration.", sourceUrl: "https://www.gutenberg.org/cache/epub/680/pg680.html", sourcePrefixes: ["The Golden Threshold"] },
  { slug: "sandhya", title: "Sandhya: Songs of Twilight", creator: "Dhan Gopal Mukerji", creatorSlug: "dhan-gopal-mukerji", description: "Compact lyric poems by Dhan Gopal Mukerji about hope, grief, love, silence and renewal, linked to the public-domain edition used for review.", sourceUrl: "https://www.gutenberg.org/files/22848/22848-h/22848-h.htm", sourcePrefixes: ["Sandhya"] },
  { slug: "song-celestial", title: "The Song Celestial; or, Bhagavad-Gita", creator: "Bhagavad Gita", creatorSlug: "bhagavad-gita", description: "Sir Edwin Arnold’s public-domain verse translation, with the chapter and translator named on every selection.", sourceUrl: "https://www.gutenberg.org/cache/epub/2388/pg2388-images.html", sourcePrefixes: ["The Song Celestial"] },
  { slug: "rahim-dohas", title: "Rahim-kavitavali: Dohas", creator: "Abdul Rahim Khan-i-Khanan", creatorSlug: "abdul-rahim-khan-i-khanan", description: "Source-checked Hindi dohas with the cited Devanagari wording and clearly labelled editorial English meanings.", sourceUrl: "https://hi.wikisource.org/wiki/रहीम-कवितावली/दोहे", sourcePrefixes: ["रहीम-कवितावली"] },
  { slug: "little-women", title: "Little Women", creator: "Louisa May Alcott", creatorSlug: "louisa-may-alcott", description: "The ambitions, choices and relationships of the March family, with fictional speaker and chapter context retained.", sourceUrl: "https://www.gutenberg.org/files/514/514-h/514-h.htm", sourcePrefixes: ["Little Women"] },
  { slug: "jane-eyre", title: "Jane Eyre", creator: "Charlotte Brontë", creatorSlug: "charlotte-bronte", description: "A first-person novel of autonomy, conscience, love and social power, with chapter locations preserved.", sourceUrl: "https://www.gutenberg.org/files/1260/1260-h/1260-h.htm", sourcePrefixes: ["Jane Eyre"] },
];

export function quotesForSourceWork(work: SourceWork) {
  return publicQuotes.filter((quote) => work.sourcePrefixes.some((prefix) => quote.source.startsWith(prefix)));
}

export function sourceWorkForQuote(source: string) {
  return sourceWorks.find((work) => work.sourcePrefixes.some((prefix) => source.startsWith(prefix)));
}
