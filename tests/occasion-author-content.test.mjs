import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
const content = await readFile(
  new URL("../app/editorial-content.ts", import.meta.url),
  "utf8",
);
test("all occasion collections contain original guidance and are approved", () => {
  for (const slug of [
    "birthday",
    "graduation",
    "wedding",
    "anniversary",
    "retirement",
    "mothers-day",
    "fathers-day",
    "christmas",
    "new-year",
    "valentines-day",
  ])
    assert.match(content, new RegExp(`slug:\"${slug}\"[^\\n]+status:\"published\"`));
  assert.doesNotMatch(content, /status:"draft"/);
});
test("author records contain context, methodology and bibliography", () => {
  for (const slug of [
    "marcus-aurelius",
    "william-shakespeare",
    "confucius",
    "ralph-waldo-emerson",
    "abraham-lincoln",
  ])
    assert.match(content, new RegExp(`\"${slug}\"`));
  for (const field of ["overview", "method", "bibliography"])
    assert.match(content, new RegExp(field));
});
test("occasion publication requires approval and sufficient verified content", async () => {
  const page = await readFile(
    new URL("../app/occasions/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const sitemap = await readFile(
    new URL("../app/sitemap.ts", import.meta.url),
    "utf8",
  );
  const readiness = await readFile(
    new URL("../app/occasion-readiness.ts", import.meta.url),
    "utf8",
  );
  assert.match(page, /robots: \{ index: publishable/);
  assert.match(readiness, /MIN_VERIFIED_OCCASION_QUOTES = 5/);
  assert.match(readiness, /approved && sufficient/);
  assert.ok(sitemap.includes("occasionReadiness(item.slug).publishable"));
});
