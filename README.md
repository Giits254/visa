# Freelance Visa — Gulf Freelance & Remote Work Visa Platform

An informational and application website for a Gulf (GCC) "Freelance Visa"
guidance service — a visa that lets applicants live in a Gulf country while
working fully online or hybrid for clients/employers elsewhere. Built with
Next.js 14 (App Router), React 18, TypeScript and Tailwind CSS, configured
for static export (deployable to Cloudflare Pages, Netlify, Vercel, or any
static host).

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
- **Apply (`/apply`)** — a 3-step application (applicant details → address
  & documents → review & submit) → an M-Pesa payment screen (Buy Goods till
  number + step-by-step instructions, with a "Simulate payment
  confirmation" button standing in for the real M-Pesa/bank integration) →
  a paid confirmation with a printable invoice.
- **Cancellation Policy (`/cancellation-policy`)** — refund/cancellation
  terms tied to the $100 processing fee, linked from the footer and the
  application review step.

All eligibility/application/payment logic is simulated client-side (no
backend) — the "Simulate payment confirmation" button is explicitly a
stand-in for the real M-Pesa/bank integration, so stakeholders can preview
the post-payment experience before that integration exists.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build for production

```bash
npm run build
```

This produces a static export in `out/` (see `output: "export"` in
`next.config.js`) — ready to deploy to Cloudflare Pages (build command
`npx next build`, output directory `out`) or any static host.

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
- Replace the placeholder contact details in `components/Footer.tsx` and
  the M-Pesa till number in `lib/data.ts` (`MPESA_TILL_NUMBER`) with the
  client's real details before launch.
- Review the cancellation policy wording in `lib/data.ts`
  (`cancellationPolicy`) against local consumer-protection requirements
  before publishing — it's marked as a draft on the page itself.
