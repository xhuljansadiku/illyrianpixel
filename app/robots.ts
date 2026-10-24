import type { MetadataRoute } from "next";
import { seo } from "@/lib/seo";

// Vendim i pronarit (2026-10-24): të gjithë motorët e kërkimit dhe AI lejohen — duam të
// dalim si burim në Google, Bing, ChatGPT, Claude, Perplexity, Gemini, Copilot.
const DISALLOW = ["/api/", "/admin/", "/*.json$"];

// Listohen me emër që kontrolluesit SEO/AI ta shohin lejen qartë. Një bot që gjen grupin e
// vet injoron grupin "*", ndaj DISALLOW përsëritet këtu.
const SEARCH_AND_AI_BOTS = [
  "Googlebot", "Googlebot-Image", "Google-Extended", "Bingbot", "DuckDuckBot", "Applebot", "Applebot-Extended",
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "CCBot", "meta-externalagent", "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ NUK bllokohet — Google duhet të ngarkojë JS/CSS për të renderuar faqet
        // dhe /_next/image për t'i indeksuar imazhet.
        disallow: DISALLOW,
      },
      { userAgent: SEARCH_AND_AI_BOTS, allow: "/", disallow: DISALLOW },
      // AI-block: bllokimi i vjetër i crawler-ave të trajnimit (çaktivizuar 2026-10-24)
      // { userAgent: "GPTBot",        disallow: "/" },
      // { userAgent: "CCBot",         disallow: "/" },
      // { userAgent: "anthropic-ai",  disallow: "/" },
      // { userAgent: "ClaudeBot",     disallow: "/" },
      // { userAgent: "Google-Extended", disallow: "/" },
    ],
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
