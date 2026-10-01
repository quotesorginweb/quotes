import type { NextConfig } from "next";

const analyticsOrigin = (() => {
  try { return process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ? new URL(process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL).origin : ""; }
  catch { return ""; }
})();
const scriptSources = ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", analyticsOrigin].filter(Boolean).join(" ");
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSources}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://region1.google-analytics.com",
  "font-src 'self' data:",
  `connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com ${analyticsOrigin}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  typescript: { tsconfigPath: "tsconfig.vercel.json" },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      ],
    }];
  },
};

export default nextConfig;
