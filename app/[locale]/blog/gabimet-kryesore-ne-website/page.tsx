import type { Metadata } from "next";
import BlogUxMistakesClient from "@/components/BlogUxMistakesClient";
import { buildMetadata, buildBreadcrumb, seo, jsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { blogArticleSchema } from "@/lib/blogDates";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Gabimet që bëjnë bizneset në website | Blog",
    description:
      "Gabimet më të zakonshme që ulin besimin e vizitorit dhe si t'i rregullosh pa ndërtuar gjithçka nga e para.",
  },
  en: {
    title: "The mistakes businesses make on their website | Blog",
    description:
      "The most common mistakes that erode visitor trust, and how to fix them without rebuilding everything from scratch.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  const base = buildMetadata(m.title, m.description, "/blog/gabimet-kryesore-ne-website", undefined, locale as Locale);
  return {
    ...base,
    title: m.title,
    openGraph: {
      ...base.openGraph,
      title: m.title
    },
    twitter: {
      ...base.twitter,
      title: m.title
    }
  };
}

export default async function GabimetKryesoreNeWebsitePage(props: Props) {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  const article = blogArticleSchema("gabimet-kryesore-ne-website", m.title.replace(/ \| Blog$/, ""), m.description, locale as Locale);
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Gabimet në Website", url: `${seo.siteUrl}/blog/gabimet-kryesore-ne-website` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <BlogUxMistakesClient />
    </>
  );
}
