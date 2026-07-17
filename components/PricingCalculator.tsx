"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionMark from "@/components/SectionMark";
import { getServiceCategories, type ServiceCategory } from "@/lib/serviceCategories";
import { applyOverridesToCategory, type PricingOverrides } from "@/lib/pricingOverrides";
import { DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";
import type { Locale } from "@/i18n/routing";

type Slug = ServiceCategory["slug"];

// Shërbimet me pagesë mujore: niveli zgjidhet direkt nga paketat reale.
const MONTHLY_SLUGS = new Set<Slug>(["seo-google-ads", "smm", "mirembajtja"]);

// Shërbimet një-herë ku nivelet kanë etiketa "njerëzore" (faqe/produkte) në
// vend të emrave të paketave; indeksi i nivelit = indeksi i paketës.
const TIERED_SLUGS: Slug[] = ["website", "ecommerce", "branding-content"];

// Shtesat vlejnë vetëm për projektet një-herë të web-it.
const EXTRAS: { id: "secondLanguage" | "blog" | "maintenance"; price: number; monthly?: boolean; slugs: Slug[] }[] = [
  { id: "secondLanguage", price: 150, slugs: ["website", "ecommerce"] },
  { id: "blog", price: 120, slugs: ["website"] },
  { id: "maintenance", price: 49, monthly: true, slugs: ["website", "ecommerce"] },
];

const DEFAULT_CLIENT_VALUE = 300;

function parsePrice(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function formatEuro(value: number): string {
  return `€${value.toLocaleString("en-US")}`;
}

export default function PricingCalculator({ overrides }: { overrides?: PricingOverrides }) {
  const t = useTranslations("pricing.calculator");
  const tf = useTranslations("pricing.filters");
  const locale = useLocale() as Locale;

  const categories = useMemo(
    () => getServiceCategories(locale).map((c) => applyOverridesToCategory(c, overrides)),
    [locale, overrides]
  );

  const [slug, setSlug] = useState<Slug>("website");
  const [tierBySlug, setTierBySlug] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [clientValue, setClientValue] = useState(DEFAULT_CLIENT_VALUE);

  const category = categories.find((c) => c.slug === slug)!;
  const isMonthly = MONTHLY_SLUGS.has(slug);
  const tierIdx = Math.min(tierBySlug[slug] ?? 0, category.packages.length - 1);
  const pkg = category.packages[tierIdx];

  const serviceLabels: Record<Slug, string> = {
    website: tf("website"),
    ecommerce: tf("ecommerce"),
    "seo-google-ads": tf("seoAds"),
    smm: tf("smm"),
    "branding-content": tf("branding"),
    mirembajtja: tf("maintenance"),
  };

  // Etiketat e niveleve: "njerëzore" për shërbimet një-herë, emri i paketës për mujoret.
  const tierLabels: string[] = TIERED_SLUGS.includes(slug)
    ? (t.raw(`tiers.${slug}`) as string[])
    : category.packages.map((p) => `${p.name} · ${p.price}${p.priceNote ?? ""}`);

  const activeExtras = EXTRAS.filter((e) => e.slugs.includes(slug) && extras.has(e.id));
  const extrasOnce = activeExtras.filter((e) => !e.monthly).reduce((sum, e) => sum + e.price, 0);
  const extrasMonthly = activeExtras.filter((e) => e.monthly).reduce((sum, e) => sum + e.price, 0);

  const basePrice = parsePrice(pkg.price);
  const isFromPrice = /nga|from/i.test(pkg.price);
  const total = isMonthly ? basePrice : basePrice + extrasOnce;

  const timelineRaw = t.raw(`timelines.${slug}`) as string | string[];
  const timeline = Array.isArray(timelineRaw) ? timelineRaw[Math.min(tierIdx, timelineRaw.length - 1)] : timelineRaw;

  const safeClientValue = Math.max(clientValue, 1);
  const roiCount = Math.max(1, Math.ceil((isMonthly ? basePrice : total) / safeClientValue));
  const showRoi = slug !== "mirembajtja";

  const toggleExtra = (id: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const estimateText = `${isFromPrice ? `${t("fromPrefix")} ` : "~"}${formatEuro(total)}${isMonthly ? t("perMonth") : ""}`;

  const waHref = useMemo(() => {
    const lines = [
      t("waIntro"),
      "",
      `• ${t("waService")}: ${serviceLabels[slug]}`,
      `• ${t("waTier")}: ${tierLabels[tierIdx]}`,
      ...(activeExtras.length > 0
        ? [`• ${t("waExtras")}: ${activeExtras.map((e) => t(`extras.${e.id}`)).join(", ")}`]
        : []),
      `• ${t("waEstimate")}: ${estimateText}${extrasMonthly > 0 ? ` ${t("plusMaintenance", { price: formatEuro(extrasMonthly) })}` : ""}`,
      "",
      t("waOutro"),
    ];
    return `https://wa.me/${DEFAULT_WHATSAPP_E164}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, tierIdx, extras, total, locale]);

  const chip = (selected: boolean) =>
    `font-ui rounded-full border px-4 py-2 text-[12px] font-medium tracking-[0.4px] transition-all duration-300 md:text-[13px] ${
      selected
        ? "border-accent/50 bg-accent/[0.12] text-accent shadow-[0_0_24px_rgba(171,131,57,0.18)]"
        : "border-white/10 bg-white/[0.02] text-white/55 hover:border-accent/30 hover:text-white"
    }`;

  return (
    <section id="kalkulatori" className="relative z-[1] scroll-mt-28 border-b border-white/[0.07]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-accent/[0.025] to-transparent" />
      <div className="section-wrap relative z-[1] py-14 md:py-20">
        <SectionMark label={t("eyebrow")} eyebrowClassName="tracking-[0.18em]" />
        <h2 className="mt-2 font-display text-[clamp(1.65rem,3.5vw,2.75rem)] leading-[1.06] tracking-[-0.02em] text-white">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/48">{t("intro")}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ── Zgjedhjet ── */}
          <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/55">01 · {t("stepService")}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <button key={c.slug} type="button" onClick={() => setSlug(c.slug)} className={chip(slug === c.slug)}>
                  {serviceLabels[c.slug]}
                </button>
              ))}
            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-accent/55">02 · {t("stepOptions")}</p>
            <div className="mt-4 flex flex-col gap-2">
              {tierLabels.map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTierBySlug((prev) => ({ ...prev, [slug]: idx }))}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-[13px] transition-all duration-300 ${
                    tierIdx === idx
                      ? "border-accent/50 bg-accent/[0.08] text-white"
                      : "border-white/10 bg-white/[0.015] text-white/55 hover:border-accent/25 hover:text-white/80"
                  }`}
                >
                  <span>{label}</span>
                  {!isMonthly && (
                    <span className={`font-mono text-[12px] ${tierIdx === idx ? "text-accent" : "text-white/35"}`}>
                      {category.packages[idx]?.price}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {!isMonthly && EXTRAS.some((e) => e.slugs.includes(slug)) && (
              <>
                <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-white/35">{t("extrasLabel")}</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {EXTRAS.filter((e) => e.slugs.includes(slug)).map((e) => (
                    <button key={e.id} type="button" onClick={() => toggleExtra(e.id)} className={chip(extras.has(e.id))}>
                      {t(`extras.${e.id}`)}
                      <span className="ml-1.5 opacity-70">
                        +{formatEuro(e.price)}
                        {e.monthly ? t("perMonth") : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Rezultati ── */}
          <div className="relative overflow-hidden rounded-[24px] border border-accent/20 bg-[linear-gradient(155deg,rgba(24,23,22,0.96),rgba(14,13,12,0.99))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] md:p-8">
            <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-accent/[0.08] blur-[90px]" />

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/55">03 · {t("stepResult")}</p>

            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/35">{t("estimateLabel")}</p>
            <p className="mt-1 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] font-bold leading-none text-accent">
              {estimateText}
            </p>
            <p className="mt-1 text-[12px] text-white/40">
              {isMonthly ? "" : t("oneTime")}
              {extrasMonthly > 0 && (
                <span className="text-white/55"> {t("plusMaintenance", { price: formatEuro(extrasMonthly) })}</span>
              )}
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4 text-[13px] text-white/60">
              <span aria-hidden className="text-accent/70">⏱</span>
              <span>
                {t("timelineLabel")}: <span className="text-white/85">{timeline}</span>
              </span>
            </div>

            {showRoi ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="font-display text-[0.95rem] font-semibold text-white">{t("roiTitle")}</p>
                <label className="mt-2 block text-[12px] leading-relaxed text-white/45">
                  {t("roiQuestion")}
                  <input
                    type="number"
                    min={10}
                    step={50}
                    value={clientValue}
                    onChange={(e) => setClientValue(Number(e.target.value))}
                    className="font-ui mt-2 w-32 rounded-[10px] border border-white/15 bg-white/[0.04] px-3 py-2 text-[13px] text-white outline-none transition-colors focus:border-accent"
                  />
                </label>
                <p className="mt-3 text-[13px] leading-relaxed text-white/70">
                  {t(isMonthly ? "roiMonthly" : "roiOnce", { count: roiCount })}
                </p>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-[13px] leading-relaxed text-white/60">
                {t("maintenanceNote")}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[0.85rem] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                {t("ctaWhatsApp")}
              </a>
              <Link href="/contact" className="interactive-button ip-cta-primary justify-center">
                {t("ctaContact")}
              </Link>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-white/30">{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
