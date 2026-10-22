// Çmimet mujore të SEO, Google Ads dhe paketës së kombinuar (2026-10-21, opsioni A i pronarit).
// Burimi i vetëm për /services/seo, /services/google-ads dhe paketat "seo-google-ads" te
// /cmimet: më parë ishin shkruar veç e veç dhe paketa e kombinuar dilte më lirë se Ads vetëm.
// Rregulli (i testuar): paketa e kombinuar kushton më pak se shuma, por kurrë më pak se
// njëri nga shërbimet më vete.

export type SeoAdsTier = "starter" | "growth" | "pro";

export const SEO_MONTHLY: Record<SeoAdsTier, number> = { starter: 99, growth: 199, pro: 299 };
export const ADS_MONTHLY: Record<SeoAdsTier, number> = { starter: 120, growth: 250, pro: 400 };
export const BUNDLE_MONTHLY: Record<SeoAdsTier, number> = { starter: 189, growth: 379, pro: 599 };

export const SEO_ADS_TIERS: SeoAdsTier[] = ["starter", "growth", "pro"];

/** Sa kursen klienti në muaj me paketën e kombinuar kundrejt SEO + Ads veç e veç */
export const bundleSavings = (tier: SeoAdsTier) => SEO_MONTHLY[tier] + ADS_MONTHLY[tier] - BUNDLE_MONTHLY[tier];

/** 189 → "€189" (i njëjti format si çmimet e tjera te serviceCategories) */
export const euro = (n: number) => `€${n.toLocaleString("en-US")}`;
