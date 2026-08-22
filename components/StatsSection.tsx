"use client";

import { useEffect, useRef, useState } from "react";
import { platformStats } from "@/lib/data";

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

function CountUpValue({
  value,
  prefix = "",
  suffix = "",
  active,
  duration = 1400,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, duration]);

  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="border-y border-night/10 bg-night text-sand">
      <div ref={ref} className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          {platformStats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-mono text-3xl font-semibold text-gold sm:text-4xl">
                <CountUpValue
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  active={inView}
                />
              </p>
              <p className="mt-1.5 text-xs text-sand/65 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}