"use client";

import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const AURA_IDS = [
  "hero",
  "services",
  "scroll-story",
  "why-not-working",
  "featured-work",
  "before-after",
  "pricing-preview",
  "about",
  "process",
  "cta"
] as const;

/** Shifts global background focus subtly based on active section (CSS reads data-aura). */
export default function SectionAura() {
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (typeof document === "undefined" || reduced || getIsMobile()) return;
    const root = document.documentElement;
    const { ScrollTrigger } = ensureGSAP();
    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    const setAura = (id: string) => {
      root.dataset.aura = id;
    };

    AURA_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 62%",
        end: "bottom 38%",
        onEnter: () => setAura(id),
        onEnterBack: () => setAura(id)
      });
      triggers.push(st);
    });

    setAura("hero");

    return () => {
      triggers.forEach((t) => t.kill());
      delete root.dataset.aura;
    };
  }, [reduced]);

  return null;
}
