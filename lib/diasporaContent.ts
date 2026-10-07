import type { Locale } from "@/i18n/routing";
import type { CountrySlug, DiasporaCountryContent } from "@/lib/diasporaShared";
import { diasporaContent as sqContent } from "@/lib/diasporaContent.sq";
import { diasporaContent as enContent } from "@/lib/diasporaContent.en";

export function getDiasporaContent(locale: Locale): Record<CountrySlug, DiasporaCountryContent> {
  return locale === "en" ? enContent : sqContent;
}
