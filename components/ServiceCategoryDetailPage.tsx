"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionMark from "@/components/SectionMark";
import { brandingConversionLandingData } from "@/lib/brandingContentConversionContent";
import { ecommerceConversionLandingData } from "@/lib/ecommerceConversionContent";
import { smmConversionLandingData } from "@/lib/smmConversionContent";
import { maintenanceConversionLandingData } from "@/lib/maintenanceConversionContent";
import type { ConversionLandingData } from "@/lib/conversionLandingShared";
import { marketingConversionLandingData } from "@/lib/marketingGrowthConversionContent";
import type { ServiceCategory } from "@/lib/serviceCategories";
import { webConversionLandingData } from "@/lib/webEcommerceConversionContent";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import { caseStudies } from "@/lib/caseStudies";

function conversionLandingForSlug(slug: ServiceCategory["slug"]): ConversionLandingData | null {
  switch (slug) {
    case "website":      return webConversionLandingData;
    case "ecommerce":    return ecommerceConversionLandingData;
    case "marketing-growth": return marketingConversionLandingData;
    case "branding-content": return brandingConversionLandingData;
    case "smm":          return smmConversionLandingData;
    case "mirembajtja":  return maintenanceConversionLandingData;
    default:             return null;
  }
}

const PAIN_INTRO: Partial<Record<ServiceCategory["slug"], string>> = {
  website: "Vizitorët hyjnë dhe dalin.\nNuk kuptohet çfarë ofroni.\nPa besim. Pa kontakt. Pa rezultate.",
};

