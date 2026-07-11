"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { useReducedMotion } from "@/lib/gsap";
import { usePinnedHeroScroll } from "@/lib/usePinnedHeroScroll";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";

const WA_HREF = buildWhatsAppChatHref(DEFAULT_WHATSAPP_E164);

const HERO_TEXTURE =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80";

export default function BlogEcommerceClient() {
  const locale = useLocale();
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
              <span aria-hidden>←</span> {locale === "en" ? "Back to blog" : "Kthehu te blogu"}
            </Link>

            <div className="mt-8">
              <p className="inline-flex rounded-full border border-violet-100/60 bg-[linear-gradient(180deg,rgba(245,243,255,0.98),rgba(233,229,255,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-violet-800">
                E-Commerce
              </p>
              {locale === "en" ? (
                <>
                  <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                    Your physical store closes at 6 PM.
                    <br className="hidden md:block" />
                    Your online store <span className="text-accent">never does.</span>
                  </h1>
                  <p ref={heroStatsRef} className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 md:text-[1.1rem]">
                    Why Albanian businesses need an online store in 2026.
                    <br />
                    The most common mistakes, real costs, and what you&apos;re losing every month without e-commerce.
                  </p>
                  <p className="mt-6 text-xs tracking-[0.14em] text-white/45">May 2026 · 7 min read</p>
                </>
              ) : (
                <>
                  <h1 ref={heroTitleRef} className="section-title font-display mt-5 max-w-4xl">
                    Dyqani juaj fizik mbyllet në orën 18:00.
                    <br className="hidden md:block" />
                    Dyqani online <span className="text-accent">kurrë.</span>
                  </h1>
                  <p ref={heroStatsRef} className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 md:text-[1.1rem]">
                    Pse bizneset shqiptare kanë nevojë për dyqan online në 2026.
                    <br />
                    Gabimet më të shpeshta, kostot reale dhe çfarë humbisni çdo muaj pa e-commerce.
                  </p>
                  <p className="mt-6 text-xs tracking-[0.14em] text-white/45">Maj 2026 · 7 min lexim</p>
                </>
              )}
            </div>
          </div>
        </section>

        <article className="section-wrap py-16 md:py-24">
          <div className="blog-growth-article mx-auto max-w-2xl space-y-16 md:space-y-24">

            {locale === "en" ? (
              <>
                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Albanian shopper behavior has changed
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    In 2020, most Albanians preferred to buy in person. Today, statistics show that over 65% of Albanian consumers search for a product online before deciding where to buy it, whether online or in person.
                  </p>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    This means: if your product doesn&apos;t appear online with full information, price, and a way to get in touch, you lose those customers, not to a physical competitor, but to the digital competitor who understood the shift.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    5 reasons your business needs an online store now
                  </h2>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">01 — Sales 24 hours, 7 days a week</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        The physical store closes. The online store never does. Your customers buy in the evening, on Saturdays, and during holidays. Every hour without an online store is an hour of lost revenue.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">02 — The diaspora market</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Several million Albanians live abroad. They buy Albanian products, send gifts to family, and support local businesses, but only if they can do it online. Without an online store, this market doesn&apos;t exist for you.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">03 — Lower cost than a physical store</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Rent, staff, and operating costs of a physical store are high. An online store requires an initial investment (build) and a minimal monthly cost (hosting, maintenance). The ROI is many times higher.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">04 — Real data and analytics</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        A physical store doesn&apos;t tell you who walked in, what they looked at, and why they left without buying. An online store gives you every piece of data: best-selling products, the buyer&apos;s journey, conversion rate, and much more.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">05 — Your competitors already have one</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Every month without an online store, your competitor with one gains customers who could have been yours. The industry doesn&apos;t wait. The Albanian digital market is growing 23% every year.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    The most common e-commerce mistakes
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    Albanian businesses entering e-commerce usually make the same mistakes, and often abandon their projects not because e-commerce doesn&apos;t work, but because they started poorly.
                  </p>
                  <ul className="space-y-4 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">A complicated checkout:</span> Every extra step in checkout lowers conversion by 10%. Customers want to buy fast, not fill out long forms.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">Limited payment options:</span> Many Albanians don&apos;t have an international credit card. If you don&apos;t accept PayPal, cash on delivery, or Stripe, you lose half your buyers.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">Weak product photos:</span> Online, the customer can&apos;t touch the product. Professional photos are the first condition of trust.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">No mobile optimization:</span> 78% of Albanian buyers shop from their phone. A store that doesn&apos;t work well on mobile is a store closed to most of them.
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    How much should you invest?
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    The investment depends on the store&apos;s complexity, the number of products, and the features needed. But here&apos;s a simple framework:
                  </p>
                  <div className="rounded-2xl border border-accent/30 bg-accent/[0.08] p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Typical prices</p>
                    <div className="mt-3 space-y-3 text-[0.98rem] text-[#D1D1D1]">
                      <div className="flex justify-between border-b border-white/8 pb-2">
                        <span>Starter store (up to 30 products)</span>
                        <span className="font-medium text-white">from €699</span>
                      </div>
                      <div className="flex justify-between border-b border-white/8 pb-2">
                        <span>Mid-size store (up to 100 products)</span>
                        <span className="font-medium text-white">from €1,199</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advanced platform (no limit)</span>
                        <span className="font-medium text-white">from €1,999</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    If your store sells even just 5 extra products a month thanks to the online channel, the investment is recovered within the first few months.
                  </p>
                </section>

                <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Next step</p>

                  <section className="mt-6 space-y-3">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Is your business ready for e-commerce?
                    </h2>
                    <div className="space-y-2 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                      <p className="flex gap-2"><span className="text-accent">✓</span> You have products or services that can be sold online</p>
                      <p className="flex gap-2"><span className="text-accent">✓</span> You have the capacity to fulfill orders (logistics)</p>
                      <p className="flex gap-2"><span className="text-accent">✓</span> You want to grow sales without growing staff</p>
                      <p className="flex gap-2"><span className="text-accent">✓</span> You want to reach customers outside your physical area</p>
                    </div>
                  </section>

                  <section className="mt-10 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Conclusion
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                      An online store isn&apos;t optional for Albanian businesses, it&apos;s the first digital necessity. Every month without one, you lose real sales. The question isn&apos;t &quot;do we need it?&quot;, the question is &quot;how fast can we launch it?&quot;
                    </p>
                  </section>

                  <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                    Ready to launch your online store?
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      href="/contact"
                      data-magnetic="true"
                      className="interactive-button ip-cta-primary ip-cta-primary--lg group gap-2 !px-8 !py-3.5 !text-sm !tracking-[0.12em]"
                    >
                      <span>Free consultation</span>
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
              </>
            ) : (
              <>
                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Sjellja e blerësit shqiptar ka ndryshuar
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    Në 2020, shumica e shqiptarëve preferonin të blinin fizikisht. Sot, statistikat tregojnë se mbi 65% e konsumatorëve shqiptarë kërkojnë produktin online para se të vendosin ku ta blejnë qoftë online qoftë fizikisht.
                  </p>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    Kjo do të thotë: nëse produkti juaj nuk shfaqet online me informacion të plotë, çmim dhe mundësi kontakti, ju i humbisni ata klientë jo konkurrentit fizik, por konkurrentit dixhital që ka kuptuar ndryshimin.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    5 arsye pse biznesi juaj ka nevojë për dyqan online tani
                  </h2>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">01 — Shitje 24 orë, 7 ditë</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Dyqani fizik mbyllet. Dyqani online kurrë. Klientët tuaj blejnë në mbrëmje, të shtunave dhe gjatë festave. Çdo orë pa dyqan online është orë humbje.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">02 — Tregu i diasporës</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Disa milion shqiptarë jetojnë jashtë vendit. Ata blejnë produkte shqiptare, u dërgojnë dhurata familjes dhe mbështesin bizneset vendase por vetëm nëse mund ta bëjnë online. Pa dyqan online, ky treg nuk ekziston për ju.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">03 — Kosto më e ulët se dyqani fizik</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Qiraja, stafi, kostot operative të dyqanit fizik janë të larta. Dyqani online kërkon investim fillestar (ndërtim) dhe kosto mujore minimale (hosting, mirëmbajtje). ROI-ja është shumë herë më e lartë.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">04 — Të dhëna dhe analitikë reale</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Dyqani fizik nuk ju tregon kush hyri, çfarë shikoi dhe pse u largua pa blerë. Dyqani online ju jep çdo e dhënë: produktet më të shitura, rrugëtimin e blerësit, normën edhe shumë më tepër.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">05 — Konkurrentët tuaj tashmë e kanë</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-[#D1D1D1]">
                        Çdo muaj pa dyqan online, konkurrenti juaj me dyqan fiton klientë që mund të ishin juaj. Industria nuk pret. Tregu dixhital shqiptar po rritet me 23% çdo vit.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Gabimet më të shpeshta në e-commerce
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    Bizneset shqiptare që hyjnë në e-commerce bëjnë zakonisht të njëjtat gabime dhe shpesh i braktisin projektet jo sepse e-commerce nuk funksionon, por sepse filluan keq.
                  </p>
                  <ul className="space-y-4 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">Checkout i komplikuar:</span> Çdo hap shtesë në checkout ul konvertimin me 10%. Klientët duan të blejnë shpejt, jo të plotësojnë formularë të gjatë.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">Pagesa të limituara:</span> Shumë shqiptarë nuk kanë kartë krediti ndërkombëtare. Nëse nuk pranoni PayPal, pagesë në dorëzim ose Stripe, humbni gjysmën e blerësve.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">Foto të dobëta të produkteve:</span> Online, klienti nuk mund ta prekë produktin. Foto profesionale janë kushti i parë i besimit.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium text-white/90">Pa mobile optimization:</span> 78% e blerëve shqiptarë blejnë nga telefoni. Dyqan që nuk funksionon mirë në mobile = dyqan i mbyllur për shumicën.
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Sa duhet të investoni?
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    Investimi varet nga kompleksiteti i dyqanit, numri i produkteve dhe funksionet e nevojshme. Por ja një kuadër i thjeshtë:
                  </p>
                  <div className="rounded-2xl border border-accent/30 bg-accent/[0.08] p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent/90">Çmimet tipike</p>
                    <div className="mt-3 space-y-3 text-[0.98rem] text-[#D1D1D1]">
                      <div className="flex justify-between border-b border-white/8 pb-2">
                        <span>Dyqan fillestar (deri 30 produkte)</span>
                        <span className="font-medium text-white">nga €699</span>
                      </div>
                      <div className="flex justify-between border-b border-white/8 pb-2">
                        <span>Dyqan i mesëm (deri 100 produkte)</span>
                        <span className="font-medium text-white">nga €1,199</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platformë e avancuar (pa limit)</span>
                        <span className="font-medium text-white">nga €1,999</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                    Nëse dyqani juaj shet edhe vetëm 5 produkte shtesë në muaj falë kanalimit online, investimi rikuperohet brenda muajve të parë.
                  </p>
                </section>

                <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-9">
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent/85">Hapi tjetër</p>

                  <section className="mt-6 space-y-3">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      A është biznesi juaj gati për e-commerce?
                    </h2>
                    <div className="space-y-2 text-[1.01rem] leading-relaxed text-[#D1D1D1]">
                      <p className="flex gap-2"><span className="text-accent">✓</span> Keni produkte ose shërbime që mund të shiten online</p>
                      <p className="flex gap-2"><span className="text-accent">✓</span> Keni kapacitet të përmbushni porosi (logjistika)</p>
                      <p className="flex gap-2"><span className="text-accent">✓</span> Dëshironi të rrisni shitjet pa rritur stafin</p>
                      <p className="flex gap-2"><span className="text-accent">✓</span> Dëshironi të arrini klientë jashtë zonës fizike</p>
                    </div>
                  </section>

                  <section className="mt-10 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Përfundim
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-[#D1D1D1] md:text-[1.08rem]">
                      Dyqani online nuk është opsion për bizneset shqiptare është nevoja e parë dixhitale. Çdo muaj pa të, humbni shitje reale. Pyetja nuk është &quot;a kemi nevojë?&quot; pyetja është &quot;sa shpejt mund ta nisim?&quot;
                    </p>
                  </section>

                  <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                    Gati të nisni dyqanin tuaj online?
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
              </>
            )}
          </div>
        </article>

        <section className="section-wrap border-t border-white/10 py-12 md:py-16">
          <h3 className="font-display text-[clamp(1.35rem,2.8vw,1.9rem)] text-white">
            {locale === "en" ? "Related articles" : "Artikuj të ngjashëm"}
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link
              href="/blog/gabimet-kryesore-ne-website"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
            >
              <p className="inline-flex rounded-full border border-indigo-100/60 bg-[linear-gradient(180deg,rgba(244,242,255,0.98),rgba(231,226,255,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-indigo-800">
                UX
              </p>
              <p className="mt-4 font-display text-[1.35rem] leading-tight text-white">
                {locale === "en"
                  ? "The Mistakes Businesses Make on Their Website (and How We Fix Them)"
                  : "Gabimet që bëjnë bizneset në website (dhe si i rregullojmë)"}
              </p>
            </Link>

            <Link
              href="/blog/google-ads-vs-seo"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
            >
              <p className="inline-flex rounded-full border border-blue-100/60 bg-[linear-gradient(180deg,rgba(239,246,255,0.98),rgba(219,234,254,0.95))] px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em] text-blue-800">
                Marketing
              </p>
              <p className="mt-4 font-display text-[1.35rem] leading-tight text-white">
                {locale === "en"
                  ? "Google Ads or SEO: Where Should You Invest Your Money?"
                  : "Google Ads apo SEO: Ku të investosh para?"}
              </p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
