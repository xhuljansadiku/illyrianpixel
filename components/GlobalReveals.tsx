"use client";

import { useEffect, useRef } from "react";
import { ensureGSAP, useReducedMotion } from "@/lib/gsap";

export default function GlobalReveals() {
  const reduced = useReducedMotion();
  const revealed = useRef(new WeakSet<HTMLElement>());

  useEffect(() => {
    if (reduced) return;

    let cleanup = () => {};
    const scheduleInit = () => {
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
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true }
              }
            );
          });
        ScrollTrigger.refresh();
      });
      cleanup = () => ctx.revert();
    };

    // Use requestIdleCallback so reveals never block LCP or main-thread tasks
    const supportsIdle = typeof window.requestIdleCallback === "function";
    let idleId: number;
    let timerId: ReturnType<typeof setTimeout>;

    if (supportsIdle) {
      idleId = window.requestIdleCallback(scheduleInit, { timeout: 2000 });
    } else {
      timerId = window.setTimeout(scheduleInit, 300);
    }

    return () => {
      if (supportsIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(timerId);
      cleanup();
    };
  }, [reduced]);

  return null;
}
