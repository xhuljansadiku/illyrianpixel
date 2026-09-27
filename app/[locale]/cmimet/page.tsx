import type { Metadata } from "next";
import { Suspense } from "react";
import AllPackagesPageClient from "@/components/AllPackagesPageClient";
import { buildMetadata } from "@/lib/seo";
import { getPricingOverrides, getVisibleFaqs } from "@/lib/publicContent";
import type { Locale } from "@/i18n/routing";

const META: Record<Locale, { title: string; desc: string }> = {
  sq: {
    title: "Çmimet & paketat, Web, Marketing, Branding",
    desc: "Investimi i duhur për rezultatin e duhur. Paketa transparente për website premium, e-commerce, SEO dhe branding, pa surpriza. Krahaso dhe zgjidh atë që përshtatet me objektivin tuaj.",
  },
  en: {
    title: "Pricing & Packages, Web, Marketing, Branding",
    desc: "The right investment for the right result. Transparent packages for premium websites, e-commerce, SEO and branding, no surprises. Compare and choose what fits your goal.",
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
  const faqItems = faqRows.map((f) => ({ q: f.question, a: f.answer, category: f.category }));
  return (
    <Suspense>
      <AllPackagesPageClient overrides={overrides} faqItems={faqItems} />
    </Suspense>
  );
}
