"use client";

import { useEffect, useRef } from "react";
import { ensureGSAP, useReducedMotion } from "@/lib/gsap";

export default function GlobalReveals() {
  const reduced = useReducedMotion();
  const revealed = useRef(new WeakSet<HTMLElement>());

  useEffect(() => {
    if (reduced) return;

    let cleanup = () => {};

    const init = () => {
      const { gsap, ScrollTrigger } = ensureGSAP();
      const ctx = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>(
          ".cinematic-section .section-title, .cinematic-section .premium-card, .cinematic-section article, .cinematic-section .luxury-link"
        );
        targets
          .filter((el) => !el.closest("#hero") && !el.closest("#process"))
          .forEach((el) => {
            if (revealed.current.has(el)) return;
            revealed.current.add(el);
            gsap.fromTo(
              el,
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true } }
            );
          });
        ScrollTrigger.refresh();
      });
      cleanup = () => ctx.revert();
    };

    // Defer until browser is idle — never blocks LCP or long tasks
    let idleId: number;
    let fallbackId: ReturnType<typeof setTimeout>;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(init, { timeout: 2000 });
    } else {
      fallbackId = window.setTimeout(init, 300);
    }

    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      window.clearTimeout(fallbackId);
      cleanup();
    };
  }, [reduced]);

  return null;
}
