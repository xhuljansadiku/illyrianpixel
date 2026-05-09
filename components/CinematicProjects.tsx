"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ensureGSAP, getIsMobile, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import { caseStudies } from "@/lib/caseStudies";

// Use first 4 projects
const PROJECTS = caseStudies.slice(0, 4);
const NUM_SLIDES = PROJECTS.length + 2; // intro + projects + cta

export default function CinematicProjects() {
  const sectionRef   = useRef<HTMLElement | null>(null);
  const trackRef     = useRef<HTMLDivElement | null>(null);
  const imageRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const ctaBtnRef    = useRef<HTMLAnchorElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    const { gsap, ScrollTrigger } = ensureGSAP();
    const isMobile = getIsMobile();

    if (isMobile || reducedMotion) {
      // Mobile: simple fade-in per slide (vertical)
      const ctx = gsap.context(() => {
        gsap.fromTo(".cp-mobile-item",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: MOTION.duration.base, stagger: 0.12, ease: MOTION.ease.enter,
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
        );
      }, sectionRef);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      const getWidth = () => (NUM_SLIDES - 1) * window.innerWidth;

      // Main horizontal scroll
      const tween = gsap.to(trackRef.current, {
        x: () => -getWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.4,
          start: "top top",
          end: () => `+=${getWidth()}`,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (NUM_SLIDES - 1),
            duration: { min: 0.3, max: 0.6 },
            delay: 0.05,
            ease: "power1.inOut",
          },
          onUpdate(self) {
            const idx = Math.round(self.progress * (NUM_SLIDES - 1));
            setActiveIdx(idx);
          },
        },
      });

      // Per-image subtle scale on active
      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { scale: 1.06 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getWidth()}`,
          scrub: true,
          onUpdate(self) {
            const slideProgress = self.progress * (NUM_SLIDES - 1);
            const dist = Math.abs(slideProgress - (i + 1)); // +1 because projects start at slide 1
            const scale = 1 + Math.max(0, 0.06 - dist * 0.04);
            gsap.set(el, { scale });
          }
        });
      });

      // CTA pulse
      if (ctaBtnRef.current) {
        gsap.to(ctaBtnRef.current, { scale: 1.02, duration: 2, repeat: -1, yoyo: true, repeatDelay: 3, ease: "sine.inOut" });
      }

      return () => tween.scrollTrigger?.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="projektet"
      ref={sectionRef}
      className="relative bg-bg"
      aria-label="Projektet e Illyrian Pixel"
    >
      {/* ── DESKTOP: Horizontal scroll ── */}
      <div className="hidden h-screen overflow-hidden lg:block">
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${NUM_SLIDES * 100}vw` }}
        >

          {/* ── Slide 0: Intro ── */}
          <div className="relative flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-[8vw]">
            {/* BG grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(200,155,46,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,155,46,0.05) 1px, transparent 1px)", backgroundSize: "48px 48px" }} aria-hidden />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.05] blur-[120px]" aria-hidden />

            <div className="relative max-w-3xl text-center">
              <div className={`transition-all duration-700 ${activeIdx === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <SectionMark label="PROJEKTET" eyebrowClassName="tracking-[0.3em]" />
                <h2 className="font-display mt-5 text-[clamp(2.4rem,5.5vw,5rem)] font-normal leading-[1.05] tracking-[-0.025em] text-white">
                  Rezultate reale nga{" "}
                  <span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">
                    projekte reale
                  </span>
                </h2>
                <p className="font-body mx-auto mt-6 max-w-[48ch] text-[1rem] leading-relaxed text-white/50">
                  Nuk tregojmë vetëm dizajn. Tregojmë si faqet tona sjellin klientë dhe rritje reale për biznese shqiptare.
                </p>
              </div>

              {/* Scroll hint */}
              <div className={`mt-14 flex items-center justify-center gap-3 transition-all duration-700 delay-200 ${activeIdx === 0 ? "opacity-100" : "opacity-0"}`}>
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/28">SCROLLO PËR TË EKSPLORUAR</span>
                <div className="flex gap-1">
                  {Array.from({ length: NUM_SLIDES }).map((_, i) => (
                    <span key={i} className={`block h-[3px] w-[18px] rounded-full transition-all duration-400 ${i === activeIdx ? "bg-accent" : "bg-white/15"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Project slides ── */}
          {PROJECTS.map((project, i) => {
            const slideIdx = i + 1;
            const isActive = activeIdx === slideIdx;
            return (
              <div
                key={project.slug}
                className="relative flex h-screen w-screen flex-shrink-0 items-center overflow-hidden"
              >
                {/* BG tint per project */}
                <div className="pointer-events-none absolute inset-0 bg-bg" aria-hidden />
                <div className="pointer-events-none absolute inset-0 opacity-[0.3]" style={{ backgroundImage: "linear-gradient(rgba(200,155,46,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,155,46,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} aria-hidden />

                <div className="relative z-[1] grid h-full w-full grid-cols-[1fr_1fr] px-[6vw]">

                  {/* LEFT: Text */}
                  <div className={`flex flex-col justify-center pr-12 transition-all duration-700 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-[11px] tracking-[0.22em] text-accent/60">{String(slideIdx).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-accent/30" aria-hidden />
                      <span className="font-body text-[11px] uppercase tracking-[0.18em] text-white/35">{project.category}</span>
                    </div>

                    <h2 className="font-display text-[clamp(2.2rem,4.5vw,4.2rem)] font-normal leading-[1.06] tracking-[-0.025em] text-white">
                      {project.title}
                    </h2>

                    <div className="mt-8 space-y-5">
                      {/* Problem */}
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/28">Sfida</span>
                        <p className="font-body mt-1.5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-white/50">
                          {project.problem}
                        </p>
                      </div>

                      {/* Result */}
                      <div className="flex items-start gap-3">
                        <span className="mt-[5px] block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">Rezultati</span>
                          <p className="font-body mt-1 max-w-[38ch] text-[0.9375rem] font-light leading-relaxed text-white/70">
                            {project.result}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex items-center gap-6">
                      <Link
                        href={`/projektet/${project.slug}`}
                        className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.04em] text-accent transition-all duration-300 hover:gap-3"
                      >
                        Shiko projektin
                        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                      </Link>
                      <span className="font-mono text-[11px] tracking-[0.1em] text-white/22">{project.location}</span>
                    </div>
                  </div>

                  {/* RIGHT: Visual */}
                  <div className={`flex items-center justify-end transition-all duration-700 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}>
                    <div
                      ref={(el) => { imageRefs.current[i] = el; }}
                      className="relative h-[65vh] w-full max-w-[580px] overflow-hidden rounded-2xl"
                      style={{ boxShadow: isActive ? "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,155,46,0.12)" : "0 16px 40px rgba(0,0,0,0.35)" }}
                    >
                      {/* Gold border on active */}
                      <div className={`absolute inset-0 z-10 rounded-2xl border transition-colors duration-600 ${isActive ? "border-accent/25" : "border-white/[0.08]"}`} />

                      <Image
                        src={project.heroImage}
                        alt={project.title}
                        fill
                        className="object-cover object-top"
                        sizes="580px"
                        priority={i === 0}
                      />

                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />

                      {/* Corner accent */}
                      <span className="pointer-events-none absolute right-4 top-4 block h-4 w-4 border-r border-t border-accent/35" aria-hidden />

                      {/* Tags */}
                      <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-white/[0.12] bg-bg/60 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-white/50 backdrop-blur-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Slide progress bar */}
                <div className="absolute bottom-8 left-[6vw] flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-white/22">{String(slideIdx).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
                  <div className="h-px w-24 bg-white/10">
                    <div className="h-full bg-accent/50 transition-all duration-600" style={{ width: isActive ? "100%" : "0%" }} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Final slide: CTA ── */}
          <div className="relative flex h-screen w-screen flex-shrink-0 items-center justify-center px-[8vw]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(200,155,46,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,155,46,0.05) 1px, transparent 1px)", backgroundSize: "48px 48px" }} aria-hidden />
            <div className={`pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[130px] transition-opacity duration-700 ${activeIdx === NUM_SLIDES - 1 ? "opacity-100" : "opacity-0"}`} aria-hidden />

            <div className={`relative max-w-2xl text-center transition-all duration-700 ${activeIdx === NUM_SLIDES - 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <span className="font-mono text-[11px] tracking-[0.22em] text-accent/60">HAPI TJETËR</span>
              <h2 className="font-display mt-4 text-[clamp(2.2rem,5vw,4.5rem)] font-normal leading-[1.06] tracking-[-0.025em] text-white">
                Dëshiron rezultate si këto<br />
                <span className="text-accent">për biznesin tënd?</span>
              </h2>
              <p className="font-body mx-auto mt-5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-white/45">
                Fillojmë me një bisedë falas. Na trego çfarë do të ndërtojmë bashkë.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <Link
                  ref={ctaBtnRef}
                  href="/contact"
                  data-magnetic="true"
                  className="interactive-button ip-cta-primary ip-cta-primary--lg inline-flex"
                >
                  Rezervo konsultë falas →
                </Link>
                <Link href="/projektet" className="luxury-link text-[13px]">
                  Shiko të gjitha projektet <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation dots */}
        <div className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-2 lg:flex" aria-hidden>
          {Array.from({ length: NUM_SLIDES }).map((_, i) => (
            <span key={i} className={`block rounded-full transition-all duration-400 ${i === activeIdx ? "h-[6px] w-[18px] bg-accent" : "h-[5px] w-[5px] bg-white/20"}`} />
          ))}
        </div>
      </div>

      {/* ── MOBILE: Vertical stack ── */}
      <div className="lg:hidden">
        {/* Intro */}
        <div className="cp-mobile-item border-b border-white/[0.06] px-5 py-16 text-center md:px-10">
          <SectionMark label="PROJEKTET" eyebrowClassName="tracking-[0.3em]" />
          <h2 className="font-display mx-auto mt-4 max-w-lg text-[clamp(2rem,7vw,2.8rem)] font-normal leading-[1.06] text-white">
            Rezultate reale nga{" "}
            <span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">projekte reale</span>
          </h2>
          <p className="font-body mx-auto mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-white/48">
            Nuk tregojmë vetëm dizajn, tregojmë si faqet tona sjellin klientë dhe rritje reale.
          </p>
        </div>

        {/* Project cards */}
        {PROJECTS.map((project, i) => (
          <div key={project.slug} className="cp-mobile-item border-b border-white/[0.06]">
            {/* Image */}
            <div className="relative h-[52vw] max-h-[280px] overflow-hidden">
              <Image src={project.heroImage} alt={project.title} fill className="object-cover object-top" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" />
              <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-accent/70">
                {String(i + 1).padStart(2, "0")} · {project.category}
              </span>
            </div>

            {/* Content */}
            <div className="px-5 py-7 md:px-10">
              <h3 className="font-display text-[1.4rem] font-normal text-white">{project.title}</h3>
              <p className="font-body mt-3 text-[0.875rem] leading-relaxed text-white/48">{project.problem}</p>
              <div className="mt-4 flex items-start gap-2.5">
                <span className="mt-[5px] block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <p className="font-body text-[0.875rem] leading-relaxed text-white/65">{project.result}</p>
              </div>
              <Link href={`/projektet/${project.slug}`} className="mt-5 inline-flex items-center gap-2 font-body text-[0.875rem] text-accent">
                Shiko projektin <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        ))}

        {/* Mobile CTA */}
        <div className="cp-mobile-item px-5 py-16 text-center md:px-10">
          <h2 className="font-display text-[clamp(1.8rem,6vw,2.4rem)] font-normal leading-[1.06] text-white">
            Dëshiron rezultate si këto<br />
            <span className="text-accent">për biznesin tënd?</span>
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg inline-flex">
              Rezervo konsultë falas →
            </Link>
            <Link href="/projektet" className="luxury-link text-[13px]">
              Shiko të gjitha projektet <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
