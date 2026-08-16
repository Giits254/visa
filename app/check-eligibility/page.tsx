"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampBadge from "@/components/StampBadge";
import {
  destinations,
  eligibleApplicantCountries,
  coreRequirements,
} from "@/lib/data";
import { validateIdNumber } from "@/lib/validation";

type Stage = "form" | "checking" | "result";

const checkingSteps = [
  "Verifying your ID and phone number",
  "Matching your nationality to Freelance Visa routes",
  "Confirming destination requirements",
  "Running background eligibility checks",
  "Compiling your document checklist",
];

const STEP_INTERVAL_MS = 1500;
const STEP_TAIL_MS = 900;

export default function CheckEligibilityPage() {
  const [stage, setStage] = useState<Stage>("form");
  const [nationality, setNationality] = useState(eligibleApplicantCountries[0]);
  const [destinationCode, setDestinationCode] = useState(destinations[0].code);
  const [state, setState] = useState("");
  const [purpose, setPurpose] = useState("Hybrid (online + onsite)");
  const [idNumber, setIdNumber] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<{ idNumber?: string; state?: string }>({});

  const destination = destinations.find((c) => c.code === destinationCode)!;
  const isAustralia = destination.code === "AU";

  function runCheck(e: React.FormEvent) {
    e.preventDefault();

    const idError = validateIdNumber(idNumber);
    const stateError = isAustralia && !state ? "Select a state or territory." : undefined;

    if (idError || stateError) {
      setErrors({ idNumber: idError ?? undefined, state: stateError });
      return;
    }
    setErrors({});

    setStage("checking");
    setActiveStep(0);

    checkingSteps.forEach((_, i) => {
      setTimeout(() => setActiveStep(i), i * STEP_INTERVAL_MS);
    });
    setTimeout(
      () => setStage("result"),
      checkingSteps.length * STEP_INTERVAL_MS + STEP_TAIL_MS
    );
  }

  function reset() {
    setStage("form");
    setActiveStep(0);
  }

  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="border-b border-night/10 bg-night text-sand">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Step 1 of 5
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Check your Freelance Visa eligibility
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/70 sm:text-base">
              Answer a few questions. This is a guidance simulation based on
              current published requirements — not a submission to any
              embassy or consulate.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
          {stage === "form" && (
            <form
              onSubmit={runCheck}
              noValidate
              className="rounded-2xl border border-night/10 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-night">
                    Your nationality
                  </span>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                  >
                    {eligibleApplicantCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-night">
                    Destination
                  </span>
                  <select
                    value={destinationCode}
                    onChange={(e) => {
                      setDestinationCode(e.target.value);
                      setState("");
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
                    <span className="text-sm font-medium text-night">
                      State or territory
                    </span>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
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

                <label className="block">
                  <span className="text-sm font-medium text-night">
                    How will you work?
                  </span>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
                  >
                    <option>Hybrid (online + onsite)</option>
                    <option>Onsite (in-country)</option>
                    <option>Fully online (remote)</option>
                    <option>Exploring a move, not yet working</option>
                  </select>
                </label>

                  <label className="block">
                    <span className="text-sm font-medium text-night">
                      ID number
                    </span>
                    <input
                      value={idNumber}
                      onChange={(e) => {
                        setIdNumber(e.target.value);
                        setErrors((prev) => ({ ...prev, idNumber: undefined }));
                      }}
                      placeholder="national ID no."
                      inputMode="numeric"
                      className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
                        errors.idNumber ? "border-red-500" : "border-night/25"
                      }`}
                    />
                    {errors.idNumber && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{errors.idNumber}</p>
                    )}
                  </label>
              </div>

              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-night transition hover:bg-gold-light"
              >
                Run eligibility check
              </button>
              <p className="mt-3 text-center text-xs text-ink/60">
                No payment is required at this stage. The processing fee
                only applies once you submit a full application.
              </p>
            </form>
          )}

          {stage === "checking" && (
            <div className="rounded-2xl border border-night/10 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-night/10 border-t-teal" />
              <p className="mt-6 font-display text-lg font-semibold text-night">
                Running your Freelance Visa eligibility check…
              </p>
              <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left">
                {checkingSteps.map((step, i) => (
                  <li
                    key={step}
                    className={`flex items-center gap-3 text-sm transition ${
                      i <= activeStep ? "text-ink" : "text-ink/45"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[10px] ${
                        i <= activeStep
                          ? "border-success bg-success text-white"
                          : "border-night/20"
                      }`}
                    >
                      {i <= activeStep ? "✓" : ""}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage === "result" && (
            <div className="animate-rise rounded-2xl border border-success/30 bg-white p-6 shadow-sm sm:p-10">
              <div className="flex flex-col items-center gap-4 border-b border-night/10 pb-8 text-center">
                <StampBadge
                  label="Freelance Visa Eligible"
                  sublabel={destination.name}
                  tone="success"
                  animate
                  size={140}
                />
                <p className="max-w-sm text-sm text-ink/75">
                  Based on {nationality} nationality applying for a Freelance
                  Visa in {destination.name}
                  {isAustralia && state ? `, ${state}` : ""} (
                  {purpose.toLowerCase()}), here&apos;s what your application
                  will need.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                    Visa route
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-night">
                    {destination.visaLabel}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                    Processing time
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold text-teal-dark">
                    {destination.avgProcessing}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                    Validity
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold text-night">
                    {destination.validity}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
                    Processing fee
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold text-gold-dark">
                    ${destination.feeUSD} USD
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="font-display text-base font-semibold text-night">
                  Your document checklist
                </p>
                <ul className="mt-4 space-y-3">
                  {coreRequirements.map((req) => (
                    <li key={req.title} className="flex gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-success/50 text-[10px] text-success-dark">
                        ✓
                      </span>
                      <span>
                        <span className="font-medium text-night">{req.title}</span>
                        <span className="text-ink/70"> — {req.detail}</span>
                      </span>
                    </li>
                  ))}
                  {isAustralia && (
                    <li className="flex gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-success/50 text-[10px] text-success-dark">
                        ✓
                      </span>
                      <span>
                        <span className="font-medium text-night">State or territory</span>
                        <span className="text-ink/70"> — confirmed as {state}</span>
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/apply"
                  className="flex-1 rounded-full bg-night px-6 py-3.5 text-center text-sm font-semibold text-sand transition hover:bg-teal-dark"
                >
                  Continue to Freelance Visa application
                </Link>
                <button
                  onClick={reset}
                  className="flex-1 rounded-full border border-night/20 px-6 py-3.5 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
                >
                  Check another destination
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-ink/55">
                This result is an estimate based on generally published
                requirements. Final decisions rest with the relevant
                embassy or immigration authority.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}