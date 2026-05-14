"use client";

import { useRef, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import { mouseBus } from "@/lib/mouseBus";

export default function CustomCursor() {
  const auraRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !auraRef.current || getIsMobile() || reduced) return;
    const { gsap } = ensureGSAP();
    const aura = auraRef.current;
    const moveToX = gsap.quickTo(aura, "x", { duration: 0.2, ease: "power3.out" });
    const moveToY = gsap.quickTo(aura, "y", { duration: 0.2, ease: "power3.out" });

    const unsubMove = mouseBus.onMove((x, y) => {
      moveToX(x - 18);
      moveToY(y - 18);
    });

    const unsubOver = mouseBus.onOver((e) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a,button,[data-cursor='active']");
      const headline = target?.closest("[data-cursor='headline'], .section-title, .hero-headline-trigger, .cadence-title");
      gsap.to(aura, {
        scale: headline ? 2.35 : interactive ? 1.35 : 1,
        backgroundColor: headline ? "rgba(245,245,240,0.92)" : interactive ? "rgba(171, 131, 57,0.18)" : "rgba(245,245,240,0.08)",
        mixBlendMode: headline ? "difference" : "normal",
        duration: 0.25,
      });
    });

    return () => { unsubMove(); unsubOver(); };
  }, [mounted, reduced]);

  if (!mounted || getIsMobile() || reduced) return null;

  return <div ref={auraRef} className="pointer-events-none fixed left-0 top-0 z-[85] h-9 w-9 rounded-full border border-white/20 bg-white/[0.08] blur-[0.2px]" />;
}
