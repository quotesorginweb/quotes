import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { quoteReports } from "../../../db/schema";
import { publicQuotes } from "../../data";

const allowedReasons = new Set(["incorrect-author", "incorrect-wording", "incorrect-source", "rights-concern", "licensing-request", "general-enquiry"]);
const attempts = new Map<string, { count: number; resetAt: number }>();

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return Response.json({ error: "JSON required" }, { status: 415 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: "Cross-site submission blocked" }, { status: 403 });
  const key = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= 5) return Response.json({ error: "Please wait before submitting another message." }, { status: 429 });
  attempts.set(key, current && current.resetAt > now ? { ...current, count: current.count + 1 } : { count: 1, resetAt: now + 600_000 });
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (clean(body.website, 200)) return Response.json({ id: crypto.randomUUID(), status: "open" }, { status: 201 });
  const quoteId = clean(body.quoteId, 80);
  const reason = clean(body.reason, 80);
  const sourceEvidence = clean(body.sourceEvidence, 1000);
  if (!allowedReasons.has(reason)) return Response.json({ error: "Choose a valid reason" }, { status: 400 });
  const needsQuote = reason.startsWith("incorrect-");
  if (needsQuote && !publicQuotes.some((quote) => quote.id === quoteId)) return Response.json({ error: "Choose a published quote" }, { status: 400 });
  if (!quoteId && !clean(body.suggestedCorrection, 2000)) return Response.json({ error: "Add a quote or message" }, { status: 400 });
  if (sourceEvidence && !/^https?:\/\//i.test(sourceEvidence)) return Response.json({ error: "Evidence must be an HTTP(S) URL" }, { status: 400 });
  const reporter = await getChatGPTUser();
  const record = {
    id: crypto.randomUUID(),
    quoteId: quoteId || "general-enquiry",
    reason,
    suggestedCorrection: clean(body.suggestedCorrection, 2000) || null,
    sourceEvidence: sourceEvidence || null,
    reporterEmail: reporter?.email ?? (clean(body.reporterEmail, 254) || null),
  };
  await getDb().insert(quoteReports).values(record);
  return Response.json({ id: record.id, status: "open" }, { status: 201 });
}
