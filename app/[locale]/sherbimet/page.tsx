import { buildMetadata } from "@/lib/seo";
import SherbimetPageClient from "@/components/SherbimetPageClient";

export const metadata = buildMetadata(
  "Shërbime Dixhitale Premium, Website, Marketing & Branding",
  "Agjenci ueb dizajni luksoz me tre specializma: website premium me konvertim të lartë, marketing strategjik për biznese dhe branding identitar. Konsultim falas.",
  "/sherbimet",
  ["shërbime web design shqipëri", "website premium albania", "marketing online biznese", "seo shqipëri", "branding identitar", "e-commerce shqipëri", "social media marketing albania"]
);

export default function SherbimetPage() {
  return <SherbimetPageClient />;
}
