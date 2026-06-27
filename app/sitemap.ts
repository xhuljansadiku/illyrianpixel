import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { caseStudies } from "@/lib/caseStudies";
import { seo } from "@/lib/seo";

const LAUNCH_DATE = new Date("2026-01-15");
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
};

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
  ]);

  const dedicatedBlogRoutes = [...dedicatedBlogSlugs].map((slug) => ({
    url: `${seo.siteUrl}/blog/${slug}`,
    lastModified: BLOG_DATES[slug] ?? LAUNCH_DATE,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const blogRoutes = blogPosts
    .filter((item) => !dedicatedBlogSlugs.has(item.slug))
    .map((item) => ({
      url: `${seo.siteUrl}/blog/${item.slug}`,
      lastModified: BLOG_DATES[item.slug] ?? LAUNCH_DATE,
      priority: 0.65,
      changeFrequency: "monthly" as const,
    }));

  const projectRoutes = caseStudies.map((cs) => ({
    url: `${seo.siteUrl}/projektet/${cs.slug}`,
    lastModified: LAUNCH_DATE,
    priority: 0.75,
    changeFrequency: "monthly" as const,
  }));

  return [
    ...staticRoutes.map(({ path, priority, changefreq, date }) => ({
      url: `${seo.siteUrl}${path}`,
      lastModified: date,
      priority,
      changeFrequency: changefreq,
    })),
    ...projectRoutes,
    ...blogRoutes,
    ...dedicatedBlogRoutes,
  ];
}


