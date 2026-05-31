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
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80";

export default function BlogGoogleAdsSeoClient() {
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
              <p className="inline-flex rounded-full border border-blue-100/60 bg-[linear-gradient(180deg,rgba(239,246,255,0.98),rgba(219,234,254,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-blue-800">
                Marketing
              </p>
              <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                Google Ads apo SEO:
                <br className="hidden md:block" />
                Ku të investosh <span className="text-accent">para?</span>
              </h1>
              <p ref={heroStatsRef} className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 md:text-[1.1rem]">
                Dy kanale të ndryshme, dy logjika të ndryshme.
                <br />
                Njëra jep rezultate nesër, tjetra ndërton diçka që zgjat vite.
                <br />
                Ja si të zgjedhësh sipas situatës suaj.
              </p>
              <p className="mt-6 text-xs tracking-[0.14em] text-white/45">Maj 2026 · 6 min lexim</p>
            </div>
          </div>
        </section>

        <article className="section-wrap py-16 md:py-24">
          <div className="blog-growth-article mx-auto max-w-2xl space-y-16 md:space-y-24">

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Pyetja e gabuar
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Shumica e bizneseve e formulojnë pyetjen kështu: &quot;Google Ads apo SEO, cila është më e mirë?&quot; Por kjo nuk është pyetja e duhur. Pyetja e duhur është: &quot;Çfarë dua tani dhe çfarë dua për tre vjet?&quot;
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Të dy kanalet funksionojnë. Por funksionojnë ndryshe, për qëllime të ndryshme dhe me horizonte kohore krejtësisht të ndryshme. Të zgjedhësh njërin pa kuptuar tjetrën është si të zgjedhësh mes makinës dhe trenit pa ditur ku po shkon.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Google Ads: rezultate nesër, investim i vazhdueshëm
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Google Ads funksionon si rubineti: hap rubinetin dhe uji rrjedh menjëherë. Mbyll rubinetin dhe nuk ka asgjë. Kjo nuk është e keqe është thjesht si funksionon sistemi.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Nëse keni një produkt ose shërbim me çmim të qartë, nevojë të menjëhershme dhe buxhet reklamash, Google Ads mund të sjellë klientë brenda ditëve të para. Ky është avantazhi i tij kryesor: shpejtësia. Nuk ka nevojë të presësh muaj fushatat aktivizohen dhe klientët fillojnë të telefonojnë.
              </p>
              <div className="rounded-2xl border border-accent/30 bg-accent/[0.08] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Kur funksionon Google Ads</p>
                <ul className="mt-3 space-y-2 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Biznes i ri që ka nevojë për klientë menjëherë</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Produkt me kërkesë të lartë (avokat, dentist)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Fushatë sezonale ose promovim i veçantë</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Testim i tregut para investimit afatgjatë</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                SEO: investim i ngadaltë që zgjat vite
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                SEO funksionon si investimi në tokë: rezultatet vijnë ngadalë, por kur vijnë, janë të juajat. Nuk paguat për çdo klikim, nuk humbni pozicionin kur ndalon buxhetin, dhe me kalimin e kohës SEO bëhet gjithnjë e më i fuqishëm.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Studime tregojnë se 75% e njerëzve nuk kalojnë faqen e parë të Google. Pozicioni i parë merr mesatarisht 27% të klikimeve. Pozicioni i dhjetë merr 2.5%. Diferenca midis të qenit i pari dhe i dhjetë nuk është 4x është mbi 10x trafik.
              </p>
              <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Kur funksionon SEO</p>
                <ul className="mt-3 space-y-2 text-[0.98rem] leading-relaxed text-[#D1D1D1]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Biznes me horizont afatgjatë (1–3 vjet)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Industri me konkurrencë dhe kosto të lartë Ads</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Dëshirë për autoritet dhe besueshmëri organike</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>Reduktim i kostos së blerjes së klientit në afatgjatë</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Kostoja reale e secilit kanal
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Google Ads ka kosto direkte dhe të dukshme: pagesh për çdo klikim. Në tregun shqiptar, çmimet variojnë nga €0.30 për klikime të zakonshme deri €3–8 për industri konkurruese si juridike, mjekësi ose ndërtim.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                SEO ka kosto indirekte: kohë dhe punë profesionale. Rezultatet e para fillojnë të shfaqen pas 3–6 muajsh. Por pasi arrihet pozicioni, trafiku vjen pa kosto shtesë mujore çdo vizitor organik është falas.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Llogaritni kështu: nëse shpenzoni €300/muaj në Google Ads dhe sjellin 30 klientë potencialë, kostoja për kontakt është €10. SEO i mirë mund të sjellë 300 vizitorë organikë çdo muaj por duhet 12 muaj për të arritur aty.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                Strategjia e zgjuar: të dyja bashkë
              </h2>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Bizneset më të suksesshme nuk zgjedhin kombinojnë. Google Ads mban faqen aktive dhe gjeneron të ardhura tani, ndërsa SEO ndërton themelin organik për të ardhmen.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Strategjia tipike: filloni me Google Ads për të testuar cilat fjalëkyçe konvertojnë në klientë realë. Pastaj investoni në SEO pikërisht për ato fjalëkyçe. Kur SEO fillon të performojë, ulni gradualisht buxhetin e Ads dhe çlironi kapital për investime të tjera.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                Ky kombinim është arsyeja pse bizneset me strategji dixhitale të plotë kanë Kosto Blerje Klienti (CAC) deri 60% më të ulët pas 18 muajsh krahasuar me ata që mbështeten vetëm në Ads.
              </p>
            </section>

            <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Vendosja e duhur</p>

              <section className="mt-6 space-y-3">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  4 pyetje para se të vendosni
                </h2>
                <div className="space-y-3 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                  <p>
                    <span className="text-accent font-medium">1. Sa shpejt keni nevojë?</span> Nesër = Ads. 6 muaj = SEO.
                  </p>
                  <p>
                    <span className="text-accent font-medium">2. Cili është buxheti mujor?</span> Nën €150/muaj = SEO. Mbi = kombinim.
                  </p>
                  <p>
                    <span className="text-accent font-medium">3. Sa vlen klienti juaj mesatar?</span> Vlerë e lartë = SEO justifikohet lehtë.
                  </p>
                  <p>
                    <span className="text-accent font-medium">4. Sa e konkurruar është industria?</span> Shumë = duhen të dyja me strategji.
                  </p>
                </div>
              </section>

              <section className="mt-10 space-y-4">
                <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                  Përfundim
                </h2>
                <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                  Nuk ka përgjigje universale. Por ka një rregull të pandryshueshëm: mos investoni në asnjërin kanal pa pasur faqe që konverton. Njëmijë vizitorë në ditë nuk bëjnë asgjë nëse Website nuk i kthen në klientë. Website-i është baza pas saj, zgjidhni kanalin që i përshtatet fazës suaj.
                </p>
              </section>

              <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                Dëshironi një plan të personalizuar për biznesin tuaj?
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
