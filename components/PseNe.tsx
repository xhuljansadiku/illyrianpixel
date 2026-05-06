"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ensureGSAP, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const panels = [
  {
    number: "01",
    title: "Fokus te rezultati",
    body: "Qëllimi ynë nuk është një website i bukur, por një sistem që ju sjell klientë dhe kërkesa reale.",
    pos: "top-[4%] left-[2%]",
    rest: { rotateX: 3, rotateY: -5, z: 35 },
    depth: 1.0,
    w: 230,
  },
  {
    number: "02",
    title: "Strategji para dizajnit",
    body: "Para se të ndërtojmë, kuptojmë biznesin, tregun dhe klientët tuaj. Pastaj krijojmë zgjidhjen që funksionon.",
    pos: "top-[2%] right-[0%]",
    rest: { rotateX: -2, rotateY: 7, z: 5 },
    depth: 0.45,
    w: 220,
  },
  {
    number: "03",
    title: "SEO & performancë",
    body: "Website që shfaqen në Google dhe janë të ndërtuara për të kthyer vizitorët në klientë.",
    pos: "bottom-[6%] left-[6%]",
    rest: { rotateX: 4, rotateY: -6, z: 3 },
    depth: 0.35,
    w: 210,
  },
  {
    number: "04",
    title: "Partneritet afatgjatë",
    body: "Nuk zhdukemi pas publikimit. Ju ndihmojmë me përmirësime, marketing dhe rritje të vazhdueshme.",
    pos: "bottom-[2%] right-[2%]",
    rest: { rotateX: -3, rotateY: 5, z: 18 },
    depth: 0.7,
    w: 240,
  },
];


