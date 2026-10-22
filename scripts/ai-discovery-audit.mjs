import { mkdir, writeFile } from "node:fs/promises";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

// Read-only lab measurements. These do not establish field Core Web Vitals.
const base = process.env.BASE_URL || "https://quotes.org.in";
const routes = process.argv.length > 2 ? process.argv.slice(2) : ["/", "/topics/change", "/authors/marcus-aurelius", "/quote/to-thine-own-self-be-true"];
const directory = new URL("../outputs/ai-discovery-audit/", import.meta.url);
await mkdir(directory, { recursive: true });
const results = [];
try {
  for (const route of routes) {
    let chrome;
    try {
      // Fresh sessions avoid cross-navigation trace failures in local Chrome.
      chrome = await launch({ chromeFlags: ["--headless=new", "--disable-dev-shm-usage"] });
      const result = await lighthouse(new URL(route, base).href, {
        port: chrome.port, output: "json", logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      });
      if (!result?.lhr) throw new Error("No Lighthouse result returned");
      const { lhr } = result;
      const file = `${route.replaceAll("/", "_") || "home"}.json`;
      await writeFile(new URL(file, directory), JSON.stringify(lhr, null, 2));
      const summary = {
        route, finalUrl: lhr.finalDisplayedUrl, fetchedAt: lhr.fetchTime,
        scores: Object.fromEntries(Object.entries(lhr.categories).map(([name, item]) => [name, item.score])),
        metrics: Object.fromEntries(["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time"].map((name) => [name, lhr.audits[name]?.numericValue])),
        failures: Object.values(lhr.audits).filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === "binary").map((audit) => ({ id: audit.id, title: audit.title, description: audit.description })),
        runtimeError: lhr.runtimeError || null,
        expectedNoindex: route.startsWith("/quote/"), report: file,
      };
      results.push(summary);
      if (lhr.runtimeError) process.exitCode = 1;
      console.log(JSON.stringify(summary));
    } catch (error) {
      results.push({ route, error: String(error) });
      console.error(`${route}: ${error}`);
      process.exitCode = 1;
    } finally {
      if (chrome) {
        try { await chrome.kill(); } catch (error) { console.warn(`Browser cleanup: ${error.message}`); }
      }
    }
  }
} finally {
  await writeFile(new URL("summary.json", directory), JSON.stringify({ base, results }, null, 2));
}
