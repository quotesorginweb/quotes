// Vercel does not provide Cloudflare Worker bindings. This shim lets the
// content site build there while database-backed API routes fail closed via
// the existing missing-binding check in db/index.ts.
export const env: { DB?: never } = {};
