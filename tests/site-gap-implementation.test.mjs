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
