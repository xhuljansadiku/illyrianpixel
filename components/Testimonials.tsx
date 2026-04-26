"use client";

import { useRef } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const quotes = [
  {
    quote: "Nga një website i bukur kaluam në një sistem që shet. Ritmi, qartësia dhe detajet ishin në nivel studioje.",
    name: "Ardian K.",
    company: "Atelier Prime",
    result: "+42% lead-e të kualifikuara"
  },
  {
    quote: "Komunikimi i markës sonë u bë shumë më i qartë. Klientët e kuptojnë vlerën tonë brenda sekondave të para.",
    name: "Elira V.",
    company: "Maison Verre",
    result: "2.3x kohë në faqe"
  },
  {
    quote: "Për herë të parë ndjemë që dizajni dhe performanca po punojnë bashkë për të njëjtin rezultat biznesi.",
    name: "Nocturne Team",
    company: "Nocturne Hotel",
    result: "+31% rezervime direkte"
  }
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-reveal",
        { opacity: 0, y: 24, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="cinematic-section section-tone-about">
      <div className="section-wrap">
        <div className="testimonial-reveal">
          <SectionMark label="ZËRI I KLIENTËVE" />
        </div>
        <h2 className="testimonial-reveal section-title mt-3 max-w-4xl">Testimonials</h2>
        <div className="mt-10 space-y-8">
          {quotes.map((item) => (
            <article key={item.name} className="testimonial-reveal relative border-t border-white/10 pt-7">
              <span className="pointer-events-none absolute left-0 top-4 font-display text-6xl leading-none text-accent/18">“</span>
              <p className="max-w-4xl pl-6 text-[1.1rem] leading-relaxed text-white/84 md:text-[1.35rem]">{item.quote}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 pl-6 text-sm text-white/62">
                <span className="text-white/88">{item.name}</span>
                <span>•</span>
                <span>{item.company}</span>
                <span className="rounded-full border border-accent/30 px-2 py-0.5 text-accent/85">{item.result}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
