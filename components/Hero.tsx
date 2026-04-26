"use client";

import { useRef } from "react";
import Image from "next/image";
import { ensureGSAP, getIsMobile, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function Hero() {
  const voxelTrail = [
    { x: 6, y: 70, s: 7, d: 0.08 },
    { x: 12, y: 64, s: 7, d: 0.16 },
    { x: 20, y: 58, s: 8, d: 0.26 },
    { x: 28, y: 52, s: 8, d: 0.36 },
    { x: 36, y: 46, s: 7, d: 0.48 },
    { x: 44, y: 40, s: 7, d: 0.58 },
    { x: 53, y: 34, s: 6, d: 0.7 },
    { x: 60, y: 30, s: 6, d: 0.82 },
    { x: 67, y: 26, s: 5, d: 0.94 },
    { x: 73, y: 24, s: 5, d: 1.06 },
    { x: 78, y: 22, s: 5, d: 1.18 },
    { x: 82, y: 21, s: 5, d: 1.28 },
    { x: 85, y: 20, s: 4, d: 1.38 },
    { x: 88, y: 19, s: 4, d: 1.48 },
    { x: 90, y: 18, s: 4, d: 1.58 },
    { x: 92, y: 17, s: 4, d: 1.68 }
  ];

  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const helmetRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const depthGlowRef = useRef<HTMLDivElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const isMobile = getIsMobile();
    let ctaEl: HTMLAnchorElement | null = null;
    let onCtaMove: ((event: PointerEvent) => void) | null = null;
    let onCtaLeave: (() => void) | null = null;
    let onHeadlineEnter: (() => void) | null = null;
    let onHeadlineLeave: (() => void) | null = null;
    let onHelmetEnter: (() => void) | null = null;
    let onHelmetLeave: (() => void) | null = null;
    let onVisualMove: ((event: PointerEvent) => void) | null = null;
    let onVisualLeave: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const headlineWords = headlineRef.current?.querySelectorAll(".headline-word");
      ctaEl = ctaRef.current;
      const sectionEl = sectionRef.current;

      if (headlineWords?.length) {
        gsap.set(headlineWords, { yPercent: 105, opacity: 0, willChange: "transform, opacity" });
        gsap.to(headlineWords, {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.12,
          delay: 0.08,
          ease: "power4.out"
        });
      }

      gsap.fromTo(
        badgeRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: MOTION.duration.base, delay: 0.18, ease: MOTION.ease.enter }
      );

      gsap.fromTo(
        paragraphRef.current,
        { y: 18, opacity: 0, filter: "blur(4px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: MOTION.duration.base, delay: 0.38, ease: MOTION.ease.enter }
      );

      gsap.fromTo(
        ".hero-cta > *",
        { opacity: 0, y: 22, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: MOTION.stagger.tight,
          duration: MOTION.duration.base,
          ease: MOTION.ease.enter,
          delay: 0.5
        }
      );

      gsap.fromTo(
        particlesRef.current,
        { opacity: 0, xPercent: -4, filter: "blur(1.6px)" },
        { opacity: 1, xPercent: 0, filter: "blur(0px)", duration: 1.2, delay: 0.22, ease: "power3.out" }
      );

      gsap.fromTo(
        helmetRef.current,
        { opacity: 0, scale: 0.96, y: 12, filter: "blur(3px)" },
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.15, delay: 0.3, ease: "power3.out" }
      );

      if (!reducedMotion) {
        if (ctaEl) {
          const cta = ctaEl;
          const maxDistance = isMobile ? 5 : 11;
          const xTo = gsap.quickTo(cta, "x", { duration: 0.28, ease: "power3.out" });
          const yTo = gsap.quickTo(cta, "y", { duration: 0.28, ease: "power3.out" });

          onCtaMove = (event: PointerEvent) => {
            const rect = cta.getBoundingClientRect();
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);
            xTo(Math.max(-maxDistance, Math.min(maxDistance, dx * 0.14)));
            yTo(Math.max(-maxDistance, Math.min(maxDistance, dy * 0.14)));
          };

          onCtaLeave = () => {
            xTo(0);
            yTo(0);
          };

          cta.addEventListener("pointermove", onCtaMove);
          cta.addEventListener("pointerleave", onCtaLeave);

          gsap.set(cta, { willChange: "transform" });
        }

        if (sectionEl) {
          onHeadlineEnter = () => sectionEl.classList.add("headline-trail-boost");
          onHeadlineLeave = () => sectionEl.classList.remove("headline-trail-boost");

          headlineRef.current?.addEventListener("mouseenter", onHeadlineEnter);
          headlineRef.current?.addEventListener("mouseleave", onHeadlineLeave);
        }

        if (visualRef.current) {
          onHelmetEnter = () => sectionEl?.classList.add("helmet-hover-boost");
          onHelmetLeave = () => sectionEl?.classList.remove("helmet-hover-boost");
          visualRef.current.addEventListener("mouseenter", onHelmetEnter);
          visualRef.current.addEventListener("mouseleave", onHelmetLeave);

          if (!isMobile) {
            const xHelmet = gsap.quickTo(helmetRef.current, "x", { duration: 0.35, ease: "power3.out" });
            const yHelmet = gsap.quickTo(helmetRef.current, "y", { duration: 0.35, ease: "power3.out" });
            const xParticles = gsap.quickTo(particlesRef.current, "x", { duration: 0.4, ease: "power3.out" });
            const yParticles = gsap.quickTo(particlesRef.current, "y", { duration: 0.4, ease: "power3.out" });
            const xGlow = gsap.quickTo(depthGlowRef.current, "x", { duration: 0.4, ease: "power3.out" });
            const yGlow = gsap.quickTo(depthGlowRef.current, "y", { duration: 0.4, ease: "power3.out" });

            onVisualMove = (event: PointerEvent) => {
              const rect = visualRef.current!.getBoundingClientRect();
              const px = (event.clientX - rect.left) / rect.width - 0.5;
              const py = (event.clientY - rect.top) / rect.height - 0.5;
              xHelmet(px * 8);
              yHelmet(py * -6);
              xParticles(px * 16);
              yParticles(py * -12);
              xGlow(px * 18);
              yGlow(py * -14);
            };

            onVisualLeave = () => {
              xHelmet(0);
              yHelmet(0);
              xParticles(0);
              yParticles(0);
              xGlow(0);
              yGlow(0);
            };

            visualRef.current.addEventListener("pointermove", onVisualMove);
            visualRef.current.addEventListener("pointerleave", onVisualLeave);
          }
        }

        gsap.to(gradientRef.current, {
          yPercent: 10,
          scale: 1.02,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.4
          }
        });

        gsap.to(visualRef.current, {
          yPercent: isMobile ? -2 : -7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          }
        });

        gsap.to(helmetRef.current, {
          yPercent: isMobile ? -2 : -5,
          xPercent: isMobile ? 0 : -2,
          rotate: isMobile ? -0.6 : -1.8,
          scale: 1.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.45
          }
        });

        gsap.to(particlesRef.current, {
          yPercent: isMobile ? -4 : -12,
          xPercent: isMobile ? 1 : -6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });

        gsap.to(depthGlowRef.current, {
          yPercent: isMobile ? 5 : 10,
          xPercent: isMobile ? -2 : -8,
          scale: 1.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.6
          }
        });

        gsap.to(visualRef.current, {
          y: isMobile ? -2 : -7,
          duration: 4.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });

        gsap.to(helmetRef.current, {
          y: isMobile ? -2 : -6,
          rotate: isMobile ? -0.5 : -1.4,
          duration: 5.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      }
    }, sectionRef);

    return () => {
      if (ctaEl && onCtaMove) ctaEl.removeEventListener("pointermove", onCtaMove);
      if (ctaEl && onCtaLeave) ctaEl.removeEventListener("pointerleave", onCtaLeave);
      if (headlineRef.current && onHeadlineEnter) headlineRef.current.removeEventListener("mouseenter", onHeadlineEnter);
      if (headlineRef.current && onHeadlineLeave) headlineRef.current.removeEventListener("mouseleave", onHeadlineLeave);
      if (visualRef.current && onHelmetEnter) visualRef.current.removeEventListener("mouseenter", onHelmetEnter);
      if (visualRef.current && onHelmetLeave) visualRef.current.removeEventListener("mouseleave", onHelmetLeave);
      if (visualRef.current && onVisualMove) visualRef.current.removeEventListener("pointermove", onVisualMove);
      if (visualRef.current && onVisualLeave) visualRef.current.removeEventListener("pointerleave", onVisualLeave);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="cinematic-section section-tone-hero relative min-h-screen overflow-hidden"
    >
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 hero-grid opacity-80 [filter:blur(0px)]"
      />
      <div
        ref={contentRef}
        className="hero-layout section-wrap relative z-10 grid min-h-[100svh] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16"
      >
        <div className="hero-copy space-y-8 text-center md:space-y-9 lg:pl-14 lg:text-left">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 rounded-full border border-accent/45 bg-accent/10 px-4 py-1.5 text-[11px] tracking-[0.2em] text-accent"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            ILLYRIAN PIXEL
          </div>
          <h1
            ref={headlineRef}
            className="hero-headline-trigger cadence-title font-display relative max-w-[12ch] text-[clamp(2.55rem,7.8vw,6.9rem)] leading-[0.95] tracking-[0.01em]"
          >
            <span className="headline-mask block overflow-hidden">
              <span className="headline-word block">
                Ktheje biznesin në{" "}
                <span className="hero-brand-word">
                  <span className="text-accent">brand</span>
                </span>
              </span>
            </span>
            <span aria-hidden className="hero-brand-trail" />
          </h1>
          <p
            ref={paragraphRef}
            className="cadence-body mx-auto max-w-2xl text-[1.2rem] font-medium leading-[1.5] tracking-[0.01em] text-white/78 md:mx-0 md:text-[1.34rem] md:leading-[1.45]"
          >
            Nga klikimi te klienti <span aria-hidden>🚀</span>
          </p>
          <div className="hero-cta cadence-cta flex flex-wrap items-center justify-center gap-4 md:gap-5 lg:justify-start">
            <a
              ref={ctaRef}
              href="#cta"
              onClick={(event) => {
                event.preventDefault();
                window.dispatchEvent(new CustomEvent("open-inquiry-modal"));
              }}
              data-magnetic="true"
              className="interactive-button hero-primary-cta rounded-full border border-accent/75 bg-accent px-9 py-[1.05rem] text-[11px] tracking-[0.18em] text-black transition-all duration-300 hover:bg-[#d5ad4f]"
            >
              NIS PROJEKTIN
            </a>
            <a href="#services" className="luxury-link hero-process-link font-light">
              EKSPLORO PORTOFOLIN <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div
          ref={visualRef}
          className="helmet-flow-scene hero-visual-shell relative h-[320px] overflow-visible md:h-[460px] lg:ml-[-10px]"
        >
          <div ref={depthGlowRef} className="absolute right-[12%] top-[8%] h-56 w-56 rounded-full bg-accent/20 blur-[90px] md:h-72 md:w-72" />
          <div ref={particlesRef} className="pointer-events-none absolute -left-[76%] top-[7%] z-20 h-[84%] w-[130%] md:-left-[72%] md:top-[4%] md:h-[90%] md:w-[124%]">
            <div className="absolute inset-0">
              {voxelTrail.map((particle, index) => (
                <span
                  key={index}
                  className="voxel-dot absolute"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.s}px`,
                    height: `${particle.s}px`,
                    animationDelay: `${particle.d}s`
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_44%,rgba(200,155,46,0.22),transparent_46%),radial-gradient(circle_at_24%_58%,rgba(255,255,255,0.04),transparent_34%)]" />
          <div ref={helmetRef} className="absolute right-0 top-[2%] z-30 h-[88%] w-[88%] md:h-[92%] md:w-[92%]">
            <Image
              src="/images/hero-helmet.png"
              alt="Vizual i helmetës së artë spartane"
              fill
              priority
              className="object-contain object-right opacity-[0.96] [filter:contrast(1.12)_saturate(1.08)_brightness(0.98)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
