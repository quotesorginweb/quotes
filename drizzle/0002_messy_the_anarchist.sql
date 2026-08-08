CREATE TABLE `public_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`context` text NOT NULL,
	`quote_reference` text,
	`reason` text NOT NULL,
	`message` text,
	`source_evidence` text,
	`reporter_email` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `public_messages_status_created_idx` ON `public_messages` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `site_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`path` text NOT NULL,
	`properties_json` text DEFAULT '{}' NOT NULL,
	`metric_value` real,
	`metric_rating` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `site_events_name_created_idx` ON `site_events` (`event_name`,`created_at`);--> statement-breakpoint
CREATE INDEX `site_events_path_created_idx` ON `site_events` (`path`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
