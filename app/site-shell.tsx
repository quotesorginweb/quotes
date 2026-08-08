import { SearchBox } from "./components";

export function Header() {
  const links = [
    ["/topics", "Topics"], ["/love-quotes", "Love"], ["/authors", "Authors"], ["/sources", "Sources"], ["/occasions", "Occasions"],
    ["/moods", "Moods"], ["/indian-quotes", "India & Hindi"], ["/quote-of-the-day", "Daily"], ["/tools/quote-image-generator", "Create"], ["/saved", "Saved"],
  ];
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Quotes.org.in home"><span>Q</span> Quotes<small>.org.in</small></a>
      <nav aria-label="Main navigation">{links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
      <SearchBox compact />
      <details className="mobile-menu" suppressHydrationWarning><summary aria-label="Open navigation">Menu</summary><div>{links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}<SearchBox compact /></div></details>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div><a className="brand inverse" href="/"><span>Q</span> Quotes<small>.org.in</small></a><p>Words worth keeping, sources worth checking.</p></div>
      <div><strong>Explore</strong><a href="/topics">Topics</a><a href="/love-quotes">Love quotes</a><a href="/authors">Authors</a><a href="/sources">Source works</a><a href="/moods">Moods</a><a href="/occasions">Occasions</a><a href="/indian-quotes">Indian quotes</a><a href="/hindi-quotes">Hindi quotes</a><a href="/saved">Saved quotes</a></div>
      <div><strong>Standards</strong><a href="/about">About</a><a href="/editorial-policy">Editorial policy</a><a href="/verification">Verification</a><a href="/corrections">Corrections log</a><a href="/rss.xml">RSS feed</a><a href="/copyright">Copyright & takedown</a></div>
      <div><strong>Legal</strong><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main id="main">{children}</main><Footer /></>;
}
