import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { caseStudies, getCaseStudies, getCaseStudyBySlug } from "@/lib/caseStudies";
import { buildMetadata, seo } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudyView from "@/components/CaseStudyView";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const cs = getCaseStudyBySlug(locale, slug);
  if (!cs) return {};
  const t = await getTranslations({ locale, namespace: "projects.detail" });
  const cleanIntro = cs.intro.replace(/\n/g, " ");
  // buildMetadata jep canonical + hreflang sipas gjuhës (slug-et janë të njëjta në sq/en)
  const base = buildMetadata(cs.title, cleanIntro, `/projektet/${cs.slug}`, undefined, locale);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title: `${cs.title} — ${t("ogCaseStudy")} | Illyrian Pixel`,
      images: [{ url: cs.heroImage || seo.ogImage, width: 1200, height: 630, alt: `${cs.title} — ${cs.category}` }]
    }
  };
}

// Dizajni i ri (2026-10-14): hero + fakte, screenshot në browser, përfitime, CTA + projekti tjetër.
// Versioni i vjetër (problem/solution/result) është në git historinë e këtij file-i.
export default async function CaseStudyPage(props: Props) {
  const { locale, slug } = await props.params;
  const all = getCaseStudies(locale);
  const i = all.findIndex((c) => c.slug === slug);
  if (i === -1) notFound();

  return (
    <>
      <Navbar />
      <CaseStudyView cs={all[i]} next={all[(i + 1) % all.length]} locale={locale} />
      <Footer />
    </>
  );
}
