import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const formats = ["square", "portrait", "landscape", "pinterest", "open-graph"];

test("every verified topic collection has five original image formats", async () => {
  const metadata = JSON.parse(await readFile(new URL("../public/images/quote-collections/licensing-metadata.json", import.meta.url), "utf8"));
  const collections = [...new Set(metadata.assets.map((asset) => asset.collection))];
  assert.equal(collections.length, 18);
  assert.equal(metadata.assets.length, collections.length * formats.length);
  for (const collection of collections) {
    const collectionAssets = metadata.assets.filter((asset) => asset.collection === collection);
    for (const format of formats) {
      const record = collectionAssets.find((asset) => asset.format === format);
      assert.ok(record, `missing ${format} image for ${collection}`);
      await access(new URL(`../public/images/quote-collections/${record.filename}`, import.meta.url));
      assert.ok(record.alt.includes("quote by"), `missing descriptive alt text for ${record.filename}`);
      assert.match(record?.license ?? "", /Original artwork.*public domain/);
      assert.match(record.sourceUrl, /^https:\/\//);
    }
  }
});

test("image sitemap and robots expose the collection image inventory", async () => {
  const sitemap = await readFile(new URL("../app/image-sitemap.xml/route.ts", import.meta.url), "utf8");
  const sitemapIndex = await readFile(new URL("../app/sitemap-index.xml/route.ts", import.meta.url), "utf8");
  const robots = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");
  assert.match(sitemap, /image:license/);
  assert.match(sitemap, /image:caption/);
  assert.match(sitemapIndex, /<sitemapindex/);
  assert.match(sitemapIndex, /sitemap\.xml/);
  assert.match(sitemapIndex, /image-sitemap\.xml/);
  assert.match(sitemapIndex, /s-maxage=3600/);
  assert.match(robots, /sitemap-index\.xml/);
  assert.match(robots, /image-sitemap\.xml/);
});
