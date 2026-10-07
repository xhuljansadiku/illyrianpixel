"use client";

import { useEffect, useRef, useState } from "react";
import type { ConversionTrustStats } from "@/lib/conversionLandingShared";
import { useReducedMotion } from "@/lib/gsap";

const GOLD = "#D4AF37";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

type Props = {
  stats: ConversionTrustStats;
};

export default function ConversionTrustBar({ stats }: Props) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [primary, setPrimary] = useState(0);
  const [secondary, setSecondary] = useState(0);
  const [tertiary, setTertiary] = useState(0);
  const ranRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setPrimary(stats.primaryCount);
      setSecondary(stats.secondaryCount);
      setTertiary(stats.tertiaryCount);
    }
  }, [reduced, stats.primaryCount, stats.secondaryCount, stats.tertiaryCount]);

  useEffect(() => {
    if (reduced) return;

    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || ranRef.current) return;
        ranRef.current = true;
        setPrimary(0);
        setSecondary(0);
        setTertiary(0);

        const duration = 1500;
        let start: number | null = null;

        const tick = (now: number) => {
          if (start === null) start = now;
          const t = Math.min(1, (now - start) / duration);
          const e = easeOutCubic(t);
          setPrimary(Math.round(e * stats.primaryCount));
          setSecondary(Math.round(e * stats.secondaryCount));
          setTertiary(Math.round(e * stats.tertiaryCount));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, stats.primaryCount, stats.secondaryCount, stats.tertiaryCount]);

  const ariaMain = `${stats.primaryCount}+ ${stats.primaryLabel} · ${stats.secondaryCount}+ ${stats.secondaryLabel} · ${stats.tertiaryCount}+ ${stats.tertiaryLabel}`;

  const sep = (
    <span className="mx-1.5 inline-block text-[#D4AF37]/60 sm:mx-2" aria-hidden>
      ·
    </span>
  );

  const stat = (n: number, label: string) => (
    <span className="whitespace-nowrap text-white/[0.9]">
      <span className="tabular-nums" style={{ color: GOLD }}>
        {n}
      </span>
      <span style={{ color: GOLD }}>+</span>
      <span className="ml-1.5">{label}</span>
    </span>
  );

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:gap-8"
    >
      <p
        className="text-center font-display text-[clamp(1.05rem,2vw,1.28rem)] tracking-[-0.02em] leading-snug"
        aria-label={ariaMain}
      >
        <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
          {stat(primary, stats.primaryLabel)}
          {sep}
          {stat(secondary, stats.secondaryLabel)}
          {sep}
          {stat(tertiary, stats.tertiaryLabel)}
        </span>
      </p>
      {stats.reachLabel ? (
        <p className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-white/58 md:text-[13px] md:tracking-[0.22em]">
          {stats.reachLabel}
        </p>
      ) : null}
    </div>
  );
}
