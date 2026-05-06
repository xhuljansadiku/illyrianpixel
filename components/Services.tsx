"use client";

import { useRef, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import ServiceOverviewLuxCard from "@/components/ServiceOverviewLuxCard";
import { SERVICE_OVERVIEW_CARDS } from "@/lib/serviceOverviewCards";

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-intro-item",
        { opacity: 0, y: 26, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.82,
          stagger: 0.1,
          ease: "power3.out"
        }
      );

      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          clearProps: "transform,opacity",
          stagger: 0.12,
          duration: 0.88,
          ease: "power3.out"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="services" ref={sectionRef} className="cinematic-section section-tone-services relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="services-ambient-gradient absolute inset-0" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-accent/12 blur-[95px]" />
        <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute right-[18%] top-[46%] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(171, 131, 57,0.045)_0%,rgba(171, 131, 57,0.022)_32%,transparent_74%)] blur-[16px] animate-[servicesBreath_7s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[14%] top-[44%] h-[470px] w-[470px] -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[170px] opacity-55" />
      <div className="services-grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="section-wrap">
        <div className="cadence-label services-intro-item">
          <SectionMark label="SHËRBIMET TONA" eyebrowClassName="!tracking-[0.32em] md:!tracking-[0.4em]" />
        </div>
        <h2 className="services-intro-item cadence-title section-title mt-3 max-w-4xl tracking-[-0.02em]">
          <span className="block">Website, Marketing dhe Branding</span>
          <span className="block">për më shumë <span className="text-[#ab8339]">klientë dhe shitje</span>.</span>
        </h2>
        <div className="services-intro-item mt-4 max-w-2xl">
          <p className="cadence-body muted text-sm md:text-base">
            Bashkëpunojmë me biznese Shqiptare që duan më shumë se një faqe interneti, duan rezultate reale dhe klientë të rinj.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-[1fr] gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:gap-8">
          {SERVICE_OVERVIEW_CARDS.map((service, idx) => (
            <ServiceOverviewLuxCard
              key={service.href}
              service={service}
              idx={idx}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              cardRef={(node) => {
                cardRefs.current[idx] = node;
              }}
              headingAs="h3"
            />
          ))}
        </div>

        <div className="mt-12 flex justify-start border-t border-white/10 pt-9 md:mt-14 md:pt-10">
          <a href="/sherbimet" className="luxury-link">
            {"T\u00cb GJITHA SH\u00cbRBIMET "}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
