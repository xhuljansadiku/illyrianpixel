import type { ConversionLandingData } from "@/lib/conversionLandingShared";

export const DIASPORA_COUNTRY_SLUGS = [
  "gjermani",
  "britani",
  "zvicer",
  "itali",
  "shba-kanada",
] as const;

export type CountrySlug = (typeof DIASPORA_COUNTRY_SLUGS)[number];

export type DiasporaCountryContent = ConversionLandingData & {
  countryLabel: string;
  flagCode: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroIntro: string;
  heroTrustLine?: string;
  ctaWhatsappHref: string;
  hookLine: string;
  relatedBlogSlugs: readonly string[];
  hasLocalCaseStudy: boolean;
};
