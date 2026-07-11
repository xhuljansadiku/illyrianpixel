import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import NewsletterPageClient from "@/components/NewsletterPageClient";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "10% Zbritje për Çdo Shërbim — Abonohu Tani",
    description:
      "Abonohu dhe merr kodin tënd ekskluziv 10% zbritje për Website, SEO, Google Ads, Branding dhe Social Media. Illyrian Pixel.",
    keywords: ["zbritje website shqipëri", "10% zbritje agjenci dixhitale", "ofertë web design albania", "kod zbritjeje illyrian pixel"],
  },
  en: {
    title: "10% Off Every Service — Subscribe Now",
    description:
      "Subscribe and get your exclusive 10% discount code for Website, SEO, Google Ads, Branding and Social Media. Illyrian Pixel.",
    keywords: ["website discount albania", "10% off digital agency", "web design offer albania", "illyrian pixel discount code"],
  },
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/newsletter", m.keywords, locale as Locale);
}

export default function NewsletterPage() {
  return <NewsletterPageClient />;
}
