import Link from "next/link";
import SectionMark from "@/components/SectionMark";
import { blogPosts } from "@/lib/blogPosts";

export default function BlogPreview() {
  return (
    <section id="blog-preview" className="cinematic-section section-tone-about border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-24 md:py-30">
        <SectionMark label="BLOG & INSIGHTS" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title mt-3 max-w-4xl">Ide, lajme & udhëzime.</h2>
          <Link href="/blog" className="luxury-link">
            Shiko të gjitha <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-10 space-y-5">
          {blogPosts.slice(0, 3).map((post) => (
            <article key={post.slug} className="group border-t border-white/10 pt-6">
              <p className="text-[11px] tracking-[0.18em] text-accent/85">{post.category}</p>
              <h3 className="mt-2 font-display text-[clamp(1.55rem,3vw,2.3rem)] leading-[1.02] text-white transition-transform duration-300 group-hover:-translate-y-[1px]">
                {post.title}
              </h3>
              <p className="mt-2 max-w-3xl text-sm text-white/62">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-xs tracking-[0.16em] text-white/75 underline decoration-transparent underline-offset-4 transition hover:text-accent hover:decoration-accent/80">
                Lexo më shumë
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
