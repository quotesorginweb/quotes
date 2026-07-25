CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`reason` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `audit_log` (`entity_type`,`entity_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`full_name` text NOT NULL,
	`alternative_name` text,
	`biography` text,
	`birth_date` text,
	`death_date` text,
	`significance` text,
	`review_status` text DEFAULT 'draft' NOT NULL,
	`reviewer_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_slug_idx` ON `authors` (`slug`);--> statement-breakpoint
CREATE TABLE `daily_schedule` (
	`date` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`approved_by` text NOT NULL,
	`image_asset_id` text,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`image_asset_id`) REFERENCES `image_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `image_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text,
	`object_key` text NOT NULL,
	`format` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`alt_text` text NOT NULL,
	`license_url` text,
	`rights_status` text NOT NULL,
	`overflow_checked` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quote_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`reason` text NOT NULL,
	`suggested_correction` text,
	`source_evidence` text,
	`reporter_email` text,
	`moderation_status` text DEFAULT 'open' NOT NULL,
	`moderator_id` text,
	`resolved_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `quote_reports` (`moderation_status`,`created_at`);--> statement-breakpoint
CREATE TABLE `quote_taxonomies` (
	`quote_id` text NOT NULL,
	`taxonomy_id` text NOT NULL,
	`editorial_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`taxonomy_id`) REFERENCES `taxonomies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`exact_text` text NOT NULL,
	`normalized_text` text NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`author_id` text,
	`attributed_person` text,
	`fictional_speaker` text,
	`source_work_id` text,
	`source_location` text,
	`primary_source_url` text,
	`secondary_verification_url` text,
	`verification_status` text DEFAULT 'unverified' NOT NULL,
	`attribution_confidence` integer DEFAULT 0 NOT NULL,
	`misattribution_note` text,
	`public_domain_status` text DEFAULT 'unknown' NOT NULL,
	`rights_review_status` text DEFAULT 'review-required' NOT NULL,
	`copyright_note` text,
	`content_safety_labels` text DEFAULT '[]' NOT NULL,
	`quote_length` integer NOT NULL,
	`editorial_notes` text,
	`publication_status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`reviewed_at` text,
	`reviewer_id` text,
	`popularity_score` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_work_id`) REFERENCES `source_works`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_slug_idx` ON `quotes` (`slug`);--> statement-breakpoint
CREATE INDEX `quotes_normalized_text_idx` ON `quotes` (`normalized_text`);--> statement-breakpoint
CREATE INDEX `quotes_publication_idx` ON `quotes` (`publication_status`,`verification_status`);--> statement-breakpoint
CREATE TABLE `source_works` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`source_type` text NOT NULL,
	`creator` text,
	`publication_date` text,
	`primary_url` text,
	`secondary_url` text,
	`rights_status` text DEFAULT 'review-required' NOT NULL,
	`rights_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `taxonomies` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`publication_status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `taxonomies_type_slug_idx` ON `taxonomies` (`type`,`slug`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`role` text DEFAULT 'reviewer' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);