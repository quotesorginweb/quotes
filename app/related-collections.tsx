import type { Quote } from "./data";
import { moods, topics } from "./data";
import { occasionReadiness } from "./occasion-readiness";

function ranked(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([value]) => value);
}

export function RelatedCollections({ quotes, excludeTopic, excludeMood, excludeOccasion }: { quotes: Quote[]; excludeTopic?: string; excludeMood?: string; excludeOccasion?: string }) {
  const relatedTopics = ranked(quotes.flatMap((quote) => quote.topics)).filter((slug) => slug !== excludeTopic).slice(0, 4);
  const relatedMoods = ranked(quotes.flatMap((quote) => quote.moods)).filter((slug) => slug !== excludeMood).slice(0, 3);
  const relatedOccasions = ranked(quotes.flatMap((quote) => quote.occasions)).filter((slug) => slug !== excludeOccasion && occasionReadiness(slug).publishable).slice(0, 3);
  if (!relatedTopics.length && !relatedMoods.length && !relatedOccasions.length) return null;
  return <aside className="related-collections" aria-labelledby="related-collections-title">
    <p className="eyebrow">Related collections</p>
    <h2 id="related-collections-title">Keep exploring by theme, mood or moment.</h2>
    <div className="pills">
      {relatedTopics.map((slug) => <a href={`/topics/${slug}`} key={`topic-${slug}`}>{topics.find((topic) => topic.slug === slug)?.label || slug.replaceAll("-", " ")}</a>)}
      {relatedMoods.map((slug) => <a href={`/moods/${slug}`} key={`mood-${slug}`}>{moods.find((mood) => mood.slug === slug)?.label || slug} mood</a>)}
      {relatedOccasions.map((slug) => <a href={`/occasions/${slug}`} key={`occasion-${slug}`}>{occasionReadiness(slug).item?.label || slug.replaceAll("-", " ")}</a>)}
    </div>
  </aside>;
}
