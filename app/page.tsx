import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { faqSchema } from "@/lib/seo";
import FAQ from "@/components/FAQ";
import FeaturedWork from "@/components/FeaturedWork";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Process from "@/components/Process";
import SectionAura from "@/components/SectionAura";
import PseNe from "@/components/PseNe";
import Services from "@/components/Services";
import TrustedClients from "@/components/TrustedClients";
import Testimonials from "@/components/Testimonials";

const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });
const BrandSignature = dynamic(() => import("@/components/BrandSignature"), { ssr: false });
const CursorTrail = dynamic(() => import("@/components/CursorTrail"), { ssr: false });
const CursorSpotlight = dynamic(() => import("@/components/CursorSpotlight"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const EasterEggOverlay = dynamic(() => import("@/components/EasterEggOverlay"), { ssr: false });
const PageTransitionOverlay = dynamic(() => import("@/components/PageTransitionOverlay"), { ssr: false });
const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const SocialProofToasts = dynamic(() => import("@/components/SocialProofToasts"), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });

export const metadata: Metadata = {
  title: "Illyrian Pixel, Agjenci Ueb Dizajni Luksoz & Marketing Premium",
  description:
    "Ndërtojmë website premium, landing page që konvertojnë dhe marketing strategjik për biznese ambicioze. Konsultim falas · Plan brenda 24h · Illyrian Pixel."
};

export default function HomePage() {
  return (
    <>
      <SectionAura />
      <Preloader />
      <PageTransitionOverlay />
      <Navbar />
      <ScrollProgress />
      <div className="site-grade" />
      <div className="ambient-noise" />
      <div className="site-vignette" />
      <BrandSignature />
      <CustomCursor />
      <CursorSpotlight />
      <CursorTrail />
      <EasterEggOverlay />
      <SocialProofToasts />
      <WhatsAppButton />
      <BackToTop />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="overflow-x-clip bg-bg pb-4 pt-14 md:pt-16">
        <Hero />
        <Services />
        <PseNe />
        <TrustedClients />
        <FeaturedWork />
        <Testimonials />
        <Process />
        <FAQ />

        {/* CTA pas FAQ */}
        <section className="relative border-b border-white/[0.06] bg-[#080808]">
          <div className="section-wrap py-16 md:py-20">
            <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[1.1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,10,10,0.98)_0%,rgba(16,16,16,0.98)_52%,rgba(171,131,57,0.16)_100%)] px-7 py-10 shadow-[0_24px_70px_rgba(0,0,0,0.38)] md:px-12 md:py-14">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_24%,rgba(255,255,255,0.07),transparent_38%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.16),transparent_44%)]" />
              <div className="pointer-events-none absolute -left-14 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-accent/20 blur-2xl" />
              <div className="max-w-[640px]">
                <p className="mb-3 font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.08] text-white">
                  {"Gati për më shumë klientë?"}
                </p>
                <p className="text-[14px] leading-[1.65] text-white/52 md:text-[15px]">
                  {"Rezervo një konsultë falas dhe fillojmë me një plan të qartë."}
                </p>
              </div>
              <Link href="/contact" className="interactive-button ip-cta-primary shrink-0">
                {"Rezervo konsultë"} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Mini Sales Block */}
        <section className="relative border-b border-white/[0.06]">
          <div className="section-wrap py-14 md:py-20 text-center">
            <p className="font-body text-[0.95rem] font-light tracking-[0.04em] text-white/50">
              Klientët tuaj të ardhshëm po ju kërkojnë tani në Google.
            </p>
            <p className="font-display mt-3 text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
              A po ju gjejnë?
            </p>
            <Link
              href="/contact"
              className="interactive-button ip-cta-primary ip-cta-primary--lg mt-8 inline-flex"
            >
              Rezervo konsultë
            </Link>
          </div>
        </section>

        {/* SEO Boost Line */}
        <div className="border-t border-white/[0.04]">
          <div className="section-wrap py-4">
            <p className="text-center font-body text-[11px] font-light leading-relaxed tracking-[0.04em] text-white/18">
              {"Agjensi digjitale për biznese Shqiptare Website, E-Commerce, SEO, Google Ads, Branding dhe Social Media Marketing për tregun vendor dhe diasporën."}
            </p>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
