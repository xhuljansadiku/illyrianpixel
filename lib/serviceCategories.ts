import type { Locale } from "@/i18n/routing";
import type { ServiceCategory } from "./serviceCategories.sq";
import { serviceCategories as sqCategories } from "./serviceCategories.sq";
import { serviceCategories as enCategories } from "./serviceCategories.en";

export type { ServiceCategory, ServiceFeatureBullet, ServicePackage } from "./serviceCategories.sq";

// Default export stays Albanian — used by admin/API/internal tooling that has
// no locale concept (app/admin, the King Genti assistant data route).
export const serviceCategories = sqCategories;
export const serviceCategoryBySlug = (slug: string) =>
  sqCategories.find((item) => item.slug === slug);

const CATALOG: Record<Locale, ServiceCategory[]> = { sq: sqCategories, en: enCategories };

export function getServiceCategories(locale: Locale): ServiceCategory[] {
  return CATALOG[locale];
}

export function getServiceCategoryBySlug(locale: Locale, slug: string): ServiceCategory | undefined {
  return CATALOG[locale].find((item) => item.slug === slug);
}
