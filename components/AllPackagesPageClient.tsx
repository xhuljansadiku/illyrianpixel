"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionMark from "@/components/SectionMark";
import ServicePackageCard from "@/components/ServicePackageCard";
import AmbientServiceIcons, { type AmbientIconConfig } from "@/components/AmbientServiceIcons";
import FAQ, { type FaqItem } from "@/components/FAQ";
import PricingCalculator from "@/components/PricingCalculator";
import { getServiceCategories, type ServiceCategory } from "@/lib/serviceCategories";
import { applyOverridesToCategory, type PricingOverrides } from "@/lib/pricingOverrides";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import type { Locale } from "@/i18n/routing";

const CMIMET_FLOAT_ICONS: AmbientIconConfig[] = [
  { variant: "web", className: "top-[8%] right-[6%]", depth: 0.5, scale: 0.9 },
  { variant: "ecommerce", className: "top-[27%] right-[23%]", depth: 0.85, scale: 0.75 },
  { variant: "marketing", className: "top-[53%] right-[2%]", depth: 0.35, scale: 1 },
  { variant: "smm", className: "top-[68%] right-[27%]", depth: 0.65, scale: 0.68 },
  { variant: "branding", className: "top-[13%] right-[37%]", depth: 0.45, scale: 0.8 },
  { variant: "maintenance", className: "top-[80%] right-[12%]", depth: 0.75, scale: 0.62 },
];

// Categories billed monthly — eligible for the mujore/vjetore toggle
const RECURRING_SLUGS = new Set<ServiceCategory["slug"]>(["seo-google-ads", "smm", "mirembajtja"]);
const ANNUAL_DISCOUNT = 0.2;

function withAnnualBilling(pkg: ServiceCategory["packages"][number], annualNote: string): ServiceCategory["packages"][number] {
  const num = Number(pkg.price.replace(/[^\d]/g, ""));
  if (!num) return pkg;
  const discounted = Math.round(num * (1 - ANNUAL_DISCOUNT));
  return {
    ...pkg,
    price: `€${discounted.toLocaleString("en-US")}`,
    priceNote: annualNote,
  };
}

