import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicePackageCard from "@/components/ServicePackageCard";
import { ADS_MONTHLY, euro } from "@/lib/seoAdsPricing";
import type { ServicePackage } from "@/lib/serviceCategories";
import { buildMetadata } from "@/lib/seo";
import FAQ from "@/components/FAQ";
import ServiceHeroImage from "@/components/ServiceHeroImage";
import { getGoogleAdsFaqs } from "@/lib/serviceFaqs";

type Props = { params: Promise<{ locale: string }> };

const META: Record<Locale, { title: string; desc: string }> = {
  sq: {
    title: "Google Ads për Biznese Shqiptare — Reklama me ROI Real",
    desc: "Reklama Google Ads që sjellin klientë, jo vetëm klikime. Setup, optimizim dhe raportim transparent për bizneset shqiptare.",
  },
  en: {
    title: "Google Ads for Albanian Businesses — Ads with Real ROI",
    desc: "Google Ads that bring in clients, not just clicks. Setup, optimization and transparent reporting for Albanian businesses.",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.desc, "/services/google-ads", undefined, locale as Locale);
}

const CONTENT: Record<Locale, {
  badge: string;
  h1: [string, string];
  subtitle: React.ReactNode;
  ctaPrimary: string;
  ctaSecondary: string;
  trustLine: string;
  seeAlso: string;
  seeAlsoSeo: string;
  seeAlsoBoth: string;
  howItWorksEyebrow: string;
  howItWorks: { eyebrow: string; title: string; body: React.ReactNode }[];
  packagesEyebrow: string;
  packagesTitle: string;
  packagesSubtitle: string;
  packagesNote: string;
  backLink: string;
  packages: ServicePackage[];
}> = {
  sq: {
    badge: "GOOGLE ADS · MARKETING",
    h1: ["Google Ads që sjell klientë,", "jo vetëm klikime."],
    subtitle: (
      <>Ne menaxhojmë fushatat.<br className="hidden md:block" /> Ju paguani buxhetin e reklamave drejtpërdrejt tek Google.</>
    ),
    ctaPrimary: "Merr ofertë falas",
    ctaSecondary: "Të gjitha paketat",
    trustLine: "Raport i qartë çdo muaj",
    seeAlso: "Shiko edhe:",
    seeAlsoSeo: "SEO",
    seeAlsoBoth: "SEO & Google Ads",
    howItWorksEyebrow: "Si funksionon",
    howItWorks: [
      {
        eyebrow: "Tarifa jonë",
        title: "Tarifë menaxhimi",
        body: "Çmimi i paketës = tarifa jonë për setup, optimizim dhe raportim.",
      },
      {
        eyebrow: "Buxheti i reklamave",
        title: "Paguhet nga ju",
        body: "Buxhetin e Google Ads e kontrolloni dhe paguani vetë, direkt tek Google.",
      },
      {
        eyebrow: "Transparencë totale",
        title: "Çdo euro nën kontroll",
        body: <>Shihni saktësisht ku shkon çdo euro.<br className="hidden md:block" /> Raport i qartë çdo muaj, çdo 2 javë ose çdo javë, sipas paketës.</>,
      },
    ],
    packagesEyebrow: "TARIFA MENAXHIMI",
    packagesTitle: "Zgjidhni nivelin e duhur",
    packagesSubtitle: "Buxheti i reklamave nuk përfshihet, paguhet nga ju direkt tek Google.",
    packagesNote: "Çmimet pa TVSH · Buxheti i reklamave paguhet te Google",
    backLink: "← Kthehu te të gjitha paketat",
    packages: [
      {
        name: "Starter",
        price: euro(ADS_MONTHLY.starter),
        priceNote: "/ muaj",
        tagline: "Reklamat e para me rezultat real",
        ideal: "Fushata juaj e parë, gati shpejt.",
        features: [
          "Ngritja e Google Ads në kërkim",
          "1 fushatë aktive",
          "Targetim lokal i saktë",
          "Matje e kërkesave dhe thirrjeve",
          "Raport mujor i qartë",
        ],
        cta: "Merr ofertë falas",
      },
      {
        name: "Growth",
        price: euro(ADS_MONTHLY.growth),
        priceNote: "/ muaj",
        tagline: "Më shumë klientë, buxhet nën kontroll",
        ideal: "2–3 fushata të optimizuara çdo javë.\nRemarketing që i rikthen vizitorët si klientë.",
        features: [
          "2–3 fushata aktive (Search + Display)",
          "Remarketing që rikthen vizitorët",
          "Ulje e kostos për klient çdo javë",
          "Targetim i avancuar",
          "Raport çdo 2 javë + takim çdo muaj",
        ],
        featured: true,
        cta: "Merr ofertë falas",
      },
      {
        name: "Pro",
        price: euro(ADS_MONTHLY.pro),
        priceNote: "/ muaj",
        tagline: "Sistem i plotë Google Ads",
        ideal: "Të gjitha formatet e Google, të matura me të dhëna reale.",
        features: [
          "Search + Display + YouTube Ads",
          "Shopping Ads (për e-commerce)",
          "Testim i reklamave (A/B)",
          "Optimizim i vazhdueshëm i fushatave",
          "Raport çdo javë + 2 takime në muaj",
        ],
        cta: "Merr ofertë falas",
      },
    ],
  },
  en: {
    badge: "GOOGLE ADS · MARKETING",
    h1: ["Ads that bring in clients,", "not just clicks"],
    subtitle: (
      <>We manage the campaigns.<br className="hidden md:block" /> You pay the ad budget directly to Google.</>
    ),
    ctaPrimary: "Get a free quote",
    ctaSecondary: "All packages",
    trustLine: "Reply within 24 hours",
    seeAlso: "See also:",
    seeAlsoSeo: "SEO",
    seeAlsoBoth: "SEO & Google Ads",
    howItWorksEyebrow: "How it works",
    howItWorks: [
      {
        eyebrow: "Our fee",
        title: "Management fee",
        body: "The package price = our fee for setup, optimization and reporting.",
      },
      {
        eyebrow: "Ad budget",
        title: "Paid by you",
        body: "You control and pay the Google Ads budget yourself, directly to Google.",
      },
      {
        eyebrow: "Full transparency",
        title: "Every euro accounted for",
        body: <>See exactly where every euro goes.<br className="hidden md:block" /> A clear report monthly, every 2 weeks or weekly, depending on the plan.</>,
      },
    ],
    packagesEyebrow: "MANAGEMENT FEE",
    packagesTitle: "Choose the right level",
    packagesSubtitle: "The ad budget isn't included — you pay it directly to Google.",
    packagesNote: "The prices above are the management fee, excluding VAT · The ad budget is paid by the client directly to Google",
    backLink: "← Back to all packages",
    packages: [
      {
        name: "Starter",
        price: euro(ADS_MONTHLY.starter),
        priceNote: "/ month",
        tagline: "Your first ads with real results",
        ideal: "Full setup and an active campaign.\nClients find you when they search for your service.",
        features: [
          "Google Ads (Search) setup",
          "1 active campaign",
          "Precise local targeting",
          "Conversion tracking",
          "Clear monthly report",
        ],
        cta: "Get a free quote",
      },
      {
        name: "Growth",
        price: euro(ADS_MONTHLY.growth),
        priceNote: "/ month",
        tagline: "More clients, budget under control",
        ideal: "2–3 campaigns optimized every week.\nRemarketing that turns visitors back into clients.",
        features: [
          "2–3 active campaigns (Search + Display)",
          "Remarketing configured",
          "Weekly CPA / ROAS optimization",
          "Advanced audiences & targeting",
          "Bi-weekly report + monthly call",
        ],
        featured: true,
        cta: "Get a free quote",
      },
      {
        name: "Pro",
        price: euro(ADS_MONTHLY.pro),
        priceNote: "/ month",
        tagline: "A complete Google Ads system",
        ideal: "Every format, A/B testing and funnel strategy. Every campaign is measured and improved with real data.",
        features: [
          "Search + Display + YouTube Ads",
          "Shopping Ads (for e-commerce)",
          "Ad A/B testing",
          "Ongoing funnel optimization",
          "Weekly report + 2 monthly calls",
        ],
        cta: "Get a free quote",
      },
    ],
  },
};

