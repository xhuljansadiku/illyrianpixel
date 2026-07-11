"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import ServiceBannerCard from "@/components/ServiceBannerCard";
import { getServiceOverviewCards } from "@/lib/serviceOverviewCards";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export default function Services() {
  const t = useTranslations("home.servicesSection");
  const locale = useLocale() as Locale;
  const cards = getServiceOverviewCards(locale);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    // If any part of the section is already on screen at mount (e.g. reloading
    // mid-scroll, or it just peeks into view below the hero), skip the entrance
    // animation entirely — otherwise it sits frozen in its blurred "from" state
    // until the user scrolls enough to cross the scrollTrigger threshold.
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

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
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%"
          }
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
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%"
          }
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
          <SectionMark label={t("eyebrow")} eyebrowClassName="!tracking-[0.32em] md:!tracking-[0.4em]" />
        </div>
        <h2 className="services-intro-item cadence-title section-title mt-3 max-w-4xl tracking-[-0.02em]">
          <span className="md:block">{t("headlineLine1")}</span>
          <span className="md:block">{t("headlineLine2Pre")}<span className="text-[#ab8339]">{t("headlineAccent")}</span>.</span>
        </h2>
        <div className="services-intro-item mt-4 max-w-2xl">
          <p className="cadence-body muted text-sm md:text-base">
            {t("intro")}
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-6 [perspective:1500px] md:gap-7">
          {cards.map((service, idx) => (
            <ServiceBannerCard
              key={service.href}
              service={service}
              reversed={idx % 2 !== 0}
              cardRef={(node) => {
                cardRefs.current[idx] = node;
              }}
              headingAs="h3"
            />
          ))}
        </div>

        <div className="mt-12 flex justify-start border-t border-white/10 pt-9 md:mt-14 md:pt-10">
          <Link href="/sherbimet" className="luxury-link">
            {t("allServicesCta")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

