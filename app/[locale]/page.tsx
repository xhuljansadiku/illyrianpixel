import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HomeClientExtras from "@/components/HomeClientExtras";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildMetadata, faqSchema, jsonLd } from "@/lib/seo";
import { getVisibleTestimonials, getVisiblePortfolioItems, getVisibleFaqs } from "@/lib/publicContent";
import type { FeaturedItem } from "@/components/FeaturedWorkGrid";
import type { Locale } from "@/i18n/routing";
// Critical above-fold — static imports (SSR + no layout shift)
import Navbar from "@/components/Navbar";
import SectionAura from "@/components/SectionAura";
// Hero text is SSR'd for instant LCP and zero CLS; only the 3D Canvas inside it
// is client-only (lazy-loaded after idle by the component itself).
import Hero from "@/components/ParticleCloudHero";

// Below-fold — dynamic imports (code-split, deferred JS)
const BeforeAfter   = dynamic(() => import("@/components/BeforeAfter"));
const GlobalCTA     = dynamic(() => import("@/components/GlobalCTA"));
const FAQ           = dynamic(() => import("@/components/FAQ"));
const FeaturedWork  = dynamic(() => import("@/components/FeaturedWork"));
const Footer        = dynamic(() => import("@/components/Footer"));
const Process       = dynamic(() => import("@/components/Process"));
const PseNe         = dynamic(() => import("@/components/PseNe"));
const Services      = dynamic(() => import("@/components/Services"));
const Testimonials  = dynamic(() => import("@/components/Testimonials"));
const TrustedClients     = dynamic(() => import("@/components/TrustedClients"));
const NewsletterSection  = dynamic(() => import("@/components/NewsletterSection"));


const META: Record<Locale, { title: string; desc: string; keywords: string[] }> = {
  sq: {
    // Pozicionimi ndërkombëtar me fokus diasporën (2026-10-05): titulli mban "Web Design" +
    // "Shqipëri" për renditjen lokale; klientë në 7 vende (DE, IT, UK, SE, US, AL, XK).
    title: "Web Design për Biznese në Europë, SHBA & Shqipëri",
    desc: "Agjenci dixhitale ndërkombëtare: website, SEO & Google Ads për biznese në Gjermani, Itali, Angli, Suedi, SHBA, Shqipëri e Kosovë. Bisedë në shqip, plan falas brenda 24h.",
    keywords: [
      "web design shqipëri", "agjenci dixhitale tiranë", "website për biznes në gjermani",
      "agjenci shqiptare diasporë", "website biznes zvicër", "seo shqipëri", "google ads shqipëri",
      "e-commerce albania", "branding biznese", "illyrian pixel"
    ],
  },
  en: {
    title: "Web Design for Businesses in Europe, the USA & Albania",
    desc: "International digital agency: websites, SEO & Google Ads for businesses in Germany, Italy, the UK, Sweden, the USA, Albania and Kosovo. We talk in Albanian. Free plan within 24h.",
    keywords: [
      "web design albania", "digital agency tirana", "albanian web agency germany",
      "albanian diaspora business website", "web design for albanian businesses", "seo albania",
      "google ads albania", "e-commerce albania", "business branding", "illyrian pixel"
    ],
  },
};

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "", m.keywords, locale);
}

// Rifresko çdo 5 min — testimonialet/portofoli menaxhohen nga admini
export const revalidate = 300;

export default async function HomePage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations("home");
  const [testimonialRows, portfolioRows, faqRows] = await Promise.all([
    getVisibleTestimonials(locale).catch(() => []),
    getVisiblePortfolioItems(locale).catch(() => []),
    getVisibleFaqs(locale).catch(() => []),
  ]);

  const faqItems = faqRows.map((f) => ({ q: f.question, a: f.answer, category: f.category }));

  const testimonialItems = testimonialRows.map((t) => ({
    quote: t.quote,
    name: t.name,
    company: t.company,
    result: t.result,
    logo: t.logo,
    category: t.category,
  }));

  const portfolioItems: FeaturedItem[] = portfolioRows.map((p) => ({
    slug: `db-${p.id}`,
    title: p.title,
    category: p.category ?? "",
    location: p.location ?? "",
    flagCodes: [],
    intro: p.description ?? "",
    metrics: p.result ? [p.result] : [],
    tags: p.tags ?? [],
    heroImage: p.image_url,
    liveUrl: p.live_url ?? "",
  }));

  return (
    <>
      <SectionAura />
      <Navbar />
      <div className="site-grade" />
      <div className="ambient-noise" />
      <div className="site-vignette" />
      <HomeClientExtras />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />
      <main id="main-content" className="overflow-x-clip bg-bg pb-4 pt-14 md:pt-16">
        <Hero />
        <Services />
        <PseNe />
        <TrustedClients />
        <FeaturedWork items={portfolioItems} />
        <BeforeAfter />
        <GlobalCTA />
        <Testimonials items={testimonialItems} />
        <Process />
        <FAQ items={faqItems} />

        {/* CTA pas FAQ */}
        <section className="relative border-b border-white/[0.06] bg-[#080808]/92">
          <div className="section-wrap py-16 md:py-20">
            <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[1.1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,10,10,0.92)_0%,rgba(16,16,16,0.92)_52%,rgba(171,131,57,0.18)_100%)] px-7 py-10 shadow-[0_24px_70px_rgba(0,0,0,0.38)] md:px-12 md:py-14">
              <div
                data-parallax="0.5"
                className="pointer-events-none absolute -inset-y-[12%] inset-x-0 bg-[radial-gradient(circle_at_14%_24%,rgba(255,255,255,0.07),transparent_38%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.16),transparent_44%)]"
              />
              <div className="pointer-events-none absolute -left-14 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-accent/20 blur-2xl" />
              <div className="max-w-[640px]">
                <p className="mb-3 font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.08] text-white">
                  {t("ctaAfterFaq.title")}
                </p>
                <p className="text-[14px] leading-[1.65] text-white/52 md:text-[15px]">
                  {t("ctaAfterFaq.body")}
                </p>
              </div>
              <Link href="/contact" className="interactive-button ip-cta-primary shrink-0">
                {t("ctaAfterFaq.cta")} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Mini Sales Block */}
        <section className="relative border-b border-white/[0.06]">
          <div className="section-wrap py-14 md:py-20 text-center">
            <p className="font-body text-[0.95rem] font-light tracking-[0.04em] text-white/50">
              {t("miniSales.line1")}
            </p>
            <p className="font-display mt-3 text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
              {t("miniSales.line2")}
            </p>
            <Link
              href="/contact"
              className="interactive-button ip-cta-primary ip-cta-primary--lg mt-8 inline-flex"
            >
              {t("miniSales.cta")}
            </Link>
          </div>
        </section>

        <NewsletterSection />

        {/* SEO Boost Line */}
        <div className="border-t border-white/[0.04]">
          <div className="section-wrap py-4">
            <p className="text-center font-body text-[11px] font-light leading-relaxed tracking-[0.04em] text-white/18">
              {t("seoBoostLine")}
            </p>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
