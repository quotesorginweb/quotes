import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  fullyParallel: false,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node node_modules/vinext/dist/cli.js dev --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "desktop-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }, { name: "mobile-chrome", use: { ...devices["Pixel 7"], channel: "chrome" } }],
});
