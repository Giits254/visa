import Link from "next/link";
import { destinations } from "@/lib/data";
import { FormState, formatInternationalPhone } from "./types";

type Destination = (typeof destinations)[number];

type ReviewStepProps = {
  form: FormState;
  destination: Destination;
  isAustralia: boolean;
  passportPreview: string | null;
  processingFeeLabel: string;
  onEditStep: (step: number) => void;
};

export default function ReviewStep({
  form,
  destination,
  isAustralia,
  passportPreview,
  processingFeeLabel,
  onEditStep,
}: ReviewStepProps) {
  return (
    <div>
      <p className="text-sm font-medium text-night">Review your details</p>
      <p className="mt-1 text-xs text-ink/60">
        Check everything below before you submit — you can jump
        back to fix anything.
      </p>

      <div className="mt-5 rounded-lg border border-night/10">
        <div className="flex items-center justify-between border-b border-night/10 bg-sand/60 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            Applicant details
          </p>
          <button
            type="button"
            onClick={() => onEditStep(0)}
            className="text-xs font-semibold text-teal-dark underline decoration-teal/40 underline-offset-4 hover:text-teal"
          >
            Edit
          </button>
        </div>

        {passportPreview && (
          <div className="flex items-center gap-3 border-b border-night/10 px-4 py-3">
            <img
              src={passportPreview}
              alt="Passport photo preview"
              className="h-14 w-14 flex-none rounded-md border border-night/10 object-cover"
            />
            <p className="text-sm text-ink/70">
              Passport photo — <span className="font-medium text-night">attached ✓</span>
            </p>
          </div>
        )}

        <dl className="divide-y divide-night/10 px-4 text-sm">
          {[
            ["Full name", form.fullName || "—"],
            ["Email", form.email || "—"],
            ["Phone", formatInternationalPhone(form.phoneCountry, form.phone) || "—"],
            ["ID number", form.idNumber || "—"],
            ["Nationality", form.nationality || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink/60">{label}</dt>
              <dd className="text-right font-medium text-night">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5 rounded-lg border border-night/10">
        <div className="flex items-center justify-between border-b border-night/10 bg-sand/60 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            Address &amp; documents
          </p>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs font-semibold text-teal-dark underline decoration-teal/40 underline-offset-4 hover:text-teal"
          >
            Edit
          </button>
        </div>

        <dl className="divide-y divide-night/10 px-4 text-sm">
          {[
            ["Street address", form.street || "—"],
            ["Town / city", form.city || "—"],
            ["ZIP / postal code", form.zip || "—"],
            ["Destination", destination.name],
            ...(isAustralia ? [["State / territory", form.state || "—"]] : []),
            ["Travel date", form.travelDate || "—"],
            ["Work style", form.purpose],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink/60">{label}</dt>
              <dd className="text-right font-medium text-night">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-success/10 p-4">
        <span className="text-sm font-medium text-night">
          {processingFeeLabel} — Paid ✓
        </span>
        <span className="font-mono text-sm font-semibold text-success-dark">
          ${destination.feeUSD}.00 USD
        </span>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink/60">
        By submitting, you agree to our{" "}
        <Link href="/cancellation-policy" className="underline hover:text-teal">
          Cancellation Policy
        </Link>
        . Submitting sends your paid application to our review team.
      </p>
    </div>
  );
}
