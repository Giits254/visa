# Freelance Visa — Gulf Freelance & Remote Work Visa Platform

An informational and application website for a Gulf (GCC) "Freelance Visa"
guidance service — a visa that lets applicants live in a Gulf country while
working hybrid or onsite for clients/employers anywhere within the stated countries. Built with
Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS, deployed as
a Cloudflare Worker (via the OpenNext adapter) with a Cloudflare D1
database, Resend for email, and Paywave Express for M-Pesa STK push
payments.

## What's included

- **Home (`/`)** — hero, a "What is a Freelance Visa?" definition section,
  the 6 GCC destinations with validity/processing times, eligible applicant
  nationalities, the 4 core requirements, a 5-step process explainer
  (including the flat processing fee), general Gulf living/working
  information, tips, and an FAQ accordion.
- **Check eligibility (`/check-eligibility`)** — nationality, destination,
  work style, ID number and phone number → a simulated background check →
  a green "Freelance Visa Eligible" result stamp with visa route,
  processing time, flat fee, and the document checklist (passport photo,
  phone number, ID number, physical address).
- **Apply (`/apply`)** — a 4-step application: applicant details → address
  & documents → **Make Payment** (real M-Pesa STK push via Paywave Express,
  polled automatically until Safaricom confirms) → review & submit, ending
  in a paid confirmation with a printable invoice.
- **"Already applied?"** (in the header, every page) — a dialog where
  anyone can enter their reference/tracking code, M-Pesa transaction ID, or
  receipt number to look up an application's status, without any login.
- **Contact (`/contact`)** — sends a real email via Resend to the platform
  inbox (with an auto-reply acknowledgement to the sender), instead of the
  old simulated submit.
- **Cancellation Policy (`/cancellation-policy`)** — refund/cancellation
  terms tied to the $100 processing fee, linked from the footer and the
  application review step.

## How an application flows through the backend

1. **Make Payment** (step 3 of Apply) calls `/api/payment/initiate`, which
   validates the form, generates a unique reference/tracking code (e.g.
   `MV-2026-AB12CD`), starts an M-Pesa STK push via Paywave with that code
   as the payment reference, and saves the applicant's details to D1 with
   status `awaiting_payment`.
2. The Apply page polls `/api/payment/status` every few seconds. Paywave
   also POSTs to `/api/payment/callback` (a webhook you register with
   them) the moment the push resolves — whichever arrives first flips the
   application to `paid` (or `payment_failed` / `payment_cancelled`).
3. Once paid, **Review & submit** calls `/api/application/submit`, which
   marks the application `submitted` and sends two emails via Resend: a
   confirmation to the applicant (with their reference code) and a full
   notification to the platform inbox (with the passport photo attached —
   the photo itself is never stored in the database, only emailed).
4. Anyone can later check status via `/api/application/status`, used by
   the "Already applied?" dialog. It only returns non-identifying info
   (first name + last initial, destination, status) — never email, phone,
   ID number, or address — since any code holder, not just the applicant,
   can query it.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the D1 database

Either run:

```bash
npx wrangler d1 create freelancevisa
```

or create it from the Cloudflare dashboard (Workers & Pages → D1 → Create
database). Either way, take the `database_name` and `database_id` it gives
you and put them in `wrangler.jsonc` under `d1_databases[0]` (this repo is
already configured for a database named `freelancevisa`). Then load the
schema:

```bash
npm run db:migrate:local    # for `next dev` / local testing
npm run db:migrate:remote   # for the deployed Worker
```

Re-run `db:migrate:remote` any time `schema.sql` changes.

### 3. Get your API keys

