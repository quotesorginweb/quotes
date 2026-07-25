export const negativeKeywordRules = {
  exclude: [
    /\b(?:car|auto|home|renters|health|life|commercial)\s+insurance\b/i,
    /\b(?:stock|share|ticker|forex|crypto(?:currency)?)\s+quotes?\b/i,
    /\b(?:mortgage|shipping|freight|roofing|solar|plumbing|hvac)\s+quot(?:e|ation)s?\b/i,
    /\b(?:get|request)\s+(?:a\s+)?quote\b/i,
    /\bquotation marks?\b/i,
    /\b(?:mla|apa|citation)\b/i,
    /\bquota\b/i,
  ],
  review: [/\bmoving quotes?\b/i, /\bincorrect quote generator\b/i],
};

export function normalizeKeyword(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[“”‘’"']/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function classifyKeyword(value) {
  const normalized = normalizeKeyword(value);
  if (!normalized || normalized.length < 3) return { status: "exclude", reason: "invalid" };
  if (negativeKeywordRules.exclude.some((rule) => rule.test(normalized))) return { status: "exclude", reason: "negative-intent" };
  if (negativeKeywordRules.review.some((rule) => rule.test(normalized))) return { status: "review", reason: "ambiguous" };
  if (/\bquotes?\b|\bquotations?\b|\bsayings?\b/.test(normalized)) return { status: "valid", reason: "quotation-discovery" };
  return { status: "review", reason: "unclear-intent" };
}

export function opportunityScore({ volume = 0, difficulty = 100, relevance = 0, serp = 0, seasonality = 0, rightsRisk = 1, coverage = 1 }) {
  const demand = Math.log10(Math.max(1, volume) + 1) * 20;
  return Math.max(0, Math.min(100, Math.round(demand + (100 - difficulty) * .25 + relevance * 15 + serp * 5 + seasonality * 5 - rightsRisk * 15 - coverage * 10)));
}
