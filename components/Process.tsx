"use client";

import { useRef } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const processSteps = [
  {
    label: "FAZA 01 | Plani",
    title: "Plani",
    points: [
      "Analizojmë qëllimet e biznesit tuaj.",
      "Identifikojmë klientët që synoni të arrini.",
      "Studiojmë konkurrencën për t'u dalluar në treg.",
      "Hartojmë strukturën dhe hapat e projektit."
    ]
  },
  {
    label: "FAZA 02 | Dizajni",
    title: "Dizajni",
    points: [
      "Krijojmë stilin vizual (ngjyrat, shkronjat, fotot).",
      "Ndërtojmë skicat e para për të parë si funksionon.",
      "Sigurojmë që mesazhi juaj të jetë i qartë.",
      "Përshtatim dizajnin që të jetë modern dhe profesional."
    ]
  },
  {
    label: "FAZA 03 | Kodimi",
    title: "Kodimi",
    points: [
      "Shndërrojmë dizajnin në një faqe funksionale (kod).",
      "Optimizojmë faqen që të hapet shumë shpejt.",
      "Sigurojmë që çdo buton dhe link të punojë saktë.",
      "Përshtasim faqen për telefon, tablet dhe kompjuter."
    ]
  },
  {
    label: "FAZA 04 | Publikimi",
    title: "Publikimi",
    points: [
      "Bëjmë kontrollet e fundit për çdo gabim teknik.",
      "Testojmë sigurinë dhe mbrojtjen e të dhënave.",
      "Lidhim faqen me emrin tuaj (Domain) dhe serverin.",
      "E publikojmë faqen live dhe gati për të pritur klientë."
    ]
  }
];

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const lineProgressRef = useRef<HTMLSpanElement | null>(null);
  const lineDotRef = useRef<HTMLSpanElement | null>(null);
  const lineGlowRef = useRef<HTMLSpanElement | null>(null);
  const bgShiftRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap, ScrollTrigger } = ensureGSAP();
    const isMobile = getIsMobile();

    const ctx = gsap.context(() => {
      const activateStep = (activeIdx: number) => {
        stepRefs.current.forEach((step, idx) => {
          if (!step) return;
          step.classList.toggle("process-step-active", idx === activeIdx);
        });
      };

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 26, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );

      if (isMobile) {
        gsap.fromTo(
          stepRefs.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 76%"
            }
          }
        );
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 24, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 88%"
            }
          }
        );
        return;
      }

      gsap.fromTo(
        lineProgressRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 1.1
          }
        }
      );

      const moveDotToStep = (idx: number) => {
        const timeline = timelineRef.current;
        const step = stepRefs.current[idx];
        if (!timeline || !step) return;
        const tlRect = timeline.getBoundingClientRect();
        const stepRect = step.getBoundingClientRect();
        const y = stepRect.top - tlRect.top + 24;
        gsap.to([lineDotRef.current, lineGlowRef.current], {
          y,
          duration: 0.46,
          ease: "power3.out"
        });
      };

      activateStep(0);
      moveDotToStep(0);

      stepRefs.current.forEach((step, idx) => {
        if (!step) return;
        ScrollTrigger.create({
          trigger: step,
          start: "top 62%",
          end: "bottom 50%",
          onEnter: () => {
            activateStep(idx);
            moveDotToStep(idx);
          },
          onEnterBack: () => {
            activateStep(idx);
            moveDotToStep(idx);
          }
        });
      });

      stepRefs.current.forEach((step) => {
        if (!step) return;
        gsap.fromTo(
          step,
          { opacity: 0.42, y: 26, filter: "blur(4px)" },
          {
            opacity: 0.96,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 70%",
              end: "bottom 48%",
              scrub: 0.85,
              onToggle: (self) => {
                step.classList.toggle("process-step-active", self.isActive);
              }
            }
          }
        );
      });

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 28, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 86%"
          }
        }
      );

      gsap.to(bgShiftRef.current, {
        yPercent: 8,
        xPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="process" ref={sectionRef} className="cinematic-section section-tone-process process-journey">
      <div
        ref={bgShiftRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_34%,rgba(200,155,46,0.16),transparent_42%),radial-gradient(circle_at_72%_70%,rgba(255,255,255,0.05),transparent_38%)]"
      />
      <div className="section-wrap">
        <SectionMark label="PROCESI" />
        <h2 ref={headingRef} className="section-title mt-3 mb-14 max-w-5xl">
          Një rrugë e qartë nga biseda e parë deri në përfundim të projektit.
        </h2>
        <div ref={timelineRef} className="process-timeline relative pb-2">
          <span className="process-line-track absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/14 md:block" />
          <span
            ref={lineProgressRef}
            className="process-line-progress absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-accent/85 md:block"
          />
          <span
            ref={lineDotRef}
            className="process-line-dot absolute left-1/2 top-0 hidden h-3 w-3 -translate-x-1/2 rounded-full border border-accent/85 bg-[#0b0b0b] md:block"
          />
          <span
            ref={lineGlowRef}
            className="process-line-glow absolute left-1/2 top-0 hidden h-10 w-10 -translate-x-1/2 rounded-full bg-accent/18 blur-2xl md:block"
          />
          <div className="space-y-10 md:space-y-16">
            {processSteps.map((step, idx) => (
              <div
                key={step.title}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className={`process-step relative md:w-[46%] ${idx % 2 === 0 ? "process-step-left md:mr-auto md:pr-10" : "process-step-right md:ml-auto md:pl-10"}`}
              >
                <span className="process-node absolute left-[-0.55rem] top-[1.15rem] h-[9px] w-[9px] rounded-full border border-accent/70 bg-[#0b0b0b] md:left-auto md:top-[1.1rem] md:h-[10px] md:w-[10px] md:border-accent/80 md:bg-[#0b0b0b] md:shadow-none" />
                <p className="text-[11px] tracking-[0.18em] text-accent/85">{step.label}</p>
                <h3 className="mt-2 font-display text-[2rem] leading-[0.96] text-white md:text-[2.55rem]">{step.title}</h3>
                <ul className="mt-3 max-w-[42ch] space-y-2 text-sm leading-relaxed text-white/72 md:text-base">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/85" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 border-t border-white/10 pt-9 md:mt-16">
          <a
            ref={ctaRef}
            href="#cta"
            className="process-end-cta inline-flex items-center gap-3 font-display text-[clamp(1.75rem,4.4vw,3.25rem)] leading-[0.95] text-white"
          >
            Nise projektin tënd <span aria-hidden className="text-accent">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
