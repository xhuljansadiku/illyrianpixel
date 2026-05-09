"use client";

import { MouseEvent, useRef } from "react";
import Link from "next/link";
import { ensureGSAP, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

export default function CTA() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.querySelectorAll(".cta-headline-line-inner") ?? [],
        { opacity: 0, yPercent: 102, filter: "blur(4px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );

      gsap.fromTo(
        panelRef.current?.querySelectorAll(".cta-body-step") ?? [],
        { opacity: 0, y: 28, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: MOTION.duration.base,
          stagger: MOTION.stagger.tight,
          delay: 0.22,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%"
          }
        }
      );

      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.94, y: 14 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.72,
          delay: 0.46,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%"
          }
        }
      );

      if (!reducedMotion) {
        gsap.to(bgRef.current, {
          backgroundPosition: "100% 50%",
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to(contentRef.current, {
          yPercent: -4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1
          }
        });

        gsap.to(bgRef.current, {
          yPercent: 8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        });

        gsap.to(buttonRef.current, {
          scale: 1.02,
          duration: 1.9,
          repeat: -1,
          yoyo: true,
          repeatDelay: 3.2,
          ease: "sine.inOut"
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const { gsap } = ensureGSAP();
    gsap.to(buttonRef.current, {
      x: x * 0.14,
      y: y * 0.16,
      duration: MOTION.duration.fast,
      ease: MOTION.ease.enter
    });
  };

  const onLeave = () => {
    if (!buttonRef.current) return;
    const { gsap } = ensureGSAP();
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: MOTION.duration.fast, ease: MOTION.ease.enter });
  };

  return (
    <section id="cta" ref={sectionRef} className="cinematic-section section-tone-cta cta-cinematic">
      <div className="section-wrap">
        <div
          ref={panelRef}
          className="cta-shell relative overflow-hidden border border-white/10 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.36)] md:px-12 md:py-12 lg:px-14 lg:py-14"
          style={{ borderRadius: "var(--radius-xl)" }}
        >
          <div
            ref={bgRef}
            className="pointer-events-none absolute inset-0 cta-cinematic-bg"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_72%,rgba(171, 131, 57,0.14),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-0 cta-cinematic-vignette" />
          <div ref={contentRef} className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-[40rem]">
              <div className="cta-body-step cadence-step">
                <SectionMark label="LE TË KRIJOJMË" />
              </div>
              <h2
                ref={headingRef}
                className="cadence-title font-display text-[2.45rem] leading-[1.12] tracking-[-0.005em] md:text-[5.2rem] md:leading-[1.02] md:tracking-[-0.013em] lg:text-[5.6rem]"
              >
                <span className="cta-headline-line block pb-[0.08em]">
                  <span className="cta-headline-line-inner block whitespace-normal md:whitespace-nowrap">Koha që faqja juaj</span>
                </span>
                <span className="cta-headline-line block pb-[0.08em] text-accent [text-shadow:0_0_28px_rgba(171, 131, 57,0.26)]">
                  <span className="cta-headline-line-inner block whitespace-normal md:whitespace-nowrap">të punojë për ju.</span>
                </span>
              </h2>
            </div>
            <div className="relative flex items-center justify-center p-2 md:p-4 lg:max-w-md lg:justify-self-end">
              <Link
                ref={buttonRef}
                href="/contact"
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                data-magnetic="true"
                className="cta-body-step cadence-cta interactive-button ip-cta-primary ip-cta-primary--lg relative inline-flex w-full items-center justify-center overflow-hidden !text-sm sm:w-auto sm:min-w-[240px]"
              >
                <span className="cta-premium-label relative">Fillo sot</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
