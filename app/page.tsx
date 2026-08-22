import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import DefinitionSection from "@/components/DefinitionSection";
import PartnersSection from "@/components/PartnersSection";
import CountriesGrid from "@/components/CountriesGrid";
import RequirementsSection from "@/components/RequirementsSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import TravelInfoSection from "@/components/TravelInfoSection";
import TipsSection from "@/components/TipsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsSection />
        <DefinitionSection />
        <CountriesGrid />
        <RequirementsSection />
        <ProcessTimeline />
        <TravelInfoSection />
        <TipsSection />
        <TestimonialsSection />
        <FAQSection />

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-night/10 bg-gold/10 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-night sm:text-3xl">
                Ready to see what your application needs?
              </h2>
              <p className="mt-2 max-w-md text-sm text-ink/75">
                The eligibility check takes about a minute and doesn&apos;t
                require any payment or document upload.
              </p>
            </div>
            <Link
              href="/check-eligibility"
              className="whitespace-nowrap rounded-full bg-night px-6 py-3.5 text-sm font-semibold text-sand transition hover:bg-teal-dark"
            >
              Check my eligibility
            </Link>
          </div>
        </section>
      </main>
      <PartnersSection />
      <Footer />
    </>
  );
}
