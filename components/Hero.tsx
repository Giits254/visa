import Image from "next/image";
import Link from "next/link";
import { destinations, PROCESSING_FEE_USD } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand text-night">
      <Image
        src="/image2.png"
        alt="Traveller crossing the tarmac with a passport and carry-on, ready to depart"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[65%_25%]"
      />
      {/* Scrim built from the sand token, not a raw hex: opaque over the copy, sheer further right so the photo reads */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sand via-sand/55 to-sand/0"
        aria-hidden
      />
      {/* Mobile: vertical fade so text sits on solid ground */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sand via-sand/35 to-transparent opacity-90 lg:hidden"
        aria-hidden
      />
      {/* Mobile: horizontal fade too, since the image spans full width behind the card at narrow sizes */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-sand/70 via-transparent to-transparent lg:hidden"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div className="animate-rise">
        <p className="font-mono text-lg uppercase tracking-[0.25em] text-gold-dark">
        Freelance Visa
      </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            <span className="text-gold-dark">Working Abroad Made Easier.</span>
            <br />
            <span className="text-night">Your Freelance Visa Journey, Simplified</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">
            Freelance Visa is your guide to living legally in the UAE, Saudi
            Arabia, Qatar, Kuwait, Bahrain, Oman, or Australia — onsite or
            hybrid. Start with a free eligibility check, then apply for a flat
            processing fee.
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
              className="rounded-full border border-night/20 px-6 py-3.5 text-center text-sm font-medium text-night transition hover:border-gold hover:text-gold-dark"
            >
              Apply for a Freelance Visa
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-night/10 pt-8">
            <div>
              <dt className="font-mono text-2xl font-medium text-gold-dark sm:text-3xl">7</dt>
              <dd className="mt-1 text-xs text-ink/60 sm:text-sm">Destinations covered</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-medium text-gold-dark sm:text-3xl">1–10</dt>
              <dd className="mt-1 text-xs text-ink/60 sm:text-sm">Typical business days</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-medium text-gold-dark sm:text-3xl">From ${PROCESSING_FEE_USD}</dt>
              <dd className="mt-1 text-xs text-ink/60 sm:text-sm">Processing fee</dd>
            </div>
          </dl>
        </div>

        <div className="lg:mt-10 lg:justify-self-end">
        </div>
      </div>
    </section>
  );
}