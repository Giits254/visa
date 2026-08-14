import Link from "next/link";
import { processSteps } from "@/lib/data";

export default function ProcessTimeline() {
  return (
    <section id="process" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
          How it works
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
          Five steps, in this order.
        </h2>
        <p className="mt-4 text-ink/80">
          Skipping step one is the most common reason Freelance Visa
          applications stall. Confirm eligibility before you gather
          documents or pay any fee.
        </p>
      </div>

      <ol className="mt-12 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((s, i) => (
          <li key={s.step} className="relative border-t border-night/15 pt-6 pr-6">
            <span className="font-mono text-xs text-gold-dark">{s.step}</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-night">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{s.detail}</p>
            {i < processSteps.length - 1 && (
              <span
                className="absolute right-0 top-0 hidden h-px w-6 -translate-y-px bg-gold sm:block"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-teal/20 bg-teal/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-night">
            Processing typically takes 1–5 business days (5–10 for Australia).
          </p>
          <p className="mt-1 text-sm text-ink/75">
            We still recommend applying at least 2–3 weeks before travel to
            allow room for document corrections or peak-season delays.
          </p>
        </div>
        <Link
          href="/check-eligibility"
          className="whitespace-nowrap rounded-full bg-night px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-teal-dark"
        >
          Start step one
        </Link>
      </div>
    </section>
  );
}
