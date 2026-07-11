import type { Metadata } from "next";
import BlogGoogleAdsSeoClient from "@/components/BlogGoogleAdsSeoClient";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";

const TITLE = "Google Ads apo SEO: Ku të investosh para?";
const DESCRIPTION =
  "Dy kanale të ndryshme, dy logjika të ndryshme. Njëra jep rezultate nesër, tjetra ndërton diçka që zgjat vite. Ja si të zgjedhësh sipas situatës dhe buxhetit të biznesit tuaj.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(TITLE, DESCRIPTION, "/blog/google-ads-vs-seo");
}

export default function GoogleAdsVsSeoPage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Google Ads vs SEO", url: `${seo.siteUrl}/blog/google-ads-vs-seo` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BlogGoogleAdsSeoClient />
    </>
  );
}
