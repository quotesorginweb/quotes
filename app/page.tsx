import { QuoteCard, SearchBox } from "./components";
import { authors, publicQuotes, quoteForDate, todayUtc, topics } from "./data";
import { PageShell } from "./site-shell";

export default function Home() {
  const daily = quoteForDate(todayUtc());
  return (
    <PageShell>
      <section className="hero">
        <div>
          <p className="eyebrow">Verified words. Thoughtfully sourced.</p>
          <h1>Find the right words,<br /><em>and know where they came from.</em></h1>
          <p className="lede">Discover carefully verified quotations by topic, mood, occasion and author — with source notes and original images made for sharing.</p>
          <SearchBox />
          <p className="trust-line"><span>✓ Human-reviewed sources</span><span>✓ Public-domain first</span><span>✓ No invented attributions</span></p>
        </div>
        <aside className="hero-art" aria-label="Featured quotation">
          <div className="sun" aria-hidden="true" />
          <div className="paper"><p>Words become useful<br />when their sources<br />remain visible.</p><small>— Quotes.org.in editorial principle</small></div>
        </aside>
      </section>

      <section className="daily section-grid">
        <div><p className="eyebrow">Quote of the day · {new Date(`${todayUtc()}T00:00:00Z`).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</p><h2>A daily thought,<br />chosen with care.</h2><p>One approved quotation for each UTC calendar date — stable, source-linked and saved in our archive.</p><a className="text-link" href="/quote-of-the-day">Visit the daily archive →</a></div>
        <QuoteCard quote={daily} featured />
      </section>

      <section className="section">
        <div className="section-head"><div><p className="eyebrow">Explore by topic</p><h2>Words for where you are.</h2></div><a href="/topics">View all topics →</a></div>
        <div className="topic-grid">{topics.map((topic, i) => <a className={`topic-card ${topic.color}`} href={`/topics/${topic.slug}`} key={topic.slug}><span>0{i + 1}</span><h3>{topic.label}</h3><p>{topic.note}</p><b>Explore collection →</b></a>)}</div>
      </section>

      <section className="mood-band section">
        <div><p className="eyebrow">Explore by mood</p><h2>How do you want to feel?</h2></div>
        <div className="pills"><a href="/moods/positive">☀ Positive</a><a href="/moods/reflective">◐ Reflective</a><a href="/topics/strength">◆ Strong</a><a href="/topics/inspirational">✦ Inspired</a></div>
      </section>

      <section className="section">
        <div className="section-head"><div><p className="eyebrow">Featured authors</p><h2>Meet the voices behind the words.</h2></div><a href="/authors">Browse all authors →</a></div>
        <div className="author-grid">{authors.map((author) => <a href={`/authors/${author.slug}`} key={author.slug}><div className="monogram">{author.name.split(" ").map((n) => n[0]).join("")}</div><h3>{author.name}</h3><p>{author.years}</p><span>{author.description}</span></a>)}</div>
      </section>

      <section className="create-banner">
        <div><p className="eyebrow">Make it yours</p><h2>Turn a thought into<br />an image worth sharing.</h2><p>Choose a quotation, colour and layout. Preview it instantly and download a clean, original image.</p><a className="button" href="/tools/quote-image-generator">Create a quote image →</a></div>
        <div className="mini-cards" aria-hidden="true"><div>“Be true.”<small>— Shakespeare</small></div><div>“Find strength.”<small>— Marcus Aurelius</small></div></div>
      </section>

      <section className="trust-section section">
        <div><p className="eyebrow">Why trust Quotes.org.in?</p><h2>Attribution is not<br />an afterthought.</h2></div>
        <div className="trust-cards"><article><b>01</b><h3>Sources before slogans</h3><p>Published quotations link to a primary source or a reliable secondary reference.</p></article><article><b>02</b><h3>Visible verification</h3><p>Every public quotation shows its review status and source work.</p></article><article><b>03</b><h3>Corrections stay traceable</h3><p>Readers can report an issue; attribution changes belong in an editorial audit trail.</p></article></div>
      </section>
    </PageShell>
  );
}
