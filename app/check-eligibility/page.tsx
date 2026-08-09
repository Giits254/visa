"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampBadge from "@/components/StampBadge";
import {
  gulfCountries,
  eligibleApplicantCountries,
  coreRequirements,
} from "@/lib/data";

type Stage = "form" | "checking" | "result";

const checkingSteps = [
  "Matching your nationality to visa routes",
  "Confirming destination requirements",
  "Reviewing processing time & fees",
  "Compiling your document checklist",
];

export default function CheckEligibilityPage() {
  const [stage, setStage] = useState<Stage>("form");
  const [nationality, setNationality] = useState(eligibleApplicantCountries[0]);
  const [destinationCode, setDestinationCode] = useState(gulfCountries[0].code);
  const [purpose, setPurpose] = useState("Tourism");
  const [activeStep, setActiveStep] = useState(0);

  const destination = gulfCountries.find((c) => c.code === destinationCode)!;

  function runCheck(e: React.FormEvent) {
    e.preventDefault();
    setStage("checking");
    setActiveStep(0);

    checkingSteps.forEach((_, i) => {
      setTimeout(() => setActiveStep(i), i * 550);
    });
    setTimeout(() => setStage("result"), checkingSteps.length * 550 + 400);
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
              Step 1 of 4
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Check your eligibility
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/65 sm:text-base">
              Answer three questions. This is a guidance simulation based on
              current published requirements — not a submission to any
              embassy or consulate.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
          {stage === "form" && (
            <form
              onSubmit={runCheck}
              className="rounded-2xl border border-night/10 bg-white/50 p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-night">
                    Your nationality
                  </span>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
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
                    onChange={(e) => setDestinationCode(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  >
                    {gulfCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-night">
                    Purpose of travel
                  </span>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  >
                    <option>Tourism</option>
                    <option>Business visit</option>
                    <option>Visiting family</option>
                    <option>Umrah / religious visit</option>
                    <option>Transit</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-night transition hover:bg-gold-light"
              >
                Run eligibility check
              </button>
              <p className="mt-3 text-center text-xs text-ink/50">
                No payment or document upload required at this stage.
              </p>
            </form>
          )}

          {stage === "checking" && (
            <div className="rounded-2xl border border-night/10 bg-white/50 p-8 text-center sm:p-10">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-night/10 border-t-teal" />
              <p className="mt-6 font-display text-lg font-semibold text-night">
                Running your eligibility check…
              </p>
              <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left">
                {checkingSteps.map((step, i) => (
                  <li
                    key={step}
                    className={`flex items-center gap-3 text-sm transition ${
                      i <= activeStep ? "text-ink" : "text-ink/30"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[10px] ${
                        i <= activeStep
                          ? "border-teal bg-teal text-white"
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
            <div className="animate-rise rounded-2xl border border-night/10 bg-white/50 p-6 sm:p-10">
              <div className="flex flex-col items-center gap-4 border-b border-night/10 pb-8 text-center">
                <StampBadge
                  label="Likely Eligible"
                  sublabel={destination.name}
                  tone="teal"
                  animate
                  size={140}
                />
                <p className="max-w-sm text-sm text-ink/65">
                  Based on {nationality} nationality travelling to{" "}
                  {destination.name} for {purpose.toLowerCase()}, here&apos;s
                  what your application will need.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/45">
                    Visa route
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-night">
                    {destination.visaTypes[0]}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/45">
                    Processing time
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold text-teal-dark">
                    {destination.avgProcessing}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/45">
                    Estimated fee
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold text-gold-dark">
                    {destination.entryFee}
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
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-teal/40 text-[10px] text-teal-dark">
                        ✓
                      </span>
                      <span>
                        <span className="font-medium text-night">{req.title}</span>
                        <span className="text-ink/60"> — {req.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/apply"
                  className="flex-1 rounded-full bg-night px-6 py-3.5 text-center text-sm font-semibold text-sand transition hover:bg-teal-dark"
                >
                  Continue to application
                </Link>
                <button
                  onClick={reset}
                  className="flex-1 rounded-full border border-night/20 px-6 py-3.5 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
                >
                  Check another destination
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-ink/45">
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
