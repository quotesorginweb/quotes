import type { Metadata } from "next";
import { PageShell } from "../site-shell";
import { CookieSettingsButton } from "../cookie-consent";
export const metadata: Metadata = { title: "Privacy Notice", description: "Learn about cookies, saved quotes and website measurements on Quotes.org.in.", alternates: { canonical: "/privacy" } };
export default function Privacy() { return <PageShell>
  <section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Privacy</div><h1>Privacy notice</h1><p>How this website uses browser storage and measurements.</p></section>
  <article className="content">
    <h2>Saved quotes and image creation</h2><p>Saved quote IDs and text entered in the image maker stay in your browser. They are not synced to our servers.</p>
    <h2>Cookie preferences</h2><p>Google Analytics is optional and its tag loads only after you select Accept cookies. It uses cookies such as _ga to measure visits. Advertising storage, advertising personalization and Google Signals are disabled. Page URLs sent by this integration omit search parameters and fragments. Learn <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a>.</p><p>Your choice is saved in this browser. Use the button below to change it at any time. Rejecting optional cookies keeps Google measurement off and does not prevent browsing or saving quotes.</p><CookieSettingsButton />
    <h2>First-party measurements and routine logs</h2><p>Separately, search terms, aggregate page views, named actions and Core Web Vitals are stored by our first-party measurement service to improve discovery and performance. This does not set an advertising profile or cross-site identifier, or send quotation text entered in the image maker. Our hosting provider may process standard security and request logs.</p>
    <h2>Reports and contact messages</h2><p>Report and contact entries are stored for editorial follow-up. Forms may include a quote reference, reason, message, source link and optional reply address. If storage is unavailable, the form falls back to your email application.</p>
    <h2>Your choices</h2><p>Clear saved quotes on the Saved page or by clearing browser storage. Do not include sensitive personal information in reports or search terms.</p><p><small>Last updated 1 October 2026.</small></p>
  </article>
</PageShell>; }
