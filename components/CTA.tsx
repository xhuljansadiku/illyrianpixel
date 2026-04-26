"use client";

import { MouseEvent, useRef } from "react";
import { ensureGSAP, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

export default function CTA() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
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

        gsap.to(".cta-light-sweep", {
          xPercent: 92,
          duration: 9,
          repeat: -1,
          repeatDelay: 2.8,
          ease: "sine.inOut"
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

  const onMove = (event: MouseEvent<HTMLButtonElement>) => {
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
          className="cta-shell relative overflow-hidden p-8 md:p-14"
          style={{ borderRadius: "var(--radius-xl)" }}
        >
          <div
            ref={bgRef}
            className="pointer-events-none absolute inset-0 cta-cinematic-bg"
          />
          <div className="cta-light-sweep pointer-events-none absolute inset-y-0 left-[-35%] w-[30%]" />
          <div className="pointer-events-none absolute inset-0 cta-cinematic-vignette" />
          <div ref={contentRef} className="grid items-end gap-10 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="max-w-3xl">
              <div className="cta-body-step cadence-step">
                <SectionMark label="LE TË KRIJOJMË" />
              </div>
              <h2
                ref={headingRef}
                className="cadence-title font-display text-[3.2rem] leading-[0.86] tracking-[-0.01em] md:text-[5.4rem]"
              >
                <span className="cta-headline-line block overflow-hidden">
                  <span className="cta-headline-line-inner block">Transformoni faqen tuaj</span>
                </span>
                <span className="cta-headline-line block overflow-hidden text-accent">
                  <span className="cta-headline-line-inner block">në një aset fitimi.</span>
                </span>
              </h2>
            </div>
            <div className="space-y-5 lg:max-w-md lg:justify-self-end">
              <p className="cta-body-step cadence-body text-sm leading-relaxed text-white/74 md:text-base">
                Nëse faqja juaj nuk po ju sjell kërkesa çdo ditë, ajo është thjesht një shpenzim.
                Ne e kthejmë atë në investimin tuaj më fitimprurës.
              </p>
              <button
                ref={buttonRef}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry-modal"))}
                data-magnetic="true"
                className="cta-body-step cadence-cta cta-button cta-premium interactive-button rounded-full border border-accent/70 bg-accent px-8 py-4 text-sm tracking-[0.18em] text-black transition-all duration-300 hover:bg-[#d5ad4f] hover:shadow-[0_10px_40px_rgba(200,155,46,0.35)]"
              >
                <span className="cta-premium-label">MERRNI ANALIZËN FALAS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
