"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ServiceOverviewCard } from "@/lib/serviceOverviewCards.sq";

/** Foto e çdo shërbimi — të njëjtat si në hero të faqeve të shërbimeve */
const PHOTOS: Record<string, string> = {
  "/services/website": "/images/services/website-hero-v3.avif",
  "/services/ecommerce": "/images/services/ecommerce-hero-v1.avif",
  "/services/aplikacione-mobile": "/images/services/apps-hero-v1.avif",
  "/services/seo-google-ads": "/images/services/seo-hero-v1.avif",
  "/services/smm": "/images/services/smm-hero-v2.avif",
  "/services/branding-content": "/images/services/branding-hero-v1.avif",
  "/services/mirembajtja": "/images/services/maintenance-hero-v1.avif",
};

/** Etiketa: "Më i kërkuar" sipas përvojës së pronarit me klientët; Mirëmbajtja = oferta reale te çmimet */
const BADGES: Record<string, { sq: string; en: string }> = {
  "/services/website": { sq: "Më i kërkuar", en: "Most requested" },
  "/services/seo-google-ads": { sq: "Më i kërkuar", en: "Most requested" },
  "/services/smm": { sq: "Më i kërkuar", en: "Most requested" },
  "/services/mirembajtja": { sq: "3 muaj falas me website", en: "3 months free with a website" },
};

/**
 * /sherbimet (2026-11-05, versioni C i demos): foto e madhe e ngjitur majtas,
 * lista djathtas; foto ndryshon sipas shërbimit aktiv. Në telefon: foto e vogël te çdo rresht.
 */
export default function ServicesStickySplit({ cards }: { cards: ServiceOverviewCard[] }) {
  const [active, setActive] = useState(cards[0]?.href);
  const locale = useLocale() === "en" ? "en" : "sq";
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div className="relative hidden lg:block">
        <div className="sticky top-28 aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
          {cards.map((c, i) => (
            <Image
              key={c.href}
              src={PHOTOS[c.href]}
              alt=""
              fill
              priority={i === 0}
              sizes="55vw"
              className="object-cover transition-opacity duration-700"
              style={{ opacity: active === c.href ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
      <ul className="space-y-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              onMouseEnter={() => setActive(c.href)}
              onFocus={() => setActive(c.href)}
              className={`group flex gap-4 rounded-2xl border px-5 py-5 transition-all duration-300 md:px-6 md:py-6 ${active === c.href ? "lg:border-accent/40 lg:bg-accent/[0.06]" : ""} border-white/[0.06] bg-white/[0.015] hover:border-accent/40`}
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] lg:hidden">
                <Image src={PHOTOS[c.href]} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl text-white md:text-2xl">
                    <span className="mr-3 font-mono text-xs text-accent/70">{c.ordinal}</span>
                    {c.title}
                  </h2>
                  <span aria-hidden className="text-white/60 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
                {BADGES[c.href] && (
                  <span className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/[0.1] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
                    {BADGES[c.href][locale]}
                  </span>
                )}
                <p className="mt-2 text-[14px] leading-relaxed text-white/55 md:text-[15px]">{c.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
