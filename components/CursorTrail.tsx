"use client";

import { useRef, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const POOL = 14;

/** Very subtle gold specks following the pointer (desktop). */
export default function CursorTrail() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const poolRef = useRef<Array<HTMLSpanElement | null>>([]);
  const iRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || reduced) return;
    if (getIsMobile()) return;
    const { gsap } = ensureGSAP();
    const onMove = (e: MouseEvent) => {
      const idx = iRef.current % POOL;
      iRef.current += 1;
      const el = poolRef.current[idx];
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.set(el, {
        x: e.clientX,
        y: e.clientY,
        opacity: 0.28,
        scale: 1,
        transformOrigin: "center center"
      });
      gsap.to(el, { opacity: 0, scale: 0.35, duration: 0.55, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mounted, reduced]);

  if (!mounted || reduced) return null;
  if (typeof window !== "undefined" && getIsMobile()) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]" aria-hidden>
      {Array.from({ length: POOL }).map((_, idx) => (
        <span
          key={idx}
          ref={(el) => {
            poolRef.current[idx] = el;
          }}
          className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-accent/55 blur-[0.3px]"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        />
      ))}
    </div>
  );
}