- **Resend** (https://resend.com) — verify a sending domain, then create
  an API key. `RESEND_FROM_EMAIL` in `wrangler.jsonc` must be an address on
  that verified domain.
- **Paywave Express** — your account API key and the email your account is
  registered under.
- **Callback token** — make up any long random string yourself, e.g.
  `openssl rand -hex 24`. This is *not* provided by Paywave; it's a shared
  secret you invent so `/api/payment/callback` can reject requests that
  don't know it.

### 4. Set environment variables/secrets

Copy `.dev.vars.example` to `.dev.vars` (gitignored) and fill in real
values for local development:

```bash
cp .dev.vars.example .dev.vars
```

For production, set the same values as Worker secrets (never committed):

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put PAYWAVE_API_KEY
npx wrangler secret put PAYWAVE_EMAIL
npx wrangler secret put PAYWAVE_CALLBACK_TOKEN
```

Non-secret values (`RESEND_FROM_EMAIL`, `PLATFORM_EMAIL`,
`PAYWAVE_BASE_URL`) live directly in `wrangler.jsonc` under `"vars"` — edit
them there.

### 5. Register the Paywave callback URL

In your Paywave dashboard (or wherever their STK push callback URL is
configured), set it to:

```
https://<your-worker-domain>/api/payment/callback?token=<PAYWAVE_CALLBACK_TOKEN>
```

using the same value you set for `PAYWAVE_CALLBACK_TOKEN`. If Paywave
doesn't deliver the callback for some reason, the status-polling fallback
in `/api/payment/status` still resolves payment by calling `verifyPayment`
directly, so nothing gets stuck — but the callback is what makes
confirmation near-instant.

## Local development

```bash
npm run dev
```

Then open http://localhost:3000. Local dev reads bindings and secrets from
`.dev.vars` via `initOpenNextCloudflareForDev()` (already wired up in
`next.config.js`), so D1, Resend, and Paywave all work the same as in
production.

## Deploy

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` (packages the app as a Cloudflare
Worker via OpenNext) followed by `opennextjs-cloudflare deploy`. It
deploys to a **Cloudflare Worker**, not the classic Pages Functions
pipeline — Cloudflare's own current guidance for a Next.js app with API
routes. If you were deploying this project through a "Pages" project
before, point your domain at the new Worker instead (Workers support
custom domains directly in the dashboard); the two aren't the same
deployment target.

`npm run preview` builds and runs the Worker locally against the same
`workerd` runtime Cloudflare uses in production — good for a final check
before deploying.

## Known limitations / things to revisit

- **M-Pesa STK push is Kenya-only.** Paywave's endpoint
  (`paywavexpress.co.ke`) integrates with Safaricom's M-Pesa, which only
  works for Kenyan (`254…`) phone numbers. The apply form's phone-country
  selector lists several other countries (Uganda, Tanzania, etc.) whose
  applicants will get a failed STK push today. If you need to support
  those nationalities, you'll want either a separate payment rail for them
  or to restrict payment to Kenyan numbers with guidance for everyone else.
- **The status checker is intentionally low-detail.** It returns first
  name + last initial, destination, and status only — no email, phone, or
  address — since it has no login and anyone with a code can query it.
- **Passport photos aren't stored.** They're emailed to the platform inbox
  as an attachment at submission time and never written to D1. If you
  later want them retrievable from an admin view, that's a deliberate
  trade-off to revisit (see the project chat history for why it was made).
- **No admin view.** Applications live in D1 but there's currently no page
  to browse them — use `npx wrangler d1 execute freelancevisa --remote
  --command "SELECT * FROM applications ORDER BY created_at DESC"` (or
  Cloudflare's D1 dashboard) for now.
- Review the cancellation policy wording in `lib/data.ts`
  (`cancellationPolicy`) against local consumer-protection requirements
  before publishing — it's marked as a draft on the page itself.

## Design system

- **Palette**: harbor blue (`#1E3A4C`) replaces the earlier near-black
  dark tone, alongside sand (`#F3E9D7`), gold accent (`#C89B3C`), Gulf-sea
  teal (`#1D8A82`), and a dedicated success green (`#1F9D55`) used for
  eligibility results and payment confirmation — defined in
  `tailwind.config.ts`.
- **Type**: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono
  (data/stats) — loaded via `next/font/google` in `app/layout.tsx`.
- **Signature element**: the circular "visa stamp" (`components/StampBadge.tsx`),
  with gold/teal/success tones, used in the hero and as the
  eligibility/payment result.
- Content data (countries, requirements, fee, tips, FAQs, cancellation
  policy) lives in `lib/data.ts` — edit this file to update copy without
  touching components.

## Notes

- Fully responsive from small mobile widths up through large desktop.
- Reduced-motion is respected (see `app/globals.css`).
- Replace the placeholder contact details in `components/Footer.tsx` with
  the client's real details before launch.
