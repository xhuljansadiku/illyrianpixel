"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const serviceItems = [
  {
    title: "Website",
    short: "Landing page • Multipage • Web App",
    desc: "Ndërtojmë imazhin që meriton biznesi juaj: website të shpejtë, modernë dhe të optimizuar për shitje.",
    href: "/services/website",
    image: "/images/work-02.svg"
  },
  {
    title: "E-commerce",
    short: "Shopify • WooCommerce • Custom Checkout",
    desc: "Dyqan online i optimizuar për konvertime dhe shitje të qëndrueshme.",
    href: "/services/ecommerce/",
    image: "/images/work-02.svg"
  },
  {
    title: "Marketing",
    short: "Meta Ads • Google Ads • Funnel",
    desc: "Reklamat nuk janë kosto, janë motori i shitjeve. Targetojmë audiencën e duhur për të sjellë fitim maksimal.",
    href: "/services/marketing",
    image: "/images/work-03.svg"
  },
  {
    title: "Mirëmbajtje",
    short: "Përditësime • Siguri • Monitorim",
    desc: "Kujdesemi që sistemi juaj të jetë gjithmonë i sigurt, i shpejtë dhe një hap para konkurrencës.",
    href: "/services/mirembajtje",
    image: "/images/work-01.svg"
  },
  {
    title: "SEO",
    short: "SEO teknike • On-page • Përmbajtje",
    desc: "Rritje organike dhe pozicionim më i fortë në Google.",
    href: "/services/seo/",
    image: "/images/work-01.svg"
  },
  {
    title: "Social Media",
    short: "Plan përmbajtjeje • Creative • Reels",
    desc: "Përmbajtje dhe strategji që sjellin vëmendje cilësore.",
    href: "/services/social-media/",
    image: "/images/work-04.svg"
  },
  {
    title: "Branding",
    short: "Strategji • Identitet • Guidelines",
    desc: "Identitet vizual dhe mesazh që e bën markën të dallohet.",
    href: "/services/branding/",
    image: "/images/hero-showcase.svg"
  },
  {
    title: "Photography",
    short: "Produkt • Lifestyle • Komerciale",
    desc: "Fotografi komerciale për produkte, ambiente dhe markë me standard editorial.",
    href: "/services/photography",
    image: "/images/work-04.svg"
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const textLayerRef = useRef<HTMLDivElement | null>(null);
  const listLayerRef = useRef<HTMLDivElement | null>(null);
  const listRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewImageRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const previewIndex = hoveredIndex ?? activeIndex;
  const activeService = useMemo(() => serviceItems[previewIndex], [previewIndex]);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap, ScrollTrigger } = ensureGSAP();
    const isMobile = getIsMobile();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current?.querySelectorAll(".services-intro-item .reveal-line-inner") ?? [],
        { opacity: 0, y: 30, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );

      gsap.fromTo(
        listRefs.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 74%"
          }
        }
      );

      gsap.to(bgLayerRef.current, {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });

      gsap.to(listLayerRef.current, {
        y: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(previewRef.current, {
        y: isMobile ? 0 : -14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });

      listRefs.current.forEach((row, idx) => {
        if (!row) return;
        ScrollTrigger.create({
          trigger: row,
          start: "top 58%",
          end: "bottom 44%",
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx)
        });
      });

      if (!isMobile && !reducedMotion) {
        gsap.fromTo(
          previewRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.25 }
        );
      }

      if (!reducedMotion) {
        gsap.to(".services-ambient-gradient", {
          backgroundPosition: "100% 50%",
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useIsomorphicLayoutEffect(() => {
    if (!previewImageRef.current) return;
    if (getIsMobile()) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(
      previewImageRef.current,
      { opacity: 0, scale: 0.95, filter: "blur(4px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }
    );
  }, [previewIndex]);

  return (
    <section id="services" ref={sectionRef} className="cinematic-section section-tone-services relative overflow-hidden">
      <div ref={bgLayerRef} className="pointer-events-none absolute inset-0">
        <div className="services-ambient-gradient absolute inset-0" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-accent/12 blur-[95px]" />
        <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[120px]" />
      </div>
      <div className="services-grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="section-wrap">
        <div ref={textLayerRef}>
          <div ref={introRef}>
            <div className="cadence-label services-intro-item">
              <div className="reveal-line">
                <div className="reveal-line-inner">
                  <SectionMark label="SHËRBIMET" />
                </div>
              </div>
            </div>
            <h2 className="services-intro-item cadence-title section-title mt-3 max-w-4xl">
              <span className="reveal-line block overflow-hidden">
                <span className="reveal-line-inner block">Nga ideja te rezultati.</span>
              </span>
            </h2>
            <div className="services-intro-item mt-4 max-w-2xl">
              <p className="reveal-line cadence-body muted text-sm md:text-base">
                <span className="reveal-line-inner block">
                  Krijojmë një rrugë të qartë për klientët tuaj.
                  <br className="hidden md:block" /> Bashkëpunojmë me biznese që kërkojnë rritje të vërtetë, jo thjesht një adresë online.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div ref={listLayerRef} className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.96fr] lg:gap-14">
          <div className="services-list-wrap relative">
            <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />
            {serviceItems.map((service, idx) => {
              const isActive = idx === activeIndex || idx === hoveredIndex;
              return (
                <a
                  key={service.title}
                  href={service.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`service-explore-row group relative block py-6 pl-7 md:py-7 ${isActive ? "is-active" : ""}`}
                >
                  <span className="service-dot absolute left-[-5px] top-[2.3rem] h-[10px] w-[10px] rounded-full border border-white/30 bg-[#0B0B0B]" />
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="service-title font-display text-[clamp(2rem,4vw,3.35rem)] leading-[0.94]">{service.title}</h3>
                    <span className="service-arrow mt-2 text-[1.1rem] text-accent/65 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  <p className="service-desc mt-2 max-w-[48ch] text-sm leading-relaxed text-white/62 md:text-base">{service.short}</p>
                </a>
              );
            })}
          </div>

          <div
            ref={previewRef}
            className="services-preview-shell pointer-events-none relative hidden min-h-[440px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.02] lg:block"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(200,155,46,0.24),transparent_52%)]" />
            <div className="services-preview-micro pointer-events-none absolute inset-0 z-[2]" aria-hidden />
            <div ref={previewImageRef} className="relative h-full w-full">
              <Image
                src={activeService.image}
                alt={`Preview vizual për ${activeService.title}`}
                fill
                className="object-cover [filter:contrast(1.1)_saturate(0.94)_brightness(0.96)]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/70 to-transparent p-6">
              <p className="text-[11px] tracking-[0.18em] text-accent/85">SHËRBIM AKTIV</p>
              <h3 className="mt-2 font-display text-[2.05rem] leading-[0.95] text-white">{activeService.title}</h3>
              <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-white/72">{activeService.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
