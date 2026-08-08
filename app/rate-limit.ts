type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(request: Request, scope: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || request.headers.get("cf-connecting-ip") || "unknown";
  const key = `${scope}:${client}`;
  const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
  bucket.count += 1;
  buckets.set(key, bucket);
  if (buckets.size > 2_000) for (const [entry, value] of buckets) if (value.resetAt <= now) buckets.delete(entry);
  return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
}

export function rateLimitHeaders(result: ReturnType<typeof checkRateLimit>) {
  return { "RateLimit-Limit": "10", "RateLimit-Remaining": String(result.remaining), "RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)) };
}
