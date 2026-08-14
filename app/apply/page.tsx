"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampBadge from "@/components/StampBadge";
import { destinations, PROCESSING_FEE_LABEL, MPESA_TILL_NUMBER } from "@/lib/data";
import { validatePhone, validateIdNumber } from "@/lib/validation";

const steps = ["Applicant details", "Address & documents", "Payment", "Review & submit"];

type Stage = "form" | "submitting" | "paid";

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>("form");
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    nationality: "",
    destination: destinations[0].code,
    state: "",
    travelDate: "",
    purpose: "Hybrid (online + onsite)",
    street: "",
    city: "",
    zip: "",
  });

  const [errors, setErrors] = useState<{ phone?: string; idNumber?: string; state?: string }>({});

  const destination = destinations.find((c) => c.code === form.destination)!;
  const isAustralia = destination.code === "AU";

  const [refNumber] = useState(
    () => "FLV-" + Math.floor(100000 + Math.random() * 900000)
  );
  const [invoiceNumber] = useState(
    () => "INV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000)
  );
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep0() {
    const phoneError = validatePhone(form.phone);
    const idError = validateIdNumber(form.idNumber);
    if (phoneError || idError) {
      setErrors({ phone: phoneError ?? undefined, idNumber: idError ?? undefined });
      return false;
    }
    setErrors({});
    return true;
  }

  function validateStep1() {
    if (isAustralia && !form.state) {
      setErrors((prev) => ({ ...prev, state: "Select a state or territory." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, state: undefined }));
    return true;
  }

  function next() {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !paymentConfirmed) return; // must confirm payment to leave payment step
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function confirmPayment() {
    setConfirmingPayment(true);
    setTimeout(() => {
      setConfirmingPayment(false);
      setPaymentConfirmed(true);
    }, 1300);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentConfirmed) return;
    setStage("submitting");
    setTimeout(() => setStage("paid"), 1200);
  }

  // ---------- PAID / INVOICE ----------
  if (stage === "paid") {
    return (
      <>
        <Header />
        <main className="bg-sand">
          <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="flex flex-col items-center text-center">
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

            <div className="mt-10 rounded-2xl border border-night/10 bg-white p-6 sm:p-8 print:border-none print:p-0">
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
                  <p className="text-ink/65">{form.phone || "—"}</p>
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
                      {PROCESSING_FEE_LABEL} — {destination.name}
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
                Paid via M-Pesa, Till {MPESA_TILL_NUMBER}. This receipt confirms
                payment of the {PROCESSING_FEE_LABEL.toLowerCase()} only —
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
        <Footer />
      </>
    );
  }

  // ---------- SUBMITTING ----------
  if (stage === "submitting") {
    return (
      <>
        <Header />
        <main className="bg-sand">
          <section className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-night/10 border-t-teal" />
            <p className="mt-6 font-display text-lg font-semibold text-night">
              Submitting your Freelance Visa application…
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // ---------- FORM ----------
  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="border-b border-night/10 bg-night text-sand">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Application
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Apply for your Freelance Visa
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/70 sm:text-base">
              Pay the processing fee, then submit — your Freelance Visa
              application moves into the queue right after.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
          <ol className="mb-10 flex items-center justify-between">
            {steps.map((label, i) => (
              <li key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-medium ${
                      i <= step
                        ? "bg-teal text-white"
                        : "border border-night/20 text-ink/50"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`hidden text-xs sm:block ${
                      i <= step ? "text-night" : "text-ink/50"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={`mx-2 h-px flex-1 ${
                      i < step ? "bg-teal" : "bg-night/15"
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>

          <form
            onSubmit={step === steps.length - 1 ? submit : (e) => e.preventDefault()}
            className="rounded-2xl border border-night/10 bg-white p-6 shadow-sm sm:p-8"
          >
            {step === 0 && (
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-night">Full name</span>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="As shown on your passport"
                    className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                  />
                </label>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-night">Email</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-night">Phone number</span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        update("phone", e.target.value);
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="+254 7xx xxx xxx"
                      className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
                        errors.phone ? "border-red-500" : "border-night/25"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone}</p>
                    )}
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-night">ID number</span>
                    <input
                      required
                      value={form.idNumber}
                      onChange={(e) => {
                        update("idNumber", e.target.value);
                        setErrors((prev) => ({ ...prev, idNumber: undefined }));
                      }}
                      placeholder="ID no."
                      inputMode="numeric"
                      className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
                        errors.idNumber ? "border-red-500" : "border-night/25"
                      }`}
                    />
                    {errors.idNumber && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{errors.idNumber}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-night">Nationality</span>
                    <input
                      required
                      value={form.nationality}
                      onChange={(e) => update("nationality", e.target.value)}
                      placeholder="e.g. Kenyan"
                      className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-night">Street address</span>
                  <input
                    required
                    value={form.street}
                    onChange={(e) => update("street", e.target.value)}
                    placeholder="House number and street name"
                    className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                  />
                </label>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-night">Town / city</span>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="e.g. Nairobi"
                      className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-night">ZIP / postal code</span>
                    <input
                      required
                      value={form.zip}
                      onChange={(e) => update("zip", e.target.value)}
                      placeholder="e.g. 00100"
                      className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-night">Destination</span>
                  <select
                    value={form.destination}
                    onChange={(e) => {
                      update("destination", e.target.value);
                      update("state", "");
                      setErrors((prev) => ({ ...prev, state: undefined }));
                    }}
                    className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                  >
                    {destinations.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                {isAustralia && (
                  <label className="block">
                    <span className="text-sm font-medium text-night">State or territory</span>
                    <select
                      value={form.state}
                      onChange={(e) => {
                        update("state", e.target.value);
                        setErrors((prev) => ({ ...prev, state: undefined }));
                      }}
                      className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
                        errors.state ? "border-red-500" : "border-night/25"
                      }`}
                    >
                      <option value="">Select a state or territory</option>
                      {destination.states?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{errors.state}</p>
                    )}
                  </label>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-night">
                      Intended travel date
                    </span>
                    <input
                      required
                      type="date"
                      value={form.travelDate}
                      onChange={(e) => update("travelDate", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-night">
                      How will you work?
                    </span>
                    <select
                      value={form.purpose}
                      onChange={(e) => update("purpose", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                    >
                      <option>Hybrid (online + onsite)</option>
                      <option>Onsite (in-country)</option>
                      <option>Fully online (remote)</option>
                    </select>
                  </label>
                </div>
                <p className="rounded-lg bg-teal/10 p-4 text-xs leading-relaxed text-teal-dark">
                  You&apos;ll also need a passport photo on hand — you can
                  upload it once our team confirms your checklist.
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex items-center justify-between rounded-xl bg-night px-5 py-4 text-sand">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-sand/60">Amount due</p>
                    <p className="font-mono text-xl font-semibold text-gold">
                      ${destination.feeUSD}.00 USD
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-sand/60">M-Pesa Till</p>
                    <p className="font-mono text-xl font-semibold">{MPESA_TILL_NUMBER}</p>
                  </div>
                </div>

                <ol className="mt-6 space-y-3 text-sm">
                  {[
                    "Open the M-Pesa menu on your phone.",
                    "Select Lipa na M-Pesa, then Buy Goods and Services.",
                    `Enter Till Number ${MPESA_TILL_NUMBER}.`,
                    `Enter the amount — $${destination.feeUSD} USD, or its KES equivalent at checkout.`,
                    "Enter your M-Pesa PIN and confirm.",
                    "You'll get an M-Pesa confirmation message immediately — keep it for your records.",
                  ].map((line, i) => (
                    <li key={line} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal/10 font-mono text-xs font-medium text-teal-dark">
                        {i + 1}
                      </span>
                      <span className="text-ink/80">{line}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-6 rounded-lg bg-gold/10 p-4 text-xs leading-relaxed text-gold-dark">
                  Bank transfer and card payment are coming soon. For now,
                  M-Pesa Buy Goods is the only supported payment method.
                </p>

                <div className="mt-6 border-t border-dashed border-night/15 pt-6">
                  {paymentConfirmed ? (
                    <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-success text-xs text-white">
                        ✓
                      </span>
                      <p className="text-sm font-medium text-success-dark">
                        Payment confirmed — continue to review &amp; submit.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                        Draft preview
                      </p>
                      <p className="mt-1 text-xs text-ink/65">
                        Payment isn&apos;t connected yet — use this button to
                        preview what happens once M-Pesa confirms payment.
                        You must confirm payment before you can submit.
                      </p>
                      <button
                        type="button"
                        onClick={confirmPayment}
                        disabled={confirmingPayment}
                        className="mt-4 w-full rounded-full bg-success px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-success-dark disabled:opacity-60"
                      >
                        {confirmingPayment ? "Confirming payment…" : "Simulate payment confirmation"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-sm font-medium text-night">Review your details</p>
                <dl className="mt-4 divide-y divide-night/10 text-sm">
                  {[
                    ["Full name", form.fullName || "—"],
                    ["Email", form.email || "—"],
                    ["Phone", form.phone || "—"],
                    ["ID number", form.idNumber || "—"],
                    ["Nationality", form.nationality || "—"],
                    ["Address", [form.street, form.city, form.zip].filter(Boolean).join(", ") || "—"],
                    ["Destination", destination.name + (isAustralia && form.state ? `, ${form.state}` : "")],
                    ["Travel date", form.travelDate || "—"],
                    ["Work style", form.purpose],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-ink/60">{label}</dt>
                      <dd className="text-right font-medium text-night">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex items-center justify-between rounded-lg bg-success/10 p-4">
                  <span className="text-sm font-medium text-night">
                    {PROCESSING_FEE_LABEL} — Paid ✓
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
            )}

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="rounded-full border border-night/20 px-6 py-3 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={step === 2 && !paymentConfirmed}
                  className="flex-1 rounded-full bg-night px-6 py-3 text-sm font-semibold text-sand transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step === 2 && !paymentConfirmed ? "Confirm payment to continue" : "Continue"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night transition hover:bg-gold-light"
                >
                  Submit application
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
