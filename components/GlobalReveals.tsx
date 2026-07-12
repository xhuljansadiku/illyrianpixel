"use client";

import { useEffect, useRef } from "react";
import { ensureGSAP, useReducedMotion } from "@/lib/gsap";

export default function GlobalReveals() {
  const reduced = useReducedMotion();
  const revealed = useRef(new WeakSet<HTMLElement>());

  useEffect(() => {
    // Skip on mobile — ScrollTrigger.refresh() causes 364ms forced reflow on mobile GPU
    if (reduced || window.matchMedia("(max-width: 767px)").matches) return;

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

        // Parallax me thellësi: çdo element me data-parallax="0.x" lëviz me
        // shpejtësi të ndryshme nga scroll-i — shtresa dekorative marrin jetë.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "0");
          if (!speed) return;
          gsap.fromTo(
            el,
            { yPercent: -speed * 8 },
            {
              yPercent: speed * 8,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });
      cleanup = () => ctx.revert();
    };

    // Defer until browser is idle — never blocks LCP or long tasks
    let idleId: number;
    let fallbackId: number;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(init, { timeout: 2000 });
    } else {
      fallbackId = window.setTimeout(init, 300) as unknown as number;
    }

    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      window.clearTimeout(fallbackId);
      cleanup();
    };
  }, [reduced]);

  return null;
}
