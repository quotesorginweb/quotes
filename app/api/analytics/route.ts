import { getDb } from "../../../db";
import { siteEvents } from "../../../db/schema";
import { checkRateLimit, rateLimitHeaders } from "../../rate-limit";

const allowedEvents = new Set([
  "page_view",
  "web_vital",
  "quote_copy",
  "quote_share",
  "quote_save",
  "quote_unsave",
  "image_export",
  "search",
]);

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "analytics", 60);
  if (!rateLimit.allowed) return new Response(null, { status: 429, headers: rateLimitHeaders(rateLimit) });
  try {
    const input = await request.json() as Record<string, unknown>;
    const eventName = String(input.eventName || "").slice(0, 40);
    if (!allowedEvents.has(eventName)) return Response.json({ error: "Unsupported event." }, { status: 400, headers: rateLimitHeaders(rateLimit) });
    const path = String(input.path || "/").slice(0, 240);
    const rawProperties = input.properties && typeof input.properties === "object" ? input.properties as Record<string, unknown> : {};
    const properties = Object.fromEntries(Object.entries(rawProperties).slice(0, 10).map(([key, value]) => [key.slice(0, 40), String(value).slice(0, 160)]));
    const metricValue = typeof input.metricValue === "number" && Number.isFinite(input.metricValue) ? input.metricValue : null;
    const metricRating = ["good", "needs-improvement", "poor"].includes(String(input.metricRating)) ? String(input.metricRating) : null;
    await getDb().insert(siteEvents).values({ id: crypto.randomUUID(), eventName, path, propertiesJson: JSON.stringify(properties), metricValue, metricRating });
    return new Response(null, { status: 204, headers: rateLimitHeaders(rateLimit) });
  } catch {
    return Response.json({ error: "Event could not be recorded." }, { status: 503, headers: rateLimitHeaders(rateLimit) });
  }
}
