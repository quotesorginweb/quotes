import { SearchBox } from "./components";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Quotes.org.in home"><span>Q</span> Quotes<small>.org.in</small></a>
      <nav aria-label="Main navigation">
        <a href="/topics">Topics</a><a href="/authors">Authors</a><a href="/occasions">Occasions</a><a href="/quote-of-the-day">Daily quote</a><a href="/tools/quote-image-generator">Create</a>
      </nav>
      <SearchBox compact />
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div><a className="brand inverse" href="/"><span>Q</span> Quotes<small>.org.in</small></a><p>Words worth keeping, sources worth checking.</p></div>
      <div><strong>Explore</strong><a href="/topics">Topics</a><a href="/authors">Authors</a><a href="/occasions">Occasions</a><a href="/quote-of-the-day">Daily archive</a></div>
      <div><strong>Standards</strong><a href="/editorial-policy">Editorial policy</a><a href="/verification">Verification</a><a href="/copyright">Copyright & takedown</a></div>
      <div><strong>Legal</strong><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main id="main">{children}</main><Footer /></>;
}
