import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getCaseStudies } from "@/lib/caseStudies";
import WorkPageClient from "@/components/WorkPageClient";
import type { Locale } from "@/i18n/routing";

const META: Record<Locale, { title: string; desc: string }> = {
  sq: {
    title: "Projektet, Raste Reale me ROI të Matshëm",
    desc: "Portofol i zgjedhur me kujdes: website premium, faqe me konvertim të lartë dhe branding identitar për biznese nga Shqipëria, Gjermania dhe Britania. Shikoni rezultatet reale.",
  },
  en: {
    title: "Our Work, Real Case Studies with Measurable ROI",
    desc: "A carefully curated portfolio: premium websites, high-conversion pages and brand identity for businesses from Albania, Germany and the UK. See the real results.",
  },
};

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "/projektet", undefined, locale);
}

export default async function ProjektePage(props: Props) {
  const { locale } = await props.params;
  return <WorkPageClient projects={getCaseStudies(locale)} />;
}

