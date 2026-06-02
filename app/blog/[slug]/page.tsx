import { notFound } from "next/navigation";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";
import { blogPosts, getBlogPostBySlug } from "@/lib/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export async function generateStaticParams() {
  return blogPosts.filter((post) => !DEDICATED_BLOG_SLUGS.has(post.slug)).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return buildMetadata("Blog", undefined, "/blog");
  return buildMetadata(post.title, post.excerpt, `/blog/${params.slug}`);
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();
  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: post.title, url: `${seo.siteUrl}/blog/${params.slug}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      name: "Illyrian Pixel"
    },
    publisher: {
      "@type": "Organization",
      name: "Illyrian Pixel"
    },
    datePublished: post.date
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
        <p className="eyebrow">{post.category}</p>
        <h1 className="section-title mt-3 max-w-4xl">{post.title}</h1>
        <p className="mt-3 text-xs tracking-[0.14em] text-white/45">{post.date}</p>
        <div className="mt-10 max-w-3xl space-y-5">
          {post.content.map((paragraph) => (
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
