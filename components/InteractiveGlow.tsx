"use client";

import { useRef } from "react";
import { getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import { mouseBus } from "@/lib/mouseBus";

export default function InteractiveGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!glowRef.current || reduced || getIsMobile()) return;
    const glow = glowRef.current;
    return mouseBus.onMove((x, y) => {
      glow.style.setProperty("--gx", `${x}px`);
      glow.style.setProperty("--gy", `${y}px`);
    });
  }, [reduced]);

  return <div ref={glowRef} className="interactive-spotlight pointer-events-none fixed inset-0 z-[2]" aria-hidden />;
}
