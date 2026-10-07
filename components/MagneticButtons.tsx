"use client";

import { useEffect } from "react";
import { ensureGSAP, getIsMobile, useReducedMotion } from "@/lib/gsap";
import { mouseBus } from "@/lib/mouseBus";

export default function MagneticButtons() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || getIsMobile()) return;
    const timer = window.setTimeout(() => {
      const { gsap } = ensureGSAP();
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic='true']"));
      const movers = els.map((el) => ({
        el,
        xTo: gsap.quickTo(el, "x", { duration: 0.3, ease: "power3.out" }),
        yTo: gsap.quickTo(el, "y", { duration: 0.3, ease: "power3.out" }),
      }));

      let rafId: number | null = null;
      let px = 0;
      let py = 0;

      const unsubMove = mouseBus.onMove((x, y) => {
        px = x;
        py = y;
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          movers.forEach(({ el, xTo, yTo }) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = px - cx;
            const dy = py - cy;
            const distance = Math.hypot(dx, dy);
            const radius = Math.max(rect.width, rect.height) * 0.5 + 50;
            if (distance > radius) { xTo(0); yTo(0); return; }
            const influence = 1 - distance / radius;
            xTo(Math.max(-12, Math.min(12, dx * 0.2 * influence)));
            yTo(Math.max(-12, Math.min(12, dy * 0.2 * influence)));
          });
        });
      });

      const unsubLeave = mouseBus.onLeave(() => {
        movers.forEach(({ xTo, yTo }) => { xTo(0); yTo(0); });
      });

      cleanup = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        unsubMove();
        unsubLeave();
      };
    }, 120);

    let cleanup = () => {};
    return () => { window.clearTimeout(timer); cleanup(); };
  }, [reduced]);

  return null;
}
