import { createClient } from "@supabase/supabase-js";
import { buildMetadata } from "@/lib/seo";
import BlogPageClient from "@/components/BlogPageClient";

export const metadata = buildMetadata(
  "Blog — Strategji Dixhitale & SEO për Biznese",
  "Artikuj praktikë për UX, SEO, marketing dixhital dhe rritje të qëndrueshme për biznese shqiptare serioze.",
  "/blog",
  ["blog seo shqipëri", "strategji dixhitale", "marketing online albania", "web design tips", "rritje biznesi online"]
);

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function BlogPage() {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, category, excerpt, date")
    .order("created_at", { ascending: false });

  return <BlogPageClient dbPosts={data ?? []} />;
}
