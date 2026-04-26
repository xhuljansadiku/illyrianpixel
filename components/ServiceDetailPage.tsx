import Link from "next/link";
import Image from "next/image";
import type { ServiceItem } from "@/lib/siteContent";
import PageHero from "@/components/PageHero";
import GlobalCTA from "@/components/GlobalCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServiceDetailPage({ service }: { service: ServiceItem }) {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label={`SHËRBIMI • ${service.title.toUpperCase()}`}
          title={`${service.title} që ndërton autoritet dhe rezultat`}
          description={service.short}
          image={`${service.image}?auto=format&fit=crop&w=1600&q=80`}
        />

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap grid gap-6 py-16 md:py-20 lg:grid-cols-2">
          <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-6">
            <p className="text-[11px] tracking-[0.18em] text-accent/88">PROBLEMI</p>
            <p className="mt-3 text-sm leading-relaxed text-white/68">{service.problem}</p>
          </article>
          <article className="rounded-[1rem] border border-accent/35 bg-accent/[0.06] p-6">
            <p className="text-[11px] tracking-[0.18em] text-accent/95">ZGJIDHJA</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{service.solution}</p>
          </article>
        </div>
      </section>

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.3rem)] leading-[0.95]">Çfarë përfshin</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.deliverables.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white/72">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.3rem)] leading-[0.95]">Procesi</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Discovery", "Design & Build", "Launch & Optimize"].map((step) => (
              <article key={step} className="rounded-[1rem] border border-white/10 bg-[#151515] p-5">
                <p className="text-[11px] tracking-[0.16em] text-accent/88">{step.toUpperCase()}</p>
                <p className="mt-3 text-sm text-white/66">
                  Hapat janë të qartë, me feedback të kontrolluar dhe vendime të dokumentuara.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.3rem)] leading-[0.95]">FAQ</h2>
          <div className="mt-6 space-y-3">
            {service.faq.map((item) => (
              <article key={item.q} className="rounded-[0.9rem] border border-white/10 bg-[#151515] p-5">
                <h3 className="text-sm tracking-[0.08em] text-white/86">{item.q}</h3>
                <p className="mt-2 text-sm text-white/65">{item.a}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/services" className="luxury-link">
              Kthehu te të gjitha shërbimet <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <GlobalCTA title="Merr ofertën e duhur për këtë shërbim." />

        <section className="section-wrap !pt-0 pb-20 md:pb-24">
          <div className="relative h-[240px] overflow-hidden rounded-[1rem] border border-white/12">
            <Image
              src={`${service.image}?auto=format&fit=crop&w=1600&q=80`}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-[#0b0b0b]/35" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
