# ADR-0001: Domain and geographic targeting

Status: Accepted — 25 July 2026

The initial keyword research uses the United States database while the production domain is `quotes.org.in`. The `.org.in` domain carries an India-related geographic signal. The service may still address global English readers, but a generic `.com`, `.org`, or appropriate gTLD should be considered if US/global commercial rankings become the primary objective.

We will begin with one clear English version. We will not invent US regional pages, add `en-US` variants without genuinely different content, or redirect visitors using IP assumptions. Routes and data records include language fields so genuine Hindi and other editions can later use separate URLs and valid `hreflang`.

This decision does not block development, but must be revisited before large-scale publication or a domain migration.
