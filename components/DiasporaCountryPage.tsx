"use client";

import Image from "next/image";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionMark from "@/components/SectionMark";
import ConversionLandingSections from "@/components/ConversionLandingSections";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import type { DiasporaCountryContent } from "@/lib/diasporaShared";

const BLOG_TITLES: Record<string, string> = {
  "menaxho-biznesin-nga-diaspora": "Kam biznes në Shqipëri ose Kosovë, jetoj jashtë: si e menaxhoj online pa qenë atje",
  "website-dygjuhesh-biznes-diaspore": "Website dygjuhësh (shqip + gjuha e vendit): pse i duhet çdo biznesi shqiptar në diasporë",
  "si-te-gjejne-klientet-shqiptare-biznesin-tend": "Si e gjejnë klientët shqiptarë biznesin tënd online, kudo që të jenë",
};

export default function DiasporaCountryPage({ content }: { content: DiasporaCountryContent }) {
  const mainRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !mainRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(mainRef.current!.querySelectorAll(".svc-reveal-heading")).forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 26, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
      const closing = mainRef.current!.querySelector<HTMLElement>(".svc-closing-panel");
      if (closing) {
        gsap.fromTo(closing,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.95, ease: "power3.out",
            scrollTrigger: { trigger: closing, start: "top 86%", once: true } }
        );
      }
    }, mainRef);
    return () => ctx.revert();
  }, [reduced, content.countryLabel]);

  return (
    <>
      <Navbar />
      <main ref={mainRef} className="relative overflow-hidden bg-bg pb-24 pt-14 text-text md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_92%_72%,rgba(171,131,57,0.06),transparent_38%)]" />

        {/* ── HERO ── */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative z-[2] py-28 md:py-36">
            <div className="flex items-center gap-3">
              <Image
                src={`https://flagcdn.com/w80/${content.flagCode}.png`}
                alt=""
                width={32}
                height={24}
                className="h-4 w-auto rounded-[2px] object-cover"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{content.heroEyebrow}</p>
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.625rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white md:whitespace-pre-line">
              {content.heroHeadline} <span className="text-accent">{content.heroHeadlineAccent}</span>
            </h1>

            <p className="mt-5 max-w-[52ch] text-[1.1rem] leading-[1.5] text-white/70">
              {content.heroIntro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="interactive-button ip-cta-primary inline-flex h-11 items-center gap-2 !px-7 !text-[15px] !font-medium !tracking-[0.02em] !text-[#0e0d0c]"
              >
                Fillo bisedën
              </Link>
              <Link href="/cmimet#kalkulatori" className="luxury-link !text-[15px]">
                Llogarit çmimin <span aria-hidden>→</span>
              </Link>
              <a
                href={content.ctaWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-[14px] font-light tracking-[0.02em] text-white/70 transition-colors duration-300 hover:border-accent/35 hover:text-white"
              >
                WhatsApp <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            {content.heroTrustLine && (
              <p className="mt-4 text-[14px] tracking-[0.04em] text-white/60">{content.heroTrustLine}</p>
            )}
          </div>
        </section>

        <ConversionLandingSections {...content} />

        {/* ── CTA MBYLLËSE ── */}
        <section className="relative z-[1]">
          <div className="section-wrap py-20 md:py-28">
            <div className="svc-closing-panel relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[linear-gradient(155deg,rgba(24,23,22,0.96),rgba(14,13,12,0.99))] px-6 py-14 text-center shadow-[0_28px_80px_rgba(0,0,0,0.45)] md:px-14 md:py-16">
              <div className="pointer-events-none absolute inset-0 opacity-[0.11]">
                <div className="noir-grid h-full w-full" />
              </div>
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent md:inset-x-16" />
              <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl" />
              <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-accent/[0.05] blur-3xl" />

              <div className="relative z-[1]">
                <SectionMark label="Hapi tjetër" eyebrowClassName="tracking-[0.22em] !text-accent/80" />
                <h2 className="mx-auto mt-3 max-w-[18ch] font-display text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.96] tracking-[-0.02em] text-white md:max-w-none">
                  Gati për një website<br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-accent via-[#eace71] to-accent bg-clip-text text-transparent">që punon edhe kur ju s&apos;jeni atje?</span>
                </h2>
                <p className="mx-auto mt-6 max-w-[44ch] text-[14px] leading-relaxed text-white/50">
                  Konsultim falas, pa detyrime. Ju dërgojmë plan konkret brenda 24 orëve.
                </p>

                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg inline-flex h-12 items-center gap-2 !px-8 !text-[12px] !tracking-[0.04em] !text-[#0e0d0c]">
                    Nis projektin
                  </Link>
                  <a
                    href={content.ctaWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-7 text-[12px] font-light tracking-[0.06em] text-white/60 transition-colors duration-300 hover:border-accent/35 hover:text-white"
                  >
                    Shkruaj në WhatsApp <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>

                {content.relatedBlogSlugs.length > 0 && (
                  <div className="mx-auto mt-12 flex max-w-[52ch] flex-col items-center gap-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Lexo më shumë</p>
                    {content.relatedBlogSlugs.map((slug) => (
                      <Link
                        key={slug}
                        href={`/blog/${slug}`}
                        className="luxury-link text-[13px] leading-snug"
                      >
                        {BLOG_TITLES[slug] ?? slug}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <Link href="/diaspora" className="text-[11px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 hover:text-white/60">
                    ← Kthehu te Diaspora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
