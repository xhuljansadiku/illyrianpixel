import type { Metadata } from "next";
import BlogGrowthClient from "@/components/BlogGrowthClient";
import { buildMetadata, buildBreadcrumb, seo, jsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { blogArticleSchema } from "@/lib/blogDates";

type Props = { params: Promise<{ locale: string }> };

const TITLE = "Ke trafikun. Por ku janë klientët?";
const DESCRIPTION =
  "Shumica e bizneseve paguajnë për të sjellë vizitorë dhe i humbin menjëherë. Jo sepse oferta është e keqe, por sepse faqja nuk po bën punën e saj.";

// BlogGrowthClient ekziston vetëm në shqip — /en mbetet noindex me canonical te versioni sq.
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  return buildMetadata(TITLE, DESCRIPTION, "/blog/si-te-rrisesh-klientet-online", undefined, locale as Locale, { sqOnly: true });
}

export default function SiTeRriseshKlientetOnlinePage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Si të rrisësh klientët online", url: `${seo.siteUrl}/blog/si-te-rrisesh-klientet-online` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogArticleSchema("si-te-rrisesh-klientet-online", TITLE, DESCRIPTION, "sq")) }} />
      <BlogGrowthClient />
    </>
  );
}
