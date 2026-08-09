"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampBadge from "@/components/StampBadge";
import { gulfCountries } from "@/lib/data";

const steps = ["Traveler details", "Trip details", "Review & submit"];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    destination: gulfCountries[0].code,
    travelDate: "",
    purpose: "Tourism",
  });

  const destination = gulfCountries.find((c) => c.code === form.destination)!;
  const refNumber = "MNR-" + Math.floor(100000 + Math.random() * 900000);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="bg-sand">
          <section className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8">
            <div className="flex justify-center">
              <StampBadge label="Application Received" sublabel={refNumber} tone="gold" animate size={150} />
            </div>
            <h1 className="mt-8 font-display text-2xl font-semibold text-night sm:text-3xl">
              Thanks, {form.fullName.split(" ")[0] || "there"}. We&apos;ve got it.
            </h1>
            <p className="mt-3 text-sm text-ink/65">
              Your reference number is{" "}
              <span className="font-mono font-medium text-night">{refNumber}</span>.
              Our team will review your file for {destination.name} and
              contact you at {form.email || "the email you provided"} within
              1 business day with next steps.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="rounded-full bg-night px-6 py-3 text-sm font-medium text-sand transition hover:bg-teal-dark"
              >
                Back to home
              </Link>
              <Link
                href="/#faq"
                className="rounded-full border border-night/20 px-6 py-3 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
              >
                Read FAQs
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

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
              Apply for your Gulf visa
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/65 sm:text-base">
              Three short sections. You can save and come back — nothing is
              charged until your file is reviewed and ready to submit.
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
                        : "border border-night/20 text-ink/40"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`hidden text-xs sm:block ${
                      i <= step ? "text-night" : "text-ink/40"
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
            className="rounded-2xl border border-night/10 bg-white/50 p-6 sm:p-8"
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
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
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
                      className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-night">Phone</span>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+254 7xx xxx xxx"
                      className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-night">Nationality</span>
                  <input
                    required
                    value={form.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    placeholder="e.g. Kenyan"
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-night">Destination</span>
                  <select
                    value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  >
                    {gulfCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
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
                      className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-night">
                      Purpose of travel
                    </span>
                    <select
                      value={form.purpose}
                      onChange={(e) => update("purpose", e.target.value)}
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
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-medium text-night">Review your details</p>
                <dl className="mt-4 divide-y divide-night/10 text-sm">
                  {[
                    ["Full name", form.fullName || "—"],
                    ["Email", form.email || "—"],
                    ["Phone", form.phone || "—"],
                    ["Nationality", form.nationality || "—"],
                    ["Destination", destination.name],
                    ["Travel date", form.travelDate || "—"],
                    ["Purpose", form.purpose],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2.5">
                      <dt className="text-ink/55">{label}</dt>
                      <dd className="font-medium text-night">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 rounded-lg bg-teal/10 p-4 text-xs leading-relaxed text-teal-dark">
                  Submitting sends your details to our review team. Document
                  upload happens in the next stage, after a specialist
                  confirms your checklist.
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
                  className="flex-1 rounded-full bg-night px-6 py-3 text-sm font-semibold text-sand transition hover:bg-teal-dark"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night transition hover:bg-gold-light disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit application"}
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
