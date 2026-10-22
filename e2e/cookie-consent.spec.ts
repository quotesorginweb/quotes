import { expect, test } from "@playwright/test";

test.use({ trace: "off", actionTimeout: 20_000, navigationTimeout: 30_000 });

for (const choice of ["accepted", "rejected"] as const) {
  test(`${choice} hides cookie UI across reloads and can be changed from Privacy`, async ({ page }) => {
    await page.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const banner = page.getByRole("region", { name: "Cookie consent" });
    await expect(banner).toBeVisible({ timeout: 30_000 });
    await banner.getByRole("button", { name: choice === "accepted" ? "Accept cookies" : "Reject optional cookies", exact: true }).click();
    await expect(banner).toHaveCount(0);
    await expect(page.locator(".cookie-settings")).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("quotes-cookie-consent-v1"))).toBe(choice);

    await page.reload({ waitUntil: "domcontentloaded" });
    // Save is disabled during SSR and becomes enabled after hydration.
    await expect(page.getByRole("button", { name: "Save", exact: true })).toBeEnabled({ timeout: 30_000 });
    await expect(banner).toHaveCount(0);
    await expect(page.locator(".cookie-settings")).toHaveCount(0);
    await expect(page.locator("#quotes-google-tag")).toHaveCount(choice === "accepted" ? 1 : 0);

    await page.goto("/privacy", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "Change cookie preferences" }).click();
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: choice === "accepted" ? "Reject optional cookies" : "Accept cookies", exact: true }).click({ noWaitAfter: true });
    await expect(banner).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => localStorage.getItem("quotes-cookie-consent-v1"))).toBe(choice === "accepted" ? "rejected" : "accepted");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(banner).toHaveCount(0);
    await expect(page.locator(".cookie-settings")).toHaveCount(0);
  });
}
