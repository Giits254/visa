import { tips } from "@/lib/data";

export default function TipsSection() {
  return (
    <section id="tips" className="scroll-mt-20 bg-teal/5 py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
            Field notes
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
            Small details that decide approvals.
          </h2>
          <p className="mt-4 text-ink/75">
            These come up again and again in applications we&apos;ve reviewed —
            worth checking before you submit.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-night/10 bg-white p-6 shadow-sm"
            >
              <h3 className="font-display text-base font-semibold text-night">
                {tip.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {tip.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
