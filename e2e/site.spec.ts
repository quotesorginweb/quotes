import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/topics/change", "/love-quotes", "/sources/meditations", "/occasions/christmas"];

for (const route of routes) {
  test(`${route} has a unique title, one heading and no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(/Quotes\.org\.in/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || "")), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("primary navigation and quote interactions work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const loveLink = page.locator('.site-header a[href="/love-quotes"]:visible').first();
  if (!(await loveLink.count())) await page.locator(".mobile-menu summary").click();
  await page.locator('.site-header a[href="/love-quotes"]:visible').first().click();
  await expect(page).toHaveURL(/\/love-quotes$/);
  const firstCard = page.locator(".quote-card").first();
  await firstCard.getByRole("button", { name: "Save" }).click();
  await expect(firstCard.getByRole("button", { name: "Saved" })).toBeVisible();
});
