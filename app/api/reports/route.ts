import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { quoteReports } from "../../../db/schema";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return Response.json({ error: "JSON required" }, { status: 415 });
  const body = await request.json() as Record<string, unknown>;
  const quoteId = clean(body.quoteId, 80);
  const reason = clean(body.reason, 80);
  const sourceEvidence = clean(body.sourceEvidence, 1000);
  if (!quoteId || !reason) return Response.json({ error: "Quote and reason are required" }, { status: 400 });
  if (sourceEvidence && !/^https?:\/\//i.test(sourceEvidence)) return Response.json({ error: "Evidence must be an HTTP(S) URL" }, { status: 400 });
  const reporter = await getChatGPTUser();
  const record = {
    id: crypto.randomUUID(),
    quoteId,
    reason,
    suggestedCorrection: clean(body.suggestedCorrection, 2000) || null,
    sourceEvidence: sourceEvidence || null,
    reporterEmail: reporter?.email ?? (clean(body.reporterEmail, 254) || null),
  };
  await getDb().insert(quoteReports).values(record);
  return Response.json({ id: record.id, status: "open" }, { status: 201 });
}
