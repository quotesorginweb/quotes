# AI discovery review - 8 October 2026

## Prepared source changes

- Each SearchBox uses React useId for its input and label, including the desktop and mobile header instances. Search inputs have the native search type. Query submission and the existing 120-character limit are preserved.
- public/llms.txt provides a concise guide to public collections, source works, attribution, editorial verification, corrections and rights. It describes HTML/XML destinations honestly and does not claim that arbitrary text entered in the image maker is verified.
- e2e/ai-discovery.spec.ts checks the homepage, topic, author and quotation templates on desktop/mobile: status, canonical, expected indexability, JSON-LD, unique search IDs, label associations, actual search submission and every link in the discovery guide.
- scripts/ai-discovery-audit.mjs saves read-only Lighthouse measurements in outputs/ai-discovery-audit. Pass optional route arguments to limit a rerun. BASE_URL selects another deployment. Each route gets a fresh browser session; runtime trace errors are recorded as failures, not successful performance measurements.

## Policies preserved

Publication remains on hold at the user's earlier request. These local changes do not change the live site, deploy the pending ownership meta tag, enable a new provider or affect Anime.

The wildcard robots rules still allow public content and exclude /admin, /api and /report. No named AI crawler permissions were added. Individual quotation pages remain noindex/follow with a topic canonical; author indexability still depends on reviewed collection coverage.

WebMCP and agents.json remain deferred until a real agent consumer and useful executable capabilities are selected. Merely adding a meta tag, data-mcp-action attribute or generic manifest would not implement browser WebMCP.

## Validation and limitations

The 36 existing Node source tests and the Vinext production build passed. The build includes dist/client/llms.txt. Direct HTTP/HTML assertions passed for all four representative templates: successful responses, unique search IDs with exactly one associated label each, expected canonical/indexability and expected JSON-LD type. All 20 links in llms.txt returned HTTP 200, and the guide itself was served as text/plain. Live measurements refer to the currently published version, not this pending source revision.

All 10 focused Playwright cases passed across desktop Chrome and Pixel 7 mobile emulation, including real keyboard search submission, matching labels, schema/indexability and guide links. Initial test-harness issues were resolved: optional robots metadata is read without waiting for a missing element, compact header search submits with Enter because its button is intentionally hidden, and navigation/action waits are bounded. Redundant accessibility aggregation was removed from this focused regression suite; the existing accessibility suite and separate live Lighthouse findings remain distinct checks.

Initial live Lighthouse checks returned accessibility 100 for all four sampled pages; homepage/topic/author SEO scores were 100. The individual quotation's lower SEO score includes its intentional noindex policy. The first homepage lab performance score was 63, LCP approximately 2.49 seconds, CLS 0 and total blocking time approximately 1.81 seconds. This is one local lab run, not field Core Web Vitals or a stable benchmark.

The first shared-browser audit produced NO_NAVSTART trace errors for the remaining pages. Fresh-session retries for topic and author pages also failed to capture timing traces; the remaining repeated audit was stopped. Raw failures are retained as unverified performance. The homepage deprecation warnings point to Cloudflare's injected challenge script; both that script and the application framework contributed to scripting cost. No Cloudflare security settings were changed to improve a score.

## References

- https://llmstxt.org/
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://webmachinelearning.github.io/webmcp/
- https://developer.chrome.com/docs/ai/webmcp/declarative-api
- https://www.ietf.org/archive/id/draft-car-agents-txt-wellknown-00.html

## Release follow-up

When publication is authorized, publish the reviewed Quotes revision through its existing Sites deployment workflow. Then verify /llms.txt, its links and the hydrated desktop/mobile search controls on the live domain. A separate performance investigation should compare repeatable lab measurements and available field data before changing caching, hydration or hosting security configuration.
