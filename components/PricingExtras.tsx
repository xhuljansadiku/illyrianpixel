"use client";

// Pjesët e strategjisë së çmimeve (2026-10-20) që përdoren te /cmimet dhe te faqet e shërbimeve:
// - CustomPackageRow: paketa "Custom" si rresht poshtë kartave (rregulli i tresh)
// - IdeaCard: një kartë "Na trego idenë" kur të gjitha paketat janë "Ofertë" (Aplikacionet)
// - GuaranteeNote: garancia e kthimit të paradhënies (heq rrezikun e klientit)
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ServicePackage } from "@/lib/serviceCategories";
import { trackEvent } from "@/lib/track";

export const isQuoteOnly = (packages: ServicePackage[]) => packages.length > 0 && packages.every((p) => !/\d/.test(p.price));

export function CustomPackageRow({ pkg, slug }: { pkg: ServicePackage; slug: string }) {
  const t = useTranslations("pricing.customRow");
  return (
    <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 md:flex-row md:items-center">
      <p className="text-[14px] leading-relaxed text-white/75">
        <span className="font-semibold text-white">{t("lead")}</span> {pkg.ideal.replace(/\n/g, " ")}{" "}
        <span className="whitespace-nowrap font-semibold text-accent">{pkg.price}</span>
      </p>
      <Link
        href="/contact"
        onClick={() => trackEvent("select_package", { category: slug, package: pkg.name, price: pkg.price })}
        className="group ip-cta-secondary shrink-0"
      >
        {pkg.cta ?? t("cta")} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

export function IdeaCard({ slug }: { slug: string }) {
  const t = useTranslations("pricing.ideaCard");
  return (
    <div className="mx-auto mt-12 max-w-[720px] rounded-3xl border border-accent/30 bg-[linear-gradient(160deg,rgba(171,131,57,0.08),rgba(255,255,255,0.01)_55%)] p-8 text-center shadow-gold-lift md:p-10">
      <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-tight text-white">{t("title")}</p>
      <p className="mx-auto mt-3 max-w-[48ch] text-[14px] leading-relaxed text-white/65">{t("text")}</p>
      <Link
        href="/contact"
        onClick={() => trackEvent("select_package", { category: slug, package: "idea" })}
        className="interactive-button ip-cta-primary ip-cta-primary--lg mt-7 inline-flex"
      >
        {t("cta")}
      </Link>
    </div>
  );
}

export function GuaranteeNote({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("pricing.guarantee");
  if (compact) {
    return (
      <p className="flex items-start gap-2 text-[12px] leading-relaxed text-white/60">
        <span aria-hidden>🛡</span>
        <span>{t("text")}</span>
      </p>
    );
  }
  return (
    <div className="mt-8 flex items-start gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] px-6 py-5">
      <span aria-hidden className="text-2xl leading-none">🛡</span>
      <div>
        <p className="font-semibold text-white">{t("title")}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-white/70">{t("text")}</p>
      </div>
    </div>
  );
}
