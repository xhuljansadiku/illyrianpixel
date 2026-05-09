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

const STRATEGJI_PILL =
  "inline-flex rounded-full border border-orange-100/55 bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(254,235,215,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-orange-950";

export default function BlogSeoClient() {
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
              <p className={STRATEGJI_PILL}>Strategji</p>
              <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                Pse SEO është <span className="text-accent">kritik</span> për biznese serioze{" "}
                <span className="inline text-[0.58em] font-medium leading-[1.05] tracking-[-0.02em] text-white/78 sm:text-[0.64em]">
                  (dhe jo një opsion)
                </span>
              </h1>
              <p
                ref={heroStatsRef}
                className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 md:text-[1.1rem]"
              >
                Të kesh një website të bukur që nuk shfaqet në Google është si të hapësh një dyqan luksoz në mes të
                shkretëtirës. Askush nuk e gjen, askush nuk blen.
              </p>
              <p className="mt-6 text-xs tracking-[0.14em] text-white/45">Prill 2026 · 7 min lexim</p>
            </div>
          </div>
        </section>

        <article className="section-wrap py-16 md:py-24">
          <div className="blog-growth-article mx-auto max-w-2xl space-y-16 md:space-y-24">
            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Google është &quot;Libri i Verdhë&quot; i kohës sonë
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Kur njerëzit kanë një problem, ata nuk shohin reklama në Instagram për të gjetur zgjidhjen; ata shkojnë
                në Google. Nëse biznesi juaj nuk shfaqet në faqen e parë për shërbimet që ofroni, ju thjesht nuk ekzistoni
                për 90% të tregut tuaj potencial.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Trafiku që nuk kushton për çdo klikim
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Reklamat (PPC) funksionojnë vetëm sa kohë ju paguani. Momentin që ndaloni buxhetin, ato zhduken. SEO është
                një investim në pronën tuaj dixhitale. Ai ndërton një fluks vizitorësh që vijnë në mënyrë organike,
                duke ulur koston e blerjes së klientit (CAC) në afatgjatë.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Autoriteti dhe Besimi (Trust)
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Njerëzit i besojnë algoritmit të Google. Renditja e lartë organike i thotë klientit në mënyrë
                subkoshente: &quot;Ky biznes është lider në industrinë e tij&quot;. Një faqe që renditet lart perceptohet
                automatikisht si më serioze dhe më profesionale se ajo që shfaqet vetëm përmes etiketës
                &quot;Sponsored&quot;.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                SEO është Luftë për Territor
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Hapësira në faqen e parë të Google është e kufizuar. Janë vetëm 10 vende organike. Nëse nuk jeni ju aty,
                është konkurrenca juaj. Çdo ditë që neglizhoni SEO-n, ju po i falni territor dhe klientë rivalëve tuaj më
                aktivë.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Eksperienca e përdoruesit (UX)
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Google nuk rendit lart vetëm fjalët kyçe; ai rendit eksperiencën. Një faqe e optimizuar për SEO është e
                shpejtë, funksionon perfekt në celular dhe ka informacion të qartë. SEO ju detyron ta bëni faqen tuaj më
                të mirë për njeriun, jo vetëm për makinerinë.
              </p>
            </section>

            <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Strategjia &amp; mbyllja</p>

              <section className="mt-6 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Pse shumica dështojnë me SEO?
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Sepse kërkojnë rezultate për 2 javë. SEO është një maratonë, jo një sprint. Por, ndryshe nga maratona,
                  këtu fituesi merr gjithë vëmendjen e tregut.
                </p>
              </section>

              <section className="mt-10 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Përmbledhje
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Bizneset serioze nuk luajnë bixhoz me fatin. Ata kontrollojnë se si dhe ku i gjejnë klientët. SEO është
                  themeli që siguron që website-i juaj të mos jetë thjesht një shpenzim, por pasuria juaj më e madhe
                  online.
                </p>
              </section>

              <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                A po e gjejnë klientët biznesin tuaj apo të konkurrencës?
              </p>
              <div className="mt-5">
                <Link
                  href="/contact"
                  data-magnetic="true"
                  className="interactive-button ip-cta-primary ip-cta-primary--lg group max-w-full gap-2 text-center !px-6 !py-3.5 !text-[12px] !leading-snug !tracking-[0.08em] sm:!px-8 sm:!text-sm sm:!tracking-[0.1em]"
                >
                  <span>Kontrollo SEO-n Falas</span>
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
              href="/blog/gabimet-kryesore-ne-website"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
            >
              <p className="inline-flex rounded-full border border-indigo-100/60 bg-[linear-gradient(180deg,rgba(244,242,255,0.98),rgba(231,226,255,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-indigo-800">
                UX
              </p>
              <p className="mt-4 font-display text-[1.35rem] leading-tight text-white">
                Gabimet që bëjnë bizneset në website (dhe si i rregullojmë)
              </p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
