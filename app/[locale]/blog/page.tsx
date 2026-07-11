import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { buildMetadata } from "@/lib/seo";
import BlogPageClient from "@/components/BlogPageClient";
import type { Locale } from "@/i18n/routing";

const META: Record<Locale, { title: string; desc: string; keywords: string[] }> = {
  sq: {
    title: "Blog: Strategji Dixhitale & SEO për Biznese",
    desc: "Artikuj praktikë për UX, SEO, marketing dixhital dhe rritje të qëndrueshme për biznese shqiptare serioze.",
    keywords: ["blog seo shqipëri", "strategji dixhitale", "marketing online albania", "web design tips", "rritje biznesi online"],
  },
  en: {
    title: "Blog: Digital Strategy & SEO for Businesses",
    desc: "Practical articles on UX, SEO, digital marketing and sustainable growth for serious Albanian businesses.",
    keywords: ["seo blog albania", "digital strategy", "online marketing albania", "web design tips", "business growth online"],
  },
};

type Props = { params: { locale: Locale } | Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "/blog", m.keywords, locale);
}

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function BlogPage() {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, category, excerpt, date")
    .or(`published.eq.true,scheduled_for.lte.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  return <BlogPageClient dbPosts={data ?? []} />;
}
