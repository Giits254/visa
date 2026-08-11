import { coreRequirements } from "@/lib/data";

export default function RequirementsSection() {
  return (
    <section id="requirements" className="scroll-mt-20 bg-sand-dim/60 py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
            What you&apos;ll need
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
            What every Freelance Visa application needs.
          </h2>
          <p className="mt-4 text-ink/70">
            These four apply to every Freelance Visa, regardless of
            destination. Your eligibility check confirms these against your
            specific case.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-night/10 bg-night/10 sm:grid-cols-2 lg:grid-cols-4">
          {coreRequirements.map((req) => (
            <div key={req.title} className="bg-sand p-6">
              <h3 className="font-display text-base font-semibold text-night">
                {req.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{req.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
