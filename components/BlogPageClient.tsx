"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogPostsForLocale } from "@/lib/blogPosts";
import type { Locale } from "@/i18n/routing";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

// Signature mood color per row — keeps the index feeling editorial
// without relying on cover images, which blog posts don't have.
// 2026-11-05: përdorej nga lista e vjetër (tani e komentuar)
// const MOOD_COLORS = ["#ab8339", "#c2703d", "#3f8f86", "#4f6f93", "#9c4d4d", "#7a8450"];

type DbPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
};

type ListedPost = DbPost & { content?: string[] };

function PostMeta({ post }: { post: ListedPost }) {
  const min = post.content ? Math.max(2, Math.round(post.content.join(" ").split(/\s+/).length / 200)) : null;
  return (
    <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
      <span className="text-accent">{post.category}</span> · {post.date}
      {min && <> · {min} min</>}
    </p>
  );
}

export default function BlogPageClient({ dbPosts = [] }: { dbPosts?: DbPost[] }) {
  const t = useTranslations("blog.index");
  const locale = useLocale() as Locale;
  const allLabel = t("allLabel");
  const heroRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const allPosts: ListedPost[] = [...dbPosts, ...getBlogPostsForLocale(locale)];
  const [active, setActive] = useState(allLabel);
  // 2026-11-05: const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Text audit 2 (2026-11-02): në karta vetëm fjalia e parë; teksti i plotë mbetet meta description.
  const firstSentence = (s: string) => s.split("\n")[0].split(/(?<=[.!?])\s/)[0];
  const categories = [allLabel, ...Array.from(new Set(allPosts.map((p) => p.category)))];

  const filtered =
    active === allLabel
      ? allPosts
      : allPosts.filter((p) => p.category === active);

  const [featuredPost, ...restPosts] = filtered;

  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".hero-eyebrow",
        { opacity: 0, y: 10, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
      )
      .fromTo(".hero-line1",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" }, "-=0.25"
      )
      .fromTo(".hero-line2",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" }, "-=0.62"
      )
      .fromTo(".hero-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.out", transformOrigin: "left" }, "-=0.3"
      )
      .fromTo(".hero-subtext",
        { opacity: 0, y: 14, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, "-=0.25"
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!listRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(".featured-post",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: listRef.current, start: "top 85%" } }
      );
      gsap.fromTo(".blog-row",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: listRef.current, start: "top 80%" } }
      );
    }, listRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative overflow-hidden bg-bg pb-4 pt-14 text-text md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-bgDeep">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="ip-eyebrow hero-eyebrow">{t("eyebrow")}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2rem,4.5vw,4.2rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
                {t("titleLine1")}
                <span className="text-accent">{t("titleAccent")}</span>
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            {/* Text audit 2 (2026-11-02): nëntitulli hequr, H1 e thotë vetë
            <p className="hero-subtext mt-6 font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {t("subtitle")}
            </p>
            */}
          </div>
        </section>

        <section className="relative z-[1]">
          <div className="section-wrap py-14 md:py-20">

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`rounded-full px-4 py-[7px] text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                    active === cat
                      ? "bg-accent text-bg"
                      : "border border-white/15 text-white/50 hover:border-white/35 hover:text-white/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles */}
            <div ref={listRef}>
              {filtered.length === 0 ? (
                <p className="text-white/40 text-sm">{t("empty")}</p>
              ) : (
                <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="featured-post group relative block overflow-hidden rounded-[1.75rem] border border-accent/25 bg-[linear-gradient(135deg,rgba(171,131,57,0.12),rgba(171,131,57,0.02)_60%)] p-8 md:p-12"
                  >
                    <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
                    <span className="relative z-[1] inline-flex items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-bg">
                      {t("latest")}
                    </span>
                    <p className="relative z-[1] mt-5 text-[11px] tracking-[0.2em] text-accent/85">
                      {featuredPost.category} • {featuredPost.date}
                    </p>
                    <h2 className="relative z-[1] mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.04] text-white transition-colors duration-300 group-hover:text-accent">
                      {featuredPost.title}
                    </h2>
                    <p className="relative z-[1] mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-white/60">
                      {firstSentence(featuredPost.excerpt)}
                    </p>
                    <span className="luxury-link relative z-[1] mt-6 inline-flex">
                      {t("readArticle")} <span aria-hidden>→</span>
                    </span>
                  </Link>

                  {/* 2026-11-05 (demo A): djathtas 6 artikujt e radhës */}
                  {restPosts.length > 0 && (
                    <ul className="divide-y divide-white/[0.07]">
                      {restPosts.slice(0, 6).map((post) => (
                        <li key={post.slug}>
                          <Link href={`/blog/${post.slug}`} className="blog-row group block py-5 first:pt-0">
                            <PostMeta post={post} />
                            <h3 className="mt-2 font-display text-xl leading-snug text-white transition-colors duration-300 group-hover:text-accent">{post.title}</h3>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* poshtë: pjesa tjetër në 3 kolona */}
                  {restPosts.length > 6 && (
                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-3 lg:col-span-2">
                      {restPosts.slice(6).map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-row group block border-t border-white/[0.07] pt-5">
                          <PostMeta post={post} />
                          <h3 className="mt-2 font-display text-lg leading-snug text-white transition-colors duration-300 group-hover:text-accent">{post.title}</h3>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* 2026-11-05: lista e vjetër me rreshta zëvendësuar me revistën (demo A)
                  {restPosts.length > 0 && (
                    <div className="mt-12 border-t border-white/10">
                      {restPosts.map((post, idx) => {
                        const mood = MOOD_COLORS[idx % MOOD_COLORS.length];
                        const isHovered = hoveredIdx === idx;
                        return (
                          <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="blog-row group relative flex items-start gap-5 border-b border-white/10 py-7 md:gap-6 md:py-8"
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx((cur) => (cur === idx ? null : cur))}
                          >
                            <span
                              className="shrink-0 pt-2 font-mono text-[12px] tracking-[0.2em] transition-colors duration-300"
                              style={{ color: isHovered ? mood : "rgba(255,255,255,0.3)" }}
                            >
                              {String(idx + 2).padStart(2, "0")}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                                {post.category} • {post.date}
                              </p>
                              <h3
                                className="mt-2 font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.05] transition-colors duration-300"
                                style={{ color: isHovered ? mood : "#ffffff" }}
                              >
                                {post.title}
                              </h3>
                              <p className="mt-2 max-w-2xl line-clamp-2 whitespace-pre-line text-sm text-white/55">
                                {firstSentence(post.excerpt)}
                              </p>
                            </div>

                            <span className="ml-2 shrink-0 pt-2 font-body text-[11px] uppercase tracking-[0.15em] text-white/35 transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>

                            <span
                              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500"
                              style={{ backgroundColor: mood, transform: isHovered ? "scaleX(1)" : "scaleX(0)" }}
                              aria-hidden
                            />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  */}
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
