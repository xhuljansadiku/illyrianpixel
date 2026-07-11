import { buildMetadata } from "@/lib/seo";
import NewsletterPageClient from "@/components/NewsletterPageClient";

export const metadata = buildMetadata(
  "10% Zbritje për Çdo Shërbim — Abonohu Tani",
  "Abonohu dhe merr kodin tënd ekskluziv 10% zbritje për Website, SEO, Google Ads, Branding dhe Social Media. Illyrian Pixel.",
  "/newsletter",
  ["zbritje website shqipëri", "10% zbritje agjenci dixhitale", "ofertë web design albania", "kod zbritjeje illyrian pixel"]
);

export default function NewsletterPage() {
  return <NewsletterPageClient />;
}
