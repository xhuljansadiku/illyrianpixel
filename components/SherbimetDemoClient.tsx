"use client";
/**
 * DEMO (2026-11-05): 4 pamje alternative për /sherbimet — pronari zgjedh një,
 * pastaj kjo faqe fshihet dhe /sherbimet përditësohet me versionin e zgjedhur.
 */
import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSherbimetPageCards } from "@/lib/serviceOverviewCards";
import type { Locale } from "@/i18n/routing";

const PHOTOS: Record<string, string> = {
  "/services/website": "/images/services/website-hero-v3.avif",
  "/services/ecommerce": "/images/services/ecommerce-hero-v1.avif",
  "/services/aplikacione-mobile": "/images/services/apps-hero-v1.avif",
  "/services/seo-google-ads": "/images/services/seo-hero-v1.avif",
  "/services/smm": "/images/services/smm-hero-v2.avif",
  "/services/branding-content": "/images/services/branding-hero-v1.avif",
  "/services/mirembajtja": "/images/services/maintenance-hero-v1.avif",
};

const VARIANTS = [
  { id: "A", name: "Listë editoriale" },
  { id: "B", name: "Bento me foto" },
  { id: "C", name: "Foto e ngjitur + listë" },
  { id: "D", name: "Panele të mëdha" },
] as const;
type VariantId = (typeof VARIANTS)[number]["id"];

type Card = ReturnType<typeof getSherbimetPageCards>[number];

function Arrow() {
  return <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>;
}

/** A — rreshta të mëdhenj me numër; foto shfaqet kur kaloni miun */
function EditorialList({ cards }: { cards: Card[] }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="relative">
      <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {cards.map((c) => (
          <li key={c.href} onMouseEnter={() => setHover(c.href)} onMouseLeave={() => setHover(null)}>
            <Link href={c.href} className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-8 md:grid-cols-[5rem_1fr_1fr_auto] md:gap-8 md:py-10">
              <span className="font-mono text-sm text-accent/70">{c.ordinal}</span>
              <span className="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-none text-white transition-colors duration-300 group-hover:text-accent">{c.title}</span>
              <span className="col-start-2 max-w-[44ch] text-[15px] leading-relaxed text-white/55 md:col-start-3">{c.desc}</span>
              <span className="col-start-2 text-sm text-white/70 md:col-start-4"><Arrow /></span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[260px] w-[390px] -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-opacity duration-500 xl:block" style={{ opacity: hover ? 1 : 0 }}>
        {cards.map((c) => (
          <Image key={c.href} src={PHOTOS[c.href]} alt="" fill sizes="390px" className="object-cover transition-opacity duration-500" style={{ opacity: hover === c.href ? 1 : 0 }} />
        ))}
      </div>
    </div>
  );
}

/** B — rrjetë bento asimetrike, foto si sfond i çdo kutie */
function Bento({ cards }: { cards: Card[] }) {
  const span = ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-3", "md:col-span-3"];
  return (
    <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-6">
      {cards.map((c, i) => (
        <Link key={c.href} href={c.href} className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] ${span[i] ?? "md:col-span-3"}`}>
          <Image src={PHOTOS[c.href]} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
            <p className="font-mono text-xs text-accent">{c.ordinal}</p>
            <h2 className={`mt-2 font-display leading-tight text-white ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>{c.title}</h2>
            <p className={`mt-2 max-w-[46ch] text-sm leading-relaxed text-white/65 ${i === 0 ? "" : "line-clamp-2"}`}>{c.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** C — foto e madhe e ngjitur majtas, lista djathtas; foto ndryshon sipas shërbimit aktiv */
function StickySplit({ cards }: { cards: Card[] }) {
  const [active, setActive] = useState(cards[0]?.href);
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div className="relative hidden lg:block">
        <div className="sticky top-28 aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl">
          {cards.map((c) => (
            <Image key={c.href} src={PHOTOS[c.href]} alt="" fill sizes="55vw" className="object-cover transition-opacity duration-700" style={{ opacity: active === c.href ? 1 : 0 }} />
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
              className={`group block rounded-2xl border px-6 py-6 transition-all duration-300 ${active === c.href ? "border-accent/40 bg-accent/[0.06]" : "border-white/[0.06] bg-white/[0.015]"}`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl text-white">
                  <span className="mr-3 font-mono text-xs text-accent/70">{c.ordinal}</span>{c.title}
                </h2>
                <span className="text-white/60"><Arrow /></span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-white/55">{c.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** D — panele të mëdha, foto dhe tekst të alternuar */
function BigPanels({ cards }: { cards: Card[] }) {
  return (
    <div className="space-y-20 md:space-y-28">
      {cards.map((c, i) => (
        <Link key={c.href} href={c.href} className="group grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className={`relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl ${i % 2 ? "md:order-2" : ""}`}>
            <Image src={PHOTOS[c.href]} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          </div>
          <div>
            <p className="font-mono text-sm text-accent">{c.ordinal}</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight text-white">{c.title}</h2>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/60">{c.desc}</p>
            <p className="mt-6 text-[15px] text-accent">{c.cta.replace(" →", "")} <Arrow /></p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function SherbimetDemoClient() {
  const t = useTranslations("services.overview");
  const locale = useLocale() as Locale;
  const cards = getSherbimetPageCards(locale);
  const [v, setV] = useState<VariantId>("A");

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative bg-bg pb-28 pt-14 text-text md:pt-16">
        {/* Zgjedhësi i versioneve — vetëm për demo */}
        <div className="sticky top-16 z-30 border-b border-accent/20 bg-bgDeep/95 backdrop-blur">
          <div className="section-wrap flex flex-wrap items-center gap-2 py-3">
            <span className="mr-2 text-xs uppercase tracking-[0.2em] text-accent">Demo</span>
            {VARIANTS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setV(x.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${v === x.id ? "border-accent bg-accent text-black" : "border-white/15 text-white/70 hover:border-accent/50"}`}
              >
                {x.id} · {x.name}
              </button>
            ))}
          </div>
        </div>

        <section className="section-wrap pb-14 pt-20 md:pt-28">
          <p className="ip-eyebrow">{t("heroEyebrow")}</p>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1.05] text-white">
            {t("heroLine1")} <span className="text-accent">{t("heroLine2")}</span>
          </h1>
        </section>

        <section className="section-wrap">
          {v === "A" && <EditorialList cards={cards} />}
          {v === "B" && <Bento cards={cards} />}
          {v === "C" && <StickySplit cards={cards} />}
          {v === "D" && <BigPanels cards={cards} />}
        </section>
      </main>
      <Footer />
    </>
  );
}
