import { spawn } from "node:child_process";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const baseUrl = process.env.BASE_URL || "http://localhost:4173";
const routes = ["/", "/topics/change", "/love-quotes", "/sources/meditations"];
const strict = Boolean(process.env.BASE_URL) || process.env.LIGHTHOUSE_STRICT === "1";
const minimums = strict
  ? { performance: 0.6, accessibility: 0.95, "best-practices": 0.9, seo: 0.9 }
  : { performance: 0.35, accessibility: 0.95, "best-practices": 0.75, seo: 0.9 };
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { const response = await fetch(baseUrl); if (response.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

try {
  if (!process.env.BASE_URL) {
    server = spawn(process.execPath, ["node_modules/vinext/dist/cli.js", "dev", "--port", "4173"], { stdio: "inherit", shell: false });
    await waitForServer();
  }
  const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"] });
  try {
    for (const route of routes) {
      const result = await lighthouse(`${baseUrl}${route}`, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: Object.keys(minimums) });
      if (!result?.lhr) throw new Error(`Lighthouse returned no report for ${route}`);
      const scores = Object.fromEntries(Object.entries(minimums).map(([category]) => [category, result.lhr.categories[category].score || 0]));
      console.log(`${route}: ${Object.entries(scores).map(([category, score]) => `${category} ${Math.round(score * 100)}`).join(", ")}`);
      for (const [category, minimum] of Object.entries(minimums)) if (scores[category] < minimum) throw new Error(`${route} ${category} score ${scores[category]} is below ${minimum}`);
    }
  } finally { try { await chrome.kill(); } catch (error) { console.warn(`Chrome cleanup warning: ${error.message}`); } }
} finally {
  if (server && !server.killed) server.kill();
}
