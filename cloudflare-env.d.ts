// Hand-written Cloudflare bindings/env typing (kept in sync with wrangler.jsonc).
// Regenerate with `npm run cf-typegen` any time bindings change, or just
// edit this file directly — it's small and explicit on purpose.
/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  // Bindings
  DB: D1Database;

  // Non-secret vars (set in wrangler.jsonc "vars")
  RESEND_FROM_EMAIL: string;
  PLATFORM_EMAIL: string;
  PAYWAVE_BASE_URL: string;

  // Secrets (set with `wrangler secret put <NAME>` in production, and in
  // .dev.vars for local development — never committed)
  RESEND_API_KEY: string;
  PAYWAVE_API_KEY: string;
  PAYWAVE_EMAIL: string;
  // Shared token appended as ?token=... to the Paywave callback URL you
  // register, so /api/payment/callback can reject requests that don't know
  // it. Make up any long random string.
  PAYWAVE_CALLBACK_TOKEN: string;
}
