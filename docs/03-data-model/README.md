# Data model summary

Core production entities: Quote, Author, SourceWork, Topic, Mood, Occasion, Audience, ImageAsset, DailySchedule, Report, EditorialReview, RightsReview, User, Role and AuditLog.

`Quote` stores a stable public ID, exact and normalized text, language, author/attributed person/fictional speaker, source locations and URLs, verification confidence, misattribution notes, public-domain and rights state, taxonomy links, safety labels, editorial state, review timestamps and engagement aggregates.

Publication is an explicit state transition. Only `verified-primary-source` and `verified-reliable-secondary-source` records may enter the public repository in the initial policy. Stable public IDs must be used instead of sequential database IDs.
