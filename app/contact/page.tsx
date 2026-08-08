import type { Metadata } from "next";
import { ReportForm } from "../components";
import { PageShell } from "../site-shell";
export const metadata: Metadata = { title: "Contact Quotes.org.in", description: "Contact the editorial team about sources, corrections, rights or licensing.", alternates: { canonical: "/contact" } };
export default function Contact() { return <PageShell><section className="page-hero"><div className="breadcrumbs"><a href="/">Home</a> / Contact</div><p className="eyebrow">Editorial and rights enquiries</p><h1>Contact Quotes.org.in</h1><p>Prepare a source question, licensing request, rights concern or general message, then review and send it from your email application. For a specific quotation, include its ID or page.</p></section><section className="content"><ReportForm context="contact" /></section></PageShell>; }
