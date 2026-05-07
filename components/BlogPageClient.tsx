"use client";

import Link from "next/link";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyConsultCTA from "@/components/StickyConsultCTA";
import { blogPosts } from "@/lib/blogPosts";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function BlogPageClient() {
  const heroRef = useRef<HTMLElement>(null);

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

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg pb-4 pt-14 text-text md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171, 131, 57,0.09),transparent_30%)]" />

        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{"BLOG & INSIGHTS"}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2rem,4.5vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
                {"Ide, lajme "}
                <span className="text-accent">{"& udhëzime."}</span>
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {"Artikuj për UX, SEO dhe rritje të qëndrueshme për biznese serioze."}
            </p>
          </div>
        </section>

        <section className="relative z-[1]">
          <div className="section-wrap py-14 md:py-20">
            <div className="mt-2 space-y-5">
              {blogPosts.map((post) => (
                <article key={post.slug} className="group border-t border-white/10 pt-6">
                  <p className="text-[11px] tracking-[0.18em] text-accent/85">
                    {post.category} • {post.date}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(1.55rem,3vw,2.3rem)] leading-[1.02] text-white transition-transform duration-300 group-hover:-translate-y-[1px]">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-white/62">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="luxury-link mt-4">
                    Lexo më shumë <span aria-hidden>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <StickyConsultCTA />
      <Footer />
    </>
  );
}
