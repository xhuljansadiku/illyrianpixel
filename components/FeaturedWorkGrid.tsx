"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import ProjectIndexList, { type FeaturedItem } from "@/components/ProjectIndexList";
import { getCaseStudies } from "@/lib/caseStudies";
import type { Locale } from "@/i18n/routing";

export type { FeaturedItem };

export default function FeaturedWorkGrid({ items }: { items?: FeaturedItem[] }) {
  const t = useTranslations("home.featuredWork");
  const locale = useLocale() as Locale;
  const sectionRef = useRef<HTMLElement | null>(null);

  // 3 projekte live + 1 "coming soon" në fund — renditja ndjek këtë listë
  const featuredSlugs = ["esm-group", "hauswerk-niederbayern", "palushi-brothers", "bardhi-wellness"];
  const localizedCaseStudies = getCaseStudies(locale);
  const featuredProjects: FeaturedItem[] =
    items && items.length > 0
      ? items
      : featuredSlugs.flatMap((slug) => {
          const project = localizedCaseStudies.find((p) => p.slug === slug);
          return project ? [project] : [];
        });

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-chapters-intro > *",
        { opacity: 0, y: 26, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="featured-work" ref={sectionRef} className="cinematic-section section-tone-work relative overflow-hidden">
      <div
        data-parallax="0.7"
        className="pointer-events-none absolute -inset-y-[12%] inset-x-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(171,131,57,0.08),transparent_36%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.05),transparent_42%)]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(171,131,57,0.04),transparent_48%,rgba(171,131,57,0.03))] animate-[featuredAmbient_20s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:repeating-radial-gradient(circle_at_0_0,rgba(255,255,255,0.4)_0_1px,transparent_1px_4px)]" />

      <div className="section-wrap featured-chapters-intro">
        <SectionMark label={t("eyebrow")} />
        <h2 className="section-title mt-3 max-w-4xl">
          {t("headlineLine1")}
          <span className="text-accent">{t("headlineAccent")}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
          {t("intro")}
        </p>
      </div>

      <div className="section-wrap mt-4 md:mt-10">
        <ProjectIndexList items={featuredProjects} />
      </div>

      <div className="section-wrap pb-2 pt-12">
        <Link href="/projektet" className="luxury-link">
          {t("allProjectsCta")}
          <span aria-hidden>{"→"}</span>
        </Link>
      </div>
    </section>
  );
}
