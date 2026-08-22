"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type StatusResult =
  | { found: true; referenceCode: string; applicantName: string; destinationName: string; statusLabel: string }
  | { found: false };

export default function ApplicationStatusDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusResult | null>(null);

  // The overlay is portalled straight to <body> (see below) instead of
  // rendering wherever this component happens to sit in the tree — the
  // header uses backdrop-blur, which (like `filter`) creates a new
  // containing block for `position: fixed` descendants, so a fixed overlay
  // nested inside it gets pinned to the header's own small box instead of
  // the full viewport. Portalling sidesteps that regardless of what any
  // ancestor's CSS does. `mounted` just guards against portalling before
  // `document` exists during server rendering.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    // Prevent the page behind the dialog from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openDialog() {
    setOpen(true);
    setResult(null);
    setError(null);
    setCode("");
  }

  function close() {
    setOpen(false);
  }

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/application/status?code=${encodeURIComponent(code.trim())}`);
      if (!res.ok) throw new Error("Could not check that code right now.");
      const data = (await res.json()) as StatusResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check that code right now.");
    } finally {
      setLoading(false);
    }
  }

  const dialog = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-night/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-status-title"
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl sm:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="application-status-title" className="font-display text-2xl font-semibold text-night">
              Check your application status
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Enter your tracking code, reference code, or M-Pesa transaction ID.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-lg text-ink/50 transition hover:bg-night/5 hover:text-night"
          >
            ✕
          </button>
        </div>

        <form onSubmit={check} className="mt-6 flex gap-3">
          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. MV-2026-AB12CD"
            className="w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex-none rounded-lg bg-night px-6 py-3 text-sm font-semibold text-sand transition hover:bg-teal-dark disabled:opacity-60"
          >
            {loading ? "Checking…" : "Check"}
          </button>
        </form>

        {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}

        {result && result.found && (
          <div className="mt-6 rounded-xl bg-success/10 p-5">
            <p className="text-base font-semibold text-success-dark">Application found</p>
            <dl className="mt-3 divide-y divide-night/10 text-sm">
              {[
                ["Reference", result.referenceCode, true],
                ["Applicant", result.applicantName, false],
                ["Destination", result.destinationName, false],
                ["Status", result.statusLabel, false],
              ].map(([label, value, mono]) => (
                <div key={label as string} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-ink/60">{label}</dt>
                  <dd className={`text-right font-medium text-night ${mono ? "font-mono" : ""}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {result && !result.found && (
          <div className="mt-6 rounded-xl bg-red-50 p-5 text-sm">
            <p className="text-base font-semibold text-red-600">No application found</p>
            <p className="mt-2 text-ink/65">
              Double-check the code, or{" "}
              <a href="/contact" className="underline hover:text-teal">
                contact us
              </a>{" "}
              if you think this is a mistake.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={className ?? "text-sm font-medium text-ink/80 transition hover:text-teal"}
      >
        Already applied?
      </button>

      {open && mounted && createPortal(dialog, document.body)}
    </>
  );
}