export default function AllPackagesPageClient({ overrides, faqItems }: { overrides?: PricingOverrides; faqItems?: FaqItem[] }) {
  const t = useTranslations("pricing");
  const locale = useLocale() as Locale;
  const serviceCategories = getServiceCategories(locale);
  const FILTERS: { slug: ServiceCategory["slug"]; label: string }[] = [
    { slug: "website",          label: t("filters.website") },
    { slug: "ecommerce",        label: t("filters.ecommerce") },
    { slug: "seo-google-ads",   label: t("filters.seoAds") },
    { slug: "smm",              label: t("filters.smm") },
    { slug: "branding-content", label: t("filters.branding") },
    { slug: "mirembajtja",      label: t("filters.maintenance") },
  ];
  const heroRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slugFromUrl = searchParams.get("kategori");
  const initialSlug = FILTERS.some((f) => f.slug === slugFromUrl)
    ? (slugFromUrl as ServiceCategory["slug"])
    : "website";

  const [active, setActive] = useState<ServiceCategory["slug"]>(initialSlug);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  function handleFilterClick(slug: ServiceCategory["slug"]) {
    setActive(slug);
    const params = new URLSearchParams(searchParams.toString());
    params.set("kategori", slug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

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

  const visible = serviceCategories
    .filter((c) => c.slug === active)
    .map((c) => applyOverridesToCategory(c, overrides))
    .map((c) =>
      RECURRING_SLUGS.has(c.slug) && billing === "annual"
        ? { ...c, packages: c.packages.map((pkg) => withAnnualBilling(pkg, t("billing.annualNote"))) }
        : c
    );

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

          <AmbientServiceIcons heroRef={heroRef} icons={CMIMET_FLOAT_ICONS} />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{t("hero.eyebrow")}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
                {t("hero.titleLine1")}
              </h1>
            </div>
            <div className="hero-line2 overflow-hidden">
              <h1 className="cursor-default font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-accent transition-all duration-500 hover:[text-shadow:0_0_48px_rgba(171,131,57,0.55)]">
                {t("hero.titleLine2")}
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 md:whitespace-pre-line font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {t("hero.subtext")}
            </p>
          </div>
        </section>

        {/* ── FILTER TABS ── */}
        <section className="sticky top-14 z-[50] border-b border-white/[0.07] bg-bg/90 backdrop-blur-[14px] md:top-[72px]">
          <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2.5 overflow-x-auto px-5 py-3 md:px-10 lg:px-14">
            {FILTERS.map((f) => (
              <button
                key={f.slug}
                type="button"
                onClick={() => handleFilterClick(f.slug)}
                className={`font-ui shrink-0 rounded-full border px-4 py-2 text-[12px] font-medium tracking-[0.8px] transition-all duration-300 md:px-5 md:text-[13px] ${
                  active === f.slug
                    ? "border-accent/50 bg-accent/[0.12] text-accent shadow-[0_0_24px_rgba(171,131,57,0.18)]"
                    : "border-white/10 bg-white/[0.02] text-white/55 hover:border-accent/30 hover:text-white"
                }`}
              >
                {f.label}
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

            {/* Section header — stays constrained */}
            <div className="section-wrap relative z-[1] !pb-0 pt-14 md:pt-20">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <SectionMark label={category.title} eyebrowClassName="tracking-[0.18em]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/30">
                      {String(serviceCategories.findIndex((c) => c.slug === category.slug) + 1).padStart(2, "0")}
                      {" / "}
                      {String(serviceCategories.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-2 max-w-2xl font-display text-[clamp(1.65rem,3.5vw,2.75rem)] leading-[1.06] tracking-[-0.02em] text-white">
                    {t("packagesFor")}{" "}
                    <span className="text-accent/85">{category.title}</span>
                  </h2>
                  <p className="mt-3 max-w-[52ch] md:whitespace-pre-line text-[14px] leading-relaxed text-white/48">
                    {category.short}
                  </p>

                  {RECURRING_SLUGS.has(category.slug) && (
                    <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
                      <button
                        type="button"
                        onClick={() => setBilling("monthly")}
                        className={`rounded-full px-4 py-1.5 font-ui text-[12px] font-medium transition-all duration-300 ${
                          billing === "monthly" ? "bg-accent/[0.14] text-accent" : "text-white/50 hover:text-white/75"
                        }`}
                      >
                        {t("billing.monthly")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBilling("annual")}
                        className={`rounded-full px-4 py-1.5 font-ui text-[12px] font-medium transition-all duration-300 ${
                          billing === "annual" ? "bg-accent/[0.14] text-accent" : "text-white/50 hover:text-white/75"
                        }`}
                      >
                        {t("billing.annual")} <span className="text-accent/85">-20%</span>
                      </button>
                    </div>
                  )}
                </div>

                {category.slug === "seo-google-ads" && (
                  <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/28">{t("onlyOneService")}</p>
                    <Link
                      href="/services/seo"
                      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-[12px] text-white/55 transition-all duration-300 hover:border-accent/35 hover:text-white"
                    >
                      SEO
                      <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                    <Link
                      href="/services/google-ads"
                      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-[12px] text-white/55 transition-all duration-300 hover:border-accent/35 hover:text-white"
                    >
                      Google Ads
                      <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Cards — shared max-width frame so it doesn't jump between tabs; only the grid itself narrows for 3-pkg categories */}
            <div className="relative z-[1] mx-auto w-full max-w-[1480px] px-5 pb-14 md:px-10 md:pb-20 lg:px-14">
              <div className={`mt-12 grid items-stretch gap-5 ${category.packages.length >= 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'mx-auto max-w-[980px] md:grid-cols-3'}`}>
                {category.packages.map((pkg) => (
                  <ServicePackageCard
                    key={`${category.slug}-${pkg.name}`}
                    pkg={pkg}
                    conversionCta
                  />
                ))}
              </div>

              {category.slug === "mirembajtja" && (
                <div className="relative mt-8 overflow-hidden rounded-[24px] border border-accent/20 bg-[linear-gradient(155deg,rgba(24,23,22,0.96),rgba(14,13,12,0.99))] px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] md:px-12 md:py-10">
                  <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:inset-x-16" />
                  <div aria-hidden className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/[0.1] blur-[90px]" />
                  <div aria-hidden className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 select-none font-display text-[9rem] font-black leading-none text-accent/[0.06] md:block">↻</div>
                  <div className="relative z-[1] flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
                    <div>
                      <p className="font-display text-[1.5rem] font-semibold leading-snug text-white md:text-[1.75rem]">
                        {t("oldSite.line1")}<br className="hidden md:block" /> <span className="text-accent">{t("oldSite.line2")}</span>
                      </p>
                      <p className="mt-2 text-[13px] tracking-[0.02em] text-white/45">{t("oldSite.note")}</p>
                    </div>
                    <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg shrink-0 !px-8">
                      {t("oldSite.cta")}
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </section>
        ))}

        <PricingCalculator overrides={overrides} />

        {faqItems && faqItems.length > 0 && (
          <div className="relative z-[1] border-b border-white/[0.07]">
            <FAQ items={faqItems} />
          </div>
        )}

        <section className="relative z-[1]">
          <div className="section-wrap py-10 md:py-12">
            <p className="text-center text-[11px] text-white/28">
              {t("vatNote")}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
