// Aplikimi i çmimeve të personalizuara nga admini (client + server safe).
import type { ServiceCategory, ServicePackage } from "@/lib/serviceCategories";

export type PricingOverrides = Record<string, { price: string; price_note: string | null }>;

export function pricingKey(categorySlug: string, packageName: string): string {
  return `${categorySlug}||${packageName}`;
}

export function applyOverridesToPackages(
  categorySlug: string,
  packages: ServicePackage[],
  overrides: PricingOverrides | undefined
): ServicePackage[] {
  if (!overrides) return packages;
  return packages.map((pkg) => {
    const o = overrides[pricingKey(categorySlug, pkg.name)];
    if (!o) return pkg;
    return { ...pkg, price: o.price, priceNote: o.price_note ?? pkg.priceNote };
  });
}

export function applyOverridesToCategory(
  category: ServiceCategory,
  overrides: PricingOverrides | undefined
): ServiceCategory {
  if (!overrides) return category;
  return { ...category, packages: applyOverridesToPackages(category.slug, category.packages, overrides) };
}
