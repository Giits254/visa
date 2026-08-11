import { gulfCountries, eligibleApplicantCountries, PROCESSING_FEE_USD, PROCESSING_FEE_LABEL } from "@/lib/data";

export default function CountriesGrid() {
  return (
    <section id="destinations" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
          Where you can work
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
          Six destinations, one Freelance Visa process.
        </h2>
        <p className="mt-4 text-ink/70">
          Every Gulf country runs its own Freelance Visa route, validity and
          timeline — but every one of them costs a flat ${PROCESSING_FEE_USD}{" "}
          {PROCESSING_FEE_LABEL.toLowerCase()}.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gulfCountries.map((country) => (
          <div
            key={country.code}
            className="group rounded-2xl border border-night/10 bg-white/40 p-6 transition hover:border-teal/40 hover:shadow-stamp"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-night/40">
                {country.code}
              </span>
              <span className="rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[11px] font-medium text-teal-dark">
                {country.avgProcessing}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-night">
              {country.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{country.notes}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-night/10 bg-sand px-2.5 py-1 text-[11px] font-medium text-ink/70">
                {country.visaLabel}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-ink/50">Valid {country.validity}</p>
              <p className="font-mono text-sm font-medium text-gold-dark">
                ${PROCESSING_FEE_USD} flat
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-night/10 bg-night text-sand">
        <div className="grid grid-cols-1 gap-8 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Who can apply
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
              Applying from these countries
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-sand/65">
              Freelance Visa currently supports applicants travelling from
              the nationalities below. Don&apos;t see yours? Run the
              eligibility check anyway — many other nationalities also
              qualify.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {eligibleApplicantCountries.map((country) => (
              <span
                key={country}
                className="rounded-full border border-sand/15 px-3.5 py-1.5 text-sm text-sand/85"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
