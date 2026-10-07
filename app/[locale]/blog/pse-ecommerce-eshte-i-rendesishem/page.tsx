import type { Metadata } from "next";
import BlogEcommerceClient from "@/components/BlogEcommerceClient";
import { buildMetadata, buildBreadcrumb, seo, jsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Dyqani juaj fizik mbyllet në orën 18:00. Dyqani online kurrë.",
    description:
      "Pse bizneset shqiptare kanë nevojë për dyqan online në 2026. Gabimet më të shpeshta, kostot reale dhe çfarë humbisni çdo muaj pa e-commerce.",
  },
  en: {
    title: "Your physical store closes at 6 PM. Your online store never does.",
    description:
      "Why Albanian businesses need an online store in 2026. The most common mistakes, real costs, and what you're losing every month without e-commerce.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/pse-ecommerce-eshte-i-rendesishem", undefined, locale as Locale);
}

export default function PseEcommerceEshteIRendesishemPage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Pse E-Commerce është i rëndësishëm", url: `${seo.siteUrl}/blog/pse-ecommerce-eshte-i-rendesishem` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <BlogEcommerceClient />
    </>
  );
}
