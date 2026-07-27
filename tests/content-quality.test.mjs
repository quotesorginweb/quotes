import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app/data.ts", import.meta.url), "utf8");

test("expanded records retain stable ids, primary source URLs and review dates", () => {
  for (const id of ["q-marcus-002", "q-confucius-002", "q-shakespeare-002", "q-shakespeare-003", "q-emerson-001", "q-emerson-002", "q-lincoln-001", "q-shakespeare-004"]) {
    assert.match(source, new RegExp(`id: "${id}"`));
  }
  assert.match(source, /https:\/\/www\.loc\.gov\/resource\/mal\.4361300/);
  assert.match(source, /https:\/\/www\.gutenberg\.org\/files\/2944/);
  assert.match(source, /https:\/\/ctext\.org\/analects\/shu-er/);
  assert.match(source, /reviewedAt: "2026-07-27"/);
});

test("new topics consolidate content rather than generating keyword variants", () => {
  for (const slug of ["friendship", "kindness", "change", "leadership"]) {
    assert.match(source, new RegExp(`slug: "${slug}"`));
  }
  assert.doesNotMatch(source, /motivation-quotes|quotes-for-motivation|motivating-quotations/);
});

test("requested content wave has sourced records and consolidated collections", () => {
  for (const id of ["q-shakespeare-005","q-shakespeare-006","q-shakespeare-007","q-shakespeare-008","q-confucius-003","q-confucius-004"]) {
    assert.match(source, new RegExp(`id: "${id}"`));
  }
  for (const slug of ["gratitude","teamwork","positive","family","short-motivational"]) {
    assert.match(source, new RegExp(`slug: "${slug}"`));
  }
  assert.match(source, /Twelfth Night, Act 3, Scene 3/);
  assert.match(source, /Henry V, Act 4, Scene 3/);
  assert.match(source, /Analects, Book 14 \(Xian Wen\)/);
});
