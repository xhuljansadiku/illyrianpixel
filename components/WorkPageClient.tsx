"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import type { CaseStudy } from "@/lib/caseStudies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalCTA from "@/components/GlobalCTA";
import ProjectIndexList from "@/components/ProjectIndexList";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function WorkPageClient({ projects }: { projects: CaseStudy[] }) {
  const t = useTranslations("projects");
  const heroRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".hero-eyebrow",
        { opacity: 0, y: 10, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
      )
      .fromTo(".hero-line1",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" }, "-=0.25"
      )
      .fromTo(".hero-line2",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" }, "-=0.62"
      )
      .fromTo(".hero-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.out", transformOrigin: "left" }, "-=0.3"
      )
      .fromTo(".hero-subtext",
        { opacity: 0, y: 14, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, "-=0.25"
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg pt-14 text-text md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{t("hero.eyebrow")}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2rem,4.5vw,4.2rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
                {t("hero.headlineLine1")}
                <span className="text-accent">{t("hero.headlineAccent")}</span>
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 max-w-3xl font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {t("hero.subtext1")}
            </p>
            <p className="hero-subtext mt-5 max-w-3xl font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {t("hero.subtext2")}
            </p>
          </div>
        </section>

        <section className="relative z-[1]">
          <div className="section-wrap py-14 md:py-20">
            <ProjectIndexList items={projects} />
          </div>
        </section>

        <GlobalCTA
          title={t("cta.title")}
          body={t("cta.body")}
        />
        <Footer />
      </main>
    </>
  );
}
