"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not send your message.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="border-b border-night/10 bg-night text-sand">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Contact us
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Talk to the Freelance Visa team
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/70 sm:text-base">
              Questions about eligibility, a destination, or an application
              in progress — reach out and we&apos;ll get back to you.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-night/10 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-ink/60">Email</p>
              <p className="mt-1 font-display text-base font-semibold text-night">
                hello@freelancevisa.co
              </p>
            </div>
            <div className="rounded-2xl border border-night/10 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-ink/60">Phone</p>
              <p className="mt-1 font-display text-base font-semibold text-night">
                +254 718 253 265
              </p>
            </div>
            <div className="rounded-2xl border border-night/10 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-ink/60">Office</p>
              <p className="mt-1 font-display text-base font-semibold text-night">
                Nairobi, Kenya
              </p>
              <p className="mt-1 text-sm text-ink/70">Mon–Fri, 0800 hrs–1700 hrs EAT</p>
            </div>
          </div>

          <div className="rounded-2xl border border-night/10 bg-white p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success-dark">
                  ✓
                </span>
                <p className="mt-4 font-display text-lg font-semibold text-night">
                  Message sent
                </p>
                <p className="mt-1 text-sm text-ink/70">
                  Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll
                  reply to {form.email || "your email"} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-night">Your name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-night">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-night">Message</span>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-night/20 bg-sand px-4 py-3 text-sm text-ink"
                  />
                </label>
                {error && (
                  <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-night transition hover:bg-gold-light disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
