import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/caseStudies";
import { blogPosts } from "@/lib/blogPosts";
import { seo } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/services/websites",
    "/services/ecommerce",
    "/services/marketing",
    "/services/seo",
    "/services/branding",
    "/work",
    "/process",
    "/about",
    "/blog",
    "/contact"
  ].map((path) => ({
    url: `${seo.siteUrl}${path}`,
    lastModified: new Date()
  }));

  const caseStudyRoutes = caseStudies.map((item) => ({
    url: `${seo.siteUrl}/work/${item.slug}`,
    lastModified: new Date()
  }));

  const blogRoutes = blogPosts.map((item) => ({
    url: `${seo.siteUrl}/blog/${item.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];
}
