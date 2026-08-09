"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/#requirements", label: "Requirements" },
  { href: "/#process", label: "Process" },
  { href: "/#tips", label: "Tips" },
  { href: "/#faq", label: "FAQs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-night/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-night text-sm font-display font-semibold text-gold">
            M
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-night">
            Manara
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition hover:text-teal"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/check-eligibility"
            className="rounded-full border border-night/20 px-4 py-2 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
          >
            Check eligibility
          </Link>
          <Link
            href="/apply"
            className="rounded-full bg-night px-5 py-2 text-sm font-medium text-sand transition hover:bg-teal-dark"
          >
            Apply now
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-night/20 lg:hidden"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M0 1H18" stroke="#101B2D" strokeWidth="1.6" />
            <path d="M0 7H18" stroke="#101B2D" strokeWidth="1.6" />
            <path d="M0 13H18" stroke="#101B2D" strokeWidth="1.6" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-night/10 bg-sand px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-night/5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link
              href="/check-eligibility"
              className="rounded-full border border-night/20 px-4 py-2.5 text-center text-sm font-medium text-night"
            >
              Check eligibility
            </Link>
            <Link
              href="/apply"
              className="rounded-full bg-night px-4 py-2.5 text-center text-sm font-medium text-sand"
            >
              Apply now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
