import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

export type LocaleParams = { locale: string };
export type PageProps<P extends Record<string, string> = Record<never, never>> = {
  params: Promise<LocaleParams & P>;
};

/**
 * Validates the [locale] segment and enables static rendering for it.
 * Call at the top of every page and generateMetadata in app/[locale].
 */
export function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export function localeParams() {
  return routing.locales.map((locale) => ({ locale }));
}
