import type { MetadataRoute } from "next";
import { seo } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/*.json$"],
      },
      // Block AI scrapers from training data
      { userAgent: "GPTBot",        disallow: "/" },
      { userAgent: "ChatGPT-User",  disallow: "/" },
      { userAgent: "CCBot",         disallow: "/" },
      { userAgent: "anthropic-ai",  disallow: "/" },
      { userAgent: "Claude-Web",    disallow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
    ],
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
