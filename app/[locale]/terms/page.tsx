import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Kushtet e Shërbimit, Illyrian Pixel",
    description: "Kushtet e përgjithshme të shërbimit të Illyrian Pixel sipas Direktivës EU 2011/83 dhe Direktivës 2000/31/KE për tregtinë elektronike.",
  },
  en: {
    title: "Terms of Service, Illyrian Pixel",
    description: "Illyrian Pixel's general terms of service under EU Directive 2011/83 and Directive 2000/31/EC on electronic commerce.",
  },
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/terms", undefined, locale as Locale);
}

const CONTENT: Record<Locale, {
  badge: string;
  title: string;
  updated: string;
  sections: { title: string; body: string }[];
}> = {
  sq: {
    badge: "DOKUMENT LIGJOR · BE / GDPR",
    title: "Kushtet e Shërbimit",
    updated: "E fundit e përditësuar: Maj 2026 · Illyrian Pixel, Tiranë, Shqipëri\nBazuar në Direktivën BE 2011/83/EU · Direktivën 2000/31/KE · GDPR 2016/679",
    sections: [
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
    ],
  },
  en: {
    badge: "LEGAL DOCUMENT · EU / GDPR",
    title: "Terms of Service",
    updated: "Last updated: May 2026 · Illyrian Pixel, Tirana, Albania\nBased on EU Directive 2011/83/EU · Directive 2000/31/EC · GDPR 2016/679",
    sections: [
      {
        title: "1. Identity of the Service Provider",
        body: `Illyrian Pixel
Tirana, Albania
Email: info@illyrianpixel.com

These terms are governed by EU Directive 2011/83/EU on Consumer Rights, Directive 2000/31/EC on Electronic Commerce, and general principles of European contract law.`,
      },
      {
        title: "2. Scope and Acceptance of Terms",
        body: `By using the website www.illyrianpixel.com or starting a collaboration with Illyrian Pixel, you fully accept these terms. If you disagree with any part, please do not continue.

These terms apply to all services provided: website design, development, digital marketing, branding, and any other service specified in a proposal.`,
      },
      {
        title: "3. Formation of the Contract",
        body: `The contract is considered formed when:
• The client accepts the detailed proposal in writing (email or document), and
• The agreed deposit payment is made.

Under Article 6 of Directive 2000/31/EC, commercial communication must be clear and identifiable. Any proposal sent by Illyrian Pixel is valid for 14 calendar days from the date of issue.`,
      },
      {
        title: "4. Prices and Payment",
        body: `All prices are in EUR. VAT (where applicable) will be specified on the invoice.

Standard payment structure:
• 50% deposit before the project starts
• 50% before final delivery

Payment delays exceeding 14 days may result in work being suspended. Under EU Directive 2011/7/EU on late payments, statutory interest of 8% above the ECB base rate may apply.`,
      },
      {
        title: "5. Execution and Deadlines",
        body: `Project deadlines are set by written agreement. Deadlines are conditional on:
• Timely delivery of materials by the client (logo, copy, images, credentials)
• Feedback being provided within 5 business days of each delivery
• Payment according to the agreed schedule

Delays caused by the client are not considered a breach on the part of Illyrian Pixel.`,
      },
      {
        title: "6. Right of Withdrawal (Directive 2011/83/EU, Article 9)",
        body: `Consumer clients within the EU have the right to withdraw from the contract within 14 calendar days of its conclusion, without giving a reason, if the service has not yet started.

The right of withdrawal DOES NOT APPLY if:
• The client has expressly requested that work begin before the 14-day period expires, or
• The service has been fully performed.

To exercise this right, notify us by email at info@illyrianpixel.com within the deadline.`,
      },
      {
        title: "7. Revisions and Scope Changes",
        body: `Each project includes the number of revisions specified in the proposal. Changes outside the original scope (conceptual changes, new features added) are treated as additional work and billed separately at a rate agreed in writing beforehand.`,
      },
      {
        title: "8. Intellectual Property",
        body: `Upon full payment, the client receives an exclusive, transferable license to the final product (the design, source code, and copy created).

Illyrian Pixel retains:
• Moral rights over creative works under Directive 2001/29/EC
• The right to use the project as a portfolio and marketing reference

If the client requires full confidentiality, this must be specified in writing before the project begins.`,
      },
      {
        title: "9. Warranties and Liability",
        body: `Illyrian Pixel warrants that services will be carried out with due professional competence per industry standards.

Limitations of liability:
• We are not liable for indirect damages, loss of revenue, or consequential damages.
• Maximum liability is limited to the amount paid for the relevant project.
• We do not guarantee specific marketing results (SEO rankings, conversions) as these depend on external factors.

These limitations do not affect the consumer's statutory rights under European law.`,
      },
      {
        title: "10. Confidentiality and Data Protection",
        body: `Both parties agree to keep confidential any information shared during the collaboration. This obligation remains in effect for 3 years after the project ends.

Personal data is processed under our Privacy Policy and GDPR Regulation (EU) 2016/679. See: illyrianpixel.com/privacy`,
      },
      {
        title: "11. Force Majeure",
        body: `Neither party is liable for delay or failure to perform obligations caused by circumstances beyond reasonable control (natural disasters, pandemics, government decisions, digital infrastructure failures). The affected party must promptly notify the other party in writing.`,
      },
      {
        title: "12. Dispute Resolution",
        body: `We prefer to resolve any dispute amicably. If no agreement is reached within 30 days, the parties may turn to:

• The EU's Online Dispute Resolution (ODR) platform: ec.europa.eu/consumers/odr, for consumers within the EU.
• The competent courts of the client's country, under Regulation (EU) 1215/2012 (Brussels I-bis).

The applicable law will be that of the client's country if the client is a consumer within the EU.`,
      },
      {
        title: "13. Changes to These Terms",
        body: `We reserve the right to change these terms. Changes take effect 30 days after publication on the site. For active contracts, the applicable terms are those in force at the time the contract was concluded.`,
      },
    ],
  },
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  const c = CONTENT[locale as Locale] ?? CONTENT.sq;

  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <section className="border-b border-white/[0.06] bg-[#070707]">
          <div className="section-wrap py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">
              {c.badge}
            </p>
            <h1 className="mt-6 font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
              {c.title}
            </h1>
            <div className="mt-6 h-px w-12 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="mt-5 max-w-xl whitespace-pre-line font-body text-[0.95rem] font-light leading-relaxed text-white/45">
              {c.updated}
            </p>
          </div>
        </section>

        <section className="section-wrap py-16 md:py-20">
          <div className="mx-auto max-w-[720px] space-y-12">
            {c.sections.map((s) => (
              <article key={s.title} className="border-b border-white/[0.06] pb-10 last:border-0">
                <h2 className="font-display text-[1.2rem] font-semibold tracking-[-0.01em] text-white">
                  {s.title}
                </h2>
                <p className="mt-3 md:whitespace-pre-line font-body text-[0.9rem] leading-[1.85] text-white/60">
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
