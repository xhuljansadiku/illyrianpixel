import type { Metadata } from "next";
import { Suspense } from "react";
import AllPackagesPageClient from "@/components/AllPackagesPageClient";
import { buildMetadata } from "@/lib/seo";
import { getPricingOverrides, getVisibleFaqs } from "@/lib/publicContent";

const DESC =
  "Investimi i duhur për rezultatin e duhur. Paketa transparente për website premium, e-commerce, SEO dhe branding, pa surpriza. Krahaso dhe zgjidh atë që përshtatet me objektivin tuaj.";

export const metadata: Metadata = buildMetadata(
  "Çmimet & paketat, Web, Marketing, Branding",
  DESC,
  "/cmimet"
);

export const revalidate = 300;

export default async function CmimetPage() {
  const [overrides, faqRows] = await Promise.all([
    getPricingOverrides().catch(() => ({})),
    getVisibleFaqs().catch(() => []),
  ]);
  const faqItems = faqRows.map((f) => ({ q: f.question, a: f.answer, category: f.category }));
  return (
    <Suspense>
      <AllPackagesPageClient overrides={overrides} faqItems={faqItems} />
    </Suspense>
  );
}
