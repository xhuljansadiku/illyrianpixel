"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/caseStudies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalCTA from "@/components/GlobalCTA";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function WorkPageClient({ projects }: { projects: CaseStudy[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

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
    if (reduced) return;
    const { gsap, ScrollTrigger } = ensureGSAP();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".wk-project").forEach((project) => {
        const meta = project.querySelector(".wk-project-meta");
        const title = project.querySelector(".wk-project-title");
        const imgWrapper = project.querySelector(".wk-img-wrapper");
        const imgInner = project.querySelector(".wk-img-inner");
        const footer = project.querySelector(".wk-project-footer");

        gsap.fromTo(
          meta,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: project, start: "top 88%", once: true }
          }
        );

        gsap.fromTo(
          title,
          { opacity: 0, y: 36, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: project, start: "top 84%", once: true }
          }
        );

        gsap.fromTo(
          imgWrapper,
          { clipPath: "inset(100% 0 0 0 round 1.1rem)" },
          {
            clipPath: "inset(0% 0 0 0 round 1.1rem)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: project, start: "top 78%", once: true }
          }
        );

        gsap.fromTo(
          imgInner,
          { y: 0 },
          {
            y: -52,
            ease: "none",
            scrollTrigger: { trigger: imgWrapper, start: "top bottom", end: "bottom top", scrub: 1.4 }
          }
        );

        gsap.fromTo(
          footer,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: { trigger: project, start: "top 72%", once: true }
          }
        );
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [reduced, projects.length]);

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative overflow-hidden bg-bg pt-14 text-text md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{"PROJEKTET TONA"}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="font-display text-[clamp(2rem,4.5vw,4.2rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
                {"\u00c7far\u00eb kemi "}
                <span className="text-accent">{"nd\u00ebrtuar."}</span>
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {"Klient\u00eb nga Italia, Gjermania, Kosova, Anglia dhe Shqip\u00ebria."}
            </p>
          </div>
        </section>

        <section className="relative z-[1]">
          <div className="section-wrap py-14 md:py-20">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((cs) => (
                <article
                  key={cs.slug}
                  className="wk-project group flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#111111]/80 px-5 pb-5 pt-8 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-accent/35"
                >
                  <h2 className="wk-project-title min-h-[2.3em] line-clamp-2 text-center font-display text-[clamp(1.55rem,3.45vw,2.55rem)] font-medium tracking-[0.012em] leading-[0.95]">
                    {cs.title === "ESM Group" ? (
                      <>
                        ESM
                        <br />
                        Group
                      </>
                    ) : cs.title === "Bardhi Wellness" ? (
                      <>
                        Bardhi
                        <br />
                        Wellness
                      </>
                    ) : (
                      cs.title
                    )}
                  </h2>

                  <div className="wk-img-wrapper relative mt-5 h-[240px] overflow-hidden rounded-[0.95rem] md:h-[280px]">
                    <div className="wk-img-inner absolute -bottom-10 -top-10 left-0 right-0">
                      <Image
                        src={cs.heroImage}
                        alt={cs.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 48vw, 32vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/55 to-transparent" />
                    </div>
                  </div>

                  <div className="wk-project-footer mt-auto flex items-center justify-end gap-4 pt-5">
                    <Link href={`/projektet/${cs.slug}`} className="luxury-link">
                      {"Shiko projektin "}
                      <span aria-hidden>{"\u2192"}</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <GlobalCTA
          title={"Gati p\u00ebr t\u00eb nd\u00ebrtuar di\u00e7ka t\u00eb jasht\u00ebzakonshme?"}
          body={
            "Rezervo nj\u00eb thirrje hyr\u00ebse p\u00ebr t\u00eb transformuar vizionin t\u00ebnd n\u00eb nj\u00eb ekzekutim strategjik."
          }
        />
        <Footer />
      </main>
    </>
  );
}
