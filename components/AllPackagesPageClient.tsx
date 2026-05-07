"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionMark from "@/components/SectionMark";
import ServicePackageCard from "@/components/ServicePackageCard";
import { serviceCategories, type ServiceCategory } from "@/lib/serviceCategories";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import StickyConsultCTA from "@/components/StickyConsultCTA";

const FILTERS: { slug: ServiceCategory["slug"]; label: string }[] = [
  { slug: "website",          label: "Website" },
  { slug: "ecommerce",        label: "E-Commerce" },
  { slug: "marketing-growth", label: "Marketing" },
  { slug: "branding-content", label: "Branding" },
  { slug: "smm",              label: "Social Media" },
];

export default function AllPackagesPageClient() {
  const heroRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ServiceCategory["slug"]>("website");

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

  const visible = serviceCategories.filter((c) => c.slug === active);

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg pb-4 pt-14 text-text md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{"ÇMIMET & PAKETAT"}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
                {"Të gjitha paketat"}
              </h1>
            </div>
            <div className="hero-line2 overflow-hidden">
              <h1 className="cursor-default font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.04] tracking-[-0.03em] text-accent transition-all duration-500 hover:[text-shadow:0_0_48px_rgba(171,131,57,0.55)]">
                {"në një vend."}
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {"Krahaso paketat për Website, E-Commerce, Marketing, Branding dhe Social Media. Çdo ofertë personalizohet falas."}
            </p>
          </div>
        </section>

        {/* ── FILTER TABS ── */}
        <section className="sticky top-14 z-[50] border-b border-white/[0.07] bg-bg/90 backdrop-blur-[14px] md:top-[72px]">
          <div className="mx-auto flex w-full max-w-[1280px] items-center gap-0 overflow-x-auto px-5 md:px-10 lg:px-14">
            {FILTERS.map((f) => (
              <button
                key={f.slug}
                type="button"
                onClick={() => setActive(f.slug)}
                className={`font-ui relative shrink-0 px-4 py-4 text-[12px] font-medium tracking-[0.8px] transition-colors duration-200 md:px-5 md:text-[13px] ${
                  active === f.slug
                    ? "text-accent"
                    : "text-white/45 hover:text-white/75"
                }`}
              >
                {f.label}
                {active === f.slug && (
                  <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-accent" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── PACKAGE SECTIONS ── */}
        {visible.map((category) => (
          <section
            key={category.slug}
            id={category.slug}
            className="relative z-[1] scroll-mt-28 border-b border-white/[0.07]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-accent/[0.025] to-transparent" />
            <div className="section-wrap relative z-[1] py-14 md:py-20">

              {/* Section header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <SectionMark label={category.title} eyebrowClassName="tracking-[0.18em]" />
                  <h2 className="mt-2 max-w-2xl font-display text-[clamp(1.65rem,3.5vw,2.75rem)] leading-[1.06] tracking-[-0.02em] text-white">
                    Paketat për{" "}
                    <span className="text-accent/85">{category.title}</span>
                  </h2>
                  <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/48">
                    {category.short}
                  </p>
                </div>
                <Link
                  href={`/services/${category.slug}`}
                  className="luxury-link shrink-0 text-[12px] uppercase tracking-[0.12em]"
                >
                  Detaje & proces <span aria-hidden>→</span>
                </Link>
              </div>

              {/* Cards */}
              <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
                {category.packages.map((pkg) => (
                  <ServicePackageCard
                    key={`${category.slug}-${pkg.name}`}
                    pkg={pkg}
                    conversionCta
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="relative z-[1]">
          <div className="section-wrap py-10 md:py-12">
            <p className="text-center text-[11px] text-white/28">
              Të gjitha çmimet janë pa TVSH · Konsultimi fillestar është gjithmonë falas
            </p>
          </div>
        </section>
      </main>
      <StickyConsultCTA />
      <Footer />
    </>
  );
}
