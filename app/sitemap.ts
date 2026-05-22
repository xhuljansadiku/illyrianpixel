import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { seo } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/sherbimet",
    "/cmimet",
    "/services/website",
    "/services/ecommerce",
    "/services/marketing-growth",
    "/services/branding-content",
    "/services/smm",
    "/services/mirembajtja",
    "/services/seo",
    "/services/google-ads",
    "/projektet",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms"
  ].map((path) => ({
    url: `${seo.siteUrl}${path}`,
    lastModified: new Date()
  }));

  const dedicatedBlogSlugs = new Set([
    "si-te-rrisesh-klientet-online",
    "gabimet-kryesore-ne-website",
    "pse-seo-eshte-kritik",
    "google-ads-vs-seo",
    "pse-ecommerce-eshte-i-rendesishem",
    "cfare-eshte-branding"
  ]);

  const dedicatedBlogRoutes = [...dedicatedBlogSlugs].map((slug) => ({
    url: `${seo.siteUrl}/blog/${slug}`,
    lastModified: new Date()
  }));

  const blogRoutes = blogPosts
    .filter((item) => !dedicatedBlogSlugs.has(item.slug))
    .map((item) => ({
      url: `${seo.siteUrl}/blog/${item.slug}`,
      lastModified: new Date()
    }));

  return [...staticRoutes, ...blogRoutes, ...dedicatedBlogRoutes];
}


