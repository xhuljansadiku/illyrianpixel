import { buildMetadata } from "@/lib/seo";
import BlogPageClient from "@/components/BlogPageClient";

export const metadata = buildMetadata(
  "Blog — Strategji Dixhitale & SEO për Biznese",
  "Artikuj praktikë për UX, SEO, marketing dixhital dhe rritje të qëndrueshme për biznese shqiptare serioze.",
  "/blog",
  ["blog seo shqipëri", "strategji dixhitale", "marketing online albania", "web design tips", "rritje biznesi online"]
);

export default function BlogPage() {
  return <BlogPageClient />;
}
