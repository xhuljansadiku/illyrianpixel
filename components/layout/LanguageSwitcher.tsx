"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { translateInsightSlug } from "@/content/insight-slugs";
import { Link, usePathname, type AppHref } from "@/i18n/navigation";
import { LOCALE_LABELS, isAppPathname, routing, type Locale, type StaticPathname } from "@/i18n/routing";

/** Builds the equivalent page in another locale (translating article slugs). */
function alternateHref(pathname: string, params: Record<string, string | string[] | undefined>, from: Locale, to: Locale): AppHref {
  if (!isAppPathname(pathname)) return "/";

  if (pathname === "/insights/[slug]") {
    const translated = translateInsightSlug(String(params.slug ?? ""), from, to);
    return translated ? { pathname, params: { slug: translated } } : "/insights";
  }

  if (pathname === "/work/[slug]") {
    return { pathname, params: { slug: String(params.slug ?? "") } };
  }

  return pathname as StaticPathname;
}

export function LanguageSwitcher({ label, className }: { label: string; className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams<Record<string, string | string[] | undefined>>();

  return (
    <div role="group" aria-label={label} className={["lang-switch", className].filter(Boolean).join(" ")}>
      {routing.locales.map((target) => {
        const isCurrent = target === locale;
        return (
          <Link
            key={target}
            href={alternateHref(pathname, params ?? {}, locale, target)}
            locale={target}
            hrefLang={LOCALE_LABELS[target].htmlLang}
            lang={LOCALE_LABELS[target].htmlLang}
            aria-label={LOCALE_LABELS[target].native}
            aria-current={isCurrent ? "true" : undefined}
            className="lang-switch__link"
          >
            {LOCALE_LABELS[target].short}
          </Link>
        );
      })}
    </div>
  );
}
