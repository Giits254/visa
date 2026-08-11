import Link from "next/link";
import StampBadge from "./StampBadge";
import { PROCESSING_FEE_USD } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-night text-sand">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #F3E9D7 0px, #F3E9D7 1px, transparent 1px, transparent 26px)",
        }}
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div className="animate-rise">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
            Freelance Visa Guidance · Est. from Nairobi
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Your Freelance Visa,
            <br />
            understood before you apply.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-sand/70 sm:text-lg">
            Freelance Visa walks you through what it takes to live and work —
            online, hybrid, or onsite — in the UAE, Saudi Arabia, Qatar, Kuwait,
            Bahrain, Oman, or Australia. Start with a free eligibility check,
            then apply for a flat ${PROCESSING_FEE_USD} processing fee.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/check-eligibility"
              className="rounded-full bg-gold px-6 py-3.5 text-center text-sm font-semibold text-night transition hover:bg-gold-light"
            >
              Check my eligibility
            </Link>
            <Link
              href="/apply"
              className="rounded-full border border-sand/25 px-6 py-3.5 text-center text-sm font-medium text-sand transition hover:border-teal-light hover:text-teal-light"
            >
              Apply for a Freelance Visa
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-sand/10 pt-8">
            <div>
              <dt className="font-mono text-2xl font-medium text-gold sm:text-3xl">7</dt>
              <dd className="mt-1 text-xs text-sand/60 sm:text-sm">Destinations covered</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-medium text-gold sm:text-3xl">1–3</dt>
              <dd className="mt-1 text-xs text-sand/60 sm:text-sm">Typical business days</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-medium text-gold sm:text-3xl">${PROCESSING_FEE_USD}</dt>
              <dd className="mt-1 text-xs text-sand/60 sm:text-sm">Flat Freelance Visa fee</dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-sand/10 bg-night-light/40 sm:h-80 sm:w-80">
            <div className="perforated absolute inset-4 rounded-full opacity-40" aria-hidden />
            <StampBadge label="Freelance Visa" sublabel="Eligibility Verified" size={200} />
          </div>
        </div>
      </div>
    </section>
  );
}


