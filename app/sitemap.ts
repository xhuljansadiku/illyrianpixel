import type { MetadataRoute } from "next";
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
};

// localePrefix "as-needed": sq has no prefix, en is prefixed with /en
const localizedUrl = (locale: Locale, path: string) =>
  locale === "en" ? `${seo.siteUrl}/en${path}` : `${seo.siteUrl}${path}`;

const LOCALES: Locale[] = ["sq", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number; changefreq: MetadataRoute.Sitemap[number]["changeFrequency"]; date: Date }[] = [
    { path: "",                          priority: 1.0,  changefreq: "weekly",  date: LAUNCH_DATE },
    { path: "/sherbimet",                priority: 0.9,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/cmimet",                   priority: 0.85, changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/contact",                  priority: 0.85, changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/projektet",                priority: 0.8,  changefreq: "weekly",  date: LAUNCH_DATE },
    { path: "/newsletter",               priority: 0.6,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/blog",                     priority: 0.75, changefreq: "weekly",  date: new Date("2026-05-15") },
    { path: "/services/website",         priority: 0.8,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/ecommerce",       priority: 0.8,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/seo-google-ads",  priority: 0.8,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/branding-content",priority: 0.75, changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/smm",             priority: 0.75, changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/mirembajtja",     priority: 0.7,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/aplikacione-mobile", priority: 0.75, changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/seo",             priority: 0.8,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/services/google-ads",      priority: 0.8,  changefreq: "monthly", date: LAUNCH_DATE },
    { path: "/privacy",                  priority: 0.3,  changefreq: "yearly",  date: LAUNCH_DATE },
    { path: "/terms",                    priority: 0.3,  changefreq: "yearly",  date: LAUNCH_DATE },
  ];

  const dedicatedBlogSlugs = new Set([
    "si-te-rrisesh-klientet-online",
    "gabimet-kryesore-ne-website",
    "pse-seo-eshte-kritik",
    "google-ads-vs-seo",
    "pse-ecommerce-eshte-i-rendesishem",
    "cfare-eshte-branding",
    "sa-kushton-website-shqiperi",
    "seo-tirane",
    "dyqan-online-shqiperi",
    "google-ads-shqiperi",
    "web-design-tirane",
    "social-media-menaxhim-shqiperi",
    "menaxho-biznesin-nga-diaspora",
    "website-dygjuhesh-biznes-diaspore",
    "si-te-gjejne-klientet-shqiptare-biznesin-tend",
    "sa-kushton-website-kosove",
  ]);

  const staticEntries = LOCALES.flatMap((locale) =>
    staticRoutes.map(({ path, priority, changefreq, date }) => ({
      url: localizedUrl(locale, path),
      lastModified: date,
      priority,
      changeFrequency: changefreq,
    }))
  );

  const blogEntries = LOCALES.flatMap((locale) => {
    const posts = getBlogPostsForLocale(locale);
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
      lastModified: LAUNCH_DATE,
      priority: 0.75,
      changeFrequency: "monthly" as const,
    }))
  );

  // Faqet e diasporës janë vetëm në shqip (v1) — jo brenda LOCALES.flatMap,
  // pikërisht që të mos listohet /en/diaspora/* (do dyfishonte përmbajtjen).
  const DIASPORA_DATE = new Date("2026-08-21");
  const diasporaEntries: MetadataRoute.Sitemap = [
    {
      url: localizedUrl("sq", "/diaspora"),
      lastModified: DIASPORA_DATE,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    ...DIASPORA_COUNTRY_SLUGS.map((slug) => ({
      url: localizedUrl("sq", `/diaspora/${slug}`),
      lastModified: DIASPORA_DATE,
      priority: 0.75,
      changeFrequency: "monthly" as const,
    })),
  ];

  return [...staticEntries, ...projectEntries, ...blogEntries, ...diasporaEntries];
}


