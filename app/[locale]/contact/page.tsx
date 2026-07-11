import { buildMetadata } from "@/lib/seo";
import ContactPageClient from "@/components/ContactPageClient";

export const metadata = buildMetadata(
  "Kontakt, Bisedë Falas, Plan Brenda 24h",
  "Tregoni projektin tuaj. Brenda 24 orësh merrni një plan konkret pa asnjë obligim. Agjenci premium dixhitale në Tiranë, Illyrian Pixel.",
  "/contact",
  ["kontakt agjenci dixhitale", "konsultim falas website", "ofertë website shqipëri", "plan marketing falas", "agjenci web tiranë"]
);

export default function ContactPage() {
  return <ContactPageClient />;
}
