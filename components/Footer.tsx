import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-night text-sand/80">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold text-sm font-display font-semibold text-gold">
                F
              </span>
              <span className="font-display text-lg font-semibold text-sand">Freelance Visa</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/60">
              Independent guidance and application support for Freelance Visa
              applicants across the Gulf. We are not a government authority
              or embassy.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              Destinations
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-sand/70">
              <li>United Arab Emirates</li>
              <li>Saudi Arabia</li>
              <li>Qatar</li>
              <li>Kuwait</li>
              <li>Bahrain</li>
              <li>Oman</li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-sand/70">
              <li><a href="/#requirements" className="hover:text-teal-light">Requirements</a></li>
              <li><a href="/#process" className="hover:text-teal-light">How it works</a></li>
              <li><a href="/#faq" className="hover:text-teal-light">FAQs</a></li>
              <li><Link href="/check-eligibility" className="hover:text-teal-light">Check eligibility</Link></li>
              <li><Link href="/apply" className="hover:text-teal-light">Apply now</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-teal-light">Cancellation policy</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-sand/70">
              <li>Nairobi, Kenya</li>
              <li>hello@freelancevisa.co</li>
              <li>+254 700 000 000</li>
              <li>Mon–Fri, 8:00–17:00 EAT</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-sand/10 pt-6 text-xs text-sand/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Freelance Visa. All rights reserved.</p>
          <p>Freelance Visa is an independent guidance and application service and is not affiliated with any embassy or consulate.</p>
        </div>
      </div>
    </footer>
  );
}
