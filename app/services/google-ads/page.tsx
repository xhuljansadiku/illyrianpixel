import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicePackageCard from "@/components/ServicePackageCard";
import type { ServicePackage } from "@/lib/serviceCategories";

export const metadata: Metadata = {
  title: "Google Ads për Biznese Shqiptare — Reklama me ROI Real",
  description: "Reklama Google Ads që sjellin klientë, jo vetëm klikime. Setup, optimizim dhe raportim transparent për bizneset shqiptare.",
};

const packages: ServicePackage[] = [
  {
    name: "Starter",
    price: "€120",
    priceNote: "/ muaj",
    tagline: "Reklamat e para me rezultat real",
    ideal: "Setup i plotë dhe fushatë aktive. Klientët ju gjejnë kur kërkojnë shërbimin tuaj.",
    features: [
      "Setup Google Ads (Search)",
      "1 fushatë aktive",
      "Targetim lokal i saktë",
      "Tracking konvertimesh",
      "Raport mujor i qartë",
    ],
    notIncluded: [
      "Remarketing",
      "Display & YouTube Ads",
    ],
    cta: "Fillo projektin",
  },
  {
    name: "Growth",
    price: "€250",
    priceNote: "/ muaj",
    tagline: "Më shumë klientë, buxhet nën kontroll",
    ideal: "2–3 fushata të optimizuara çdo javë. Remarketing që rikthejnë vizitorët si klientë.",
    features: [
      "2–3 fushata aktive (Search + Display)",
      "Remarketing i konfiguruar",
      "Optimizim javor CPA / ROAS",
      "Audienca & targetim i avancuar",
      "Raport 2-javësh + call mujor",
    ],
    notIncluded: [
      "YouTube Ads",
      "Shopping Ads",
    ],
    featured: true,
    cta: "Fillo projektin",
  },
  {
    name: "Pro",
    price: "€400",
    priceNote: "/ muaj",
    tagline: "Sistem i plotë Google Ads",
    ideal: "Të gjitha formatet, A/B testing dhe strategji funnel. Dominoni Google para konkurrencës.",
    features: [
      "Search + Display + YouTube Ads",
      "Shopping Ads (për e-commerce)",
      "A/B testing i reklamave",
      "Optimizim i vazhdueshëm funnel",
      "Raport javor + 2 call mujore",
    ],
    cta: "Fillo projektin",
  },
];

export default function GoogleAdsPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg pb-24 pt-14 text-text md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        {/* Hero */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div className="section-wrap relative z-[2] py-28 md:py-36">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">GOOGLE ADS · MARKETING</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              Reklama që sjellin klientë,{" "}
              <span className="text-accent">jo vetëm klikime</span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[1.05rem] leading-[1.6] text-white/60">
              Ne menaxhojmë fushatat. Ju paguani buxhetin e reklamave drejtpërdrejt tek Google.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="interactive-button ip-cta-primary inline-flex h-11 items-center gap-2 !px-7 !text-[15px] !font-medium !text-[#0e0d0c]">
                Konsultim falas →
              </Link>
              <Link href="/cmimet" className="luxury-link !text-[15px]">
                Të gjitha paketat <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-white/40">Konsultim falas · Pa detyrim · Rezultate të matshme</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/28">Shiko edhe:</p>
              <Link href="/services/seo" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                SEO <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/cmimet" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                Marketing & Growth <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative z-[1] border-b border-white/[0.06]">
          <div className="section-wrap py-12 md:py-16">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/60">Tarifa jonë</p>
                <p className="mt-2 font-display text-[1.1rem] font-medium text-white">Fee menaxhimi</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
                  Çmimi i paketës = tarifa jonë për setup, optimizim dhe raportim.
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/60">Buxheti i reklamave</p>
                <p className="mt-2 font-display text-[1.1rem] font-medium text-white">Paguhet nga ju</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
                  Buxhetin e Google Ads e kontrolloni dhe paguani vetë, direkt tek Google.
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/60">Transparencë totale</p>
                <p className="mt-2 font-display text-[1.1rem] font-medium text-white">Çdo euro nën kontroll</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
                  Shihni saktësisht ku shkon çdo euro. Raport i qartë çdo javë ose 2 javë.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="relative z-[1]">
          <div className="section-wrap py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">TARIFA MENAXHIMI</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.06] tracking-[-0.02em] text-white">
              Zgjidhni nivelin e duhur
            </h2>
            <p className="mt-2 text-[13px] text-white/40">
              Buxheti i reklamave nuk përfshihet — paguhet nga ju direkt tek Google.
            </p>
            <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
              {packages.map((pkg) => (
                <ServicePackageCard key={pkg.name} pkg={pkg} />
              ))}
            </div>
            <p className="mt-8 text-center text-[11px] text-white/28">
              Çmimet e mësipërme janë tarifa menaxhimi pa TVSH · Buxheti i reklamave paguhet nga klienti direkt tek Google
            </p>
          </div>
        </section>

        {/* Back link */}
        <div className="section-wrap !pt-0">
          <Link href="/cmimet" className="luxury-link text-[12px]">
            ← Kthehu te të gjitha paketat
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
