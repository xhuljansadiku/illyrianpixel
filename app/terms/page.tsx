import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata(
  "Kushtet e Shërbimit, Illyrian Pixel",
  "Kushtet e përgjithshme të shërbimit të Illyrian Pixel sipas Direktivës EU 2011/83 dhe Direktivës 2000/31/KE për tregtinë elektronike.",
  "/terms"
);

const sections = [
  {
    title: "1. Identiteti i Ofruesit të Shërbimit",
    body: `Illyrian Pixel
Tiranë, Shqipëri
Email: info@illyrianpixel.com

Këto kushte rregullohen nga Direktiva BE 2011/83/EU mbi të Drejtat e Konsumatorëve, Direktiva 2000/31/KE mbi Tregtinë Elektronike dhe parimet e përgjithshme të së drejtës kontraktuale evropiane.`,
  },
  {
    title: "2. Fushëveprimi dhe Pranimi i Kushteve",
    body: `Duke përdorur faqen www.illyrianpixel.com ose duke filluar bashkëpunimin me Illyrian Pixel, pranoni plotësisht këto kushte. Nëse nuk bini dakord me ndonjë pjesë, ju lutemi mos të vazhdoni.

Këto kushte zbatohen për të gjitha shërbimet e ofruara: dizajn uebsajti, zhvillim, marketing dixhital, branding dhe çdo shërbim tjetër i specifikuar në ofertë.`,
  },
  {
    title: "3. Formimi i Kontratës",
    body: `Kontrata konsiderohet e lidhur kur:
• Klienti pranon me shkrim (email ose dokument) propozimin e detajuar, dhe
• Kryhet pagesa e avancit të rënë dakord.

Sipas Nenit 6 të Direktivës 2000/31/KE, komunikimi tregtar duhet të jetë i qartë dhe i identifikueshëm. Çdo ofertë e dërguar nga Illyrian Pixel është e vlefshme për 14 ditë kalendarike nga data e lëshimit.`,
  },
  {
    title: "4. Çmimet dhe Pagesa",
    body: `Të gjitha çmimet janë në EUR. TVSH-ja (nëse aplikohet) do të specifikohet në faturë.

Mënyra standarde e pagesës:
• 50% avancë para fillimit të projektit
• 50% para dorëzimit final

Vonesa në pagesë mbi 14 ditë mund të rezultojë në pezullim të punës. Sipas Direktivës BE 2011/7/EU mbi pagesat me vonesë, mund të aplikohet interes ligjor prej 8% mbi normën bazë të BQE-së.`,
  },
  {
    title: "5. Ekzekutimi dhe Afatet",
    body: `Afatet e projektit vendosen me marrëveshje të shkruar. Afatet janë të kushtëzuara nga:
• Dorëzimi në kohë i materialeve nga klienti (logo, tekste, imazhe, kredenciale)
• Dhënia e feedbackut brenda 5 ditëve pune nga çdo dorëzim
• Pagesa sipas afateve të rëna dakord

Vonesa të shkaktuara nga klienti nuk konsiderohen shkelje nga ana e Illyrian Pixel.`,
  },
  {
    title: "6. E Drejta e Tërheqjes (Direktiva 2011/83/EU, Neni 9)",
    body: `Klientët konsumatorë brenda BE-së kanë të drejtë të tërhiqen nga kontrata brenda 14 ditëve kalendarike nga lidhja e saj, pa dhënë arsye, nëse shërbimi nuk ka filluar ende.

E drejta e tërheqjes NDRYSHE NUK APLIKOHET nëse:
• Klienti ka kërkuar shprehimisht fillimin e punës para skadimit të periudhës 14-ditore, ose
• Shërbimi është kryer plotësisht.

Për të ushtruar këtë të drejtë, njoftoni me email info@illyrianpixel.com brenda afatit.`,
  },
  {
    title: "7. Revizimet dhe Ndryshimet e Scope-it",
    body: `Çdo projekt përfshin numrin e revizioneve të specifikuar në ofertë. Ndryshimet jashtë scope-it origjinal (ndryshime konceptuale, shtim funksionalitetesh të reja) trajtohen si punë shtesë dhe faturihen veçmas me tarifë të rënë dakord paraprakisht me shkrim.`,
  },
  {
    title: "8. Pronësia Intelektuale",
    body: `Pas kryerjes së pagesës të plotë, klienti merr licencë ekskluzive dhe të transferueshme mbi produktin final (dizajni, kodi burimor, tekstet e krijuara).

Illyrian Pixel ruan:
• Të drejtat morale mbi veprat kreative sipas Direktivës 2001/29/KE
• Të drejtën të përdorë projektin si referencë portofoli dhe marketing

Nëse klienti kërkon konfidencialitet të plotë, duhet të specifikohet me shkrim para fillimit të projektit.`,
  },
  {
    title: "9. Garancitë dhe Përgjegjësia",
    body: `Illyrian Pixel garanton që shërbimet do të kryhen me kompetencën e duhur profesionale sipas standardeve të industrisë.

Kufizimet e përgjegjësisë:
• Nuk mbajmë përgjegjësi për dëme indirekte, humbje të ardhurash ose dëme pasojë.
• Përgjegjësia maksimale kufizohet në shumën e paguar për projektin përkatës.
• Nuk garantojmë rezultate specifike marketingu (pozicione SEO, konvertime) pasi varen nga faktorë të jashtëm.

Këto kufizime nuk cënojnë të drejtat ligjore të konsumatorit sipas ligjit evropian.`,
  },
  {
    title: "10. Konfidencialiteti dhe Mbrojtja e të Dhënave",
    body: `Të dyja palët bien dakord të mbajnë konfidenciale informacionin e ndarë gjatë bashkëpunimit. Kjo detyrim mbetet aktiv 3 vjet pas përfundimit të projektit.

Të dhënat personale përpunohen sipas Politikës sonë të Privatësisë dhe Rregullores GDPR (BE) 2016/679. Shikoni: illyrianpixel.com/privacy`,
  },
  {
    title: "11. Force Majeure",
    body: `Asnjëra palë nuk mban përgjegjësi për vonesë ose mosekzekutim të detyrimeve shkaktuar nga rrethana jashtë kontrollit të arsyeshëm (katastrofa natyrore, pandemi, vendime shtetërore, dështime infrastrukture dixhitale). Pala e prekur duhet të njoftojë menjëherë palën tjetër me shkrim.`,
  },
  {
    title: "12. Zgjidhja e Mosmarrëveshjeve",
    body: `Preferojmë zgjidhjen miqësore të çdo mosmarrëveshjeje. Nëse nuk arrihet marrëveshje brenda 30 ditëve, palët mund t'i drejtohen:

• Platformës ODR (Online Dispute Resolution) të KE-së: ec.europa.eu/consumers/odr, për konsumatorët brenda BE-së.
• Gjykatave kompetente të vendit të klientit, sipas Rregullores (BE) 1215/2012 (Bruksel I-bis).

Ligji i zbatuar do të jetë ai i vendit të klientit nëse ky është konsumator brenda BE-së.`,
  },
  {
    title: "13. Ndryshimet e Kushteve",
    body: `Rezervojmë të drejtën të ndryshojmë këto kushte. Ndryshimet hyjnë në fuqi 30 ditë pas publikimit në faqe. Për kontratat aktive, kushtet e aplikueshme janë ato në fuqi në momentin e lidhjes së kontratës.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <section className="border-b border-white/[0.06] bg-[#070707]">
          <div className="section-wrap py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">
              DOKUMENT LIGJOR · BE / GDPR
            </p>
            <h1 className="mt-6 font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
              Kushtet e Shërbimit
            </h1>
            <div className="mt-6 h-px w-12 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="mt-5 max-w-xl font-body text-[0.95rem] font-light leading-relaxed text-white/45">
              E fundit e përditësuar: Maj 2026 · Illyrian Pixel, Tiranë, Shqipëri
              <br />
              Bazuar në Direktivën BE 2011/83/EU · Direktivën 2000/31/KE · GDPR 2016/679
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
