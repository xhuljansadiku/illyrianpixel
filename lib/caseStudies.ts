import type { Locale } from "@/i18n/routing";
import type { CaseStudy } from "./caseStudies.sq";
import { caseStudies as sqCaseStudies } from "./caseStudies.sq";
import { caseStudies as enCaseStudies } from "./caseStudies.en";

export type { CaseStudy } from "./caseStudies.sq";

// Default export stays Albanian — for consumers with no locale concept
// (sitemap generation, the unused CinematicProjects preview component).
export const caseStudies = sqCaseStudies;
export const caseStudyBySlug = (slug: string) => sqCaseStudies.find((item) => item.slug === slug);

const CATALOG: Record<Locale, CaseStudy[]> = { sq: sqCaseStudies, en: enCaseStudies };

export function getCaseStudies(locale: Locale): CaseStudy[] {
  return CATALOG[locale];
}

export function getCaseStudyBySlug(locale: Locale, slug: string): CaseStudy | undefined {
  return CATALOG[locale].find((item) => item.slug === slug);
}
