"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const particlesInnerRef = useRef<HTMLDivElement | null>(null);
  const depthGlowRef = useRef<HTMLDivElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const isMobile = getIsMobile();
    let onHeadlineEnter: (() => void) | null = null;
    let onHeadlineLeave: (() => void) | null = null;
    let onVisualMove: ((event: PointerEvent) => void) | null = null;
    let onVisualLeave: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const headlineWords = headlineRef.current?.querySelectorAll(".headline-word");
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
        if (sectionEl) {
          onHeadlineEnter = () => sectionEl.classList.add("headline-trail-boost");
          onHeadlineLeave = () => sectionEl.classList.remove("headline-trail-boost");

          headlineRef.current?.addEventListener("mouseenter", onHeadlineEnter);
          headlineRef.current?.addEventListener("mouseleave", onHeadlineLeave);
        }

        if (visualRef.current) {
          if (!isMobile) {
            const setParallaxX = gsap.quickTo(visualRef.current, "--helmet-parallax-x", {
              duration: 0.85,
              ease: "power2.out"
            });
            const setParallaxY = gsap.quickTo(visualRef.current, "--helmet-parallax-y", {
              duration: 0.85,
              ease: "power2.out"
            });
            const xGlow = gsap.quickTo(depthGlowRef.current, "x", { duration: 0.85, ease: "power2.out" });
            const yGlow = gsap.quickTo(depthGlowRef.current, "y", { duration: 0.85, ease: "power2.out" });
            const inner = particlesInnerRef.current;
            const setParticleX = inner
              ? gsap.quickTo(inner, "x", { duration: 1.15, ease: "power2.out" })
              : null;
            const setParticleY = inner
              ? gsap.quickTo(inner, "y", { duration: 1.15, ease: "power2.out" })
              : null;

            onVisualMove = (event: PointerEvent) => {
              const rect = visualRef.current!.getBoundingClientRect();
              const px = (event.clientX - rect.left) / rect.width - 0.5;
              const py = (event.clientY - rect.top) / rect.height - 0.5;
              setParallaxX(px * 8);
              setParallaxY(py * -6);
              xGlow(px * 8);
              yGlow(py * -7);
              setParticleX?.(px * 5);
              setParticleY?.(py * -4);
            };

            onVisualLeave = () => {
              setParallaxX(0);
              setParallaxY(0);
              xGlow(0);
              yGlow(0);
              setParticleX?.(0);
              setParticleY?.(0);
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
      }
    }, sectionRef);

    return () => {
      if (headlineRef.current && onHeadlineEnter) headlineRef.current.removeEventListener("mouseenter", onHeadlineEnter);
      if (headlineRef.current && onHeadlineLeave) headlineRef.current.removeEventListener("mouseleave", onHeadlineLeave);
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
      <h1 className="sr-only">
        Më shumë klientë për biznesin tuaj — Website, SEO dhe Marketing për biznese shqiptare
      </h1>
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 hero-grid opacity-80 [filter:blur(0px)]"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] hero-depth-vignette"
        aria-hidden
      />
      <div
        ref={contentRef}
        className="hero-layout section-wrap relative z-10 grid min-h-[100svh] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16"
      >
        <div className="hero-copy space-y-6 text-center md:space-y-7 lg:pl-14 lg:text-left">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 rounded-full border border-accent/45 bg-accent/10 px-4 py-1.5 text-[11px] tracking-[0.2em] text-accent"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            ILLYRIAN PIXEL
          </div>
          <h2
            ref={headlineRef}
            className="hero-headline-trigger cadence-title font-display relative max-w-[22ch] text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.02em]"
          >
            <span className="headline-mask block overflow-hidden">
              <span className="headline-word block">
                Më shumë klientë{" "}
                <span className="hero-brand-word">
                  <span className="hero-brand-accent text-accent inline-block font-black">
                    për biznesin tuaj.
                  </span>
                </span>
              </span>
            </span>
            <span aria-hidden className="hero-brand-trail" />
          </h2>
          <div ref={paragraphRef} className="cadence-body space-y-3">
            <p className="font-body text-[1rem] font-light leading-[1.5] tracking-[0.04em] text-white/62">
              {"Ndërtojmë website, SEO dhe marketing online për biznese shqiptare në Shqipëri dhe diasporë."}
            </p>
            <p className="font-body text-[0.88rem] font-light tracking-[0.04em] text-accent/80 text-center lg:text-left">
              {"Plan konkret brenda 24 orëve pa pagesë."}
            </p>
            <p className="font-body text-[0.85rem] font-light tracking-[0.06em] text-white/40 text-center lg:text-left">
              {"Ju fokusohuni te biznesi. Klientët i sjellim ne."}
            </p>
          </div>
          <div className="hero-cta cadence-cta flex flex-wrap items-center justify-center gap-4 md:gap-5 lg:justify-start">
            <Link
              ref={ctaRef}
              href="/contact"
              data-magnetic="true"
              className="interactive-button ip-cta-primary ip-cta-primary--lg"
            >
              Merr ofertë falas
            </Link>
            <a href="/projektet" className="luxury-link">
              Shiko projektet <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div
          ref={visualRef}
          className="helmet-flow-scene hero-visual-shell relative h-[320px] overflow-visible md:h-[460px] lg:ml-[-10px]"
        >
          <div ref={depthGlowRef} className="absolute right-[12%] top-[8%] h-56 w-56 rounded-full bg-accent/20 blur-[90px] md:h-72 md:w-72" />
          <div
            ref={particlesRef}
            className="helmet-particles pointer-events-none absolute -left-[76%] top-[7%] z-20 h-[84%] w-[130%] md:-left-[72%] md:top-[4%] md:h-[90%] md:w-[124%]"
          >
            <div ref={particlesInnerRef} className="helmet-particles-shift absolute inset-0">
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
            <div className="helmet helm-radial-feather relative h-full w-full">
              <Image
                src="/images/hero-helmet.png"
                alt="Illyrian Pixel — Agjenci Dixhitale Premium për Biznese Shqiptare"
                fill
                priority
                className="hero-helmet-img object-contain object-right opacity-[0.97] [filter:contrast(1.12)_saturate(1.08)_brightness(0.98)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
