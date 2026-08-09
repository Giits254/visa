# Manara — Gulf Visa Guidance Platform

An informational website for a Gulf (GCC) visa guidance service. Built with
Next.js 14 (App Router), React 18, TypeScript and Tailwind CSS.

## What's included

- **Home (`/`)** — hero, the 6 GCC destinations with fees/processing times,
  eligible applicant nationalities, core document requirements, a 4-step
  process explainer, general Gulf travel information, application tips, and
  an FAQ accordion.
- **Check eligibility (`/check-eligibility`)** — a simulated eligibility
  checker: pick nationality, destination and purpose, watch a short
  simulated background check, then get a result "stamp" with the visa
  route, processing time, fee estimate and a document checklist.
- **Apply (`/apply`)** — a 3-step simulated application form (traveler
  details → trip details → review & submit) ending in a confirmation
  screen with a reference number.

All eligibility/application logic is simulated client-side (no backend) —
wire it up to a real API or form service when ready.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start
```

## Design system

- **Palette**: deep indigo night (`#101B2D`), sand (`#F3E9D7`), gold accent
  (`#C89B3C`), Gulf-sea teal (`#1D8A82`) — defined in `tailwind.config.ts`.
- **Type**: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono
  (data/stats) — loaded via `next/font/google` in `app/layout.tsx`.
- **Signature element**: the circular "visa stamp" (`components/StampBadge.tsx`),
  used in the hero and as the eligibility/application result.
- Content data (countries, requirements, tips, FAQs) lives in `lib/data.ts`
  — edit this file to update copy without touching components.

## Notes

- Fully responsive from small mobile widths up through large desktop.
- Reduced-motion is respected (see `app/globals.css`).
- Replace the placeholder contact details in `components/Footer.tsx` with
  the client's real details before launch.