export default function ServiceCategoryDetailPage({ category }: { category: ServiceCategory }) {
  const mainRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !mainRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(mainRef.current!.querySelectorAll(".svc-reveal-heading")).forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 26, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
      const closing = mainRef.current!.querySelector<HTMLElement>(".svc-closing-panel");
      if (closing) {
        gsap.fromTo(closing,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.95, ease: "power3.out",
            scrollTrigger: { trigger: closing, start: "top 86%", once: true } }
        );
      }
    }, mainRef);
    return () => ctx.revert();
  }, [reduced, category.slug]);

  const eyebrow = category.title.toUpperCase();
  const data = conversionLandingForSlug(category.slug);
  const isConversionLanding = data !== null;
  const isWebPackages = category.slug === "website" || category.slug === "ecommerce";

  const painIntro = PAIN_INTRO[category.slug] ?? data?.painSection?.intro ?? data?.solutionSection?.intro;
  const valueItems = data?.whyUs?.items?.slice(0, 4) ?? [];
  const testimonials = data?.testimonials?.slice(0, 2) ?? [];
  const portfolioItems = (data?.portfolioSlugs ?? [])
    .slice(0, 2)
    .map((slug) => caseStudies.find((c) => c.slug === slug))
    .filter(Boolean) as typeof caseStudies;

  return (
    <>
      <Navbar />
      <main ref={mainRef} className="relative overflow-hidden bg-bg pb-24 pt-14 text-text md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_92%_72%,rgba(171,131,57,0.06),transparent_38%)]" />

        {/* ── 1. HERO ── */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative z-[2] py-28 md:py-36">
            {/* Eyebrow */}
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{eyebrow}</p>

            {/* Headline — clamp(42px,5vw,64px) */}
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.625rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white whitespace-pre-line">
              {(() => {
                const t = category.headline;
                const i = t.lastIndexOf(" ");
                return i === -1 ? t : <>{t.slice(0, i + 1)}<span className="text-accent">{t.slice(i + 1)}</span></>;
              })()}
            </h1>

            {/* Subheadline — 18-20px, leading 1.5 */}
            {category.subheadline && (
              <p className="mt-5 max-w-[52ch] text-[1.1rem] leading-[1.5] text-white/70">
                {category.subheadline}
              </p>
            )}

            {/* Supporting text — 16px, optional */}
            {category.description && (
              <p className="mt-3 max-w-[52ch] whitespace-pre-line text-base leading-relaxed text-white/55">
                {category.description}
              </p>
            )}

            {/* CTAs — 28-32px gap from subheadline */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className={`interactive-button ip-cta-primary inline-flex h-11 items-center gap-2 !px-7 !text-[15px] !font-medium !tracking-[0.02em] !text-[#0e0d0c] ${isConversionLanding ? "svc-web-hero-cta-pulse" : ""}`}
              >
                {isWebPackages
                  ? (category.ctaPrimary ?? "Merr ofertë falas")
                  : category.slug === "marketing-growth" ? "Fillo sot"
                  : category.slug === "branding-content" ? (category.ctaPrimary ?? "Transformo përshtypjen")
                  : category.slug === "smm" ? (category.ctaPrimary ?? "Fillo Tani")
                  : category.slug === "mirembajtja" ? (category.ctaPrimary ?? "Fillo Mirëmbajtjen")
                  : "Rezervo Tani"}
              </Link>
              <Link href="/projektet" className="luxury-link !text-[15px]">
                {category.ctaSecondary ?? "Punet tona"} <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Trust line — 16px gap from CTAs, 14px, opacity 60% */}
            {isConversionLanding && (
              <p className="mt-4 text-[14px] tracking-[0.04em] text-white/60">
                {isWebPackages
                  ? (category.trustLine ?? "0 kosto · 0 obligim · Strategji reale brenda 24 orësh")
                  : category.slug === "marketing-growth"
                    ? "Vendet janë të kufizuara · Pa obligim · Përgjigje brenda 24h"
                    : (category.trustLine ?? "Konsultim falas · Pa detyrim · Përgjigje brenda 24h")}
              </p>
            )}

            {/* Tags — 20-24px gap from trust, 13px, px-3.5 py-2 */}
            <div className="mt-6 flex flex-wrap gap-2">
              {category.subServices.map((s) => (
                <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 font-body text-[13px] font-light tracking-[0.03em] text-white/75 transition-colors duration-300 hover:border-accent/25 hover:text-white/90">
                  {s}
                </span>
              ))}
            </div>

            {/* SEO micro-line */}
            <p className="mt-6 font-mono text-[10px] tracking-[0.18em] text-white/25">
              Shërbim për biznese në Shqipëri dhe diasporë.
            </p>
          </div>
        </section>

        {/* ── 2. PROBLEM + VALUE ── */}
        {(painIntro || valueItems.length > 0) && (
          <section className="relative z-[1] border-b border-white/[0.06]">
            <div className="section-wrap py-20 md:py-28">
              {painIntro && (
                <div className="svc-reveal-heading relative mb-14 overflow-hidden rounded-2xl border border-red-500/10 bg-[#0a0606] px-8 py-10">
                  <div aria-hidden className="pointer-events-none absolute -right-16 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-red-900/[0.12] blur-[100px]" />
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                  <div aria-hidden className="pointer-events-none absolute right-[4%] top-1/2 -translate-y-1/2 select-none font-display text-[10rem] font-black leading-none text-red-500/[0.13] md:text-[14rem]">✕</div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" aria-hidden />
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400/60">Problemi</p>
                    </div>
                    <p className="max-w-[44ch] font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.18] tracking-[-0.01em] text-white whitespace-pre-line">
                      {painIntro}
                    </p>
                    <div className="mt-7 h-px w-12 bg-gradient-to-r from-red-400/30 to-transparent" />
                  </div>
                </div>
              )}

              {valueItems.length > 0 && (
                <div className="svc-reveal-heading relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080808] px-8 py-10">
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
                  <div aria-hidden className="pointer-events-none absolute right-[4%] top-1/2 -translate-y-1/2 select-none font-display text-[10rem] font-black leading-none text-emerald-500/[0.08] md:text-[14rem]">✔</div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400/70" aria-hidden />
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/60">Zgjidhja</p>
                    </div>
                    <h2 className="max-w-[44ch] font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.18] tracking-[-0.01em] text-white">
                      {data?.whyUs?.headingBefore}{" "}
                      <span className="text-emerald-400/80">{data?.whyUs?.headingAccent}</span>
                    </h2>
                    <ul className="mt-7 space-y-3">
                      {valueItems.map((item) => (
                        <li key={item.title} className="flex items-start gap-4">
                          <span className="mt-1 shrink-0 text-emerald-400/80 text-[14px]" aria-hidden>✔</span>
                          <p className="font-display text-[1rem] tracking-[-0.01em] text-emerald-400/85">{item.title}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 h-px w-12 bg-gradient-to-r from-emerald-400/25 to-transparent" />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 3. PROOF ── */}
        {(testimonials.length > 0 || portfolioItems.length > 0) && (
          <section className="relative z-[1] border-b border-white/[0.06]">
            <div className="section-wrap py-20 md:py-28">
              <div className="svc-reveal-heading">
                <SectionMark label={data?.feedbackLabel ?? "Klientët"} eyebrowClassName="tracking-[0.22em]" />
                <h2 className="mt-1 max-w-xl font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.05] tracking-[-0.02em] text-white whitespace-pre-line">
                  {data?.feedbackHeadline ?? "Rezultate reale."}
                </h2>
              </div>

              {testimonials.length > 0 && (
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {testimonials.map((t) => (
                    <blockquote key={t.name} className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(22,22,22,0.94),rgba(14,14,14,0.97))] p-6">
                      <p className="text-[0.95rem] font-light leading-[1.75] text-white/75 before:content-['“'] after:content-['”']">
                        {t.quote}
                      </p>
                      <footer className="mt-4 flex items-center gap-3">
                        <span className="h-px w-5 bg-accent/40" aria-hidden />
                        <div>
                          <p className="text-[12px] font-medium text-white/80">{t.name}</p>
                          <p className="text-[11px] text-white/40">{t.role} · {t.location}</p>
                        </div>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}

              {portfolioItems.length > 0 && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {portfolioItems.map((item) => (
                    <Link key={item.slug} href={`/projektet/${item.slug}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4)]"
                    >
                      <div className="w-full bg-[#0a0a0a]">
                        <Image
                          src={item.heroImage}
                          alt={item.title}
                          width={800}
                          height={600}
                          className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="border-t border-white/[0.06] bg-[#0e0e0e] px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent/75">{item.category}</p>
                        <h3 className="mt-1 font-display text-[1.05rem] tracking-[-0.01em] text-white transition-colors group-hover:text-accent/90">{item.title}</h3>
                        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-light tracking-[0.04em] text-white/40 transition-colors group-hover:text-accent/65">
                          Shiko projektin <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-8 text-center">
                <Link href="/projektet" className="luxury-link text-[12px]">
                  Shiko të gjitha projektet <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 4. FINAL CTA ── */}
        <section className="relative z-[1]">
          <div className="section-wrap py-20 md:py-28">
            <div className="svc-closing-panel relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[linear-gradient(155deg,rgba(24,23,22,0.96),rgba(14,13,12,0.99))] px-6 py-14 text-center shadow-[0_28px_80px_rgba(0,0,0,0.45)] md:px-14 md:py-16">
              <div className="pointer-events-none absolute inset-0 opacity-[0.11]">
                <div className="noir-grid h-full w-full" />
              </div>
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent md:inset-x-16" />
              <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl" />
              <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-accent/[0.05] blur-3xl" />

              <div className="relative z-[1]">
                <SectionMark label="Hapi i radhës" eyebrowClassName="tracking-[0.22em] !text-accent/80" />
                <h2 className="mx-auto mt-3 max-w-[18ch] font-display text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.96] tracking-[-0.02em] text-white md:max-w-none">
                  {category.slug === "marketing-growth" ? (
                    <>Nesër do të jetë{" "}<span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">më shtrenjtë</span>{" "}se sot.</>
                  ) : category.slug === "branding-content" ? (
                    <>Prania juaj meriton<br /><span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">të njëjtin nivel si puna juaj.</span></>
                  ) : (
                    <>{"Një bisedë pa pagesë."}<br /><span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">{"Një plan i qartë për më shumë klientë."}</span></>
                  )}
                </h2>
                <p className="mx-auto mt-6 max-w-[44ch] text-[14px] leading-relaxed text-white/50">
                  {category.slug === "marketing-growth"
                    ? "Çdo ditë pa sistem, dikush tjetër merr klientin tuaj. Flisni me ne sot, pa asnjë kosto."
                    : category.slug === "branding-content"
                      ? "30 minuta falas. Pa obligim. Plan i qartë për markën tuaj."
                      : "30 minuta · pa detyrim · përgjigje brenda 24 orëve."}
                </p>

                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg inline-flex h-12 items-center gap-2 !px-8 !text-[12px] !tracking-[0.04em] !text-[#0e0d0c]">
                    {category.slug === "marketing-growth" ? "Fillo sot →"
                      : category.slug === "branding-content" ? "Rezervo orën tuaj të parë →"
                      : "Fillo Sot →"}
                  </Link>
                  <Link href="/contact" className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-7 text-[12px] font-light tracking-[0.06em] text-white/60 transition-colors duration-300 hover:border-accent/35 hover:text-white">
                    Na kontaktoni <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>

                <div className="mt-12">
                  <Link href="/sherbimet" className="text-[11px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 hover:text-white/60">
                    ← Kthehu te shërbimet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
