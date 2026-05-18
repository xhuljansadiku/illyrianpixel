import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import GlobalCTA from "@/components/GlobalCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata(
  "Rreth Illyrian Pixel — Studio e Fokusuar, Jo Agjenci e Madhe",
  "Illyrian Pixel është një studio e specializuar dixhitale. Çdo projekt trajtohet direkt nga eksperti — pa account manager, pa junior, pa kompromis cilësie.",
  "/about"
);

const values = [
  {
    label: "Qartësi mbi gjithçka",
    body: "Çdo vendim dizajni ose strategjik ka arsye. Nuk bëjmë gjëra sepse duken mirë — i bëjmë sepse funksionojnë."
  },
  {
    label: "Ekzekutim, jo promesa",
    body: "Shumë agjenci premtojnë rezultate. Ne tregojmë procesin, afatet dhe çfarë ndodh hap pas hapi para se të fillojmë."
  },
  {
    label: "Pak projekte, punë e plotë",
    body: "Nuk pranojmë dhjetë projekte njëkohësisht. Kur punojmë me ju, jeni prioriteti — jo njëri nga shumë klientë."
  },
  {
    label: "Standard i lartë ose asgjë",
    body: "Nëse kërkesa juaj nuk përshtatet me atë që bëjmë mirë, jua themi hapur. Nuk marrim çdo projekt vetëm për të faturuar."
  }
];

const expertise = [
  { icon: "◈", label: "Website & Landing Pages", detail: "Faqe që konvertojnë — jo vetëm faqe të bukura." },
  { icon: "◈", label: "E-Commerce", detail: "Dyqane online me checkout të optimizuar dhe analitikë shitjesh." },
  { icon: "◉", label: "SEO & Google Ads", detail: "Trafik organik dhe fushata me ROI të matshëm." },
  { icon: "◆", label: "Branding & Identitet Vizual", detail: "Logo, ngjyra dhe ton që ndërtojnë besim të menjëhershëm." },
  { icon: "◉", label: "Social Media Marketing", detail: "Content dhe menaxhim i plotë për Instagram, Facebook dhe TikTok." },
  { icon: "◈", label: "Mirëmbajtje & Optimizim", detail: "Faqja juaj mbetet e shpejtë, e sigurt dhe e përditësuar." }
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label="RRETH NESH"
          title="Një ekspert. Jo dhjetë juniora."
          description="Kur punoni me Illyrian Pixel, flisni direkt me personin që ndërton projektin tuaj — nga strategjia deri te lansimi."
          image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80"
        />

        {/* Studio intro */}
        <section className="border-t border-white/10">
          <div className="section-wrap grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">Kush jam</p>
              <h2 className="font-display mt-4 text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.0]">
                Studio e specializuar,<br />jo agjenci e madhe.
              </h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-white/68">
                Illyrian Pixel është një studio e vetme — e fokusuar tërësisht te dizajni dixhital dhe rezultatet e matshme. Nuk ka ekip të gjerë, nuk ka account manager që i kalon mesazhet tutje. Ju flisni direkt me personin që di çdo detaj të projektit tuaj.
              </p>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-white/68">
                Kjo do të thotë komunikim i drejtpërdrejtë, vendime të shpejta dhe kujdes real për çdo projekt — jo vetëm për projektet e mëdha.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">Kush nuk jam</p>
              <h2 className="font-display mt-4 text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.0]">
                Pa premtime boshe,<br />pa faqe &quot;të shpejta&quot;.
              </h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-white/68">
                Nuk ofroj &quot;faqe brenda 3 ditësh&quot; ose &quot;SEO nr.1 në Google brenda një jave&quot;. Këto janë premtime boshe që shesin iluzion, jo rezultate.
              </p>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-white/68">
                Punojmë me biznese që kuptojnë se prezenca dixhitale është investim afatgjatë — dhe janë gati të investojnë si duhet.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-white/10">
          <div className="section-wrap py-16 md:py-24">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">Parimet</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.0]">
              Çfarë udhëheq çdo vendim
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {values.map((v) => (
                <div
                  key={v.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <div className="mb-3 h-px w-10 bg-gradient-to-r from-accent/70 to-transparent" />
                  <p className="font-display text-[1.15rem] leading-snug text-white">{v.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="border-t border-white/10">
          <div className="section-wrap py-16 md:py-24">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">Ekspertiza</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.0]">
              Çfarë bëjmë mirë
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {expertise.map((e) => (
                <div key={e.label} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.015] p-5">
                  <span className="mt-0.5 shrink-0 text-accent">{e.icon}</span>
                  <div>
                    <p className="font-medium text-white/90">{e.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/52">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-white/10">
          <div className="section-wrap py-16 md:py-24">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80">Procesi</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.0]">
              Si funksionon bashkëpunimi
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {[
                { n: "01", title: "Bisedë e lirë", body: "Tregoni projektin — pa formular, pa prezantim. Kuptojmë çfarë nevojitet realisht." },
                { n: "02", title: "Plan konkret", body: "Brenda 24–48 orësh merrni propozim me hapa, afate dhe çmim të qartë." },
                { n: "03", title: "Ekzekutim me kontroll", body: "Ju informojmë në çdo fazë. Asnjë surprizë — as teknike, as financiare." },
                { n: "04", title: "Lansim & mbështetje", body: "Pas lansimit nuk zhdukem. Jeni mbështetur për problemet dhe pyetjet e para." }
              ].map((step) => (
                <div key={step.n} className="relative pl-6">
                  <div className="absolute left-0 top-0 text-[10px] font-semibold tracking-[0.2em] text-accent/60">{step.n}</div>
                  <div className="mb-3 ml-[-1.5rem] h-px w-10 bg-gradient-to-r from-accent/40 to-transparent" />
                  <p className="font-display text-[1.1rem] leading-snug text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solo advantage callout */}
        <section className="border-t border-white/10">
          <div className="section-wrap py-16 md:py-20">
            <div className="relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,10,10,0.98)_0%,rgba(16,16,16,0.98)_52%,rgba(171,131,57,0.12)_100%)] px-7 py-10 md:px-12 md:py-14">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_24%,rgba(255,255,255,0.05),transparent_38%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.12),transparent_44%)]" />
              <p className="relative text-[10px] uppercase tracking-[0.3em] text-accent/80">Avantazhi i punës direkte</p>
              <h2 className="font-display relative mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.05] text-white">
                Kur flisni me ne, flisni me atë që ndërton projektin — jo me dikë që e shpjegon tek dikush tjetër.
              </h2>
              <p className="relative mt-5 max-w-xl text-sm leading-relaxed text-white/60">
                Agjencitë e mëdha kanë account manager, dizajner junior, developer tjetër dhe koordinator projekti. Ju paguani të gjithë dhe shpesh askush nuk e njeh projektin tuaj plotësisht. Këtu, personi me të cilin bisedoni është ai që punon.
              </p>
              <Link href="/contact" className="interactive-button ip-cta-primary relative mt-8 inline-flex">
                Fillo bisedën <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <GlobalCTA title="Gati për një projekt me standarde të larta?" />
      </main>
      <Footer />
    </>
  );
}
