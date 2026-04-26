import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import GlobalCTA from "@/components/GlobalCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata("About", "Illyrian Pixel: filozofi premium, cilësi mbi sasi dhe fokus në rritje reale.");

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label="ABOUT"
          title="Quality over quantity, always."
          description="Illyrian Pixel ekziston për të ndërtuar prezencë që mban çmimin dhe gjeneron besim të qëndrueshëm."
          image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80"
        />
      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1fr]">
          <article>
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.95]">Kush jemi</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Një studio e vogël, e fokusuar te ekzekutimi i kontrolluar: strategji, dizajn dhe teknologji në të njëjtin
              ritëm.
            </p>
          </article>
          <article>
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.95]">Kush nuk jemi</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Nuk jemi për “faqe të shpejta” pa drejtim. Punojmë me biznese që kërkojnë rritje reale dhe standard të lartë.
            </p>
          </article>
        </div>
      </section>
      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.95]">Filozofia</h2>
          <p className="mt-5 max-w-3xl text-[1.04rem] leading-relaxed text-white/72">
            Premium nuk është dekorim. Është qartësi, disiplinë dhe përputhje mes asaj që premton marka dhe asaj që ndjen
            përdoruesi në ekran.
          </p>
        </div>
      </section>
        <GlobalCTA title="Nëse kërkon cilësi dhe qartësi, jemi gati për call." />
      </main>
      <Footer />
    </>
  );
}
