import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { LOCALE_LABELS, routing, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "./site-url";

export const SITE_NAME = "Nordic Pixel";

export type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute, localized URL for an internal route, e.g. ("sv", "/services") → https://…/sv/tjanster */
export function localizedUrl(locale: Locale, href: Href): string {
  return absoluteUrl(getPathname({ locale, href }));
}

/** URL of the generated Open Graph image for a locale (app/[locale]/opengraph-image.tsx). */
export function ogImageUrl(locale: Locale): string {
  return absoluteUrl(`/${locale}/opengraph-image`);
}

type BuildMetadataOptions = {
  locale: Locale;
  /** Internal route of this page. */
  href: Href;
  /** Per-locale routes when they differ (e.g. articles with translated slugs). */
  alternates?: Partial<Record<Locale, Href>>;
  title: string;
  description: string;
  /** Use the title as-is instead of appending "| Nordic Pixel". */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Unique title, description, canonical URL, hreflang alternates, Open Graph and
 * Twitter metadata for a page. Images are set explicitly because a page-level
 * `openGraph` object replaces the one inherited from the layout.
 */
export function buildMetadata(options: BuildMetadataOptions): Metadata {
  const { locale, href, title, description } = options;
  const canonical = localizedUrl(locale, href);

  const languages: Record<string, string> = {};
  for (const alternateLocale of routing.locales) {
    const alternateHref = options.alternates?.[alternateLocale] ?? href;
    languages[LOCALE_LABELS[alternateLocale].htmlLang] = localizedUrl(alternateLocale, alternateHref);
  }
  languages["x-default"] = languages[LOCALE_LABELS[routing.defaultLocale].htmlLang];

  const fullTitle = options.absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const image = { url: ogImageUrl(locale), width: 1200, height: 630, alt: SITE_NAME };

  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: options.type ?? "website",
      siteName: SITE_NAME,
      locale: LOCALE_LABELS[locale].ogLocale,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => LOCALE_LABELS[l].ogLocale),
      url: canonical,
      title: fullTitle,
      description,
      images: [image],
      ...(options.type === "article" && {
        publishedTime: options.publishedTime,
        modifiedTime: options.modifiedTime ?? options.publishedTime,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
    ...(options.noindex && { robots: { index: false, follow: true } }),
  };
}
