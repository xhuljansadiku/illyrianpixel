"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConversionTrustBar from "@/components/ConversionTrustBar";
import DiasporaCountryCard from "@/components/DiasporaCountryCard";
import { getConversionTrustStatsDefault } from "@/lib/conversionLandingShared";
import { DIASPORA_COUNTRY_SLUGS } from "@/lib/diasporaShared";
import { diasporaContent } from "@/lib/diasporaContent.sq";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

const RELATED_POSTS = [
  { slug: "menaxho-biznesin-nga-diaspora", title: "Kam biznes në Shqipëri ose Kosovë, jetoj jashtë: si e menaxhoj online pa qenë atje" },
  { slug: "website-dygjuhesh-biznes-diaspore", title: "Website dygjuhësh (shqip + gjuha e vendit): pse i duhet çdo biznesi shqiptar në diasporë" },
  { slug: "si-te-gjejne-klientet-shqiptare-biznesin-tend", title: "Si e gjejnë klientët shqiptarë biznesin tënd online, kudo që të jenë" },
];

export default function DiasporaHubPage() {
  const heroRef = useRef<HTMLElement | null>(null);

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
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" },
        "-=0.25"
      )
      .fromTo(".hero-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.out", transformOrigin: "left" },
        "-=0.3"
      )
      .fromTo(".hero-subtext",
        { opacity: 0, y: 14, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" },
        "-=0.25"
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg text-text pt-14 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        {/* Hero */}
        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-36">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">
              PËR SHQIPTARËT JASHTË VENDIT
            </p>

            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2.6rem,6.5vw,5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                Website për biznese shqiptare <span className="text-accent">në diasporë.</span>
              </h1>
            </div>

            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />

            <p className="hero-subtext mt-6 max-w-[56ch] font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/55">
              Punojmë online, çdo ditë, me biznese shqiptare të hapura jashtë vendit. Zgjidhni shtetin tuaj për shembuj, dëshmi reale dhe një qasje të përshtatur për situatën tuaj specifike.
            </p>
          </div>
        </section>

        {/* Kartat e shteteve */}
        <section className="relative z-[1] border-b border-white/10">
          <div className="section-wrap py-14 md:py-20">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {DIASPORA_COUNTRY_SLUGS.map((slug) => {
                const c = diasporaContent[slug];
                return (
                  <DiasporaCountryCard
                    key={slug}
                    slug={slug}
                    countryLabel={c.countryLabel}
                    flagCode={c.flagCode}
                    hookLine={c.hookLine}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section
          aria-label="Besim dhe përvojë"
          className="relative z-[1] border-b border-[#D4AF37]/15 bg-[linear-gradient(180deg,rgba(212,175,55,0.04)_0%,rgba(255,255,255,0.02)_42%,rgba(255,255,255,0.015)_100%)] shadow-[inset_0_1px_0_rgba(212,175,55,0.07)]"
        >
          <div className="section-wrap py-10 md:py-12">
            <ConversionTrustBar stats={getConversionTrustStatsDefault("sq")} />
          </div>
        </section>

        {/* Lexo më shumë */}
        <section className="relative z-[1] border-b border-white/[0.06] bg-[#0a0a0a]">
          <div className="section-wrap py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/50">Lexo më shumë</p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.8vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em] text-white">
              Artikuj për biznesin <span className="text-accent">nga diaspora.</span>
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {RELATED_POSTS.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="luxury-link max-w-[64ch] text-[14px] leading-snug">
                  {post.title} <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(171,131,57,0.13),transparent_70%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          <div className="section-wrap relative py-28 md:py-36 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/55">HAPI TJETËR</p>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white">
              S&apos;e gjeni shtetin tuaj në listë?
            </h2>
            <p className="mt-5 font-body text-[0.95rem] font-light leading-relaxed text-white/48">
              Punojmë me biznese shqiptare kudo në botë. Na shkruani dhe flasim për situatën tuaj specifike.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg">
                Fillo bisedën
              </Link>
              <Link href="/cmimet#kalkulatori" className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.06em] text-white/50 transition-colors duration-300 hover:text-white">
                Llogarit çmimin
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
