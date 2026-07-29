import type { Metadata } from "next";
import { PageShell } from "../site-shell";

export const metadata: Metadata = {
  title: "Copyright and Image Licensing",
  description: "Licensing terms for Quotes.org.in original quotation artwork and public-domain source text.",
  alternates: { canonical: "/copyright" },
};

export default function CopyrightPage() {
  return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Copyright</div><p className="eyebrow">Rights and reuse</p><h1>Copyright and image licensing</h1><p>Clear rights information accompanies every original collection image.</p></section><article className="content"><h2>Original artwork</h2><p>The watercolor artwork, layouts and rendered image files are original Quotes.org.in editorial assets created with OpenAI image generation and deterministic editorial composition. Unless a separate written licence applies, the artwork is © 2026 Quotes.org.in and all rights are reserved.</p><h2>Quotation text</h2><p>Quotations embedded in these images are selected from reviewed public-domain editions. Each collection page links to the relevant source record. Public-domain status of the quoted words does not place the surrounding artwork or layout in the public domain.</p><h2>Metadata and accessibility</h2><p>Every downloadable image has a descriptive filename, alternative-text record and licensing entry. The complete machine-readable asset register is available as <a className="text-link" href="/images/quote-collections/licensing-metadata.json">licensing metadata</a>.</p><h2>Permission requests</h2><p>For publishing, commercial reuse or adapted versions, please use the <a className="text-link" href="/contact">contact page</a> and identify the collection, format and filename.</p></article></PageShell>;
}
