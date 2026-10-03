"use client";

import { useRef } from "react";
import Link from "next/link";
import type { ServiceItem } from "@/lib/siteContent";
import GlobalCTA from "@/components/GlobalCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function ServiceDetailPage({ service }: { service: ServiceItem }) {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubRef = useRef<HTMLParagraphElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const { gsap, ScrollTrigger } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(
        heroTitleRef.current,
        { scale: 1 },
        {
          scale: 0.78,
          transformOrigin: "left top",
          ease: "none",
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            pin: true,
            pinSpacing: true
          }
        }
      );

      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative overflow-hidden bg-bg text-text pt-14 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_10%_14%,rgba(171, 131, 57,0.1),transparent_35%),radial-gradient(circle_at_88%_82%,rgba(171, 131, 57,0.07),transparent_42%)]" />

        {/* Hero */}
        <section ref={heroSectionRef} className="relative z-[1] border-b border-white/10">
          <div className="section-wrap py-20 md:py-28">
            <div className="mb-5 h-px w-[180px] bg-gradient-to-r from-accent/80 to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">
              SHËRBIMI • {service.title.toUpperCase()}
            </p>
            <h1
              ref={heroTitleRef}
              className="mt-4 max-w-4xl bg-[url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1800&q=80')] bg-[length:170%] bg-[position:22%_48%] bg-clip-text font-display text-[clamp(2.2rem,6vw,4.8rem)] leading-[0.93] text-transparent [will-change:transform]"
            >
              {service.heroTitle}
            </h1>
            <p ref={heroSubRef} className="mt-6 max-w-[58ch] text-base leading-relaxed text-white/65">
              {service.short}
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="border-t border-white/10">
          <div className="section-wrap py-16 md:py-24">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">PAKETAT TONA</p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[0.95]">
              Zgjidhni paketën e duhur.
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm text-white/55">
              Nuk jeni të sigurt cila? Na kontaktoni, ju ndihmojmë të zgjidhni pa presion.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {service.packages.map((pkg, i) => (
                <article
                  key={pkg.name}
                  className={`relative flex flex-col rounded-[1.1rem] border p-6 ${
                    i === 1
                      ? "border-accent/45 bg-accent/[0.05]"
                      : "border-white/10 bg-[#151515]"
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute right-4 top-4 rounded-full bg-accent/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-accent">
                      Më popullorja
                    </span>
                  )}

                  <p className="text-[10px] uppercase tracking-[0.22em] text-accent/80">{pkg.name}</p>
                  <p className="mt-1.5 font-display text-[2rem] leading-none">{pkg.price}</p>
                  <p className="mt-3 text-sm text-white/50">{pkg.for}</p>

                  <ul className="mt-6 grow space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full bg-accent/75" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={
                      i === 1
                        ? "interactive-button ip-cta-primary mt-8 block text-center !text-xs !tracking-[0.12em]"
                        : "luxury-link mt-8 block text-center"
                    }
                  >
                    Fillo sot <span aria-hidden>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/10">
          <div className="section-wrap py-16 md:py-20">
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.95]">
              Pyetje të shpeshta
            </h2>
            <div className="mt-8 space-y-3">
              {service.faq.map((item) => (
                <article
                  key={item.q}
                  className="rounded-[0.9rem] border border-white/10 bg-[#151515] p-5"
                >
                  <h3 className="text-sm text-white/85">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{item.a}</p>
                </article>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/sherbimet" className="luxury-link">
                ← Kthehu te shërbimet
              </Link>
            </div>
          </div>
        </section>

        <GlobalCTA
          label="HAPI TJETËR"
          title="Gati të fillojmë?"
          body="Rezervoni një bisedë falas, ju tregojmë saktësisht çfarë duhet dhe si do duket rezultati."
          primaryActionText="Rezervo një call →"
          primaryActionHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
