"use client";

import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function MagneticButtons() {
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || getIsMobile()) return;
    const { gsap } = ensureGSAP();
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic='true']"));
    const cleanups: Array<() => void> = [];

    els.forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.26, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.26, ease: "power3.out" });
      const onMove = (ev: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = ev.clientX - (rect.left + rect.width / 2);
        const dy = ev.clientY - (rect.top + rect.height / 2);
        xTo(Math.max(-8, Math.min(8, dx * 0.15)));
        yTo(Math.max(-8, Math.min(8, dy * 0.15)));
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((dispose) => dispose());
  }, [reduced]);

  return null;
}
