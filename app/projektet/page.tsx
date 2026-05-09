import { buildMetadata } from "@/lib/seo";
import { caseStudies } from "@/lib/caseStudies";
import WorkPageClient from "@/components/WorkPageClient";

export const metadata = buildMetadata(
  "Projektet, Raste Reale me ROI të Matshëm",
  "Portofol i zgjedhur me kujdes: website premium, faqe me konvertim të lartë dhe branding identitar për biznese nga Shqipëria, Gjermania dhe Britania. Shikoni rezultatet reale.",
  "/projektet"
);

export default function ProjektePage() {
  return <WorkPageClient projects={caseStudies} />;
}

