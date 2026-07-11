import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string }> = {
  sq: {
    title: "Politika e Privatësisë, Illyrian Pixel",
    description: "Si mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale sipas Rregullores GDPR (BE) 2016/679.",
  },
  en: {
    title: "Privacy Policy, Illyrian Pixel",
    description: "How we collect, use and protect your personal data under GDPR Regulation (EU) 2016/679.",
  },
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/privacy", undefined, locale as Locale);
}

const CONTENT: Record<Locale, {
  badge: string;
  title: string;
  updated: string;
  sections: { title: string; body: string }[];
}> = {
  sq: {
    badge: "DOKUMENT LIGJOR · GDPR",
    title: "Politika e Privatësisë",
    updated: "E fundit e përditësuar: Maj 2026 · Illyrian Pixel, Tiranë, Shqipëri\nBazuar në Rregulloren (BE) 2016/679, GDPR",
    sections: [
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
    ],
  },
  en: {
    badge: "LEGAL DOCUMENT · GDPR",
    title: "Privacy Policy",
    updated: "Last updated: May 2026 · Illyrian Pixel, Tirana, Albania\nBased on Regulation (EU) 2016/679, GDPR",
    sections: [
      {
        title: "1. Identity of the Data Controller",
        body: `The controller of personal data is Illyrian Pixel, based in Tirana, Albania. For any questions about data protection, you can contact us at: info@illyrianpixel.com`,
      },
      {
        title: "2. What Data We Collect and Why (Legal Basis, Article 6 GDPR)",
        body: `We collect the following data:

• Name, email, business name and message, when you fill out the contact form. Legal basis: Article 6(1)(b) GDPR, performance of a contract or pre-contractual steps taken at the data subject's request.

• Anonymous browsing data (if analytics is enabled). Legal basis: Article 6(1)(f) GDPR, legitimate interest in improving the service.

• Email voluntarily provided for a free analysis. Legal basis: Article 6(1)(a) GDPR, expressed consent.

We do not collect special categories of data under Article 9 GDPR (health, ethnic origin, etc.).`,
      },
      {
        title: "3. Retention Period (Article 5(1)(e) GDPR)",
        body: `Data is retained only for as long as necessary:

• Contact and communication data: up to 2 years after the relationship ends.
• Contractual and financial data: up to 5 years per legal obligations.
• Analytics data: anonymized, with no specific time limit.

Once the retention period expires, data is securely deleted or anonymized.`,
      },
      {
        title: "4. Data Recipients",
        body: `We do not sell or share your personal data with third parties for marketing purposes. We may share it only with:

• Calendly Inc. (USA), for booking meetings. Transfer governed by the EU's Standard Contractual Clauses (SCC).
• FormSubmit, for sending forms. Data is processed under their own policy.
• Competent legal authorities, only when required by law.`,
      },
      {
        title: "5. International Transfers (Articles 44–49 GDPR)",
        body: `Some of our providers are based outside the European Economic Area (EEA). Any such transfer only takes place if:

• The receiving country has an adequacy decision from the European Commission, or
• The Standard Contractual Clauses (SCC) approved by the EC are applied, or
• Other appropriate safeguards under Article 46 GDPR have been put in place.`,
      },
      {
        title: "6. Cookies",
        body: `We use technically necessary cookies for the site to function. If we use analytics or marketing cookies, we will ask for your prior consent under the ePrivacy Directive (2002/58/EC) and Article 6(1)(a) GDPR. You can manage your cookie preferences from your browser settings at any time.`,
      },
      {
        title: "7. Your Rights as a Data Subject (Articles 15–22 GDPR)",
        body: `Under GDPR, you have the following rights:

• Right of access (Article 15), to obtain a copy of your data.
• Right to rectification (Article 16), to correct inaccurate data.
• Right to erasure ("to be forgotten") (Article 17), to request deletion of your data.
• Right to restriction of processing (Article 18).
• Right to data portability (Article 20), to receive your data in a readable format.
• Right to object (Article 21), to processing based on legitimate interest.
• Right not to be subject to automated decision-making (Article 22).

To exercise any of these rights, contact us at: info@illyrianpixel.com. We will respond within 30 calendar days.`,
      },
      {
        title: "8. Right to Lodge a Complaint (Article 77 GDPR)",
        body: `If you believe the processing of your data violates GDPR, you have the right to lodge a complaint with the competent supervisory authority. If you are an EU citizen, you can contact the supervisory authority of your country. The full list is available at: edpb.europa.eu/about-edpb/board/members`,
      },
      {
        title: "9. Data Security (Article 32 GDPR)",
        body: `We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss or destruction. Communications are encrypted with SSL/TLS. Internal access is restricted according to the principle of least privilege.`,
      },
      {
        title: "10. Changes to This Policy",
        body: `We may update this policy to reflect legal or operational changes. The update date is noted at the top of the document. We recommend reviewing it periodically. Continued use of the site after material changes implies acceptance of them, or we will ask for renewed consent where required by law.`,
      },
    ],
  },
};

export default async function PrivacyPage({ params }: Props) {
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
