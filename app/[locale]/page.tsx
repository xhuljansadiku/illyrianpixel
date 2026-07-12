import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildMetadata, faqSchema } from "@/lib/seo";
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
const FAQ           = dynamic(() => import("@/components/FAQ"));
const FeaturedWork  = dynamic(() => import("@/components/FeaturedWork"));
const Footer        = dynamic(() => import("@/components/Footer"));
const Process       = dynamic(() => import("@/components/Process"));
const PseNe         = dynamic(() => import("@/components/PseNe"));
const Services      = dynamic(() => import("@/components/Services"));
const Testimonials  = dynamic(() => import("@/components/Testimonials"));
const TrustedClients     = dynamic(() => import("@/components/TrustedClients"));
const NewsletterSection  = dynamic(() => import("@/components/NewsletterSection"));

const BrandSignature    = dynamic(() => import("@/components/BrandSignature"),    { ssr: false });
const EasterEggOverlay  = dynamic(() => import("@/components/EasterEggOverlay"),  { ssr: false });

const META: Record<Locale, { title: string; desc: string; keywords: string[] }> = {
  sq: {
    title: "Web Design & Marketing Premium Shqipëri",
    desc: "Website premium, SEO & marketing dixhital për biznese shqiptare. Konsultim falas, plan konkret brenda 24h. Illyrian Pixel — agjenci dixhitale premium.",
    keywords: [
      "web design shqipëri", "agjenci dixhitale tiranë", "website premium albania",
      "seo shqipëri", "marketing online", "e-commerce albania", "google ads shqipëri",
      "branding biznese", "landing page konvertim", "illyrian pixel"
    ],
  },
  en: {
    title: "Premium Web Design & Marketing Albania",
    desc: "Premium websites, SEO & digital marketing for Albanian businesses. Free consultation, concrete plan within 24h. Illyrian Pixel — premium digital agency.",
    keywords: [
      "web design albania", "digital agency tirana", "premium website albania",
      "seo albania", "online marketing", "e-commerce albania", "google ads albania",
      "business branding", "landing page conversion", "illyrian pixel"
    ],
  },
};

type Props = { params: { locale: Locale } | Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "", m.keywords, locale);
}

// Rifresko çdo 5 min — testimonialet/portofoli menaxhohen nga admini
export const revalidate = 300;

export default async function HomePage() {
  const t = await getTranslations("home");
  const [testimonialRows, portfolioRows, faqRows] = await Promise.all([
    getVisibleTestimonials().catch(() => []),
    getVisiblePortfolioItems().catch(() => []),
    getVisibleFaqs().catch(() => []),
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
      <BrandSignature />
      <EasterEggOverlay />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main id="main-content" className="overflow-x-clip bg-bg pb-4 pt-14 md:pt-16">
        <Hero />
        <Services />
        <PseNe />
        <TrustedClients />
        <FeaturedWork items={portfolioItems} />
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
