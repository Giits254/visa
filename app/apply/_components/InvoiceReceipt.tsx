import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampBadge from "@/components/StampBadge";
import { destinations } from "@/lib/data";
import { FormState, formatInternationalPhone } from "./types";

type Destination = (typeof destinations)[number];

type InvoiceReceiptProps = {
  form: FormState;
  destination: Destination;
  isAustralia: boolean;
  refNumber: string;
  invoiceNumber: string;
  today: string;
  mpesaTillNumber: string | number;
  processingFeeLabel: string;
};

export default function InvoiceReceipt({
  form,
  destination,
  isAustralia,
  refNumber,
  invoiceNumber,
  today,
  mpesaTillNumber,
  processingFeeLabel,
}: InvoiceReceiptProps) {
  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 12mm;
          }
        }
      `}</style>
      <div className="print:hidden">
        <Header />
      </div>
      <main className="bg-sand print:bg-white">
        <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20 print:max-w-full print:px-0 print:py-0">
          <div className="flex flex-col items-center text-center print:hidden">
            <StampBadge label="Application Submitted" sublabel={refNumber} tone="success" animate size={140} />
            <h1 className="mt-6 font-display text-2xl font-semibold text-night sm:text-3xl">
              You&apos;re all set, {form.fullName.split(" ")[0] || "there"}.
            </h1>
            <p className="mt-3 max-w-md text-sm text-ink/75">
              Your paid Freelance Visa application for {destination.name} is
              now in our processing queue. We&apos;ll email {form.email || "you"}{" "}
              with updates, and typical processing is {destination.avgProcessing}.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-night/10 bg-white p-6 shadow-sm sm:p-8 print:mt-0 print:rounded-none print:border-none print:p-0 print:shadow-none">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-night/10 pb-6">
              <div>
                <p className="font-display text-lg font-semibold text-night">
                  Freelance Visa
                </p>
                <p className="mt-1 text-xs text-ink/60">
                  Nairobi, Kenya · hello@freelancevisa.co
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-base font-semibold text-night">
                  Invoice {invoiceNumber}
                </p>
                <p className="mt-1 text-xs text-ink/60">Issued {today}</p>
                <span className="mt-2 inline-block rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success-dark">
                  PAID
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 py-6 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                  Billed to
                </p>
                <p className="mt-1 font-medium text-night">{form.fullName || "—"}</p>
                <p className="text-ink/65">{form.email || "—"}</p>
                <p className="text-ink/65">{formatInternationalPhone(form.phoneCountry, form.phone) || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                  Application reference
                </p>
                <p className="mt-1 font-mono font-medium text-night">{refNumber}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-ink/55">
                  Destination
                </p>
                <p className="text-ink/65">
                  {destination.name}
                  {isAustralia && form.state ? `, ${form.state}` : ""}
                </p>
              </div>
            </div>

            <table className="w-full border-t border-night/10 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink/55">
                  <th className="py-3 font-medium">Description</th>
                  <th className="py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-night/10">
                  <td className="py-3 text-night">
                    {processingFeeLabel} — {destination.name}
                  </td>
                  <td className="py-3 text-right font-mono text-night">
                    ${destination.feeUSD.toFixed(2)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-night/20">
                  <td className="py-3 font-display font-semibold text-night">Total paid</td>
                  <td className="py-3 text-right font-mono font-semibold text-night">
                    ${destination.feeUSD.toFixed(2)} USD
                  </td>
                </tr>
              </tfoot>
            </table>

            <p className="mt-6 text-xs leading-relaxed text-ink/60">
              Paid via M-Pesa, Till {mpesaTillNumber}. This receipt confirms
              payment of the {processingFeeLabel.toLowerCase()} only —
              it is not a Freelance Visa issuance guarantee. See our{" "}
              <Link href="/cancellation-policy" className="underline hover:text-teal">
                Cancellation Policy
              </Link>{" "}
              for refund terms.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 print:hidden sm:flex-row">
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-full border border-night/20 px-6 py-3 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
            >
              Print / save invoice as PDF
            </button>
            <Link
              href="/"
              className="flex-1 rounded-full bg-night px-6 py-3 text-center text-sm font-medium text-sand transition hover:bg-teal-dark"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