export default function PseNe() {
  const sectionRef   = useRef<HTMLElement | null>(null);
  const bgGridRef    = useRef<HTMLDivElement | null>(null);
  const bgGlowRef    = useRef<HTMLDivElement | null>(null);
  const fgLinesRef   = useRef<HTMLDivElement | null>(null);
  const eyebrowRef   = useRef<HTMLDivElement | null>(null);
  const headingRef   = useRef<HTMLHeadingElement | null>(null);
  const subtextRef   = useRef<HTMLParagraphElement | null>(null);
  const bottomRef    = useRef<HTMLDivElement | null>(null);
  const ctaBtnRef    = useRef<HTMLAnchorElement | null>(null);
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rightRef     = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: "top 80%" };

      gsap.fromTo(eyebrowRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: MOTION.duration.base, ease: MOTION.ease.enter, scrollTrigger: st }
      );
      gsap.fromTo(
        headingRef.current?.querySelectorAll(".psene-line-inner") ?? [],
        { yPercent: 112, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: st }
      );
      gsap.fromTo([subtextRef.current, bottomRef.current],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: MOTION.duration.base, stagger: 0.14, delay: 0.22, ease: MOTION.ease.enter, scrollTrigger: st }
      );

      // Set resting 3D state
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const { rotateX, rotateY, z } = panels[i].rest;
        gsap.set(el, { rotateX, rotateY, z, opacity: 0, y: 70, filter: "blur(6px)" });
      });

      // Panels stagger in
      gsap.to(panelRefs.current.filter(Boolean), {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.9, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: rightRef.current, start: "top 82%" }
      });

      // Scroll parallax
      if (!reducedMotion) {
        gsap.to(bgGridRef.current, {
          y: 60, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.8 }
        });
        gsap.to(bgGlowRef.current, {
          y: 110, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.4 }
        });
        panelRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            y: `-=${panels[i].depth * 90 + 20}`, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 }
          });
        });
        gsap.to(fgLinesRef.current, {
          y: -80, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 }
        });
      }

      if (!reducedMotion && ctaBtnRef.current) {
        gsap.to(ctaBtnRef.current, { scale: 1.02, duration: 2, repeat: -1, yoyo: true, repeatDelay: 3, ease: "sine.inOut" });
      }
    }, sectionRef);

    let onMove: ((e: PointerEvent) => void) | null = null;
    if (!reducedMotion && sectionRef.current) {
      const quickSetters = panelRefs.current.map((el) => el ? {
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power2.out" }),
        rX: gsap.quickTo(el, "rotateX", { duration: 0.9, ease: "power2.out" }),
        rY: gsap.quickTo(el, "rotateY", { duration: 0.9, ease: "power2.out" }),
      } : null);
      const glowX = gsap.quickTo(bgGlowRef.current, "x", { duration: 1.2, ease: "power2.out" });
      const glowY = gsap.quickTo(bgGlowRef.current, "y", { duration: 1.2, ease: "power2.out" });

      onMove = (e: PointerEvent) => {
        const rect = sectionRef.current!.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        quickSetters.forEach((qs, i) => {
          if (!qs) return;
          const d = panels[i].depth;
          qs.x(mx * 28 * d);
          qs.rY(panels[i].rest.rotateY + mx * 10 * d);
          qs.rX(panels[i].rest.rotateX - my * 8 * d);
        });
        glowX(mx * 80);
        glowY(my * 60);
      };
      sectionRef.current.addEventListener("pointermove", onMove);
    }

    return () => {
      ctx.revert();
      if (onMove && sectionRef.current) sectionRef.current.removeEventListener("pointermove", onMove);
    };
  }, [reducedMotion]);

  const onPanelEnter = (i: number) => {
    if (reducedMotion || !panelRefs.current[i]) return;
    setHoveredPanel(i);
    const { gsap } = ensureGSAP();
    gsap.to(panelRefs.current[i], { z: panels[i].rest.z + 40, scale: 1.03, duration: 0.35, ease: "power2.out" });
  };

  const onPanelLeave = (i: number) => {
    if (!panelRefs.current[i]) return;
    setHoveredPanel(null);
    const { gsap } = ensureGSAP();
    gsap.to(panelRefs.current[i], { z: panels[i].rest.z, scale: 1, duration: 0.4, ease: "power2.out" });
  };

  const onCtaMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ctaBtnRef.current) return;
    const rect = ctaBtnRef.current.getBoundingClientRect();
    const { gsap } = ensureGSAP();
    gsap.to(ctaBtnRef.current, {
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.13,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.13,
      duration: 0.3, ease: "power2.out"
    });
  };
  const onCtaLeave = () => {
    if (!ctaBtnRef.current) return;
    const { gsap } = ensureGSAP();
    gsap.to(ctaBtnRef.current, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
  };

  return (
    <section
      id="pse-ne"
      ref={sectionRef}
      className="cinematic-section relative overflow-hidden border-b border-white/[0.06] bg-bg"
    >
      {/* BG grid */}
      <div
        ref={bgGridRef}
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "linear-gradient(rgba(200,155,46,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,155,46,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      {/* BG glow */}
      <div ref={bgGlowRef} className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[130px]" aria-hidden />
      {/* FG lines */}
      <div ref={fgLinesRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 1200 600" className="absolute inset-0 h-full w-full opacity-[0.18]" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="200" x2="1200" y2="320" stroke="rgba(200,155,46,1)" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="400" y2="600" stroke="rgba(200,155,46,1)" strokeWidth="0.5" />
          <line x1="900" y1="0" x2="700" y2="600" stroke="rgba(200,155,46,1)" strokeWidth="0.5" />
          <circle cx="400" cy="200" r="1.5" fill="rgba(200,155,46,1)" />
          <circle cx="800" cy="380" r="1.5" fill="rgba(200,155,46,1)" />
          <circle cx="600" cy="100" r="1" fill="rgba(200,155,46,1)" />
        </svg>
      </div>

      <div className="section-wrap relative z-[1] py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-12 items-center gap-y-14 lg:gap-x-12 xl:gap-x-16">

          {/* LEFT */}
          <div className="relative col-span-12 flex flex-col gap-8 lg:col-span-5 lg:sticky lg:top-24 lg:pb-8">

            {/* Subtle gold glow behind headline */}
            <div
              className="pointer-events-none absolute -left-8 -top-8 h-[280px] w-[280px] rounded-full opacity-[0.12] blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(200,155,46,1), transparent 70%)" }}
              aria-hidden
            />

            <div ref={eyebrowRef}>
              <SectionMark label="PSE NE" eyebrowClassName="tracking-[0.3em]" />
            </div>

            {/* Headline — editorial line breaks + gold gradient on klientë */}
            <h2
              ref={headingRef}
              className="relative font-display text-[clamp(2rem,3.8vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.025em] text-white"
            >
              <span className="block overflow-hidden">
                <span className="psene-line-inner block">
                  {"Rritje reale për "}
                  <span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">
                    {"biznesin tuaj."}
                  </span>
                </span>
              </span>
            </h2>

            {/* Subtext — stronger, clearer */}
            <p
              ref={subtextRef}
              className="font-body max-w-[40ch] text-[0.9375rem] leading-[1.65] text-white/55"
            >
              Ne nuk ndërtojmë vetëm website. Ndërtojmë sisteme dixhitale që sjellin klientë, kërkesa dhe rritje reale për biznesin tuaj.
            </p>

            <div ref={bottomRef} className="flex flex-col items-start gap-6">
              {/* CTA block */}
              <div className="flex flex-col items-start gap-6">
                <div className="flex items-center gap-2.5">
                  <span className="block h-px w-5 shrink-0 bg-accent/45" aria-hidden />
                  <p className="font-body text-[0.8rem] font-light italic text-white/35">
                    Zgjidhja që funksionon për biznesin tuaj fillon këtu.
                  </p>
                </div>
                <Link
                  ref={ctaBtnRef}
                  href="/contact"
                  data-magnetic="true"
                  className="interactive-button ip-cta-primary ip-cta-primary--lg inline-flex"
                  onPointerMove={onCtaMove}
                  onPointerLeave={onCtaLeave}
                >
                  Rezervo konsultë falas →
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — 3D panels desktop */}
          <div ref={rightRef} className="col-span-12 hidden lg:col-span-7 lg:block [perspective:1000px]">
            <div className="relative h-[560px] [transform-style:preserve-3d]">
              {panels.map((panel, i) => (
                <div key={panel.number} ref={(el) => { panelRefs.current[i] = el; }} className={`absolute ${panel.pos}`} style={{ width: panel.w }} onPointerEnter={() => onPanelEnter(i)} onPointerLeave={() => onPanelLeave(i)}>
                  <div className="pointer-events-none absolute -inset-[6px] rounded-2xl blur-[16px]" style={{ background: "radial-gradient(circle, rgba(200,155,46,0.22), transparent 70%)", opacity: hoveredPanel === i ? 1 : 0, transition: "opacity 0.4s ease" }} aria-hidden />
                  <div className="relative overflow-hidden rounded-2xl px-5 py-5 backdrop-blur-sm" style={{ background: "rgba(18,18,18,0.72)", border: hoveredPanel === i ? "1px solid rgba(201,155,46,0.45)" : "1px solid rgba(255,255,255,0.08)", boxShadow: hoveredPanel === i ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,155,46,0.12) inset" : "0 12px 40px rgba(0,0,0,0.35)", transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}>
                    <span className="pointer-events-none absolute left-2.5 top-2.5 block h-2.5 w-2.5 border-l border-t border-accent/35" aria-hidden />
                    <span className="pointer-events-none absolute bottom-2.5 right-2.5 block h-2.5 w-2.5 border-b border-r border-accent/35" aria-hidden />
                    <span className="font-mono text-[10px] tracking-[0.22em] text-accent/50">{panel.number}</span>
                    <h3 className="font-display mt-2 text-[0.9375rem] font-bold leading-[1.25] tracking-[-0.01em] transition-colors duration-300" style={{ color: hoveredPanel === i ? "rgb(200,155,46)" : "rgba(255,255,255,0.9)" }}>{panel.title}</h3>
                    <p className="font-body mt-2 text-[0.78rem] font-light leading-relaxed text-white/50">{panel.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile stack */}
          <div className="col-span-12 flex flex-col gap-3 lg:hidden">
            {panels.map((panel) => (
              <div key={panel.number} className="rounded-xl px-5 py-5" style={{ background: "rgba(18,18,18,0.72)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="font-mono text-[10px] tracking-[0.2em] text-accent/50">{panel.number}</span>
                <h3 className="font-display mt-1.5 text-[1rem] font-bold leading-[1.25] text-white/90">{panel.title}</h3>
                <p className="font-body mt-2 text-[0.875rem] font-light leading-relaxed text-white/45">{panel.body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
