// "nga €X" për ofertat = paketa më e lirë e çdo kategorie, me çmimet e adminit (si te /cmimet).
// Përdoret nga faqja kryesore dhe faqja kroate (/hr), që çmimet të përputhen kudo.
import type { Locale } from "@/i18n/routing";
import { getServiceCategories } from "@/lib/serviceCategories";
import { applyOverridesToCategory, type PricingOverrides } from "@/lib/pricingOverrides";

export type OfferPrice = { price: string; note?: string };

export function getOfferPrices(locale: Locale, overrides: PricingOverrides | undefined): Record<string, OfferPrice | undefined> {
  const prices: Record<string, OfferPrice | undefined> = {};
  for (const cat of getServiceCategories(locale)) {
    const first = applyOverridesToCategory(cat, overrides).packages[0];
    if (first && /[0-9]/.test(first.price)) prices[cat.slug] = { price: first.price, note: first.priceNote };
  }
  return prices;
}
