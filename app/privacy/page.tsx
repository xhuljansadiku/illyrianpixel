import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata(
  "Politika e Privatësisë, Illyrian Pixel",
  "Si mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale sipas Rregullores GDPR (BE) 2016/679.",
  "/privacy"
);

const sections = [
  {
    title: "1. Identiteti i Kontrolluesit të të Dhënave",
    body: `Kontrolluesi i të dhënave personale është Illyrian Pixel, me seli në Tiranë, Shqipëri. Për çdo pyetje rreth mbrojtjes së të dhënave, mund të na kontaktoni në: info@illyrianpixel.com`,
  },
  {
    title: "2. Çfarë të dhënash mbledhim dhe pse (Baza ligjore, Neni 6 GDPR)",
    body: `Mbledhim të dhënat e mëposhtme:

• Emri, email, emri i biznesit dhe mesazhi, kur plotësoni formularin e kontaktit. Baza ligjore: Neni 6(1)(b) GDPR, ekzekutimi i një kontrate ose masa paraprake me kërkesë të subjektit.

• Të dhëna navigimi anonime (nëse aktivizohet analitika), Baza ligjore: Neni 6(1)(f) GDPR, interes legjitim për të përmirësuar shërbimin.

• Email i dhënë vullnetarisht për analizë falas, Baza ligjore: Neni 6(1)(a) GDPR, pëlqimi i shprehur.

Nuk mbledhim kategori speciale të dhënash sipas Nenit 9 GDPR (shëndet, origjinë etnike, etj.).`,
  },
  {
    title: "3. Periudha e Ruajtjes (Neni 5(1)(e) GDPR)",
    body: `Të dhënat ruhen vetëm për kohën e nevojshme:

• Të dhënat e kontaktit dhe komunikimit: deri në 2 vjet pas ndërprerjes së marrëdhënies.
• Të dhënat kontraktuale dhe financiare: deri në 5 vjet sipas detyrimeve ligjore.
• Të dhënat e analitikës: anonimizuar, pa afat specifik.

Pas skadimit të afatit, të dhënat fshihen ose anonimizojnë në mënyrë të sigurt.`,
  },
  {
    title: "4. Marrësit e të Dhënave",
    body: `Nuk shesim dhe nuk ndajmë të dhënat tuaja personale me palë të treta për qëllime marketingu. Mund t'i ndajmë vetëm me:

• Calendly Inc. (SHBA), për rezervimin e takimeve. Transferta e rregulluar me Klauzolat Standarde Kontraktuale (SCC) të BE-së.
• FormSubmit, për dërgimin e formularëve. Të dhënat procesojnë sipas politikës së tyre.
• Autoritetet kompetente ligjore, vetëm nëse kërkohet me ligj.`,
  },
  {
    title: "5. Transferta Ndërkombëtare (Neni 44-49 GDPR)",
    body: `Disa nga ofruesit tanë janë të vendosur jashtë Zonës Ekonomike Europiane (ZEE). Çdo transfertë e tillë kryhet vetëm nëse:

• Vendi pranues ka vendim adekuate nga Komisioni Europian, ose
• Zbatohen Klauzolat Standarde Kontraktuale (SCC) të miratuara nga KE, ose
• Janë marrë garancitë e tjera të përshtatshme sipas Nenit 46 GDPR.`,
  },
  {
    title: "6. Cookies",
    body: `Përdorim cookies të nevojshme teknike për funksionimin e faqes. Nëse kemi cookies analitike ose marketingu, do të kërkojmë pëlqimin tuaj paraprak sipas Direktivës ePrivacy (2002/58/KE) dhe Nenit 6(1)(a) GDPR. Mund të menaxhoni preferencat e cookies nga cilësimet e shfletuesit tuaj në çdo kohë.`,
  },
  {
    title: "7. Të Drejtat Tuaja si Subjekt i të Dhënave (Nenet 15–22 GDPR)",
    body: `Sipas GDPR, keni të drejtat e mëposhtme:

• E drejta e aksesit (Neni 15), të merrni kopje të të dhënave tuaja.
• E drejta e korrigjimit (Neni 16), të korrigjoni të dhëna të pasaktë.
• E drejta e fshirjes ("të harrohesh") (Neni 17), të kërkoni fshirjen e të dhënave.
• E drejta e kufizimit të përpunimit (Neni 18).
• E drejta e transportueshmërisë (Neni 20), të merrni të dhënat në format të lexueshëm.
• E drejta e kundërshtimit (Neni 21), kundër përpunimit bazuar në interes legjitim.
• E drejta të mos i nënshtroheni vendimmarrjes automatike (Neni 22).

Për të ushtruar çdo të drejtë, na kontaktoni: info@illyrianpixel.com. Do t'ju përgjigjemi brenda 30 ditëve kalendarike.`,
  },
  {
    title: "8. E Drejta e Ankesës (Neni 77 GDPR)",
    body: `Nëse besoni se përpunimi i të dhënave tuaja shkel GDPR, keni të drejtë të paraqisni ankesë pranë autoritetit mbikëqyrës kompetent. Nëse jeni qytetar i BE-së, mund të kontaktoni autoritetin mbikëqyrës të vendit tuaj. Listën e plotë gjendet në: edpb.europa.eu/about-edpb/board/members`,
  },
  {
    title: "9. Siguria e të Dhënave (Neni 32 GDPR)",
    body: `Zbatojmë masa teknike dhe organizative të përshtatshme për të mbrojtur të dhënat tuaja kundër aksesit të paautorizuar, humbjes ose shkatërrimit. Komunikimet janë të enkriptuara me SSL/TLS. Aksesi i brendshëm kufizohet sipas parimit të nevojës minimale.`,
  },
  {
    title: "10. Ndryshimet e Politikës",
    body: `Mund të përditësojmë këtë politikë për të reflektuar ndryshime ligjore ose operacionale. Data e përditësimit është shënuar në krye të dokumentit. Ju rekomandojmë ta rishikoni periodikisht. Përdorimi i vazhdueshëm i faqes pas ndryshimeve të rëndësishme nënkupton pranimin e tyre, ose do t'ju kërkojmë pëlqim të ri kur kërkohet nga ligji.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <section className="border-b border-white/[0.06] bg-[#070707]">
          <div className="section-wrap py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">
              DOKUMENT LIGJOR · GDPR
            </p>
            <h1 className="mt-6 font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
              Politika e Privatësisë
            </h1>
            <div className="mt-6 h-px w-12 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="mt-5 max-w-xl font-body text-[0.95rem] font-light leading-relaxed text-white/45">
              E fundit e përditësuar: Maj 2026 · Illyrian Pixel, Tiranë, Shqipëri
              <br />
              Bazuar në Rregulloren (BE) 2016/679, GDPR
            </p>
          </div>
        </section>

        <section className="section-wrap py-16 md:py-20">
          <div className="mx-auto max-w-[720px] space-y-12">
            {sections.map((s) => (
              <article key={s.title} className="border-b border-white/[0.06] pb-10 last:border-0">
                <h2 className="font-display text-[1.2rem] font-semibold tracking-[-0.01em] text-white">
                  {s.title}
                </h2>
                <p className="mt-3 whitespace-pre-line font-body text-[0.9rem] leading-[1.85] text-white/60">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
