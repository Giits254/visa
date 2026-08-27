import Image from "next/image";
import { partners } from "@/lib/data";

export default function PartnersSection() {
  return (
    <section className="border-t border-night/10 bg-night/[0.03] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
            Who we work with
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-night sm:text-3xl">
            Trusted across our destinations.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink/70">
            We coordinate with missions and processing contacts across each
            destination we cover, so your documents move through the right
            channel the first time.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10">
          {partners.map((partner) => (
            <div
              key={partner.slug}
              className="grayscale opacity-60 transition hover:opacity-100 hover:grayscale-0"
              title={partner.name}
            >
              <Image
                src={`/flags/${partner.slug}.png`}
                alt={partner.name}
                width={56}
                height={56}
                unoptimized
                className="h-12 w-12 rounded-full object-cover shadow-sm sm:h-14 sm:w-14"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}