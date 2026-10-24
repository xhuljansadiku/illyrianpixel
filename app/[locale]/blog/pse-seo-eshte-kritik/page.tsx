import type { Metadata } from "next";
import BlogSeoClient from "@/components/BlogSeoClient";
import { buildMetadata, buildBreadcrumb, seo, jsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Pse SEO është kritik për biznese serioze (dhe jo një opsion)",
    description:
      "Një website i bukur që nuk shfaqet në Google është si një dyqan luksoz në mes të shkretëtirës. Askush nuk e gjen, askush nuk blen.",
  },
  en: {
    title: "Why SEO is critical for serious businesses (not optional)",
    description:
      "Having a beautiful website that doesn't show up on Google is like opening a luxury store in the middle of the desert. No one finds it, no one buys.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/pse-seo-eshte-kritik", undefined, locale as Locale);
}

export default function PseSeoEshteKritikPage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Pse SEO është kritik", url: `${seo.siteUrl}/blog/pse-seo-eshte-kritik` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <BlogSeoClient />
    </>
  );
}
