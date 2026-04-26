"use client";

import { useRef } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const chips = [
  { id: "slow", label: "NGADALË" },
  { id: "struct", label: "PA STRUKTURË" },
  { id: "seo", label: "PA SEO" },
  { id: "conv", label: "PA KONVERTIM" }
];

const pillars = [
  { title: "Strukturë", body: "Hierarki dhe ritëm që udhëheqin vëmendjen." },
  { title: "Performancë", body: "Shpejtësi, matje, përmirësim i vazhdueshëm." },
  { title: "Premium", body: "Detaje që mbeten të qeta — por ndihen." }
];

/**
 * Pinned scroll narrative (~3.6× viewport): chaos → alignment → structured grid.
 * Reduced motion / mobile: static “resolved” layout only (no pin).
 */
export default function ChaosToClarity() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!wrapRef.current || !pinRef.current) return;
    const { gsap } = ensureGSAP();
    const isMobile = getIsMobile();
    const chipEls = chipRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (reduced || isMobile) {
      gsap.set(chipEls, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" });
      gsap.set([headlineRef.current, subRef.current], { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(lineRef.current, { scaleX: 1, opacity: 1 });
      gsap.set(gridCardRefs.current.filter(Boolean), { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(chipEls, {
        opacity: 0.32,
        x: (i) => (i % 2 === 0 ? -1 : 1) * (46 + i * 10),
        y: (i) => -18 + i * 22 + (i % 3) * 8,
        rotate: (i) => -9 + i * 5,
        scale: 0.94,
        filter: "blur(10px)"
      });
      gsap.set(headlineRef.current, { opacity: 0.35, y: 36, filter: "blur(8px)", letterSpacing: "0.02em" });
      gsap.set(subRef.current, { opacity: 0.25, y: 22, filter: "blur(6px)" });
      gsap.set(lineRef.current, { scaleX: 0.08, opacity: 0.25 });
      gsap.set(gridCardRefs.current.filter(Boolean), { opacity: 0, y: 42, filter: "blur(8px)", scale: 0.96 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=360%",
          pin: pinRef.current,
          scrub: 1.12,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(
        chipEls,
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 1.1,
          ease: "power3.out"
        },
        0
      )
        .to(lineRef.current, { scaleX: 1, opacity: 1, duration: 0.85, ease: "power2.inOut" }, 0.15)
        .to(
          headlineRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.01em", duration: 1, ease: "power3.out" },
          0.35
        )
        .to(subRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out" }, 0.55)
        .to(
          gridCardRefs.current.filter(Boolean),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 1.15,
            ease: "power3.out"
          },
          0.72
        );
    }, wrapRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="chaos-clarity"
      ref={wrapRef}
      className="chaos-clarity-root cinematic-section relative border-t border-white/[0.06] !min-h-0 py-0 md:py-0"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden py-16 md:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(200,155,46,0.14),transparent_55%)] opacity-90" />
        <div className="pointer-events-none absolute inset-0 noir-grid opacity-[0.14]" />

        <div className="section-wrap relative z-[1] w-full">
          <p className="text-[11px] tracking-[0.22em] text-accent/90">BRAND TRANSFORMATION</p>
          <h2
            ref={headlineRef}
            className="mt-4 max-w-[16ch] font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.96] tracking-[0.01em] text-white"
          >
            Nga kaosi në qartësi.
          </h2>
          <p ref={subRef} className="mt-4 max-w-xl text-sm leading-relaxed text-white/62 md:text-base">
            Një rrjedhë e vetme scroll: ide e përzier → strukturë → sistem premium që lexohet dhe konverton.
          </p>

          <div className="relative mt-14 min-h-[200px] md:min-h-[240px]">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {chips.map((c, i) => (
                <span
                  key={c.id}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  className="rounded-full border border-white/14 bg-white/[0.05] px-4 py-2 text-[11px] tracking-[0.2em] text-white/78 backdrop-blur-md will-change-transform"
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div
              ref={lineRef}
              className="mx-auto mt-12 h-px w-[min(640px,92%)] origin-center bg-gradient-to-r from-transparent via-accent/75 to-transparent will-change-transform"
            />
          </div>

          <div ref={gridRef} className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  gridCardRefs.current[i] = el;
                }}
                className="rounded-[1.05rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md md:p-6"
              >
                <p className="text-[11px] tracking-[0.2em] text-accent/90">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
