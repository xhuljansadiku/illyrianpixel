"use client";

import { useRef } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

/** One scroll-driven glass signature: blob → card → UI frame. */
export default function MorphGlassSignature() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const morphRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !morphRef.current) return;
    const { gsap } = ensureGSAP();
    const isMobile = getIsMobile();
    const el = morphRef.current;

    if (reduced || isMobile) {
      gsap.set(el, { borderRadius: "1.1rem", scale: 1, rotate: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { borderRadius: "52%", scale: 0.86, rotate: -6, boxShadow: "0 0 0 rgba(200,155,46,0)" },
        {
          borderRadius: "1.05rem",
          scale: 1.05,
          rotate: 0,
          boxShadow: "0 0 80px rgba(200,155,46,0.12)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            end: "bottom 22%",
            scrub: 1.05
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="morph-glass"
      ref={sectionRef}
      className="cinematic-section pointer-events-none relative min-h-[38vh] border-t border-white/[0.05] py-16 md:min-h-[42vh] md:py-20"
    >
      <div className="section-wrap relative flex items-center justify-center">
        <div
          ref={morphRef}
          className="relative h-[min(52vw,320px)] w-[min(52vw,320px)] border border-white/14 bg-white/[0.04] backdrop-blur-xl md:h-[280px] md:w-[280px]"
          style={{ willChange: "transform, border-radius" }}
        >
          <div className="pointer-events-none absolute inset-[14%] rounded-[0.65rem] border border-white/10 bg-black/20" />
          <div className="pointer-events-none absolute inset-[26%] rounded-md border border-accent/25 bg-accent/[0.04]" />
          <p className="absolute bottom-6 left-1/2 w-[88%] -translate-x-1/2 text-center text-[10px] tracking-[0.2em] text-white/35">
            SIGNATURE
          </p>
        </div>
      </div>
    </section>
  );
}
