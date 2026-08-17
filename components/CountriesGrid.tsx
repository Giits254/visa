import Image from "next/image";
import { destinations, eligibleApplicantCountries, PROCESSING_FEE_USD, AUSTRALIA_FEE_USD } from "@/lib/data";

// Maps each country to its photo. Filenames as provided — dubai is the odd one out on .png.
// NOTE: adjust these keys if your `country.code` values differ from standard ISO codes.
const countryImages: Record<string, { src: string; alt: string }> = {
  AE: { src: "/countries/dubai.png", alt: "Dubai skyline at dusk" },
  KSA: { src: "/countries/saudi.jpg", alt: "Saudi Arabia cityscape" },
  QA: { src: "/countries/qatar.jpg", alt: "Doha skyline along the corniche" },
  KW: { src: "/countries/kuwait.jpg", alt: "Kuwait City waterfront" },
  BH: { src: "/countries/bahrain.jpg", alt: "Manama skyline" },
  OM: { src: "/countries/oman.jpg", alt: "Muscat coastline and mountains" },
  AU: { src: "/countries/australia.jpg", alt: "Australian coastline" },
};

// Region + accent color per country. Add new countries here as your eligibility list grows —
// anything not listed falls into "Other" automatically rather than being dropped.
const REGION_MAP: Record<string, string> = {
  Kenya: "East Africa",
  Uganda: "East Africa",
  Tanzania: "East Africa",
  Rwanda: "East Africa",
  Ethiopia: "East Africa",
  Nigeria: "Southern & West Africa",
  Ghana: "Southern & West Africa",
  "South Africa": "Southern & West Africa",
  Zambia: "Southern & West Africa",
  Malawi: "Southern & West Africa",
  India: "South & Southeast Asia",
  Philippines: "South & Southeast Asia",
  Pakistan: "South & Southeast Asia",
  Bangladesh: "South & Southeast Asia",
  "Sri Lanka": "South & Southeast Asia",
  Indonesia: "South & Southeast Asia",
};

const REGION_ORDER = ["East Africa", "Southern & West Africa", "South & Southeast Asia", "Other"];
const REGION_ACCENTS: Record<string, string> = {
  "East Africa": "#C99A3E", // gold
  "Southern & West Africa": "#4FA8A0", // teal
  "South & Southeast Asia": "#E7DFCF", // sand
  Other: "#8A94A6",
};

function groupByRegion(countries: string[]) {
  const buckets = new Map<string, string[]>();
  for (const country of countries) {
    const region = REGION_MAP[country] ?? "Other";
    if (!buckets.has(region)) buckets.set(region, []);
    buckets.get(region)!.push(country);
  }
  return REGION_ORDER.filter((region) => buckets.has(region)).map((region) => ({
    region,
    countries: buckets.get(region)!,
    accent: REGION_ACCENTS[region],
  }));
}

export default function CountriesGrid() {
  return (
    <section id="destinations" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
          Where you can work
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
          Seven destinations, one Freelance Visa process.
        </h2>
        <p className="mt-4 text-ink/80">
          Each destination runs its own Freelance Visa route, validity and
          timeline. The processing fee is ${PROCESSING_FEE_USD} USD for our
          Gulf destinations and ${AUSTRALIA_FEE_USD} USD for Australia.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((country) => {
          const image = countryImages[country.code];

          return (
            <div
              key={country.code}
              className="group overflow-hidden rounded-2xl border border-night/10 bg-white/40 transition hover:border-teal/40 hover:shadow-stamp"
            >
              {image && (
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[15%] transition duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                  {/* Ties the photo into the sand/night palette instead of sitting as a raw cutout */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/55 via-night/10 to-transparent"
                    aria-hidden
                  />
                  {/* Fades the bottom edge into the card's own background so the photo doesn't hard-cut */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/60 to-transparent"
                    aria-hidden
                  />
                  {/* Country code as a stamp, overlapping the photo like a visa mark */}
                  <span className="absolute bottom-3 left-4 rounded-full border border-sand/40 bg-night/40 px-2.5 py-1 font-mono text-xs font-medium text-sand backdrop-blur-sm">
                    {country.code}
                  </span>
                  <span className="absolute bottom-3 right-4 rounded-full bg-sand/90 px-2.5 py-1 font-mono text-[11px] font-medium text-teal-dark">
                    {country.avgProcessing}
                  </span>
                </div>
              )}

              <div className="p-6">
                {!image && (
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-night/40">
                      {country.code}
                    </span>
                    <span className="rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[11px] font-medium text-teal-dark">
                      {country.avgProcessing}
                    </span>
                  </div>
                )}
                <h3 className={image ? "font-display text-lg font-semibold text-night" : "mt-4 font-display text-lg font-semibold text-night"}>
                  {country.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{country.notes}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-night/10 bg-sand px-2.5 py-1 text-[11px] font-medium text-ink/80">
                    {country.visaLabel}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-ink/70">Valid {country.validity}</p>
                  <p className="font-mono text-sm font-medium text-gold-dark">
                    ${country.feeUSD} fee
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 rounded-2xl border border-night/10 bg-night text-sand">
        <div className="p-8 sm:p-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Who can apply
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
              Applying from these countries
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-sand/65">
              Freelance Visa currently supports {eligibleApplicantCountries.length}{" "}
              nationalities across three regions. Don&apos;t see yours? Run
              the eligibility check anyway — many other nationalities also
              qualify.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-sand/10 pt-8 sm:grid-cols-3">
            {groupByRegion(eligibleApplicantCountries).map((group) => (
              <div key={group.region}>
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: group.accent }}
                    aria-hidden
                  />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sand/50">
                    {group.region}
                  </p>
                </div>
                <ul className="mt-3">
                  {group.countries.map((country) => (
                    <li
                      key={country}
                      className="border-b border-sand/[0.07] py-2 text-sm text-sand/85 last:border-0"
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}