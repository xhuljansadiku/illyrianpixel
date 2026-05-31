"use client";

import Link from "next/link";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { useReducedMotion } from "@/lib/gsap";
import { usePinnedHeroScroll } from "@/lib/usePinnedHeroScroll";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";

const WA_HREF = buildWhatsAppChatHref(DEFAULT_WHATSAPP_E164);

const HERO_TEXTURE =
  "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1800&q=80";

export default function BlogGrowthClient() {
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
              <p className="inline-flex rounded-full border border-emerald-100/60 bg-[linear-gradient(180deg,rgba(227,255,246,0.98),rgba(210,247,236,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-emerald-800">
                Rritje
              </p>
              <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                Ke trafikun.
                <br className="hidden md:block" />
                Por ku janë <span className="text-accent">klientët?</span>
              </h1>
              <p ref={heroStatsRef} className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 md:text-[1.1rem]">
                Shumica e bizneseve shpenzojnë para për të sjellë njerëz në faqe dhe i humbin menjëherë. Jo sepse
                oferta është e keqe, por sepse faqja nuk po bën punën e saj.
              </p>
              <p className="mt-6 text-xs tracking-[0.14em] text-white/45">Prill 2026 · 5 min lexim</p>
            </div>
          </div>
        </section>

        <article className="section-wrap py-16 md:py-24">
          <div className="blog-growth-article mx-auto max-w-2xl space-y-16 md:space-y-24">
            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Problemi nuk është reklama</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Kur shitjet nuk shkojnë, reagimi i parë është: &quot;duhet më shumë reklamë&quot;. Por para se të rrisësh
                buxhetin, bëji vetes një pyetje: nëse 1000 njerëz hyjnë në faqe dhe vetëm 10 kontaktojnë, problemi nuk
                është sa njerëz vijnë, por çfarë ndodh kur ata arrijnë.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Oferta e parë duhet të godasë</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Vizitori ka rreth 5 sekonda për të kuptuar nëse është në vendin e duhur. Nëse nuk e kupton menjëherë
                çfarë bën biznesi dhe për kë, ai largohet dhe nuk kthehet më.
              </p>
              <div className="rounded-2xl border border-accent/30 bg-accent/[0.08] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Formula e thjeshtë</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">Çfarë bën + Për kë + Rezultati.</p>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  &quot;Ndihmojmë bizneset të shesin më shumë online pa rritur buxhetin e reklamave&quot; —{" "}
                  <span className="inline-flex rounded-full bg-[#4B3B17] px-3 py-1 text-[0.82rem] font-medium leading-none text-white">
                    Kjo është ofertë.
                  </span>
                </p>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  &quot;Agjenci dixhitale me eksperiencë&quot; —{" "}
                  <span className="inline-flex rounded-full border border-red-500/45 bg-red-950/90 px-3 py-1 text-[0.82rem] font-medium leading-none text-red-100">
                    Kjo nuk është ofertë.
                  </span>
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Bëji klientët të besojnë</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Njerëzit nuk besojnë atë që thua ti, besojnë atë që thonë të tjerët për ty. Para se t&apos;i kërkosh
                vizitorit të veprojë, jepi arsye reale:
              </p>
              <ul className="space-y-3 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Dëshmi:</span> Çfarë thonë të tjerët, me emra dhe
                    rezultate konkrete.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Autoritet:</span> Numra që flasin vetë (projekte, vite
                    eksperiencë).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Logo:</span> Brandet që ju njihen krijojnë besim të
                    menjëhershëm pa fjalë.
                  </span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Një buton i qartë vlen më shumë se dhjetë të bukur
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Gabimi që shohim çdo ditë: faqe me gjashtë butona dhe shumë popup-e. Kur klienti nuk di ku të klikojë,
                nuk klikon askund. Çdo seksion duhet të ketë një qëllim të vetëm dhe një hap të qartë.
                <br className="hidden md:block" />
                Zgjidh një: &quot;Kontakto tani&quot;, &quot;Merr ofertën&quot; ose &quot;Fillo sot&quot;, dhe mbaje
                konsistent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Si fitohet klienti</h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Një faqe që konverton ndjek një logjikë strikte, jo rastësi:
              </p>
              <ul className="space-y-3 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Oferta:</span> Kush je dhe çfarë ofron.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Problemi:</span> Çfarë po e mundon klientin tënd.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Zgjidhja:</span> Si e zgjidh ti konkretisht.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Dëshmia:</span> Pse duhet të të besojnë ty.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Kontakti:</span> Një klikim, pa menduar dy herë.
                  </span>
                </li>
              </ul>
            </section>

            <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Strategjia &amp; mbyllja</p>

              <section className="mt-6 space-y-3">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Statistikat që vërtet kanë rëndësi
                </h2>
                <p className="text-[1.02rem] leading-snug text-[#D1D1D1] md:text-[1.08rem]">
                  Nuk ke nevojë për dhjetë dashboard-e. Tre gjëra mjaftojnë:
                </p>
                <div className="space-y-1.5">
                  <p className="text-[1.01rem] leading-snug text-[#D1D1D1]">
                    <span className="text-accent">Klikimet në CTA:</span> Sa njerëz tregojnë interes real.
                  </p>
                  <p className="text-[1.01rem] leading-snug text-[#D1D1D1]">
                    <span className="text-accent">Fillimi i formularit:</span> Sa njerëz tentojnë të kontaktojnë.
                  </p>
                  <p className="text-[1.01rem] leading-snug text-[#D1D1D1]">
                    <span className="text-accent">Dërgimi i formularit:</span> Sa njerëz e përfundojnë rrugëtimin.
                  </p>
                </div>
              </section>

              <section className="mt-10 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Përmbledhje
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Rritja nuk fillon me më shumë buxhet reklamash, fillon me një faqe që di punën e saj. Mesazh i qartë,
                  besim i shpejtë dhe një rrugë e thjeshtë drejt kontaktit. Rregulloje këtë dhe çdo euro reklamë do të
                  kthehet mbrapsht.
                </p>
              </section>

              <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                A po e ktheni trafikun në kontakte, apo vetëm në bounce?
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
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
                <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.8rem] font-semibold tracking-[0.06em] text-white transition-opacity hover:opacity-90">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </article>

        <section className="section-wrap border-t border-white/10 py-12 md:py-16">
          <h3 className="font-display text-[clamp(1.35rem,2.8vw,1.9rem)] text-white">Artikuj të ngjashëm</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
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
