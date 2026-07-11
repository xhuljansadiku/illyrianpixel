import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";
import { blogPosts, getBlogPostBySlug } from "@/lib/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type BlogPostPageProps = {
  params: { slug: string };
};

const DEDICATED_BLOG_SLUGS = new Set([
  "si-te-rrisesh-klientet-online",
  "gabimet-kryesore-ne-website",
  "pse-seo-eshte-kritik",
  "google-ads-vs-seo",
  "pse-ecommerce-eshte-i-rendesishem",
  "cfare-eshte-branding"
]);

const CATEGORY_COLORS: Record<string, string> = {
  "Web Design": "rgba(234,206,113,0.95)",
  "SEO": "rgba(167,243,208,0.9)",
  "E-Commerce": "rgba(196,181,253,0.9)",
  "Marketing": "rgba(252,211,77,0.9)",
  "Social Media": "rgba(147,197,253,0.9)",
  "Branding": "rgba(249,168,212,0.9)",
  "Strategji": "rgba(253,186,116,0.9)",
  "Rritje": "rgba(110,231,183,0.9)",
  "UX": "rgba(165,180,252,0.9)",
};

const DEFAULT_CATEGORY_COLOR = "rgba(171,131,57,0.9)";

function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR;
}

function estimateReadTime(content: string[]) {
  const words = content.join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.round(words / 200))} min lexim`;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getDbPostBySlug(slug: string) {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .or(`published.eq.true,scheduled_for.lte.${new Date().toISOString()}`)
    .maybeSingle();
  return data;
}

async function getOtherPosts(slug: string) {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, category, excerpt, date")
    .neq("slug", slug)
    .or(`published.eq.true,scheduled_for.lte.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function generateStaticParams() {
  return blogPosts.filter((post) => !DEDICATED_BLOG_SLUGS.has(post.slug)).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug) ?? (await getDbPostBySlug(params.slug));
  if (!post) return buildMetadata("Blog", undefined, "/blog");
  return buildMetadata(post.title, post.meta_description || post.excerpt, `/blog/${params.slug}`);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const staticPost = getBlogPostBySlug(params.slug);

  if (staticPost) {
    const breadcrumbSchema = buildBreadcrumb([
      { name: "Home", url: seo.siteUrl },
      { name: "Blog", url: `${seo.siteUrl}/blog` },
      { name: staticPost.title, url: `${seo.siteUrl}/blog/${params.slug}` },
    ]);

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: staticPost.title,
      description: staticPost.excerpt,
      author: { "@type": "Organization", name: "Illyrian Pixel" },
      publisher: { "@type": "Organization", name: "Illyrian Pixel" },
      datePublished: staticPost.date,
    };

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg pb-16 pt-20 text-text">
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <section className="section-wrap">
          <p className="eyebrow">{staticPost.category}</p>
          <h1 className="section-title mt-3 max-w-4xl">{staticPost.title}</h1>
          <p className="mt-3 text-xs tracking-[0.14em] text-white/45">{staticPost.date}</p>
          <div className="mt-10 max-w-3xl space-y-5">
            {staticPost.content.map((paragraph) => (
              <p key={paragraph} className="text-[1.02rem] leading-relaxed text-white/72 md:text-[1.12rem]">
                {paragraph}
              </p>
            ))}
          </div>
          <a href="/blog" className="luxury-link mt-10">
            Kthehu te blogu <span aria-hidden>→</span>
          </a>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const post = await getDbPostBySlug(params.slug);
  if (!post) notFound();

  const others = await getOtherPosts(params.slug);
  const otherStatic = blogPosts
    .filter((p) => p.slug !== params.slug)
    .map((p) => ({ slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, date: p.date }));
  const candidates = [...others, ...otherStatic];
  const sameCategory = candidates.filter((p) => p.category === post.category);
  const otherCategory = candidates.filter((p) => p.category !== post.category);
  const related = [...sameCategory, ...otherCategory].slice(0, 2).map((p) => ({
    href: `/blog/${p.slug}`,
    category: p.category,
    categoryColor: categoryColor(p.category),
    title: p.title,
  }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: "Illyrian Pixel" },
    publisher: { "@type": "Organization", name: "Illyrian Pixel" },
    datePublished: post.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogArticleLayout
        category={post.category}
        categoryColor={categoryColor(post.category)}
        title={post.title}
        breadcrumbLabel={post.title}
        path={`/blog/${post.slug}`}
        description={post.excerpt}
        date={post.date}
        readTime={estimateReadTime(post.content)}
        related={related}
      >
        {post.content.map((paragraph: string, i: number) => (
          <p key={i} className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/72 md:text-[1.12rem]">
            {paragraph}
          </p>
        ))}
      </BlogArticleLayout>
    </>
  );
}
