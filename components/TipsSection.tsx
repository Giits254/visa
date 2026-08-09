import { tips } from "@/lib/data";

export default function TipsSection() {
  return (
    <section id="tips" className="scroll-mt-20 bg-night py-20 text-sand">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
            Field notes
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Small details that decide approvals.
          </h2>
          <p className="mt-4 text-sand/65">
            These come up again and again in applications we&apos;ve reviewed —
            worth checking before you submit.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-sand/10 bg-night-light/50 p-6"
            >
              <h3 className="font-display text-base font-semibold text-gold-light">
                {tip.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sand/65">
                {tip.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
