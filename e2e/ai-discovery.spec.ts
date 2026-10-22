import { expect, test } from "@playwright/test";

test.use({ trace: "off", actionTimeout: 20_000, navigationTimeout: 30_000 });

const samples = [
  { path: "/", type: "WebSite", indexable: true },
  { path: "/topics/change", type: "CollectionPage", indexable: true },
  { path: "/authors/marcus-aurelius", type: "Person", indexable: true },
  { path: "/quote/to-thine-own-self-be-true", type: "Quotation", indexable: false },
];

for (const sample of samples) {
  test(`${sample.path} preserves discovery, indexing and accessible search`, async ({ page }) => {
    const response = await page.goto(sample.path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S/);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(sample.indexable ? `https://quotes.org.in${sample.path}` : "https://quotes.org.in/topics/life");
    const robots = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content")).join(","));
    if (sample.indexable) expect(robots || "").not.toMatch(/noindex/);
    else expect(robots).toMatch(/noindex/);

    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.flatMap((script) => JSON.parse(script.textContent || "null")),
    );
    expect(schemas.some((schema) => schema?.["@type"] === sample.type)).toBe(true);
    if (sample.type === "Quotation") {
      const quote = schemas.find((schema) => schema["@type"] === "Quotation");
      await expect(page.locator("main")).toContainText(quote.text);
      await expect(page.locator("main")).toContainText(quote.creator.name);
      expect(quote.isPartOf.url).toMatch(/^https:\/\//);
    }

    const fields = await page.locator('form[role="search"] input').evaluateAll((inputs) => inputs.map((element) => {
      const input = element as HTMLInputElement;
      return { id: input.id, labels: [...(input.labels || [])].map((label) => label.textContent?.trim()) };
    }));
    expect(fields.length).toBeGreaterThanOrEqual(2);
    expect(new Set(fields.map((field) => field.id)).size).toBe(fields.length);
    for (const field of fields) expect(field.labels).toEqual(["Search quotations, authors and topics"]);

    if (!(await page.locator('form[role="search"]:visible').count())) await page.locator(".mobile-menu summary").click();
    const form = page.locator('form[role="search"]:visible').first();
    await form.getByRole("searchbox").fill("Marcus");
    // Compact header search intentionally hides its button and submits on Enter.
    await form.getByRole("searchbox").press("Enter", { noWaitAfter: true });
    await expect(page).toHaveURL(/\/search\?q=Marcus$/);
    await expect(page.locator("main")).toContainText("Marcus");
  });
}

test("llms.txt is readable and every curated local link resolves", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  const text = await response.text();
  expect(text).toMatch(/^# Quotes\.org\.in\r?\n/);
  const links = [...text.matchAll(/\]\((https:\/\/quotes\.org\.in[^)]+)\)/g)].map((match) => new URL(match[1]).pathname);
  expect(links.length).toBeGreaterThan(10);
  for (const link of links) {
    const target = await request.get(link);
    expect(target.status(), link).toBe(200);
  }
});
