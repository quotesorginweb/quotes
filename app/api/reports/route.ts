import { checkRateLimit, rateLimitHeaders } from "../../rate-limit";
import { getDb } from "../../../db";
import { publicMessages } from "../../../db/schema";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "reports");
  if (!rateLimit.allowed) return Response.json({ error: "Too many requests. Try again shortly." }, { status: 429, headers: rateLimitHeaders(rateLimit) });
  try {
    const input = await request.json() as Record<string, unknown>;
    if (String(input.website || "")) return Response.json({ received: true }, { headers: rateLimitHeaders(rateLimit) });
    const context = input.context === "contact" ? "contact" : "quote";
    const quoteReference = String(input.quoteId || "").trim().slice(0, 160);
    const reason = String(input.reason || "").trim().slice(0, 80);
    const message = String(input.suggestedCorrection || "").trim().slice(0, 2000);
    const sourceEvidence = String(input.sourceEvidence || "").trim().slice(0, 1000);
    const reporterEmail = String(input.reporterEmail || "").trim().slice(0, 254);
    if (!reason || (context === "quote" && !quoteReference) || (context === "contact" && !message)) {
      return Response.json({ error: "Required information is missing." }, { status: 400, headers: rateLimitHeaders(rateLimit) });
    }
    if (sourceEvidence && !/^https?:\/\//i.test(sourceEvidence)) {
      return Response.json({ error: "Source evidence must be a web address." }, { status: 400, headers: rateLimitHeaders(rateLimit) });
    }
    if (reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400, headers: rateLimitHeaders(rateLimit) });
    }
    const id = `QR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await getDb().insert(publicMessages).values({ id, context, quoteReference: quoteReference || null, reason, message: message || null, sourceEvidence: sourceEvidence || null, reporterEmail: reporterEmail || null });
    return Response.json({ received: true, caseId: id }, { status: 201, headers: rateLimitHeaders(rateLimit) });
  } catch {
    return Response.json({ error: "Your message could not be stored right now." }, { status: 503, headers: rateLimitHeaders(rateLimit) });
  }
}
