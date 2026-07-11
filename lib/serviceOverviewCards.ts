import type { Locale } from "@/i18n/routing";
import type { ServiceOverviewCard } from "./serviceOverviewCards.sq";
import * as sq from "./serviceOverviewCards.sq";
import * as en from "./serviceOverviewCards.en";

export type { ServiceOverviewCard };

const HOME_CATALOG: Record<Locale, ServiceOverviewCard[]> = {
  sq: sq.SERVICE_OVERVIEW_CARDS,
  en: en.SERVICE_OVERVIEW_CARDS,
};

const SHERBIMET_CATALOG: Record<Locale, ServiceOverviewCard[]> = {
  sq: sq.SHERBIMET_PAGE_CARDS,
  en: en.SHERBIMET_PAGE_CARDS,
};

export function getServiceOverviewCards(locale: Locale): ServiceOverviewCard[] {
  return HOME_CATALOG[locale];
}

export function getSherbimetPageCards(locale: Locale): ServiceOverviewCard[] {
  return SHERBIMET_CATALOG[locale];
}
