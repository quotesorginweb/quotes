export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
  if (!src) return null;
  return <script defer src={src} data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || "quotes.org.in"} data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID} />;
}
