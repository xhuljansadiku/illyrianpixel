import type { MetadataRoute } from "next";
import { DEDICATED_BLOG_SLUGS } from "@/lib/blogDedicatedSlugs";
import { STRUCTURED_ARTICLES } from "@/lib/blogArticles";
import { getBlogPostsForLocale } from "@/lib/blogPosts";
import { getCaseStudies } from "@/lib/caseStudies";
import { seo } from "@/lib/seo";
import { DIASPORA_COUNTRY_SLUGS } from "@/lib/diasporaShared";
import type { Locale } from "@/i18n/routing";

// Actual site go-live date (confirmed by owner), not the first commit date
const LAUNCH_DATE = new Date("2026-05-10");
const BLOG_DATES: Record<string, Date> = {
  "si-te-rrisesh-klientet-online": new Date("2026-04-10"),
  "gabimet-kryesore-ne-website": new Date("2026-04-15"),
  "pse-seo-eshte-kritik": new Date("2026-04-20"),
  "google-ads-vs-seo": new Date("2026-05-05"),
  "pse-ecommerce-eshte-i-rendesishem": new Date("2026-05-10"),
  "cfare-eshte-branding": new Date("2026-05-15"),
  "sa-kushton-website-shqiperi": new Date("2026-05-20"),
  "seo-tirane": new Date("2026-05-22"),
  "dyqan-online-shqiperi": new Date("2026-05-24"),
  "google-ads-shqiperi": new Date("2026-05-26"),
  "web-design-tirane": new Date("2026-05-28"),
  "social-media-menaxhim-shqiperi": new Date("2026-05-30"),
  "menaxho-biznesin-nga-diaspora": new Date("2026-07-25"),
  "website-dygjuhesh-biznes-diaspore": new Date("2026-07-25"),
  "si-te-gjejne-klientet-shqiptare-biznesin-tend": new Date("2026-07-25"),
  "sa-kushton-website-kosove": new Date("2026-07-29"),
  ...Object.fromEntries(STRUCTURED_ARTICLES.map((a) => [a.slug, new Date(a.published)])),
};

// localePrefix "as-needed": sq has no prefix, en is prefixed with /en
const localizedUrl = (locale: Locale, path: string) =>
  locale === "en" ? `${seo.siteUrl}/en${path}` : `${seo.siteUrl}${path}`;

const LOCALES: Locale[] = ["sq", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  // date = ndryshimi i fundit real i faqes (nga git log, 2026-10-24). Google e injoron lastmod-in
  // kur sheh që s'përputhet me ndryshimet — përditësoje kur ndryshon përmbajtja e faqes.
  const staticRoutes: { path: string; priority: number; changefreq: MetadataRoute.Sitemap[number]["changeFrequency"]; date: Date }[] = [
    { path: "",                          priority: 1.0,  changefreq: "weekly",  date: new Date("2026-10-22") },
    { path: "/sherbimet",                priority: 0.9,  changefreq: "monthly", date: new Date("2026-10-07") },
    { path: "/cmimet",                   priority: 0.85, changefreq: "monthly", date: new Date("2026-10-07") },
    { path: "/contact",                  priority: 0.85, changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/projektet",                priority: 0.8,  changefreq: "weekly",  date: new Date("2026-10-21") },
    { path: "/newsletter",               priority: 0.6,  changefreq: "monthly", date: new Date("2026-10-07") },
    { path: "/blog",                     priority: 0.75, changefreq: "weekly",  date: new Date("2026-10-22") },
    { path: "/services/website",         priority: 0.8,  changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/ecommerce",       priority: 0.8,  changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/seo-google-ads",  priority: 0.8,  changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/branding-content",priority: 0.75, changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/smm",             priority: 0.75, changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/mirembajtja",     priority: 0.7,  changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/aplikacione-mobile", priority: 0.75, changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/services/seo",             priority: 0.8,  changefreq: "monthly", date: new Date("2026-10-22") },
    { path: "/services/google-ads",      priority: 0.8,  changefreq: "monthly", date: new Date("2026-10-21") },
    { path: "/privacy",                  priority: 0.3,  changefreq: "yearly",  date: new Date("2026-10-13") },
    { path: "/terms",                    priority: 0.3,  changefreq: "yearly",  date: new Date("2026-10-13") },
  ];

  // Burim i vetëm me app/[locale]/blog/[slug] (2026-10-22) — më parë dy lista të ndara
  const dedicatedBlogSlugs = DEDICATED_BLOG_SLUGS;

  // Artikuj pa version anglisht — /en/... e tyre është noindex (buildMetadata sqOnly)
  const sqOnlyBlogSlugs = new Set(["si-te-rrisesh-klientet-online"]);

  const staticEntries = LOCALES.flatMap((locale) =>
    staticRoutes.map(({ path, priority, changefreq, date }) => ({
      url: localizedUrl(locale, path),
      lastModified: date,
      priority,
      changeFrequency: changefreq,
    }))
  );

  const blogEntries = LOCALES.flatMap((locale) => {
    const posts = getBlogPostsForLocale(locale).filter(
      (item) => !(locale === "en" && sqOnlyBlogSlugs.has(item.slug))
    );
    const dedicated = posts
      .filter((item) => dedicatedBlogSlugs.has(item.slug))
      .map((item) => ({
        url: localizedUrl(locale, `/blog/${item.slug}`),
        lastModified: BLOG_DATES[item.slug] ?? LAUNCH_DATE,
        priority: 0.7,
        changeFrequency: "monthly" as const,
      }));
    const rest = posts
      .filter((item) => !dedicatedBlogSlugs.has(item.slug))
      .map((item) => ({
        url: localizedUrl(locale, `/blog/${item.slug}`),
        lastModified: BLOG_DATES[item.slug] ?? LAUNCH_DATE,
        priority: 0.65,
        changeFrequency: "monthly" as const,
      }));
    return [...dedicated, ...rest];
  });

  const projectEntries = LOCALES.flatMap((locale) =>
    getCaseStudies(locale).map((cs) => ({
      url: localizedUrl(locale, `/projektet/${cs.slug}`),
      // Redizajni i faqeve të projekteve (7e994bd)
      lastModified: new Date("2026-10-14"),
      priority: 0.75,
      changeFrequency: "monthly" as const,
    }))
  );

  // Faqet e diasporës: sq që më 2026-08-21, en (lib/diasporaContent.en.ts) që më 2026-10-05.
  const diasporaEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => {
    const date = new Date(locale === "en" ? "2026-10-05" : "2026-08-21");
    return [
      {
        url: localizedUrl(locale, "/diaspora"),
        lastModified: date,
        priority: 0.8,
        changeFrequency: "monthly" as const,
      },
      ...DIASPORA_COUNTRY_SLUGS.map((slug) => ({
        url: localizedUrl(locale, `/diaspora/${slug}`),
        lastModified: date,
        priority: 0.75,
        changeFrequency: "monthly" as const,
      })),
    ];
  });

  return [...staticEntries, ...projectEntries, ...blogEntries, ...diasporaEntries];
}


