import type { MetadataRoute } from "next";
import { seo } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ NUK bllokohet — Google duhet të ngarkojë JS/CSS për të renderuar faqet
        // dhe /_next/image për t'i indeksuar imazhet.
        disallow: ["/api/", "/admin/", "/*.json$"],
      },
      // Bllokohen vetëm crawler-at që mbledhin të dhëna për trajnim. Fetcher-at që
      // veprojnë kur një person pyet ChatGPT/Claude/Perplexity lejohen — sjellin klientë.
      { userAgent: "GPTBot",        disallow: "/" },
      { userAgent: "CCBot",         disallow: "/" },
      { userAgent: "anthropic-ai",  disallow: "/" },
      { userAgent: "ClaudeBot",     disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
    ],
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
