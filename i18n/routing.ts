import { defineRouting } from "next-intl/routing";

/**
 * Locale routing for Nordic Pixel.
 *
 * - Swedish is the primary market, English serves the rest of the Nordics/Europe.
 * - Every URL carries its locale (/sv/…, /en/…) so both versions are equal,
 *   crawlable and easy to extend with more locales later (e.g. /no, /da, /fi).
 * - No Accept-Language redirects: many Swedes browse with English system
 *   settings, and they should land on the Swedish site unless they choose otherwise.
 * - No locale cookie: the site sets no cookies at all (see /cookies).
 * - Swedish URLs use Swedish slugs (e.g. /sv/tjanster/webbutveckling) for SEO in Sweden.
 *   Keys below are the internal routes that match the folders in app/[locale].
 */
export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
  // hreflang alternates are rendered in <head> by each page's metadata instead.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/services": { sv: "/tjanster", en: "/services" },
    "/services/web-development": { sv: "/tjanster/webbutveckling", en: "/services/web-development" },
    "/services/e-commerce": { sv: "/tjanster/e-handel", en: "/services/e-commerce" },
    "/services/seo-google-ads": { sv: "/tjanster/seo-och-google-ads", en: "/services/seo-google-ads" },
    "/services/branding-content": { sv: "/tjanster/branding-och-innehall", en: "/services/branding-content" },
    "/services/digital-marketing": { sv: "/tjanster/digital-marknadsforing", en: "/services/digital-marketing" },
    "/services/maintenance-growth": { sv: "/tjanster/underhall-och-tillvaxt", en: "/services/maintenance-growth" },
    "/work": { sv: "/case", en: "/work" },
    "/work/[slug]": { sv: "/case/[slug]", en: "/work/[slug]" },
    "/about": { sv: "/om-oss", en: "/about" },
    "/process": "/process",
    "/insights": { sv: "/insikter", en: "/insights" },
    "/insights/[slug]": { sv: "/insikter/[slug]", en: "/insights/[slug]" },
    "/contact": { sv: "/kontakt", en: "/contact" },
    "/contact/thanks": { sv: "/kontakt/tack", en: "/contact/thank-you" },
    "/privacy": { sv: "/integritetspolicy", en: "/privacy" },
    "/terms": { sv: "/villkor", en: "/terms" },
    "/cookies": "/cookies",
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/** Internal routes without dynamic segments — usable as plain string hrefs. */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

export const LOCALE_LABELS: Record<Locale, { short: string; native: string; htmlLang: string; ogLocale: string }> = {
  sv: { short: "SV", native: "Svenska", htmlLang: "sv", ogLocale: "sv_SE" },
  en: { short: "EN", native: "English", htmlLang: "en", ogLocale: "en_GB" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}

export function isAppPathname(value: string): value is AppPathname {
  return Object.prototype.hasOwnProperty.call(routing.pathnames, value);
}
