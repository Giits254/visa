"use client";

import { useState } from "react";
import { faqs } from "@/lib/data";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
          Questions
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
          Frequently asked questions.
        </h2>
      </div>

      <div className="mt-10 divide-y divide-night/10 border-t border-b border-night/10">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-base font-medium text-night sm:text-lg">
                  {item.q}
                </span>
                <span
                  className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border border-night/20 text-night transition ${
                    isOpen ? "rotate-45 border-teal text-teal" : ""
                  }`}
                  aria-hidden
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 0V12" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M0 6H12" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <p className="pb-6 pr-10 text-sm leading-relaxed text-ink/65">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
