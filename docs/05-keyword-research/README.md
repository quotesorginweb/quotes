# Keyword research workflow

Raw SEMrush exports remain private and outside `public/`. Import normalizes comparison text while retaining the original keyword, deduplicates close variants, classifies negative and ambiguous intent, clusters topics, calculates a transparent opportunity score and creates review-queue proposals only.

The shared rules live in `scripts/keyword-classifier.mjs`. Ambiguous terms such as “moving quotes” require manual review. Intent labels are evidence, not publication authority.
