import type { Locale } from "./types";

/**
 * Article slugs per locale. Kept separate from the article bodies so that the
 * language switcher (a client component) can translate article URLs without
 * shipping the articles themselves to the browser.
 */
export const INSIGHT_SLUGS: { id: string; slugs: Record<Locale, string> }[] = [
  {
    id: "seo-vs-google-ads",
    slugs: { sv: "seo-eller-google-ads", en: "seo-or-google-ads" },
  },
  {
    id: "website-checklist",
    slugs: { sv: "checklista-infor-ny-webbplats", en: "website-project-checklist" },
  },
  {
    id: "ecommerce-platform",
    slugs: { sv: "valja-e-handelsplattform", en: "choosing-an-ecommerce-platform" },
  },
];

/** Translates an article slug from one locale to another (null if unknown). */
export function translateInsightSlug(slug: string, from: Locale, to: Locale): string | null {
  const entry = INSIGHT_SLUGS.find((item) => item.slugs[from] === slug);
  return entry ? entry.slugs[to] : null;
}
