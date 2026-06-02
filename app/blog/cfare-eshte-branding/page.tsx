import type { Metadata } from "next";
import BlogBrandingClient from "@/components/BlogBrandingClient";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";

const TITLE = "Branding nuk është logo. Është çfarë ndiejnë të tjerët.";
const DESCRIPTION =
  "Çfarë është branding në të vërtetë, pse bizneset shqiptare e nënvlerësojnë dhe çfarë humbasin duke e trajtuar si thjesht logo dhe ngjyrë.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(TITLE, DESCRIPTION, "/blog/cfare-eshte-branding");
}

export default function CfareEshteBrandingPage() {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: "Çfarë është Branding", url: `${seo.siteUrl}/blog/cfare-eshte-branding` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BlogBrandingClient />
    </>
  );
}
