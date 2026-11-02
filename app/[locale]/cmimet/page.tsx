import type { Metadata } from "next";
import AllPackagesPageClient from "@/components/AllPackagesPageClient";
import { buildMetadata } from "@/lib/seo";
import { getPricingOverrides, getVisibleFaqs } from "@/lib/publicContent";
import type { Locale } from "@/i18n/routing";

const META: Record<Locale, { title: string; desc: string }> = {
  sq: {
    title: "Çmimet & paketat, Web, Marketing, Branding",
    desc: "Paketa transparente për website premium, e-commerce, SEO dhe branding, pa surpriza. Krahasoni dhe zgjidhni atë që i përshtatet objektivit tuaj.",
  },
  en: {
    title: "Pricing & Packages, Web, Marketing, Branding",
    desc: "Transparent packages for premium websites, e-commerce, SEO and branding, with no surprises. Compare them and choose the one that fits your goal.",
  },
};

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "/cmimet", undefined, locale);
}

export const revalidate = 300;

export default async function CmimetPage(props: Props) {
  const { locale } = await props.params;
  const [overrides, faqRows] = await Promise.all([
    getPricingOverrides().catch(() => ({})),
    getVisibleFaqs(locale).catch(() => []),
  ]);
  // Text audit 2 (2026-11-02): këtu vetëm pyetjet për çmimin (SEO, pagesa, garancia) — të tjerat janë te kryefaqja.
  // Rreshtat në Supabase "faqs": 2 = SEO, 5 = pagesa, 7 = garancia.
  const PRICING_FAQ_IDS = [2, 5, 7];
  const pricingFaqs = faqRows.filter((f) => PRICING_FAQ_IDS.includes(Number(f.id)));
  const faqItems = (pricingFaqs.length > 0 ? pricingFaqs : faqRows).map((f) => ({ q: f.question, a: f.answer, category: f.category }));
  return <AllPackagesPageClient overrides={overrides} faqItems={faqItems} />;
}
