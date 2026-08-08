import { checkRateLimit, rateLimitHeaders } from "../../rate-limit";

export function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "reports");
  if (!rateLimit.allowed) return Response.json({ error: "Too many requests. Try again shortly." }, { status: 429, headers: rateLimitHeaders(rateLimit) });
  return Response.json(
    { error: "Online report storage is not enabled. Use the email reporting form." },
    { status: 503, headers: rateLimitHeaders(rateLimit) },
  );
}
