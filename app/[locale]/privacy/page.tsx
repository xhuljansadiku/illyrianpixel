import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ locale: string }> };

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

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
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
    updated: "E fundit e përditësuar: Tetor 2026 · Illyrian Pixel, Tiranë, Shqipëri\nBazuar në Rregulloren (BE) 2016/679, GDPR",
    sections: [
      {
        title: "1. Identiteti i Kontrolluesit të të Dhënave",
        body: `Kontrolluesi i të dhënave personale është Illyrian Pixel, me seli në Tiranë, Shqipëri. Për çdo pyetje rreth mbrojtjes së të dhënave, mund të na kontaktoni në: info@illyrianpixel.com`,
      },
      {
        title: "2. Çfarë të dhënash mbledhim dhe pse (Baza ligjore, Neni 6 GDPR)",
        body: `Mbledhim të dhënat e mëposhtme:

• Formulari i kontaktit: emri, email, telefoni, emri i biznesit, mesazhi dhe, nëse i plotësoni, shërbimi, buxheti dhe afati. Baza ligjore: Neni 6(1)(b) GDPR, masa paraprake me kërkesën tuaj.

• Newsletter: email-i, data e abonimit dhe e konfirmimit (konfirmim i dyfishtë), si dhe nëse hapni email-et tona ose klikoni linket në to. Baza ligjore: Neni 6(1)(a) GDPR, pëlqimi. Mund të çabonoheni me një klik nga çdo email.

• Asistenti King Genti: mesazhet që shkruani në bisedë, të lidhura vetëm me një identifikues të rastësishëm sesioni (pa emër dhe pa adresë IP). I përdorim për të përmirësuar përgjigjet. Baza ligjore: Neni 6(1)(f) GDPR, interes legjitim. Ju lutem mos shkruani të dhëna sensitive në bisedë.

• Statistika të brendshme vizitash: vetëm faqja e vizituar dhe data, pa cookies dhe pa të dhëna personale. Baza ligjore: Neni 6(1)(f) GDPR, interes legjitim.

• Analitika (Google Analytics, Microsoft Clarity): vetëm nëse klikoni “Prano” te banner-i i cookies. Mbledh mënyrën si përdoret faqja (faqet, klikimet, lëvizjet, pajisja, vendndodhja e përafërt); Clarity regjistron edhe ndërveprimet në faqe. Baza ligjore: Neni 6(1)(a) GDPR, pëlqimi, që mund ta tërhiqni në çdo kohë.

• Mbrojtje nga abuzimi: adresa IP përdoret përkohësisht për të kufizuar kërkesat e tepërta në formularë dhe fshihet brenda 24 orësh. Baza ligjore: Neni 6(1)(f) GDPR, interes legjitim për sigurinë e faqes.

Nuk mbledhim kategori speciale të dhënash sipas Nenit 9 GDPR (shëndet, origjinë etnike, etj.).`,
      },
      {
        title: "3. Periudha e Ruajtjes (Neni 5(1)(e) GDPR)",
        body: `Të dhënat ruhen vetëm për kohën e nevojshme:

• Të dhënat e kontaktit dhe komunikimit: deri në 2 vjet pas ndërprerjes së marrëdhënies.
• Të dhënat kontraktuale dhe financiare: deri në 5 vjet sipas detyrimeve ligjore.
• Abonimi në newsletter: derisa të çabonoheni.
• Bisedat me asistentin: derisa të mos jenë më të nevojshme për përmirësimin e tij; mund të kërkoni fshirjen e tyre në çdo kohë.
• Adresa IP për mbrojtje nga abuzimi: deri në 24 orë.
• Google Analytics dhe Microsoft Clarity: sipas afateve të ruajtjes të këtyre shërbimeve (për Google Analytics, maksimumi 14 muaj).

Pas skadimit të afatit, të dhënat fshihen ose anonimizojnë në mënyrë të sigurt.`,
      },
      {
        title: "4. Marrësit e të Dhënave",
        body: `Nuk shesim dhe nuk ndajmë të dhënat tuaja personale me palë të treta për qëllime marketingu. Mund t'i ndajmë vetëm me:

• Vercel Inc. (SHBA), hostimi i faqes; përpunon adresën IP dhe të dhëna teknike të çdo kërkese.
• Supabase, databaza ku ruhen kërkesat e kontaktit, abonimet në newsletter dhe bisedat me asistentin.
• Resend (SHBA), dërgimi i email-eve (konfirmime, njoftime dhe newsletter).
• Telegram dhe WhatsApp (përmes shërbimit CallMeBot), njoftime të brendshme drejt nesh kur dërgoni formularin e kontaktit; përmbajnë të dhënat që keni shkruar.
• Google (Google Analytics) dhe Microsoft (Microsoft Clarity), vetëm nëse jepni pëlqimin.
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
        body: `Faqja funksionon pa cookies jo-thelbësore. Cookies analitike vendosen vetëm nëse klikoni “Prano” te banner-i, sipas Direktivës ePrivacy (2002/58/KE) dhe Nenit 6(1)(a) GDPR:

• Google Analytics: _ga dhe _ga_<ID>, për të dalluar vizitorët dhe sesionet; deri në 2 vjet.
• Microsoft Clarity: _clck dhe _clsk (si dhe cookies të Microsoft), për analizën e përdorimit dhe regjistrimin e sesioneve; deri në 1 vit.

Nëse nuk pranoni, Google Analytics funksionon pa cookies (Google Consent Mode) dhe merr vetëm sinjale teknike për statistika të përmbledhura, ndërsa Microsoft Clarity nuk ngarkohet fare.

Në memorien e shfletuesit (localStorage/sessionStorage) ruajmë vetëm zgjedhje teknike: zgjedhjen tuaj për cookies (12 muaj), nëse keni mbyllur një dritare informuese dhe identifikuesin e sesionit të bisedës (fshihet kur mbyllni skedën).

Mund ta ndryshoni ose tërhiqni pëlqimin në çdo kohë nga “Cilësimet e cookies” në fund të çdo faqeje.`,
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
    updated: "Last updated: October 2026 · Illyrian Pixel, Tirana, Albania\nBased on Regulation (EU) 2016/679, GDPR",
    sections: [
      {
        title: "1. Identity of the Data Controller",
        body: `The controller of personal data is Illyrian Pixel, based in Tirana, Albania. For any questions about data protection, you can contact us at: info@illyrianpixel.com`,
      },
      {
        title: "2. What Data We Collect and Why (Legal Basis, Article 6 GDPR)",
        body: `We collect the following data:

• Contact form: name, email, phone, business name, message and, if you fill them in, service, budget and timeline. Legal basis: Article 6(1)(b) GDPR, pre-contractual steps at your request.

• Newsletter: your email, the date you subscribed and confirmed (double opt-in), and whether you open our emails or click their links. Legal basis: Article 6(1)(a) GDPR, consent. You can unsubscribe with one click from any email.

• King Genti assistant: the messages you type in the chat, linked only to a random session identifier (no name, no IP address). We use them to improve the answers. Legal basis: Article 6(1)(f) GDPR, legitimate interest. Please do not share sensitive information in the chat.

• Internal visit statistics: only the page visited and the date, with no cookies and no personal data. Legal basis: Article 6(1)(f) GDPR, legitimate interest.

• Analytics (Google Analytics, Microsoft Clarity): only if you click “Accept” in the cookie banner. Collects how the site is used (pages, clicks, scrolling, device, approximate location); Clarity also records on-page interactions. Legal basis: Article 6(1)(a) GDPR, consent, which you can withdraw at any time.

• Abuse protection: your IP address is used temporarily to limit excessive form submissions and is deleted within 24 hours. Legal basis: Article 6(1)(f) GDPR, legitimate interest in keeping the site secure.

We do not collect special categories of data under Article 9 GDPR (health, ethnic origin, etc.).`,
      },
      {
        title: "3. Retention Period (Article 5(1)(e) GDPR)",
        body: `Data is retained only for as long as necessary:

• Contact and communication data: up to 2 years after the relationship ends.
• Contractual and financial data: up to 5 years per legal obligations.
• Newsletter subscription: until you unsubscribe.
• Assistant conversations: until they are no longer needed to improve the assistant; you can ask us to delete them at any time.
• IP addresses used for abuse protection: up to 24 hours.
• Google Analytics and Microsoft Clarity: according to those services' retention periods (for Google Analytics, at most 14 months).

Once the retention period expires, data is securely deleted or anonymized.`,
      },
      {
        title: "4. Data Recipients",
        body: `We do not sell or share your personal data with third parties for marketing purposes. We may share it only with:

• Vercel Inc. (USA), website hosting; processes the IP address and technical data of every request.
• Supabase, the database where contact requests, newsletter subscriptions and assistant conversations are stored.
• Resend (USA), for sending emails (confirmations, notifications and the newsletter).
• Telegram and WhatsApp (via the CallMeBot service), internal notifications to us when you submit the contact form; they contain the details you entered.
• Google (Google Analytics) and Microsoft (Microsoft Clarity), only if you give consent.
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
        body: `The site works without non-essential cookies. Analytics cookies are only set if you click “Accept” in the banner, in line with the ePrivacy Directive (2002/58/EC) and Article 6(1)(a) GDPR:

• Google Analytics: _ga and _ga_<ID>, to distinguish visitors and sessions; up to 2 years.
• Microsoft Clarity: _clck and _clsk (plus Microsoft cookies), for usage analysis and session recording; up to 1 year.

If you decline, Google Analytics runs without cookies (Google Consent Mode) and only receives technical signals for aggregated statistics, while Microsoft Clarity is not loaded at all.

In your browser's storage (localStorage/sessionStorage) we only keep technical choices: your cookie choice (12 months), whether you closed an informational pop-up, and the chat session identifier (deleted when you close the tab).

You can change or withdraw your consent at any time via “Cookie settings” at the bottom of every page.`,
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

export default async function PrivacyPage(props: Props) {
  const { locale } = await props.params;
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
