import { freelanceVisaDefinition } from "@/lib/data";

export default function DefinitionSection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-dark">
          Definition
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-night sm:text-3xl">
          {freelanceVisaDefinition.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/75">
          {freelanceVisaDefinition.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <span className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink/70">
            Work fully online
          </span>
          <span className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink/70">
            Or hybrid, with local clients
          </span>
          <span className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink/70">
            Or fully onsite
          </span>
          <span className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink/70">
            No local sponsor required
          </span>
        </div>
      </div>
    </section>
  );
}
