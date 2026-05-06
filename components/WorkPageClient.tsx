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
  const reduced = useReducedMotion();

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

        <section className="relative z-[1] border-b border-white/10">
          <div className="section-wrap relative z-[1] py-20 md:py-28">
            <div className="sv-label mb-5 h-px w-[180px] bg-gradient-to-r from-accent/80 to-transparent" />
            <p className="sv-label text-[10px] uppercase tracking-[0.3em] text-accent/80">PROJEKTET TONA</p>
            <h1
              data-cursor="headline"
              className="hero-headline-trigger cadence-title mt-4 max-w-4xl bg-[url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1800&q=80')] bg-[length:170%] bg-[position:22%_48%] bg-clip-text font-display text-[clamp(2.55rem,7.8vw,6.9rem)] leading-[0.95] tracking-[0.01em] pb-[0.12em] text-transparent"
            >
              {"\u00c7far\u00eb kemi"}
              <br />
              <span className="text-white/35">{"nd\u00ebrtuar."}</span>
            </h1>
            <div className="wk-stats mt-8 max-w-[56ch] space-y-1 text-base leading-relaxed text-white/62">
              <p>{"Klient\u00eb nga Italia, Gjermania, Kosova, Anglia dhe Shqip\u00ebria."}</p>
              <p>
                {"Pun\u00eb nd\u00ebrkomb\u00ebtare me "}
                <span className="text-white/90">{"cil\u00ebsi Gjermane"}</span>.
              </p>
            </div>
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
