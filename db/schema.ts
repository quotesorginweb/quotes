import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  role: text("role", { enum: ["administrator", "editor", "reviewer", "image-editor", "analyst"] }).notNull().default("reviewer"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (table) => [uniqueIndex("users_email_idx").on(table.email)]);

export const authors = sqliteTable("authors", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  fullName: text("full_name").notNull(),
  alternativeName: text("alternative_name"),
  biography: text("biography"),
  birthDate: text("birth_date"),
  deathDate: text("death_date"),
  significance: text("significance"),
  reviewStatus: text("review_status").notNull().default("draft"),
  reviewerId: text("reviewer_id").references(() => users.id),
  ...timestamps,
}, (table) => [uniqueIndex("authors_slug_idx").on(table.slug)]);

export const sourceWorks = sqliteTable("source_works", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  sourceType: text("source_type").notNull(),
  creator: text("creator"),
  publicationDate: text("publication_date"),
  primaryUrl: text("primary_url"),
  secondaryUrl: text("secondary_url"),
  rightsStatus: text("rights_status").notNull().default("review-required"),
  rightsNote: text("rights_note"),
  ...timestamps,
});

export const quotes = sqliteTable("quotes", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  exactText: text("exact_text").notNull(),
  normalizedText: text("normalized_text").notNull(),
  language: text("language").notNull().default("en"),
  authorId: text("author_id").references(() => authors.id),
  attributedPerson: text("attributed_person"),
  fictionalSpeaker: text("fictional_speaker"),
  sourceWorkId: text("source_work_id").references(() => sourceWorks.id),
  sourceLocation: text("source_location"),
  primarySourceUrl: text("primary_source_url"),
  secondaryVerificationUrl: text("secondary_verification_url"),
  verificationStatus: text("verification_status", { enum: ["verified-primary-source", "verified-reliable-secondary-source", "commonly-attributed", "misattributed", "unverified", "rejected"] }).notNull().default("unverified"),
  attributionConfidence: integer("attribution_confidence").notNull().default(0),
  misattributionNote: text("misattribution_note"),
  publicDomainStatus: text("public_domain_status").notNull().default("unknown"),
  rightsReviewStatus: text("rights_review_status").notNull().default("review-required"),
  copyrightNote: text("copyright_note"),
  contentSafetyLabels: text("content_safety_labels").notNull().default("[]"),
  quoteLength: integer("quote_length").notNull(),
  editorialNotes: text("editorial_notes"),
  preparedById: text("prepared_by_id").references(() => users.id),
  publicationStatus: text("publication_status", { enum: ["draft", "in-review", "scheduled", "published", "unpublished", "rejected"] }).notNull().default("draft"),
  publishedAt: text("published_at"),
  reviewedAt: text("reviewed_at"),
  reviewerId: text("reviewer_id").references(() => users.id),
  popularityScore: integer("popularity_score").notNull().default(0),
  ...timestamps,
}, (table) => [
  uniqueIndex("quotes_slug_idx").on(table.slug),
  index("quotes_normalized_text_idx").on(table.normalizedText),
  index("quotes_publication_idx").on(table.publicationStatus, table.verificationStatus),
]);

export const taxonomies = sqliteTable("taxonomies", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["topic", "mood", "occasion", "audience"] }).notNull(),
  slug: text("slug").notNull(),
  label: text("label").notNull(),
  publicationStatus: text("publication_status").notNull().default("draft"),
  ...timestamps,
}, (table) => [uniqueIndex("taxonomies_type_slug_idx").on(table.type, table.slug)]);

export const quoteTaxonomies = sqliteTable("quote_taxonomies", {
  quoteId: text("quote_id").notNull().references(() => quotes.id),
  taxonomyId: text("taxonomy_id").notNull().references(() => taxonomies.id),
  editorialOrder: integer("editorial_order").notNull().default(0),
});

export const imageAssets = sqliteTable("image_assets", {
  id: text("id").primaryKey(),
  quoteId: text("quote_id").references(() => quotes.id),
  objectKey: text("object_key").notNull(),
  format: text("format").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  altText: text("alt_text").notNull(),
  licenseUrl: text("license_url"),
  rightsStatus: text("rights_status").notNull(),
  overflowChecked: integer("overflow_checked", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const dailySchedule = sqliteTable("daily_schedule", {
  date: text("date").primaryKey(),
  quoteId: text("quote_id").notNull().references(() => quotes.id),
  approvedBy: text("approved_by").notNull().references(() => users.id),
  imageAssetId: text("image_asset_id").references(() => imageAssets.id),
  timezone: text("timezone").notNull().default("UTC"),
  publishedAt: text("published_at"),
  ...timestamps,
});

export const quoteReports = sqliteTable("quote_reports", {
  id: text("id").primaryKey(),
  quoteId: text("quote_id").notNull().references(() => quotes.id),
  reason: text("reason").notNull(),
  suggestedCorrection: text("suggested_correction"),
  sourceEvidence: text("source_evidence"),
  reporterEmail: text("reporter_email"),
  moderationStatus: text("moderation_status").notNull().default("open"),
  moderatorId: text("moderator_id").references(() => users.id),
  resolvedAt: text("resolved_at"),
  ...timestamps,
}, (table) => [index("reports_status_idx").on(table.moderationStatus, table.createdAt)]);

export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").references(() => users.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  beforeJson: text("before_json"),
  afterJson: text("after_json"),
  reason: text("reason"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("audit_entity_idx").on(table.entityType, table.entityId, table.createdAt)]);
