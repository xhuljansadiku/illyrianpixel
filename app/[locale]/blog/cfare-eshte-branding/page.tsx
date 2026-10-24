import type { Metadata } from "next";
import BlogBrandingClient from "@/components/BlogBrandingClient";
import { buildMetadata, buildBreadcrumb, seo, jsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { blogArticleSchema } from "@/lib/blogDates";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Branding nuk është logo. Është çfarë ndiejnë të tjerët.",
    description:
      "Çfarë është branding në të vërtetë, pse bizneset shqiptare e nënvlerësojnë dhe çfarë humbasin duke e trajtuar si thjesht logo dhe ngjyrë.",
  },
  en: {
    title: "Branding isn't a logo. It's what others feel.",
    description:
      "What branding really is, why Albanian businesses underestimate it, and what they lose by treating it as just a logo and a color.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/cfare-eshte-branding", undefined, locale as Locale);
}

export default async function CfareEshteBrandingPage(props: Props) {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  const article = blogArticleSchema("cfare-eshte-branding", m.title, m.description, locale as Locale);
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Çfarë është Branding", url: `${seo.siteUrl}/blog/cfare-eshte-branding` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <BlogBrandingClient />
    </>
  );
}
