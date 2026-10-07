import type { MetadataRoute } from "next";
import { getArticles } from "@/content/insights";
import { INSIGHT_SLUGS } from "@/content/insight-slugs";
import { LEGAL_UPDATED } from "@/content/legal";
import { getProjects } from "@/content/projects";
import { getServices } from "@/content/services";
import { LOCALE_LABELS, routing, type Locale } from "@/i18n/routing";
import { localizedUrl, type Href } from "@/lib/seo";

/** Date the site content was last substantially updated. */
const SITE_UPDATED = "2026-10-06";

type Entry = {
  hrefs: Record<Locale, Href>;
  lastModified: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

const same = (href: Href): Record<Locale, Href> => ({ sv: href, en: href });

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles("sv");

  const entries: Entry[] = [
    { hrefs: same("/"), lastModified: SITE_UPDATED, priority: 1, changeFrequency: "weekly" },
    { hrefs: same("/services"), lastModified: SITE_UPDATED, priority: 0.9, changeFrequency: "monthly" },
    ...getServices("sv").map<Entry>((service) => ({
      hrefs: same(service.href),
      lastModified: SITE_UPDATED,
      priority: 0.8,
      changeFrequency: "monthly",
    })),
    { hrefs: same("/work"), lastModified: SITE_UPDATED, priority: 0.7, changeFrequency: "monthly" },
    // Placeholder case studies are noindex and stay out of the sitemap.
    ...getProjects("sv")
      .filter((project) => !project.placeholder)
      .map<Entry>((project) => ({
        hrefs: same({ pathname: "/work/[slug]", params: { slug: project.slug } }),
        lastModified: SITE_UPDATED,
        priority: 0.6,
        changeFrequency: "yearly",
      })),
    { hrefs: same("/about"), lastModified: SITE_UPDATED, priority: 0.7, changeFrequency: "monthly" },
    { hrefs: same("/process"), lastModified: SITE_UPDATED, priority: 0.6, changeFrequency: "monthly" },
    { hrefs: same("/insights"), lastModified: SITE_UPDATED, priority: 0.7, changeFrequency: "weekly" },
    ...INSIGHT_SLUGS.map<Entry>((entry) => {
      const article = articles.find((item) => item.id === entry.id);
      return {
        hrefs: {
          sv: { pathname: "/insights/[slug]", params: { slug: entry.slugs.sv } },
          en: { pathname: "/insights/[slug]", params: { slug: entry.slugs.en } },
        },
        lastModified: article?.updatedAt ?? article?.publishedAt ?? SITE_UPDATED,
        priority: 0.6,
        changeFrequency: "yearly",
      };
    }),
    { hrefs: same("/contact"), lastModified: SITE_UPDATED, priority: 0.8, changeFrequency: "yearly" },
    { hrefs: same("/privacy"), lastModified: LEGAL_UPDATED, priority: 0.2, changeFrequency: "yearly" },
    { hrefs: same("/terms"), lastModified: LEGAL_UPDATED, priority: 0.2, changeFrequency: "yearly" },
    { hrefs: same("/cookies"), lastModified: LEGAL_UPDATED, priority: 0.2, changeFrequency: "yearly" },
  ];

  return entries.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, entry.hrefs[locale]),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternate) => [LOCALE_LABELS[alternate].htmlLang, localizedUrl(alternate, entry.hrefs[alternate])]),
        ),
      },
    })),
  );
}
