import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("quote cards expose crawlable detail and prefilled image-maker links", async () => {
  const components = await read("../app/components.tsx");
  assert.match(components, /href=\{`\/quote\/\$\{quote\.slug\}`\}/);
  assert.match(components, /quote-image-generator\?quote=\$\{quote\.slug\}/);
  const generator = await read("../app/tools/quote-image-generator/page.tsx");
  assert.match(generator, /publicQuotes\.find/);
  assert.match(generator, /initialAuthor=\{selected\?\.author\}/);
});

test("noindex quote and thin-author pages stay out of the XML sitemap", async () => {
  const sitemap = await read("../app/sitemap.ts");
  assert.doesNotMatch(sitemap, /publicQuotes\.map\(\(quote\).*\/quote\//);
  assert.match(sitemap, /authorReadiness\(author\.slug\)\.indexable/);
  const authors = await read("../app/author-readiness.ts");
  assert.match(authors, /MIN_INDEXABLE_AUTHOR_QUOTES = 3/);
});

test("public mood and occasion taxonomies cover every published classification", async () => {
  const data = await read("../app/data.ts");
  assert.match(data, /slug: "hopeful"/);
  assert.match(data, /slug: "sad"/);
  assert.doesNotMatch(data, /occasions: \[[^\]]*"(?:work|friendship)"/);
  const editorial = await read("../app/editorial-content.ts");
  assert.match(editorial, /slug:"birthday"[^\n]+status:"published"/);
  assert.match(editorial, /slug:"new-year"[^\n]+status:"published"/);
});

test("Indian and Hindi discovery hubs are linked and indexed", async () => {
  const sitemap = await read("../app/sitemap.ts");
  const shell = await read("../app/site-shell.tsx");
  const indian = await read("../app/indian-quotes/page.tsx");
  const hindi = await read("../app/hindi-quotes/page.tsx");
  for (const path of ["/indian-quotes", "/hindi-quotes"]) {
    assert.ok(sitemap.includes(path));
    assert.ok(shell.includes(path));
  }
  assert.match(indian, /culturalContext === "India"/);
  assert.match(hindi, /languageCode === "hi"/);
});

test("search covers source, translation, mood, occasion and language fields", async () => {
  const search = await read("../app/search/page.tsx");
  for (const field of ["quote.translation", "quote.source", "quote.moods", "quote.occasions", "quote.languageCode"]) {
    assert.ok(search.includes(field));
  }
});

test("every public quotation maps to a source-work record", async () => {
  const data = await read("../app/data.ts");
  const sources = await read("../app/source-works.ts");
  assert.match(sources, /"Henry V"/);
  assert.match(sources, /"Shakespeare’s Sonnets"/);
  assert.match(sources, /"The Complete Works"/);
  assert.match(sources, /"कविता-कौमुदी १"/);
  assert.match(data, /slug: "bura-jo-dekhan-main-chala-hindi"/);
});

test("indexed collection templates emit collection and list schema", async () => {
  const structured = await read("../app/structured-data.tsx");
  const topics = await read("../app/topics/[slug]/page.tsx");
  const occasions = await read("../app/occasions/[slug]/page.tsx");
  assert.match(structured, /"@type": "CollectionPage"/);
  assert.match(structured, /"@type": "ItemList"/);
  assert.match(topics, /collectionPageData/);
  assert.match(occasions, /collectionPageData/);
});

test("first-party analytics records page events and Core Web Vitals", async () => {
  const analytics = await read("../app/analytics.tsx");
  const route = await read("../app/api/analytics/route.ts");
  const schema = await read("../db/schema.ts");
  for (const metric of ["LCP", "CLS", "INP", "FCP", "TTFB"]) assert.ok(analytics.includes(`\"${metric}\"`));
  assert.match(route, /siteEvents/);
  assert.match(schema, /site_events/);
});

test("www requests permanently redirect to the canonical apex host", async () => {
  const worker = await read("../worker/index.ts");
  assert.match(worker, /url\.hostname === "www\.quotes\.org\.in"/);
  assert.match(worker, /url\.hostname = "quotes\.org\.in"/);
  assert.match(worker, /Response\.redirect\(url\.toString\(\), 301\)/);
});
