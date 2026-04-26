import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import GlobalCTA from "@/components/GlobalCTA";
import TestimonialBlock from "@/components/TestimonialBlock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata(
  "Shërbimet",
  "Website, e-commerce, marketing, SEO dhe branding për biznese që kërkojnë rritje reale."
);

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label="SERVICES"
          title="Shërbime të lidhura në një sistem të vetëm rritjeje."
          description="Jo module të shkëputura: strategji, dizajn dhe ekzekutim në të njëjtin ritëm."
          image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
        />

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[0.95]">Çfarë bëjmë</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {servicesData.map((service) => (
              <ServiceCard key={service.slug} title={service.title} description={service.short} href={`/services/${service.slug}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[0.95]">Cila paketë për kë?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-5">
              <p className="text-[11px] tracking-[0.16em] text-accent/85">STARTER</p>
              <p className="mt-2 text-sm text-white/65">Biznese që duan bazë të pastër dhe prezencë serioze.</p>
            </article>
            <article className="rounded-[1rem] border border-accent/40 bg-accent/[0.06] p-5">
              <p className="text-[11px] tracking-[0.16em] text-accent/95">GROWTH</p>
              <p className="mt-2 text-sm text-white/72">Biznese që duan website + kërkesë të qëndrueshme.</p>
            </article>
            <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-5">
              <p className="text-[11px] tracking-[0.16em] text-accent/85">PREMIUM</p>
              <p className="mt-2 text-sm text-white/65">Marka që kërkojnë sistem të plotë dhe autoritet në treg.</p>
            </article>
          </div>
        </div>
      </section>

        <TestimonialBlock />
        <GlobalCTA title="Merr drejtim të qartë për shërbimin e duhur." />
      </main>
      <Footer />
    </>
  );
}
