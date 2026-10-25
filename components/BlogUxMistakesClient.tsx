"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import BlogArticleLayout from "@/components/BlogArticleLayout";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";

const WA_HREF = buildWhatsAppChatHref(DEFAULT_WHATSAPP_E164);

// Article body only; hero, back link, WhatsApp CTA and related posts come from BlogArticleLayout.
export default function BlogUxMistakesClient() {
  const locale = useLocale();
  const en = locale === "en";

  return (
    <BlogArticleLayout
      category="UX"
      categoryColor=""
      title={en ? <>The mistakes businesses make{" "}
                    <span className="whitespace-nowrap">
                      on their website{" "}
                      <span className="inline-block align-baseline text-[0.7em] sm:text-[0.78em] md:text-[0.82em]">
                        (and how we <span className="text-accent">fix them</span>)
                      </span>
                    </span></> : <>Gabimet që bëjnë bizneset{" "}
                    <span className="whitespace-nowrap">
                      në website{" "}
                      <span className="inline-block align-baseline text-[0.7em] sm:text-[0.78em] md:text-[0.82em]">
                        (dhe si i <span className="text-accent">rregullojmë</span>)
                      </span>
                    </span></>}
      description={en ? <>An unclear website doesn&apos;t just lose visitors; it loses customers.
                    {"\n"}
                    The visitor arrives, doesn&apos;t understand what to do, and leaves.
                    {"\n"}
                    No complaints, no email left, never to return.</> : <>Një website i paqartë nuk humbet thjesht vizitorë; humbet klientë.
                    {"\n"}
                    Vizitori hyn, nuk kupton çfarë të bëjë dhe largohet.
                    {"\n"}
                    Pa u ankuar, pa lënë email, pa u kthyer më.</>}
      date={en ? "April 2026" : "Prill 2026"}
      readTime={en ? "4 min read" : "4 min lexim"}
      related={en ? [{ href: "/blog/si-te-rrisesh-klientet-online", category: "Growth", categoryColor: "", title: "You Have the Traffic. So Where Are the Customers?" }, { href: "/blog/pse-seo-eshte-kritik", category: "Strategy", categoryColor: "", title: "Why SEO Is Critical for Serious Businesses (Not Optional)" }] : [{ href: "/blog/si-te-rrisesh-klientet-online", category: "Rritje", categoryColor: "", title: "Keni trafikun. Por ku janë klientët?" }, { href: "/blog/pse-seo-eshte-kritik", category: "Strategji", categoryColor: "", title: "Pse SEO është kritik për biznese serioze (dhe jo një opsion)" }]}
    >
      <div className="blog-growth-article space-y-16 md:space-y-24">

            {locale === "en" ? (
              <>
                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Five seconds to convince or to lose them.
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    The visitor makes the decision, without even realizing it, within the first 5 seconds.
                    <br className="hidden md:block" />
                    If the main headline is unclear or too generic, they leave.
                    <br className="hidden md:block" />
                    &quot;Innovative digital agency with tailored solutions&quot; tells no one anything.
                    <br className="hidden md:block" />
                    Say exactly what you do and for whom.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Many options, zero decisions</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Too many buttons, too many menus and too many pop-ups confuse the customer.
                    <br className="hidden md:block" />
                    When everything demands attention, nothing gets it.
                    <br className="hidden md:block" />
                    Every page should have a single purpose and lead the visitor toward one clear step.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Proof is missing</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    People don&apos;t believe what you say about yourself, they believe what others say about you.
                    <br className="hidden md:block" />
                    Without real reviews, without numbers and without concrete results, trust isn&apos;t built.
                    <br className="hidden md:block" />
                    And without trust, there&apos;s no contact.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Contact is hidden</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    If the customer has to search for your phone number or contact form, you&apos;ve already lost them.
                    <br className="hidden md:block" />
                    Contact should always be visible: at the top, at the bottom, and everywhere the visitor is ready to
                    make a decision.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">The mobile barrier</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Over 60% of visitors come from mobile.
                    <br className="hidden md:block" />
                    If the buttons are small, the text overflows the screen, or the form is hard to fill out, you&apos;re
                    losing most of your audience without knowing it.
                  </p>
                </section>

                <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-lift md:p-9">
                  <p className="ip-eyebrow">Strategy &amp; closing</p>

                  <section className="mt-6 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      How do we fix it?
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      There&apos;s no need to rebuild everything from scratch.
                      <br className="hidden md:block" />
                      Often, surgical changes are enough: a clearer headline, a cleaner visual hierarchy, and a call
                      to action in the right place.
                      <br className="hidden md:block" />
                      We review your customer&apos;s journey and simplify it all the way to conversion.
                    </p>
                  </section>

                  <section className="mt-10 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Summary
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      A website that sells is simple for the visitor: they understand the offer instantly, they trust
                      the proof, and they know where to click. When these are missing, the customer doesn&apos;t
                      complain, they leave.
                    </p>
                  </section>

                  <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                    Ready to turn your website into a sales machine?
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      href="/contact"
                      data-magnetic="true"
                      className="interactive-button ip-cta-primary ip-cta-primary--lg group gap-2 "
                    >
                      <span>Start today</span>
                      <span aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                    <a data-track-location="blog" href={WA_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.8rem] font-semibold tracking-[0.08em] text-[#062b14] transition-opacity hover:opacity-90">
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
                    Pesë sekonda për të bindur ose për të humbur.
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Vizitori merr vendimin pa e kuptuar vetë brenda 5 sekondave të para.
                    <br className="hidden md:block" />
                    Nëse titulli kryesor është i paqartë ose shumë i përgjithshëm, ai largohet.
                    <br className="hidden md:block" />
                    &quot;Agjenci dixhitale inovative me zgjidhje të personalizuara&quot; nuk i thotë asgjë askujt.
                    <br className="hidden md:block" />
                    Thoni saktësisht çfarë bëni dhe për kë.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Shumë opsione, zero vendime</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Shumë butona, shumë menu dhe shumë popup-e e hutojnë klientin.
                    <br className="hidden md:block" />
                    Kur gjithçka kërkon vëmendje, asgjë nuk e merr atë.
                    <br className="hidden md:block" />
                    Çdo faqe duhet të ketë një qëllim të vetëm dhe ta udhëheqë vizitorin drejt një hapi të qartë.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Mungon dëshmia</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Njerëzit nuk besojnë atë që thoni ju për veten, besojnë atë që thonë të tjerët për ju.
                    <br className="hidden md:block" />
                    Pa komente reale, pa numra dhe pa rezultate konkrete, besimi nuk ndërtohet.
                    <br className="hidden md:block" />
                    Dhe pa besim, nuk ka kontakt.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Kontakti është i fshehur</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Nëse klientit i duhet të kërkojë numrin e telefonit ose formularin, ju e keni humbur atë.
                    <br className="hidden md:block" />
                    Kontakti duhet të jetë gjithmonë i dukshëm: në krye, në fund dhe kudo ku vizitori është gati të marrë një
                    vendim.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">Barriera e celularit</h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Mbi 60% e vizitorëve vijnë nga telefoni.
                    <br className="hidden md:block" />
                    Nëse butonat janë të vegjël, teksti del jashtë ekranit ose formulari është i vështirë për t&apos;u
                    plotësuar, ju po humbisni shumicën e audiencës pa e ditur.
                  </p>
                </section>

                <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-lift md:p-9">
                  <p className="ip-eyebrow">Strategjia &amp; mbyllja</p>

                  <section className="mt-6 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Si i rregullojmë?
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      Nuk ka nevojë të ndërtoni gjithçka nga e para.
                      <br className="hidden md:block" />
                      Shpesh mjaftojnë ndryshime kirurgjikale: një titull më i qartë, një hierarki vizuale më e pastër dhe një
                      thirrje për veprim në vendin e duhur.
                      <br className="hidden md:block" />
                      Ne rishikojmë rrugëtimin e klientit tuaj dhe e thjeshtojmë atë deri në konversion.
                    </p>
                  </section>

                  <section className="mt-10 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Përmbledhje
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      Website-i që shet është i thjeshtë për vizitorin: e kupton menjëherë ofertën, beson dëshminë dhe di
                      ku të klikojë. Kur këto mungojnë, klienti nuk ankohet, largohet.
                    </p>
                  </section>

                  <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                    Gati për ta kthyer website-in tuaj në një makineri shitjesh?
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      href="/contact"
                      data-magnetic="true"
                      className="interactive-button ip-cta-primary ip-cta-primary--lg group gap-2 "
                    >
                      <span>Fillo sot</span>
                      <span aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                    <a data-track-location="blog" href={WA_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.8rem] font-semibold tracking-[0.08em] text-[#062b14] transition-opacity hover:opacity-90">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </>
            )}
      </div>
    </BlogArticleLayout>
  );
}
