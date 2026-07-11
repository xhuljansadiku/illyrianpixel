import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SherbimetPageClient from "@/components/SherbimetPageClient";
import type { Locale } from "@/i18n/routing";

const META: Record<Locale, { title: string; desc: string; keywords: string[] }> = {
  sq: {
    title: "Shërbime Dixhitale Premium, Website, Marketing & Branding",
    desc: "Agjenci ueb dizajni luksoz me tre specializma: website premium me konvertim të lartë, marketing strategjik për biznese dhe branding identitar. Konsultim falas.",
    keywords: ["shërbime web design shqipëri", "website premium albania", "marketing online biznese", "seo shqipëri", "branding identitar", "e-commerce shqipëri", "social media marketing albania"],
  },
  en: {
    title: "Premium Digital Services, Website, Marketing & Branding",
    desc: "Luxury web design agency with three specialties: high-conversion premium websites, strategic business marketing and brand identity. Free consultation.",
    keywords: ["digital services albania", "premium website albania", "online business marketing", "seo albania", "brand identity", "e-commerce albania", "social media marketing albania"],
  },
};

type Props = { params: { locale: Locale } | Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "/sherbimet", m.keywords, locale);
}

export default function SherbimetPage() {
  return <SherbimetPageClient />;
}
