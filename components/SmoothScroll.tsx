"use client";

import { PropsWithChildren, useRef } from "react";
import Lenis from "lenis";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function SmoothScroll({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    // Lenis smooth scroll: desktop only
    // On mobile: native touch scroll is faster and smoother; Lenis adds JS overhead
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (prefersReducedMotion || isMobile) return;

    const { gsap, ScrollTrigger } = ensureGSAP();
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      infinite: false
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    const tick = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
