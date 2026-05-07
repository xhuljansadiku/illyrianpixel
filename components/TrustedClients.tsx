"use client";

import { useRef } from "react";
import Image from "next/image";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

type Client = { name: string; logo: string; invert?: boolean };

const clients: Client[] = [
  { name: "Squadin",                    logo: "/images/logos/squadin.svg" },
  { name: "ESM Group",                  logo: "/images/logos/esm-group.png",             invert: true },
  { name: "Palushi Brothers",           logo: "/images/logos/palushi-brothers.webp" },
  { name: "Bardhi Wellness",            logo: "/images/logos/bardhi-wellness.png" },
  { name: "Hauswerk Niederbayern",      logo: "/images/logos/hauswerk-niederbayern.png" },
  { name: "Suli Group Trockenbau",      logo: "/images/logos/suli-group-trockenbau.png" },
  { name: "Ilirjana Shehu Photography", logo: "/images/logos/ilirjana-shehu-photography.png" },
];

export default function TrustedClients() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tc-header",
        { opacity: 0, y: 20, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          stagger: 0.08, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".tc-strip",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".tc-strip", start: "top 90%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="klientet"
      className="relative border-b border-white/[0.06] bg-[#080808]"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-[#ab8339]/[0.06] blur-[90px]"
      />

      {/* Header */}
      <div className="section-wrap relative z-10 !pb-12 md:!pb-14">
        <div className="flex flex-col items-start">
          <div className="tc-header">
            <SectionMark label="Klientët tanë" />
          </div>
          <h2 className="tc-header section-title mt-2 text-white">
            Marka dhe biznese që na besojnë
          </h2>
          <p className="tc-header mt-4 max-w-[480px] font-body text-[0.94rem] font-light leading-relaxed tracking-[0.02em] text-white/45">
            Nga Shqipëria në tregun ndërkombëtar, bashkëpunojmë me biznese që kërkojnë rritje dhe rezultate reale.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="tc-strip trusted-clients-strip relative overflow-x-clip pb-20 pt-4 md:pb-28">
        {/* Fade masks */}
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#080808] to-transparent" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#080808] to-transparent" />

        <div className={`trusted-marquee flex w-max items-center gap-4 pr-4${reduced ? "" : " trusted-marquee--animated"}`}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-4">
              {clients.map((client) => (
                <div
                  key={`${dup}-${client.name}`}
                  title={client.name}
                  className="group flex h-[76px] w-[196px] flex-shrink-0 cursor-default items-center justify-center rounded-2xl border border-[#ab8339]/18 bg-[linear-gradient(135deg,rgba(171,131,57,0.07),rgba(171,131,57,0.02))] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#ab8339]/45 hover:shadow-[0_4px_32px_rgba(171,131,57,0.18)]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      sizes="166px"
                      className="object-contain brightness-0 invert opacity-45 transition-all duration-500 group-hover:[filter:none] group-hover:opacity-100 group-hover:scale-[1.05]"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Trust stats */}
      <div className="section-wrap relative z-10 !pt-0 !pb-20 md:!pb-28">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {["6+ vite eksperiencë", "100+ projekte", "Biznese në Shqipëri & diasporë"].map((item, i) => (
            <span key={item} className="inline-flex items-center gap-3">
              {i > 0 && (
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-accent/40" aria-hidden />
              )}
              <span className="font-mono text-[11px] tracking-[0.14em] text-white/42">{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
