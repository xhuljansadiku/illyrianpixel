/**
 * Absolute base URL used for canonical URLs, hreflang, Open Graph, sitemap and JSON-LD.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production domain (e.g. https://www.example.se).
 * On Vercel it falls back to the project's production domain, locally to localhost.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  ];
  const url = candidates.find((value): value is string => typeof value === "string" && value.length > 0);
  return (url ?? "http://localhost:3000").replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
