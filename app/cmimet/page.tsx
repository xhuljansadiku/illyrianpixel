import type { Metadata } from "next";
import AllPackagesPageClient from "@/components/AllPackagesPageClient";
import { buildMetadata } from "@/lib/seo";

const DESC =
  "Investimi i duhur për rezultatin e duhur. Paketa transparente për website premium, e-commerce, SEO dhe branding, pa surpriza. Krahaso dhe zgjidh atë që përshtatet me objektivin tuaj.";

export const metadata: Metadata = buildMetadata(
  "Çmimet & paketat, Web, Marketing, Branding",
  DESC,
  "/cmimet"
);

export default function CmimetPage() {
  return <AllPackagesPageClient />;
}
