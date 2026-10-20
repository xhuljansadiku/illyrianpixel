"use client";

// Titujt e seksioneve "ndizen" me scroll (2026-10-20, zgjedhur nga useri — varianti A).
// Një brez drite e artë kalon nëpër çdo h2.section-title te <main> ndërsa titulli ngjitet
// nga fundi i ekranit drejt mesit (CSS .light-sweep-on te globals.css). Animohet vetëm
// background-position — s'përplaset me reveal-et ekzistuese (opacity/y). Me reduced-motion
// ose pa JS titujt mbeten si më parë.
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function SectionTitleSweep() {
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const { gsap } = ensureGSAP();
    const titles = gsap.utils.toArray<HTMLElement>("main h2.section-title");
    const ctx = gsap.context(() => {
      for (const el of titles) {
        el.classList.add("light-sweep-on");
        gsap.fromTo(
          el,
          { backgroundPosition: "100% 0%" },
          { backgroundPosition: "0% 0%", ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 40%", scrub: 0.6 } }
        );
      }
    });
    return () => {
      ctx.revert();
      for (const el of titles) el.classList.remove("light-sweep-on");
    };
  }, [reduced]);

  return null;
}
