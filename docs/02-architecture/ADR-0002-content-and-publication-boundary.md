# ADR-0002: Content and publication boundary

Status: Accepted — 25 July 2026

Public routes consume a repository that returns only published records with an approved verification status. Draft, unverified, commonly attributed, misattributed, rejected, sensitive, and rights-review records remain in the editorial layer. Search, sitemaps, daily selection, and related-content logic must use the same boundary.

The current deployable milestone uses typed seed records. Production content moves to PostgreSQL through a typed repository without changing page templates. Generated images belong in S3/R2-compatible object storage. The Sites preview can use its managed runtime, but it is not the system of record for production editorial content.
