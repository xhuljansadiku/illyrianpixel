"use client";

import { useRef } from "react";
import { ensureGSAP, getIsMobile, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function BrandSignature() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!layerRef.current || !glowRef.current || reducedMotion || getIsMobile()) return;
    const { gsap } = ensureGSAP();
    let frame = 0;
    let nextX = -320;
    let nextY = -320;

    const handleMove = (event: MouseEvent) => {
      nextX = event.clientX - 160;
      nextY = event.clientY - 160;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        gsap.to(glowRef.current, {
          x: nextX,
          y: nextY,
          duration: MOTION.duration.fast,
          ease: MOTION.ease.enter
        });
        frame = 0;
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <div className="noir-grid absolute inset-0" />
      <div
        ref={glowRef}
        className="absolute -left-[320px] -top-[320px] h-[320px] w-[320px] rounded-full bg-accent/15 blur-[95px]"
      />
    </div>
  );
}
