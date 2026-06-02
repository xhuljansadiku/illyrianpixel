import type { Metadata } from "next";
import BlogGrowthClient from "@/components/BlogGrowthClient";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";

const TITLE = "Ke trafikun. Por ku janë klientët?";
const DESCRIPTION =
  "Shumica e bizneseve shpenzojnë para për të sjellë njerëz në faqe dhe i humbin menjëherë. Jo sepse oferta është e keqe, por sepse faqja nuk po bën punën e saj.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(TITLE, DESCRIPTION, "/blog/si-te-rrisesh-klientet-online");
}

export default function SiTeRriseshKlientetOnlinePage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Si të rrisësh klientët online", url: `${seo.siteUrl}/blog/si-te-rrisesh-klientet-online` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BlogGrowthClient />
    </>
  );
}
