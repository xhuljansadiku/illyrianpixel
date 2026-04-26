import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import GlobalCTA from "@/components/GlobalCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const timeline = [
  { title: "1. Discovery", detail: "Qëllimi, audienca, oferta dhe diferencimi." },
  { title: "2. Direction", detail: "Arkitekturë, mesazh dhe hierarchy që vendos ritmin." },
  { title: "3. Design & Build", detail: "UI premium, implementim performant dhe QA." },
  { title: "4. Launch", detail: "Deploy i kontrolluar me checklist dhe monitorim." },
  { title: "5. Optimize", detail: "Përmirësime mbi sjelljen reale të përdoruesve." }
];

export const metadata = buildMetadata("Process", "Proces i qartë nga kontakti i parë te launch dhe optimizimi.");

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label="PROCESS"
          title="Një proces i qartë, pa surpriza."
          description="Çdo hap ka output, afat dhe përgjegjësi të qarta për të dy palët."
          image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
        />
      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <div className="grid gap-4 md:grid-cols-2">
            {timeline.map((item) => (
              <article key={item.title} className="rounded-[1rem] border border-white/10 bg-[#151515] p-5">
                <h2 className="font-display text-3xl leading-[0.95]">{item.title}</h2>
                <p className="mt-3 text-sm text-white/64">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap py-16 md:py-20">
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.95]">Përgjegjësi të përbashkëta</h2>
          <ul className="mt-6 space-y-2 text-sm text-white/66">
            <li>• Ne sjellim strategjinë, strukturën dhe ekzekutimin teknik.</li>
            <li>• Ju sillni feedback të qartë dhe vendime në kohë.</li>
            <li>• Komunikimi është transparent në çdo milestone.</li>
          </ul>
        </div>
      </section>
        <GlobalCTA title="Rezervo call dhe merr timeline-in e projektit tënd." />
      </main>
      <Footer />
    </>
  );
}
