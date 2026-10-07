import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Crawlers that collect AI training data are opted out (same policy as before).
      // Search and answer engines that fetch pages on a user's behalf are still allowed.
      // Remove this rule to allow training crawlers.
      { userAgent: ["GPTBot", "CCBot", "ClaudeBot", "anthropic-ai", "Google-Extended"], disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
