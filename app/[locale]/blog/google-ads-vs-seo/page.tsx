import type { Metadata } from "next";
import BlogGoogleAdsSeoClient from "@/components/BlogGoogleAdsSeoClient";
import { buildMetadata, buildBreadcrumb, seo, jsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Google Ads apo SEO: Ku të investosh para?",
    description:
      "Dy kanale të ndryshme, dy logjika të ndryshme. Njëra jep rezultate nesër, tjetra ndërton diçka që zgjat vite. Ja si të zgjedhësh sipas situatës dhe buxhetit të biznesit tuaj.",
  },
  en: {
    title: "Google Ads or SEO: Where should you invest your money?",
    description:
      "Two different channels, two different logics. One delivers results tomorrow, the other builds something that lasts for years. Here's how to choose based on your situation and budget.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/google-ads-vs-seo", undefined, locale as Locale);
}

export default function GoogleAdsVsSeoPage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Google Ads vs SEO", url: `${seo.siteUrl}/blog/google-ads-vs-seo` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <BlogGoogleAdsSeoClient />
    </>
  );
}
