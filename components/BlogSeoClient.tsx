"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import BlogArticleLayout from "@/components/BlogArticleLayout";

// Article body only; hero, back link, WhatsApp CTA and related posts come from BlogArticleLayout.
export default function BlogSeoClient() {
  const locale = useLocale();
  const en = locale === "en";

  return (
    <BlogArticleLayout
      category={en ? "Strategy" : "Strategji"}
      categoryColor=""
      title={en ? <>Why SEO Is <span className="text-accent">Critical</span> for Serious Businesses{" "}
                    <span className="inline text-[0.58em] font-medium leading-[1.05] tracking-[-0.02em] text-white/78 sm:text-[0.64em]">
                      (Not Optional)
                    </span></> : <>Pse SEO është <span className="text-accent">kritik</span> për biznese serioze{" "}
                    <span className="inline text-[0.58em] font-medium leading-[1.05] tracking-[-0.02em] text-white/78 sm:text-[0.64em]">
                      (dhe jo një opsion)
                    </span></>}
      description={en ? <>Having a beautiful website that doesn&apos;t show up on Google is like opening a luxury store in
                    the middle of the desert. No one finds it, no one buys.</> : <>Të kesh një website të bukur që nuk shfaqet në Google është si të hapësh një dyqan luksoz në mes të
                    shkretëtirës. Askush nuk e gjen, askush nuk blen.</>}
      date={en ? "April 2026" : "Prill 2026"}
      readTime={en ? "7 min read" : "7 min lexim"}
      related={en ? [{ href: "/blog/si-te-rrisesh-klientet-online", category: "Growth", categoryColor: "", title: "You Have the Traffic. So Where Are the Customers?" }, { href: "/blog/gabimet-kryesore-ne-website", category: "UX", categoryColor: "", title: "The Mistakes Businesses Make on Their Website (and How We Fix Them)" }] : [{ href: "/blog/si-te-rrisesh-klientet-online", category: "Rritje", categoryColor: "", title: "Ke trafikun. Por ku janë klientët?" }, { href: "/blog/gabimet-kryesore-ne-website", category: "UX", categoryColor: "", title: "Gabimet që bëjnë bizneset në website (dhe si i rregullojmë)" }]}
    >
      <div className="blog-growth-article space-y-16 md:space-y-24">

            {locale === "en" ? (
              <>
                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Google is the &quot;Yellow Pages&quot; of our time
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    When people have a problem, they don&apos;t look at Instagram ads to find the solution; they go to
                    Google. If your business doesn&apos;t show up on the first page for the services you offer, you
                    simply don&apos;t exist for most of your potential market.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Traffic that doesn&apos;t cost you per click
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Ads (PPC) work only as long as you pay. The moment you stop the budget, they disappear. SEO is an
                    investment in your digital property. It builds a flow of visitors who arrive organically, lowering
                    your customer acquisition cost (CAC) over the long term.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Authority and Trust
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    People trust Google&apos;s algorithm. A high organic ranking tells the customer, subconsciously:
                    &quot;This business is a leader in its industry.&quot; A page that ranks high is automatically
                    perceived as more serious and more professional than one that only shows up through the
                    &quot;Sponsored&quot; label.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    SEO Is a Battle for Territory
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Space on Google&apos;s first page is limited. There are only 10 organic spots. If you&apos;re not
                    there, your competitor is. Every day you neglect SEO, you&apos;re handing over territory and
                    customers to your more active rivals.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    User Experience (UX)
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Google doesn&apos;t just rank keywords; it ranks experience. A page optimized for SEO is fast,
                    works perfectly on mobile, and has clear information. SEO forces you to make your page better for
                    the human, not just for the machine.
                  </p>
                </section>

                <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-lift md:p-9">
                  <p className="ip-eyebrow">Strategy &amp; closing</p>

                  <section className="mt-6 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Why do most people fail at SEO?
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      Because they expect results in 2 weeks. SEO is a marathon, not a sprint. But unlike a marathon,
                      here the winner takes the market&apos;s entire attention.
                    </p>
                  </section>

                  <section className="mt-10 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Summary
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      Serious businesses don&apos;t gamble with luck. They control how and where customers find them.
                      SEO is the foundation that ensures your website isn&apos;t just an expense, but your biggest
                      asset online.
                    </p>
                  </section>

                  <p className="mt-8 text-[1.05rem] font-medium leading-snug text-white md:text-[1.1rem]">
                    Are customers finding your business, or your competitor&apos;s?
                  </p>
                  <div className="mt-5">
                    <Link
                      href="/contact"
                      data-magnetic="true"
                      className="interactive-button ip-cta-primary ip-cta-primary--lg group max-w-full gap-2 text-center "
                    >
                      <span>Get a Free SEO Check</span>
                      <span aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Google është &quot;Libri i Verdhë&quot; i kohës sonë
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Kur njerëzit kanë një problem, ata nuk shohin reklama në Instagram për të gjetur zgjidhjen; ata shkojnë
                    në Google. Nëse biznesi juaj nuk shfaqet në faqen e parë për shërbimet që ofroni, ju thjesht nuk ekzistoni
                    për pjesën më të madhe të tregut tuaj potencial.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Trafiku që nuk kushton për çdo klikim
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Reklamat (PPC) funksionojnë vetëm sa kohë ju paguani. Momentin që ndaloni buxhetin, ato zhduken. SEO është
                    një investim në pronën tuaj dixhitale. Ai ndërton një fluks vizitorësh që vijnë në mënyrë organike,
                    duke ulur koston e blerjes së klientit (CAC) në afatgjatë.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Autoriteti dhe Besimi (Trust)
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
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
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Hapësira në faqen e parë të Google është e kufizuar. Janë vetëm 10 vende organike. Nëse nuk jeni ju aty,
                    është konkurrenca juaj. Çdo ditë që neglizhoni SEO-n, ju po i falni territor dhe klientë rivalëve tuaj më
                    aktivë.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="blog-growth-h2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                    Eksperienca e përdoruesit (UX)
                  </h2>
                  <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                    Google nuk rendit lart vetëm fjalët kyçe; ai rendit eksperiencën. Një faqe e optimizuar për SEO është e
                    shpejtë, funksionon perfekt në celular dhe ka informacion të qartë. SEO ju detyron ta bëni faqen tuaj më
                    të mirë për njeriun, jo vetëm për makinerinë.
                  </p>
                </section>

                <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 shadow-lift md:p-9">
                  <p className="ip-eyebrow">Strategjia &amp; mbyllja</p>

                  <section className="mt-6 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Pse shumica dështojnë me SEO?
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
                      Sepse kërkojnë rezultate për 2 javë. SEO është një maratonë, jo një sprint. Por, ndryshe nga maratona,
                      këtu fituesi merr gjithë vëmendjen e tregut.
                    </p>
                  </section>

                  <section className="mt-10 space-y-4">
                    <h2 className="blog-growth-h2 font-display text-[clamp(1.45rem,2.8vw,1.85rem)] leading-tight text-white">
                      Përmbledhje
                    </h2>
                    <p className="text-[1.02rem] leading-relaxed text-text md:text-[1.08rem]">
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
                      className="interactive-button ip-cta-primary ip-cta-primary--lg group max-w-full gap-2 text-center "
                    >
                      <span>Kontrollo SEO-n Falas</span>
                      <span aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </>
            )}
      </div>
    </BlogArticleLayout>
  );
}
