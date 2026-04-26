import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata("Blog", "Artikuj për UX, SEO dhe rritje të qëndrueshme për biznese serioze.");

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pb-12 pt-20 text-text">
        <section className="section-wrap">
        <p className="eyebrow">BLOG</p>
        <h1 className="section-title mt-3 max-w-4xl">Insights për rritje reale online.</h1>
        <div className="mt-10 space-y-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border-t border-white/10 pt-6">
              <p className="text-[11px] tracking-[0.18em] text-accent/85">
                {post.category} • {post.date}
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.02] text-white">{post.title}</h2>
              <p className="mt-2 max-w-3xl text-sm text-white/62">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex text-xs tracking-[0.16em] text-white/75 underline decoration-transparent underline-offset-4 transition hover:text-accent hover:decoration-accent/80">
                Lexo artikullin
              </Link>
            </article>
          ))}
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
