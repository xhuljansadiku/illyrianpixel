"use client";

import { useRef, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

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
    const onMove = (e: MouseEvent) => {
      moveToX(e.clientX - 18);
      moveToY(e.clientY - 18);
    };
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a,button,[data-cursor='active']");
      gsap.to(aura, {
        scale: interactive ? 1.35 : 1,
        backgroundColor: interactive ? "rgba(200,155,46,0.18)" : "rgba(245,245,240,0.08)",
        duration: 0.25
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduced]);

  if (!mounted || getIsMobile() || reduced) return null;

  return <div ref={auraRef} className="pointer-events-none fixed left-0 top-0 z-[85] h-9 w-9 rounded-full border border-white/20 bg-white/[0.08] blur-[0.2px]" />;
}
