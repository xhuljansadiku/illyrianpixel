import { buildMetadata } from "@/lib/seo";
import SherbimetPageClient from "@/components/SherbimetPageClient";

export const metadata = buildMetadata(
  "Shërbime Dixhitale Premium, Website, Marketing & Branding",
  "Agjenci ueb dizajni luksoz me tre specializma: website premium me konvertim të lartë, marketing strategjik për biznese dhe branding identitar. Konsultim falas.",
  "/sherbimet"
);

export default function SherbimetPage() {
  return <SherbimetPageClient />;
}