export default async function GoogleAdsPage(props: Props) {
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
          <div className="section-wrap relative z-[2] py-28 md:py-36 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
            <div>
            <p className="ip-eyebrow">{c.badge}</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              {c.h1[0]}{" "}
              <br />
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
              <Link href="/services/seo" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                {c.seeAlsoSeo} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/cmimet?kategori=seo-google-ads" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                {c.seeAlsoBoth} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            </div>
            <ServiceHeroImage src="/images/services/google-ads-hero-v1.avif" alt={locale === "en" ? "Google Ads dashboard with CTR, cost per conversion and Quality Score" : "Panel i Google Ads me CTR, koston për konvertim dhe Quality Score"} />
          </div>
        </section>

        {/* Text audit 2 (2026-11-02): kutitë "Tarifa jonë / Buxheti / Transparencë" hequr — buxheti thuhet te nëntitulli, shënimi dhe FAQ
        <section className="relative z-[1] border-b border-white/[0.06]">
          <div className="section-wrap py-12 md:py-16">
            <div className="grid gap-4 sm:grid-cols-3">
              {c.howItWorks.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/60">{item.eyebrow}</p>
                  <p className="mt-2 font-display text-[1.1rem] font-medium text-white">{item.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* Packages */}
        <section className="relative z-[1]">
          <div className="section-wrap py-20 md:py-28">
            <p className="ip-eyebrow">{c.packagesEyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.06] tracking-[-0.02em] text-white">
              {c.packagesTitle}
            </h2>
            {/* Text audit 2 (2026-11-02): packagesSubtitle hequr (përsëriste buxhetin)
            <p className="mt-2 text-[13px] text-white/40">
              {c.packagesSubtitle}
            </p>
            */}
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
        <FAQ items={getGoogleAdsFaqs(c, locale as Locale)} />

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
