"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceOverviewLuxCard from "@/components/ServiceOverviewLuxCard";
import { SHERBIMET_PAGE_CARDS } from "@/lib/serviceOverviewCards";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import StickyConsultCTA from "@/components/StickyConsultCTA";

export default function SherbimetPageClient() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const siPunojmeRef = useRef<HTMLElement | null>(null);

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
      .fromTo(".hero-line2",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" },
        "-=0.62"
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

  useIsomorphicLayoutEffect(() => {
    if (!siPunojmeRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: siPunojmeRef.current, start: "top 78%" }
      });
      tl.fromTo(".sp-eyebrow",
        { opacity: 0, y: 10, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
      )
      .fromTo(".sp-headline",
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" },
        "-=0.25"
      )
      .fromTo(".sp-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.45, ease: "power3.out", transformOrigin: "left" },
        "-=0.3"
      )
      .fromTo(".sp-subtext",
        { opacity: 0, y: 14, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(".sp-card",
        { opacity: 0, x: 30, filter: "blur(6px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        "-=0.7"
      );
    }, siPunojmeRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg text-text pt-14 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        {/* Hero */}
        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          {/* Noise grain */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          {/* Gold ambient glow */}
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          {/* Decorative vertical line */}
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{"SHËRBIMET"}</p>

            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
                {"Sisteme digjitale"}
              </h1>
            </div>
            <div className="hero-line2 overflow-hidden">
              <h1 className="cursor-default font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.04] tracking-[-0.03em] text-accent transition-all duration-500 hover:[text-shadow:0_0_48px_rgba(171,131,57,0.55)]">
                {"që sjellin klientë."}
              </h1>
            </div>

            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />

            <p className="hero-subtext mt-6 whitespace-nowrap font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {"Nga website dhe SEO, te reklamat dhe branding, ndërtojmë zgjidhje të plota për bizneset shqiptare."}
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="relative z-[1] border-b border-white/10">
          <div className="section-wrap py-14 md:py-20">
            <div className="mt-2 grid auto-rows-[1fr] gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:gap-8">
              {SHERBIMET_PAGE_CARDS.map((service, idx) => (
                <ServiceOverviewLuxCard
                  key={service.href}
                  service={service}
                  idx={idx}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  headingAs="h2"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Si punojmë — minimal */}
        <section ref={siPunojmeRef} className="relative z-[1] border-b border-white/[0.06] bg-[#0a0a0a]">
          <div className="section-wrap py-20 md:py-28">
            <p className="sp-eyebrow font-mono text-[10px] uppercase tracking-[0.28em] text-accent/50">{"Si punojmë"}</p>
            <h2 className="sp-headline mt-5 font-display text-[clamp(1.8rem,3.8vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em] text-white">
              {"Një shërbim ose sistem i plotë."}
              <br />
              <span className="text-accent">{"Zgjidhni ju."}</span>
            </h2>
            <p className="sp-subtext mt-6 max-w-[50ch] font-body text-[0.95rem] font-light leading-[1.7] text-white/45">
              {"Kur website, SEO dhe marketing punojnë bashkë, rezultatet shumëfishohen."}
            </p>
          </div>
        </section>

        {/* CTA — premium */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(171,131,57,0.13),transparent_70%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          <div className="section-wrap relative py-28 md:py-36 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/55">{"Hapi tjetër"}</p>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white">
              {"Gati të rritni biznesin?"}
            </h2>
            <p className="mt-5 font-body text-[0.95rem] font-light leading-relaxed text-white/48">
              {"Rezervo një konsultë falas dhe marrim një plan konkret brenda 24 orëve, pa detyrim."}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg">
                {"Fillo Bisedën"}
              </Link>
              <Link href="/contact" className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.06em] text-white/50 transition-colors duration-300 hover:text-white">
                {"Kontakto Tani"}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-[0.14em] text-white/22">
              {"Pa detyrim · Përgjigje brenda 24 orëve"}
            </p>
          </div>
        </section>

        {/* SEO line */}
        <div className="border-t border-white/[0.04]">
          <div className="section-wrap py-4">
            <p className="text-center font-body text-[11px] font-light leading-relaxed tracking-[0.04em] text-white/18">
              {"Agjensi digjitale për biznese Shqiptare Website, E-Commerce, SEO, Google Ads, Branding dhe Social Media Marketing për tregun vendor dhe diasporën."}
            </p>
          </div>
        </div>
      </main>
      <StickyConsultCTA />
      <Footer />
    </>
  );
}
