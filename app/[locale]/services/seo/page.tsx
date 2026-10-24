import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicePackageCard from "@/components/ServicePackageCard";
import { SEO_MONTHLY, euro } from "@/lib/seoAdsPricing";
import type { ServicePackage } from "@/lib/serviceCategories";
import { buildMetadata } from "@/lib/seo";
import FAQ from "@/components/FAQ";
import { getSeoFaqs } from "@/lib/serviceFaqs";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; desc: string }> = {
  sq: {
    title: "SEO për Biznese Shqiptare — Pozicionim në Google",
    desc: "SEO strategjik që ju sjell klientë organikë nga Google. Keywords, on-page dhe link building për bizneset shqiptare.",
  },
  en: {
    title: "SEO for Albanian Businesses — Google Ranking",
    desc: "Strategic SEO that brings you organic clients from Google. Keywords, on-page and link building for Albanian businesses.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.desc, "/services/seo", undefined, locale as Locale);
}

const CONTENT: Record<Locale, {
  badge: string;
  h1: [string, string];
  subtitle: React.ReactNode;
  ctaPrimary: string;
  ctaSecondary: string;
  trustLine: string;
  seeAlso: string;
  seeAlsoGoogleAds: string;
  seeAlsoBoth: string;
  packagesEyebrow: string;
  packagesTitle: string;
  packagesNote: string;
  backLink: string;
  packages: ServicePackage[];
}> = {
  sq: {
    badge: "SEO · MARKETING",
    h1: ["SEO që ju sjell klientë", "nga Google"],
    subtitle: (
      <>Pozicionim organik i qëndrueshëm.<br className="hidden md:block" /> Klientët ju gjejnë kur kërkojnë shërbimin tuaj.</>
    ),
    ctaPrimary: "Konsultim falas →",
    ctaSecondary: "Të gjitha paketat",
    trustLine: "Konsultim falas · Pa detyrim · Raport progresi çdo muaj",
    seeAlso: "Shiko edhe:",
    seeAlsoGoogleAds: "Google Ads",
    seeAlsoBoth: "SEO & Google Ads",
    packagesEyebrow: "PAKETAT",
    packagesTitle: "Zgjidhni nivelin e duhur",
    packagesNote: "Të gjitha çmimet janë pa TVSH · Konsultimi fillestar është gjithmonë falas",
    backLink: "← Kthehu te të gjitha paketat",
    packages: [
      {
        name: "Basic",
        price: euro(SEO_MONTHLY.starter),
        priceNote: "/ muaj",
        tagline: "Fillon pozicionimin në Google",
        ideal: "Optimizimi i parë i saktë.\nFaqja juaj fillon të gjendet nga klientët e duhur.",
        features: [
          "Research 10–15 keywords kyçe",
          "Optimizim on-page (title, meta, H1)",
          "Google Search Console setup",
          "Struktura URL + internal links",
          "Raport mujor i pozicioneve",
        ],
        cta: "Merr ofertë",
      },
      {
        name: "Growth",
        price: euro(SEO_MONTHLY.growth),
        priceNote: "/ muaj",
        tagline: "Rritje organike e qëndrueshme",
        ideal: "Keywords të shumta, link building dhe SEO teknik. Punë e vazhdueshme për pozicion më të mirë.",
        features: [
          "Keywords 20–30 + analiza konkurrencës",
          // Q-10 (2026-10-22): s'ofrohet si numër fiks në muaj
          // "Link building bazë (5–10 backlinks/muaj)",
          "Regjistrim në direktori dhe lista lokale të besueshme",
          "SEO teknik (shpejtësi, schema, sitemap)",
          "Core Web Vitals optimization",
          "Raport 2-javësh i detajuar",
        ],
        featured: true,
        cta: "Merr ofertë",
      },
      {
        name: "Pro",
        price: euro(SEO_MONTHLY.pro),
        priceNote: "/ muaj",
        tagline: "Autoritet dhe rritje organike afatgjatë",
        ideal: "Sistem SEO i plotë.\nShkallëzim, autoritet domeni dhe rezultate afatgjata.",
        features: [
          "Keywords të pakufizuara",
          // Q-10 (2026-10-22): s'ofrohet si numër fiks në muaj
          // "Link building i avancuar (15–20/muaj)",
          "Lidhje nga partnerë dhe media lokale, sipas mundësive",
          "SEO lokal + ndërkombëtar",
          "Content optimization mujore",
          "Call strategjik mujor",
        ],
        cta: "Merr ofertë",
      },
    ],
  },
  en: {
    badge: "SEO · MARKETING",
    h1: ["SEO that brings you clients", "from Google"],
    subtitle: (
      <>Sustainable organic ranking.<br className="hidden md:block" /> Clients find you when they search for your service.</>
    ),
    ctaPrimary: "Free consultation →",
    ctaSecondary: "All packages",
    trustLine: "Free consultation · No obligation · Monthly progress report",
    seeAlso: "See also:",
    seeAlsoGoogleAds: "Google Ads",
    seeAlsoBoth: "SEO & Google Ads",
    packagesEyebrow: "PACKAGES",
    packagesTitle: "Choose the right level",
    packagesNote: "All prices exclude VAT · The initial consultation is always free",
    backLink: "← Back to all packages",
    packages: [
      {
        name: "Basic",
        price: euro(SEO_MONTHLY.starter),
        priceNote: "/ month",
        tagline: "Starts your Google ranking",
        ideal: "The first proper optimization.\nYour site starts getting found by the right clients.",
        features: [
          "Research on 10–15 key keywords",
          "On-page optimization (title, meta, H1)",
          "Google Search Console setup",
          "URL structure + internal links",
          "Monthly ranking report",
        ],
        cta: "Get a quote",
      },
      {
        name: "Growth",
        price: euro(SEO_MONTHLY.growth),
        priceNote: "/ month",
        tagline: "Sustainable organic growth",
        ideal: "Multiple keywords, link building and technical SEO. Ongoing work towards a better ranking.",
        features: [
          "20–30 keywords + competitor analysis",
          // Q-10 (2026-10-22): not offered as a fixed monthly number
          // "Base link building (5–10 backlinks/month)",
          "Listings in trusted local directories",
          "Technical SEO (speed, schema, sitemap)",
          "Core Web Vitals optimization",
          "Detailed bi-weekly report",
        ],
        featured: true,
        cta: "Get a quote",
      },
      {
        name: "Pro",
        price: euro(SEO_MONTHLY.pro),
        priceNote: "/ month",
        tagline: "Authority and long-term organic growth",
        ideal: "A complete SEO system.\nScaling, domain authority and long-term results.",
        features: [
          "Unlimited keywords",
          // Q-10 (2026-10-22): not offered as a fixed monthly number
          // "Advanced link building (15–20/month)",
          "Links from partners and local media, where possible",
          "Local + international SEO",
          "Monthly content optimization",
          "Monthly strategy call",
        ],
        cta: "Get a quote",
      },
    ],
  },
};

export default async function SeoPage(props: Props) {
  const { locale } = await props.params;
  const c = CONTENT[locale as Locale] ?? CONTENT.sq;

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative overflow-hidden bg-bg pb-24 pt-14 text-text md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        {/* Hero */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-bgDeep">
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />
          <div className="section-wrap relative z-[2] py-28 md:py-36">
            <p className="ip-eyebrow">{c.badge}</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              {c.h1[0]}{" "}
              <span className="text-accent">{c.h1[1]}</span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[1.05rem] leading-[1.6] text-white/60">
              {c.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="interactive-button ip-cta-primary inline-flex items-center gap-2 ">
                {c.ctaPrimary}
              </Link>
              <Link href="/cmimet" className="luxury-link !text-[15px]">
                {c.ctaSecondary} <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-white/40">{c.trustLine}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/28">{c.seeAlso}</p>
              <Link href="/services/google-ads" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                {c.seeAlsoGoogleAds} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/cmimet?kategori=seo-google-ads" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                {c.seeAlsoBoth} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="relative z-[1]">
          <div className="section-wrap py-20 md:py-28">
            <p className="ip-eyebrow">{c.packagesEyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.06] tracking-[-0.02em] text-white">
              {c.packagesTitle}
            </h2>
            <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
              {c.packages.map((pkg) => (
                <ServicePackageCard key={pkg.name} pkg={pkg} />
              ))}
            </div>
            <p className="mt-8 text-center text-[11px] text-white/28">
              {c.packagesNote}
            </p>
          </div>
        </section>

        {/* FAQ (lib/serviceFaqs) — me skemë FAQPage */}
        <FAQ items={getSeoFaqs(c, locale as Locale)} />

        {/* Back link */}
        <div className="section-wrap !pt-0">
          <Link href="/cmimet" className="luxury-link text-[12px]">
            {c.backLink}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
