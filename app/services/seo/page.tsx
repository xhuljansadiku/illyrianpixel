import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicePackageCard from "@/components/ServicePackageCard";
import type { ServicePackage } from "@/lib/serviceCategories";

export const metadata: Metadata = {
  title: "SEO për Biznese Shqiptare — Pozicionim në Google",
  description: "SEO strategjik që ju sjell klientë organikë nga Google. Keywords, on-page dhe link building për bizneset shqiptare.",
};

const packages: ServicePackage[] = [
  {
    name: "Basic",
    price: "€99",
    priceNote: "/ muaj",
    tagline: "Fillon pozicionimin në Google",
    ideal: "Optimizimi i parë i saktë. Faqja juaj fillon të gjendet nga klientët e duhur.",
    features: [
      "Research 10–15 keywords kyçe",
      "Optimizim on-page (title, meta, H1)",
      "Google Search Console setup",
      "Struktura URL + internal links",
      "Raport mujor i pozicioneve",
    ],
    notIncluded: [
      "Link building",
      "SEO teknik i avancuar",
    ],
    cta: "Merr ofertë",
  },
  {
    name: "Growth",
    price: "€199",
    priceNote: "/ muaj",
    tagline: "Rritje organike e qëndrueshme",
    ideal: "Keywords të shumta, link building dhe SEO teknik. Pozicion që rritet çdo muaj.",
    features: [
      "Keywords 20–30 + analiza konkurrencës",
      "Link building bazë (5–10 backlinks/muaj)",
      "SEO teknik (shpejtësi, schema, sitemap)",
      "Core Web Vitals optimization",
      "Raport 2-javësh i detajuar",
    ],
    notIncluded: [
      "Content writing",
    ],
    featured: true,
    cta: "Merr ofertë",
  },
  {
    name: "Pro",
    price: "€299",
    priceNote: "/ muaj",
    tagline: "Autoritet dhe dominim organik",
    ideal: "Sistem SEO i plotë. Shkallëzim, autoritet domeni dhe rezultate afatgjata.",
    features: [
      "Keywords të pakufizuara",
      "Link building i avancuar (15–20/muaj)",
      "SEO lokal + ndërkombëtar",
      "Content optimization mujore",
      "Call strategjik mujor",
    ],
    cta: "Merr ofertë",
  },
];

export default function SeoPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-bg pb-24 pt-14 text-text md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_10%,rgba(171,131,57,0.09),transparent_30%)]" />

        {/* Hero */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div className="section-wrap relative z-[2] py-28 md:py-36">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">SEO · MARKETING</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              SEO që ju sjell klientë{" "}
              <span className="text-accent">nga Google</span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[1.05rem] leading-[1.6] text-white/60">
              Pozicionim organik i qëndrueshëm. Klientët ju gjejnë kur kërkojnë shërbimin tuaj.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="interactive-button ip-cta-primary inline-flex h-11 items-center gap-2 !px-7 !text-[15px] !font-medium !text-[#0e0d0c]">
                Konsultim falas →
              </Link>
              <Link href="/cmimet" className="luxury-link !text-[15px]">
                Të gjitha paketat <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-white/40">Konsultim falas · Pa detyrim · Rezultate brenda 90 ditëve</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/28">Shiko edhe:</p>
              <Link href="/services/google-ads" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                Google Ads <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/cmimet?tab=marketing-growth" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[12px] text-white/50 transition-all duration-300 hover:border-accent/35 hover:text-white">
                Marketing & Growth <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="relative z-[1]">
          <div className="section-wrap py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">PAKETAT</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.06] tracking-[-0.02em] text-white">
              Zgjidhni nivelin e duhur
            </h2>
            <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
              {packages.map((pkg) => (
                <ServicePackageCard key={pkg.name} pkg={pkg} />
              ))}
            </div>
            <p className="mt-8 text-center text-[11px] text-white/28">
              Të gjitha çmimet janë pa TVSH · Konsultimi fillestar është gjithmonë falas
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
