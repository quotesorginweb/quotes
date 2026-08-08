import type { Metadata } from "next";
import { CollectionControls } from "../components";
import { publicQuotes } from "../data";
import { RelatedCollections } from "../related-collections";
import { PageShell } from "../site-shell";
import { breadcrumbData, StructuredData } from "../structured-data";

const loveOccasions = new Set(["wedding", "anniversary", "valentines-day"]);
export const metadata: Metadata = { title: "Love Quotes with Verified Sources", description: "Verified public-domain quotations about affection, constancy, friendship and love, with the original work kept visible.", alternates: { canonical: "/love-quotes" } };

export default function LoveQuotesPage() {
  const selected = publicQuotes.filter((quote) => quote.occasions.some((occasion) => loveOccasions.has(occasion)) || quote.topics.includes("friendship"));
  return <PageShell>
    <StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Love quotes", path: "/love-quotes" }])} />
    <section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Love quotes</div><p className="eyebrow">Affection in its original context</p><h1>Love quotes with verified sources</h1><p>Explore sourced words about affection, friendship, constancy, reunion and mutual respect. Dramatic speakers and translators stay visible, and anonymous internet sayings remain outside the collection.</p><p><small>{selected.length} reviewed public-domain quotations</small></p></section>
    <section className="content"><aside className="collection-callout"><p className="eyebrow">Choose for the relationship</p><h2>Let the quotation support your own words.</h2><p>For a ceremony, read the original dramatic context first. For a card or message, keep the exact wording and attribution, then add the specific memory or quality that makes it personal.</p><div className="pills"><a href="/occasions/wedding">Wedding</a><a href="/occasions/anniversary">Anniversary</a><a href="/occasions/valentines-day">Valentine’s Day</a><a href="/topics/friendship">Friendship</a></div></aside><RelatedCollections quotes={selected} /><CollectionControls quotes={selected} /></section>
  </PageShell>;
}
