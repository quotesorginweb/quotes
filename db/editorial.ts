import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from ".";
import { auditLog, authors, quoteReports, quotes, sourceWorks, users } from "./schema";
import type { ChatGPTUser } from "../app/chatgpt-auth";

export type EditorialRole = "administrator" | "editor" | "reviewer" | "image-editor" | "analyst";
export type EditorialUser = { id: string; email: string; displayName: string | null; role: EditorialRole };

export async function requireEditorialUser(identity: ChatGPTUser, allowed?: EditorialRole[]): Promise<EditorialUser> {
  const db = getDb();
  const [existing] = await db.select().from(users).where(eq(users.email, identity.email)).limit(1);
  let current = existing as EditorialUser | undefined;
  if (existing && !existing.active) throw new Error("EDITORIAL_ACCESS_DENIED");
  if (!current) {
    const [{ value }] = await db.select({ value: count() }).from(users);
    if (value > 0) throw new Error("EDITORIAL_ACCESS_DENIED");
    current = { id: crypto.randomUUID(), email: identity.email, displayName: identity.fullName, role: "administrator" };
    await db.insert(users).values({ ...current, active: true });
    await writeAudit(current.id, "user", current.id, "bootstrap-administrator", null, current, "First owner-only editorial user");
  }
  if (allowed && !allowed.includes(current.role)) throw new Error("EDITORIAL_ACCESS_DENIED");
  return current;
}

export async function writeAudit(actorId: string, entityType: string, entityId: string, action: string, before: unknown, after: unknown, reason?: string) {
  await getDb().insert(auditLog).values({ id: crypto.randomUUID(), actorId, entityType, entityId, action, beforeJson: before ? JSON.stringify(before) : null, afterJson: after ? JSON.stringify(after) : null, reason: reason ?? null });
}

export async function getEditorialDashboard() {
  const db = getDb();
  const [quoteRows, reportRows, auditRows, openReports, published, reviewing] = await Promise.all([
    db.select({
      id: quotes.id, text: quotes.exactText, slug: quotes.slug, author: authors.fullName, source: sourceWorks.title,
      verification: quotes.verificationStatus, rights: quotes.rightsReviewStatus, status: quotes.publicationStatus,
      preparedById: quotes.preparedById, confidence: quotes.attributionConfidence,
    }).from(quotes).leftJoin(authors, eq(quotes.authorId, authors.id)).leftJoin(sourceWorks, eq(quotes.sourceWorkId, sourceWorks.id)).orderBy(desc(quotes.updatedAt)).limit(30),
    db.select().from(quoteReports).orderBy(desc(quoteReports.createdAt)).limit(20),
    db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(20),
    db.select({ value: count() }).from(quoteReports).where(eq(quoteReports.moderationStatus, "open")),
    db.select({ value: count() }).from(quotes).where(eq(quotes.publicationStatus, "published")),
    db.select({ value: count() }).from(quotes).where(eq(quotes.publicationStatus, "in-review")),
  ]);
  return { quotes: quoteRows, reports: reportRows, audit: auditRows, counts: { reports: openReports[0].value, published: published[0].value, review: reviewing[0].value } };
}

export async function createDraft(input: { text: string; author: string; source: string; sourceUrl: string; sourceLocation?: string }, editor: EditorialUser) {
  const db = getDb();
  const normalized = input.text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const duplicate = await db.select({ id: quotes.id }).from(quotes).where(eq(quotes.normalizedText, normalized)).limit(1);
  if (duplicate.length) throw new Error("DUPLICATE_QUOTE");
  const authorId = crypto.randomUUID(), sourceId = crypto.randomUUID(), quoteId = crypto.randomUUID();
  await db.insert(authors).values({ id: authorId, slug: `${input.author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${authorId.slice(0, 6)}`, fullName: input.author, reviewStatus: "draft" });
  await db.insert(sourceWorks).values({ id: sourceId, title: input.source, sourceType: "other", primaryUrl: input.sourceUrl, rightsStatus: "review-required" });
  await db.insert(quotes).values({
    id: quoteId, slug: `${normalized.split(" ").slice(0, 8).join("-")}-${quoteId.slice(0, 6)}`, exactText: input.text, normalizedText: normalized,
    authorId, sourceWorkId: sourceId, sourceLocation: input.sourceLocation ?? null, primarySourceUrl: input.sourceUrl,
    quoteLength: input.text.length, preparedById: editor.id, publicationStatus: "in-review",
  });
  await writeAudit(editor.id, "quote", quoteId, "created-draft", null, { ...input, publicationStatus: "in-review" });
  return quoteId;
}

export async function reviewQuote(id: string, action: "approve" | "reject" | "unpublish", reason: string, reviewer: EditorialUser) {
  const db = getDb();
  const [before] = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  if (!before) throw new Error("QUOTE_NOT_FOUND");
  if (before.preparedById === reviewer.id && reviewer.role !== "administrator") throw new Error("SECOND_REVIEWER_REQUIRED");
  if (action === "approve") {
    const eligible = ["verified-primary-source", "verified-reliable-secondary-source"].includes(before.verificationStatus) &&
      before.rightsReviewStatus === "approved" && before.attributionConfidence >= 80 && Boolean(before.primarySourceUrl);
    if (!eligible) throw new Error("PUBLICATION_CHECKS_FAILED");
  }
  const status = action === "approve" ? "published" : action === "reject" ? "rejected" : "unpublished";
  await db.update(quotes).set({ publicationStatus: status, reviewerId: reviewer.id, reviewedAt: new Date().toISOString(), publishedAt: status === "published" ? new Date().toISOString() : before.publishedAt }).where(eq(quotes.id, id));
  await writeAudit(reviewer.id, "quote", id, action, before, { publicationStatus: status }, reason);
}

export async function verifyEvidence(id: string, input: { verification: "verified-primary-source" | "verified-reliable-secondary-source"; rights: "public-domain" | "licensed"; confidence: number; note: string }, reviewer: EditorialUser) {
  const db = getDb();
  const [before] = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  if (!before) throw new Error("QUOTE_NOT_FOUND");
  if (!before.primarySourceUrl) throw new Error("SOURCE_URL_REQUIRED");
  await db.update(quotes).set({
    verificationStatus: input.verification, rightsReviewStatus: "approved", publicDomainStatus: input.rights,
    attributionConfidence: Math.max(0, Math.min(100, input.confidence)), editorialNotes: input.note,
  }).where(eq(quotes.id, id));
  await writeAudit(reviewer.id, "quote", id, "evidence-verified", before, input, input.note);
}

export async function resolveReport(id: string, moderator: EditorialUser) {
  const db = getDb();
  const [before] = await db.select().from(quoteReports).where(and(eq(quoteReports.id, id), eq(quoteReports.moderationStatus, "open"))).limit(1);
  if (!before) throw new Error("REPORT_NOT_FOUND");
  await db.update(quoteReports).set({ moderationStatus: "resolved", moderatorId: moderator.id, resolvedAt: new Date().toISOString() }).where(eq(quoteReports.id, id));
  await writeAudit(moderator.id, "quote-report", id, "resolved", before, { moderationStatus: "resolved" });
}
