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
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1800&q=80";

export default function BlogBrandingClient() {
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
              <p className="inline-flex rounded-full border border-rose-100/60 bg-[linear-gradient(180deg,rgba(255,241,242,0.98),rgba(254,226,228,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-rose-800">
                Branding
              </p>
              <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                Branding nuk është logo.
                <br className="hidden md:block" />
                Është <span className="text-accent">çfarë ndiejnë</span> të tjerët.
              </h1>
              <p ref={heroStatsRef} className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 md:text-[1.1rem]">
                Çfarë është branding në të vërtetë, pse bizneset shqiptare e nënvlerësojnë dhe çfarë humbasin duke e bërë kështu.
              </p>
              <p className="mt-6 text-xs tracking-[0.14em] text-white/45">Maj 2026 · 6 min lexim</p>
            </div>
          </div>
        </section>

        <article className="section-wrap py-16 md:py-24">
          <div className="blog-growth-article mx-auto max-w-2xl space-y-16 md:space-y-24">

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Keqkuptimi më i madh në biznes
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Kur shumica e biznesmenëve shqiptarë dëgjojnë &quot;branding&quot;, mendojnë logo. Kur mendojnë logo, mendojnë ngjyrë. Kur mendojnë ngjyrë, mendojnë se kanë bërë branding. Nuk kanë.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Branding është tërësia e asaj që njerëzit mendojnë dhe ndiejnë kur dëgjojnë emrin e biznesit tuaj. Logo është pjesë e vogël e saj. Dhe nëse po bëni branding vetëm si logo, po investoni vetëm në fasadën e shtëpisë pa ndërtuar themelet.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Çfarë është branding në realitet
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Jeff Bezos e ka shprehur thjesht: &quot;Branding është çfarë thonë njerëzit për ty kur nuk je në dhomë.&quot; Kjo do të thotë: branding është reputacioni i menaxhuar. Është tërësia e çdo pikëprekjeje që klienti ka me biznesin tuaj.
              </p>
              <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Branding përfshin</p>
                <ul className="mt-3 space-y-2 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Si duket (logo, ngjyrat, tipografia, dizajni)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Si flet (toni i zërit, mesazhet kyçe, copywriting)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Si sillet (shërbimi ndaj klientit, procesi, eksperienca)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Çfarë premton (pozicionimi, vlerat, misioni)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Çfarë ndiejnë njerëzit (emocionet dhe asociacionet)</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Pse branding i dobët kushton më shumë sesa branding i mirë
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Bizneset pa branding të qartë paguajnë më shumë për çdo klient. Arsyeja: kur nuk dalloheni qartë nga konkurrenca, e vetmja mënyrë për të tërhequr klientë është çmimi. Dhe lufta e çmimit është beteja që askush nuk fiton.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Studime tregojnë se bizneset me branding të fortë mund të ngarkojnë 20–30% çmim më të lartë për të njëjtat produkte. Jo sepse produkti është më i mirëpor sepse besimi dhe perceptimi janë më të lartë.
              </p>
              <div className="rounded-2xl border border-accent/30 bg-accent/[0.08] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Shembulli konkret</p>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  Dy berberë, i njëjti shërbim. I pari ka logo të blerë online për €10, pa ngjyra të qëndrueshme, Instagram i çrregullt. I dyti ka identitet vizual të hartuar, ton të qartë, foto profesionale.
                </p>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  I pari ngarkon €10 për prerje. I dyti €18. Klientët e dytit nuk negociojnësepse nuk e perceptojnë si shërbim të thjeshtë.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                3 shenjat që branding juaj ka probleme
              </h2>
              <ul className="space-y-5 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Klientët e rinj nuk ju njohin menjëherë.</span> Nëse dikush sheh logon tuaj pa emrin, nuk ju identifikon. Branding i fortë krijon njohje të menjëhershme.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Klientët pyesin gjithmonë çmimin e parë.</span> Kur çmimi është pyetja e parë, branding nuk ka bërë punën e tij. Besimi i madh zhvendos fokusit nga çmimi te vlera.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-medium text-white/90">Materialet tuaja ndryshojnë çdo vit.</span> Ngjyra të ndryshme, tone të ndryshme, stil të ndryshëm. Qëndrueshmëria është kushti i parë i brandingut të fuqishëm.
                  </span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Nga ku fillon branding i vërtetë
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Branding nuk fillon me dizajnerin. Fillon me pyetjet:
              </p>
              <ul className="space-y-3 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Kush jam unë si biznes dhe çfarë vlera sjell?</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Kush është klienti ideal dhe çfarë dëshiron ai të ndiejë?</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Si dua të dallohem nga konkurrencajo vetëm çfarë bëj, por si?</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Nëse marka ime do të ishte person, si do të fliste dhe si do të dukej?</span>
                </li>
              </ul>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Pasi i keni përgjigjet, dizajni vjen natyrshëm. Logo, ngjyrat dhe tipografia bëhen shprehje vizuale e asaj që tashmë keni vendosurjo vendime të rastit.
              </p>
            </section>

            <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Branding &amp; Identiteti</p>

              <section className="mt-6 space-y-3">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Çfarë përfshihet në paketë branding profesionale
                </h2>
                <div className="space-y-2 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                  <p className="flex gap-2"><span className="text-accent">◆</span> Logo profesionale + variante (horizontal, vertikal, ikon)</p>
                  <p className="flex gap-2"><span className="text-accent">◆</span> Paleta ngjyrash + tipografi e hartuar</p>
                  <p className="flex gap-2"><span className="text-accent">◆</span> Brand Guidelinessi të përdoret marka kudo</p>
                  <p className="flex gap-2"><span className="text-accent">◆</span> Ton i zërit dhe mesazhet kyçe</p>
                  <p className="flex gap-2"><span className="text-accent">◆</span> Templates për social media dhe materiale fizike</p>
                </div>
              </section>

              <section className="mt-10 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Përfundim
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Branding është investimi i vetëm dixhital që vlen në çdo kanal: website, social media, kartëvizita, vetë ju kur flisni me klientë. Nuk është kostoështë themel. Dhe si çdo themel, ia vlen ta ndërtoni mirë herën e parë.
                </p>
              </section>

              <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                Gati të ndërtoni një identitet që dallon dhe mbetet?
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  data-magnetic="true"
                  className="interactive-button ip-cta-primary ip-cta-primary--lg group gap-2 !px-8 !py-3.5 !text-sm !tracking-[0.12em]"
                >
                  <span>Konsultë falas</span>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
