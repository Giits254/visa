import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="border-b border-night/10 bg-night text-sand">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              About us
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              We built the guide we wished existed.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/70 sm:text-base">
              Freelance Visa exists to make one specific, confusing process
              clear: moving abroad without giving up the work you already do.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="space-y-6 text-base leading-relaxed text-ink/80">
            <p>
              We started Freelance Visa from Nairobi after watching too many
              remote workers and freelancers get tangled in visa processes
              built for tourists or in-country employees — neither of which
              describes someone earning a living online, onsite, or in a
              hybrid mix of both while based abroad.
            </p>
            <p>
              The Freelance Visa route exists precisely for that gap: it lets
              you live legally in a destination country while your income
              keeps coming from clients or an employer elsewhere, with no
              local sponsor required. Our job is to make that route
              understandable — clear eligibility, a straightforward
              document checklist, transparent pricing, and a status you can
              actually track.
            </p>
            <p>
              We currently guide applicants from 16 nationalities across
              Africa and Asia into seven destinations — the UAE, Saudi
              Arabia, Qatar, Kuwait, Bahrain, Oman, and Australia — and
              we&apos;re adding more as we go.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-night/10 bg-white p-6">
              <p className="font-display text-2xl font-semibold text-night">7</p>
              <p className="mt-1 text-sm text-ink/70">Destinations guided</p>
            </div>
            <div className="rounded-2xl border border-night/10 bg-white p-6">
              <p className="font-display text-2xl font-semibold text-night">16+</p>
              <p className="mt-1 text-sm text-ink/70">Applicant nationalities</p>
            </div>
            <div className="rounded-2xl border border-night/10 bg-white p-6">
              <p className="font-display text-2xl font-semibold text-night">2 yrs</p>
              <p className="mt-1 text-sm text-ink/70">Typical visa validity</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-night/10 bg-gold/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-lg font-semibold text-night">
                Have questions before you start?
              </p>
              <p className="mt-1 text-sm text-ink/70">
                Reach out — we're happy to talk through your situation.
              </p>
            </div>
            <Link
              href="/contact"
              className="whitespace-nowrap rounded-full bg-night px-6 py-3 text-center text-sm font-medium text-sand transition hover:bg-teal-dark"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
