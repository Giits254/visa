"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data";

const AVATAR_PALETTES = [
  "bg-teal text-sand",
  "bg-gold text-night",
  "bg-night text-sand",
  "bg-teal-dark text-sand",
  "bg-gold-dark text-sand",
];

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-gold" : "fill-night/15"}`}
          aria-hidden
        >
          <path d="M10 1.6l2.47 5.24 5.78.68-4.3 3.98 1.16 5.7L10 14.9l-5.11 2.3 1.16-5.7-4.3-3.98 5.78-.68z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  function go(delta: number) {
    setIndex((current) => (current + delta + total) % total);
  }

  const t = testimonials[index];

  return (
    <section className="bg-gold/5 py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-dark">
            Applicant stories
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
            People who made the move.
          </h2>
          <p className="mt-4 text-ink/80">
            A few of the applicants who&apos;ve been through the Freelance
            Visa process with us.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-night/20 bg-white text-night shadow-sm transition hover:bg-night/5 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-night/10 bg-white shadow-sm">
            <div
              key={t.name}
              className="animate-rise p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${AVATAR_PALETTES[index % AVATAR_PALETTES.length]}`}
                  aria-hidden
                >
                  {initialsFor(t.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-night">{t.name}</p>
                  <p className="truncate text-xs text-ink/60">
                    {t.role ? `${t.role} · ` : "Applicant · "}
                    {t.destination}
                  </p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-dark sm:inline-flex">
                  Verified applicant
                </span>
              </div>

              <div className="mt-3">
                <StarRating rating={t.rating} />
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-ink/85">
                {t.quote}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-night/20 bg-white text-night shadow-sm transition hover:bg-night/5 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-2 bg-night/15 hover:bg-night/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
