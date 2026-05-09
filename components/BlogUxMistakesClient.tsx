"use client";

import Link from "next/link";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { useReducedMotion } from "@/lib/gsap";
import { usePinnedHeroScroll } from "@/lib/usePinnedHeroScroll";

const HERO_TEXTURE =
  "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1800&q=80";

export default function BlogUxMistakesClient() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroStatsRef = useRef<HTMLParagraphElement>(null);
  const heroTextureRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  usePinnedHeroScroll({
    enabled: !reduced,
    heroSectionRef,
    heroTitleRef,
    heroStatsRef,
    heroTextureRef
  });

  return (
    <>
      <Navbar />
      <ScrollProgress />
      <main className="min-h-screen bg-bg pb-16 pt-20 text-text [scroll-behavior:smooth]">
        <section ref={heroSectionRef} className="relative border-b border-white/10">
          <div
            ref={heroTextureRef}
            className="pointer-events-none absolute inset-0 z-0 bg-[length:180%] bg-[position:20%_50%] opacity-0"
            style={{ backgroundImage: `url(${HERO_TEXTURE})` }}
          />
          <div className="section-wrap relative z-[1] pb-12 pt-6 md:pb-14">
            <Link href="/blog" className="luxury-link">
              <span aria-hidden>←</span> Kthehu te blogu
            </Link>

            <div className="mt-8">
              <p className="inline-flex rounded-full border border-indigo-100/60 bg-[linear-gradient(180deg,rgba(244,242,255,0.98),rgba(231,226,255,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-indigo-800">
                UX
              </p>
              <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                Gabimet që bëjnë bizneset{" "}
                <span className="whitespace-nowrap">
                  në website{" "}
                  <span className="inline-block align-baseline text-[0.7em] sm:text-[0.78em] md:text-[0.82em]">
                    (dhe si i <span className="text-accent">rregullojmë</span>)
                  </span>
                </span>
              </h1>
              <p ref={heroStatsRef} className="mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed text-white/68 md:text-[1.1rem]">
                Një website i paqartë nuk humbet thjesht vizitorë; humbet klientë.
                {"\n"}
                Vizitori hyn, nuk kupton çfarë të bëjë dhe largohet.
                {"\n"}
                Pa u ankuar, pa lënë email, pa u kthyer më.
              </p>
              <p className="mt-6 text-xs tracking-[0.14em] text-white/45">Prill 2026 · 4 min lexim</p>
            </div>
          </div>
        </section>

        <article className="section-wrap py-16 md:py-24">
          <div className="blog-growth-article mx-auto max-w-2xl space-y-16 md:space-y-24">
            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Pesë sekonda për të bindur ose për të humbur.
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Vizitori merr vendimin pa e kuptuar vetë brenda 5 sekondave të para.
                <br />
                Nëse titulli kryesor është i paqartë ose shumë i përgjithshëm, ai largohet.
                <br />
                &quot;Agjenci dixhitale inovative me zgjidhje të personalizuara&quot; nuk i thotë asgjë askujt.
                <br />
                Thuaj saktësisht çfarë bën dhe për kë.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Shumë opsione, zero vendime</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Shumë butona, shumë menu dhe shumë popup-e e hutojnë klientin.
                <br />
                Kur gjithçka kërkon vëmendje, asgjë nuk e merr atë.
                <br />
                Çdo faqe duhet të ketë një qëllim të vetëm dhe ta udhëheqë vizitorin drejt një hapi të qartë.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Mungon dëshmia</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Njerëzit nuk besojnë atë që thua ti për veten, besojnë atë që thonë të tjerët për ty.
                <br />
                Pa komente reale, pa numra dhe pa rezultate konkrete, besimi nuk ndërtohet.
                <br />
                Dhe pa besim, nuk ka kontakt.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Kontakti është i fshehur</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Nëse klientit i duhet të kërkojë numrin e telefonit ose formularin, ju e keni humbur atë.
                <br />
                Kontakti duhet të jetë gjithmonë i dukshëm: në krye, në fund dhe kudo ku vizitori është gati të marrë një
                vendim.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Barriera e celularit</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Mbi 60% e vizitorëve vijnë nga telefoni.
                <br />
                Nëse butonat janë të vegjël, teksti del jashtë ekranit ose formulari është i vështirë për t&apos;u
                plotësuar, ju po humbisni shumicën e audiencës pa e ditur.
              </p>
            </section>

            <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Strategjia &amp; mbyllja</p>

              <section className="mt-6 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Si i rregullojmë?
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Nuk ka nevojë të ndërtosh gjithçka nga e para.
                  <br />
                  Shpesh mjaftojnë ndryshime kirurgjikale: një titull më i qartë, një hierarki vizuale më e pastër dhe një
                  thirrje për veprim në vendin e duhur.
                  <br />
                  Ne rishikojmë rrugëtimin e klientit tuaj dhe e thjeshtojmë atë deri në konversion.
                </p>
              </section>

              <section className="mt-10 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Përmbledhje
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Website-i që shet është i thjeshtë për vizitorin: e kupton menjëherë ofertën, beson dëshminë dhe di
                  ku të klikojë. Kur këto mungojnë, klienti nuk ankohet, largohet.
                </p>
              </section>

              <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                Gati për ta kthyer website-in tuaj në një makineri shitjesh?
              </p>
              <div className="mt-5">
                <Link
                  href="/contact"
                  data-magnetic="true"
                  className="interactive-button ip-cta-primary ip-cta-primary--lg group gap-2 !px-8 !py-3.5 !text-sm !tracking-[0.12em]"
                >
                  <span>Fillo sot</span>
                  <span aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </article>

        <section className="section-wrap border-t border-white/10 py-12 md:py-16">
          <h3 className="font-display text-[clamp(1.35rem,2.8vw,1.9rem)] text-white">Artikuj të ngjashëm</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link
              href="/blog/si-te-rrisesh-klientet-online"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
            >
              <p className="inline-flex rounded-full border border-emerald-100/60 bg-[linear-gradient(180deg,rgba(227,255,246,0.98),rgba(210,247,236,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-emerald-800">
                Rritje
              </p>
              <p className="mt-4 font-display text-[1.35rem] leading-tight text-white">
                Ke trafikun. Por ku janë klientët?
              </p>
            </Link>

            <Link
              href="/blog/pse-seo-eshte-kritik"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
            >
              <p className="inline-flex rounded-full border border-orange-100/55 bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(254,235,215,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-orange-950">
                Strategji
              </p>
              <p className="mt-4 font-display text-[1.35rem] leading-tight text-white">
                Pse SEO është kritik për biznese serioze (dhe jo një opsion)
              </p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
