import { company } from "./company";
import type { ContentBlock, Locale, Localized } from "./types";

/**
 * Legal pages. These are carefully written templates, not legal advice — have
 * them reviewed before launch. Values in [BRACKETS] must be confirmed or filled in.
 */
export type LegalPageId = "privacy" | "terms" | "cookies";

export type LegalPage = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  body: ContentBlock[];
};

/** Date of the current version of the legal texts (ISO). */
export const LEGAL_UPDATED = "2026-10-06";

const { legalName, orgNumber, address, email } = company;

const PAGES: Localized<Record<LegalPageId, LegalPage>> = {
  sv: {
    privacy: {
      title: "Integritetspolicy",
      metaTitle: "Integritetspolicy",
      metaDescription: "Så behandlar Nordic Pixel dina personuppgifter enligt dataskyddsförordningen (GDPR).",
      intro: `Den här policyn förklarar hur ${legalName} ("Nordic Pixel", "vi") behandlar dina personuppgifter när du besöker vår webbplats eller kontaktar oss. Vi behandlar personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR) och kompletterande svensk lagstiftning.`,
      body: [
        { type: "h2", text: "Personuppgiftsansvarig" },
        {
          type: "p",
          text: `Personuppgiftsansvarig är ${legalName}, org.nr ${orgNumber}, ${address}. Du når oss på ${email}.`,
        },
        { type: "h2", text: "Vilka uppgifter vi behandlar" },
        {
          type: "p",
          text: "Vi behandlar de uppgifter som du själv lämnar till oss och vissa tekniska uppgifter som uppstår när du använder webbplatsen:",
        },
        {
          type: "ul",
          items: [
            "**Kontaktformulär:** namn, företag, e-postadress, telefonnummer (valfritt), vilken tjänst och budget förfrågan gäller samt ditt meddelande.",
            "**Kommunikation:** uppgifter som du lämnar när du mejlar eller ringer oss, och vår fortsatta korrespondens med dig.",
            "**Tekniska uppgifter:** IP-adress, webbläsare och tidpunkt för besöket, som registreras i serverloggar för drift och säkerhet.",
          ],
        },
        {
          type: "p",
          text: "Vi använder i dag inga cookies eller verktyg för analys eller marknadsföring på webbplatsen. Läs mer i vår [cookiepolicy](/cookies).",
        },
        { type: "h2", text: "Varför vi behandlar uppgifterna och med vilken rättslig grund" },
        {
          type: "ul",
          items: [
            "**Besvara förfrågningar och ta fram förslag** – för att vidta åtgärder på din begäran innan ett eventuellt avtal ingås (artikel 6.1 b GDPR) eller, när du kontaktar oss för ett företags räkning, med stöd av vårt berättigade intresse av att besvara affärsförfrågningar (artikel 6.1 f GDPR).",
            "**Fullgöra uppdrag och avtal** – när du eller ditt företag blir kund (artikel 6.1 b GDPR).",
            "**Drift, säkerhet och skydd mot missbruk** – till exempel för att förhindra spam via kontaktformuläret (berättigat intresse, artikel 6.1 f GDPR).",
            "**Uppfylla rättsliga förpliktelser** – till exempel enligt bokföringslagen när du är kund (artikel 6.1 c GDPR).",
          ],
        },
        { type: "h2", text: "Hur länge vi sparar uppgifterna" },
        {
          type: "p",
          text: "Vi sparar inte personuppgifter längre än nödvändigt. Förfrågningar som inte leder till ett uppdrag raderas senast [12] månader efter vår senaste kontakt. Uppgifter om kunder sparas så länge uppdraget pågår och därefter så länge lagen kräver, till exempel sju år för räkenskapsinformation enligt bokföringslagen. Serverloggar sparas en kort period enligt vår hostingleverantörs rutiner.",
        },
        { type: "h2", text: "Vilka vi delar uppgifterna med" },
        {
          type: "p",
          text: "Vi säljer aldrig dina personuppgifter. Vi delar dem endast med leverantörer som hjälper oss att driva verksamheten och som behandlar uppgifterna för vår räkning enligt personuppgiftsbiträdesavtal:",
        },
        {
          type: "ul",
          items: [
            "**Hosting:** [HOSTING PROVIDER, e.g. Vercel Inc.] – driftar webbplatsen.",
            "**E-postleverans:** [EMAIL DELIVERY PROVIDER, e.g. Resend] – levererar meddelanden från kontaktformuläret till oss.",
            "**E-post och kontorsverktyg:** [EMAIL / OFFICE PROVIDER] – används för vår korrespondens med dig.",
          ],
        },
        {
          type: "p",
          text: "Vi kan också lämna ut uppgifter om vi är skyldiga att göra det enligt lag eller myndighetsbeslut.",
        },
        { type: "h2", text: "Överföring utanför EU/EES" },
        {
          type: "p",
          text: "Vissa av våra leverantörer kan behandla uppgifter utanför EU/EES, till exempel i USA. I sådana fall säkerställer vi att överföringen har stöd i dataskyddsförordningen, till exempel genom EU-kommissionens beslut om EU–U.S. Data Privacy Framework eller genom EU-kommissionens standardavtalsklausuler.",
        },
        { type: "h2", text: "Dina rättigheter" },
        { type: "p", text: "Du har rätt att:" },
        {
          type: "ul",
          items: [
            "få information om och tillgång till de personuppgifter vi behandlar om dig,",
            "få felaktiga uppgifter rättade,",
            "få dina uppgifter raderade, till exempel när de inte längre behövs,",
            "begära att behandlingen begränsas,",
            "invända mot behandling som grundar sig på vårt berättigade intresse,",
            "få ut uppgifter som du själv lämnat i ett maskinläsbart format (dataportabilitet).",
          ],
        },
        {
          type: "p",
          text: `Kontakta oss på ${email} om du vill utöva dina rättigheter. Om du anser att vi behandlar dina uppgifter felaktigt kan du lämna klagomål till Integritetsskyddsmyndigheten (IMY), [imy.se](https://www.imy.se).`,
        },
        { type: "h2", text: "Ändringar i policyn" },
        {
          type: "p",
          text: "Vi kan komma att uppdatera den här policyn, till exempel om vi börjar använda nya tjänster. Den senaste versionen finns alltid på den här sidan.",
        },
      ],
    },
    terms: {
      title: "Användarvillkor",
      metaTitle: "Användarvillkor",
      metaDescription: "Villkor för användning av Nordic Pixels webbplats.",
      intro: `Dessa villkor gäller för användning av webbplatsen som drivs av ${legalName} ("Nordic Pixel", "vi"). Genom att använda webbplatsen godkänner du villkoren.`,
      body: [
        { type: "h2", text: "Webbplatsens innehåll" },
        {
          type: "p",
          text: "Informationen på webbplatsen är allmän och lämnas i informationssyfte. Vi strävar efter att den ska vara korrekt och aktuell, men kan inte garantera att den alltid är fullständig eller felfri. Innehållet utgör inget bindande erbjudande – förslag, priser och villkor för uppdrag lämnas separat och skriftligen.",
        },
        { type: "h2", text: "Immateriella rättigheter" },
        {
          type: "p",
          text: "Allt innehåll på webbplatsen – som texter, design, logotyper, grafik och kod – tillhör Nordic Pixel eller våra licensgivare och skyddas av upphovsrätt och varumärkesrätt. Du får inte kopiera, återpublicera eller använda innehållet kommersiellt utan vårt skriftliga godkännande. Korta citat med tydlig källhänvisning är tillåtna.",
        },
        { type: "h2", text: "Förfrågningar via webbplatsen" },
        {
          type: "p",
          text: "En förfrågan via kontaktformuläret innebär inte att ett avtal har ingåtts. Uppdrag regleras alltid i ett separat avtal eller en skriftlig offert.",
        },
        { type: "h2", text: "Länkar till andra webbplatser" },
        {
          type: "p",
          text: "Webbplatsen kan innehålla länkar till externa webbplatser. Vi ansvarar inte för innehållet på dessa webbplatser eller för hur de behandlar personuppgifter.",
        },
        { type: "h2", text: "Ansvarsbegränsning" },
        {
          type: "p",
          text: "I den utsträckning som tillåts enligt tillämplig lag ansvarar vi inte för skada som uppstår till följd av användning av webbplatsen eller av att den tillfälligt inte är tillgänglig.",
        },
        { type: "h2", text: "Personuppgifter och cookies" },
        {
          type: "p",
          text: "Hur vi behandlar personuppgifter beskrivs i vår [integritetspolicy](/privacy). Information om cookies finns i vår [cookiepolicy](/cookies).",
        },
        { type: "h2", text: "Tillämplig lag och tvister" },
        {
          type: "p",
          text: "Svensk lag gäller för dessa villkor. Tvister ska i första hand lösas genom dialog och i annat fall avgöras av allmän domstol i Sverige.",
        },
        { type: "h2", text: "Ändringar och kontakt" },
        {
          type: "p",
          text: `Vi kan uppdatera villkoren vid behov. Den senaste versionen finns alltid på den här sidan. Frågor besvaras på ${email}.`,
        },
      ],
    },
    cookies: {
      title: "Cookiepolicy",
      metaTitle: "Cookiepolicy",
      metaDescription: "Information om hur Nordic Pixels webbplats använder cookies.",
      intro: "Här förklarar vi vad cookies är och hur vår webbplats använder dem.",
      body: [
        { type: "h2", text: "Vad är cookies?" },
        {
          type: "p",
          text: "Cookies är små textfiler som en webbplats sparar på din dator, mobil eller surfplatta. De används till exempel för att komma ihåg inställningar, mäta besök eller visa annonser. Liknande tekniker, som lokal lagring i webbläsaren, omfattas av samma regler.",
        },
        { type: "h2", text: "Hur vi använder cookies" },
        {
          type: "p",
          text: "Vår webbplats använder i dag **inga cookies** – varken för analys, marknadsföring eller andra syften – och inga liknande tekniker för att spara information i din webbläsare. Därför visar vi ingen cookiebanner.",
        },
        {
          type: "p",
          text: "Webbplatsen laddar inte heller in några externa tjänster, typsnitt eller skript från tredje part. Typsnitten levereras direkt från vår egen server.",
        },
        { type: "h2", text: "Om vi börjar använda cookies" },
        {
          type: "p",
          text: "Om vi i framtiden vill använda till exempel analysverktyg kommer vi att uppdatera den här policyn och, där lagen om elektronisk kommunikation kräver det, be om ditt samtycke innan cookies som inte är nödvändiga sparas.",
        },
        { type: "h2", text: "Så hanterar du cookies i din webbläsare" },
        {
          type: "p",
          text: "Du kan när som helst radera cookies och välja vilka cookies som ska tillåtas i webbläsarens inställningar. Läs mer i hjälpavsnitten för din webbläsare.",
        },
        { type: "h2", text: "Frågor" },
        {
          type: "p",
          text: `Har du frågor om hur vi använder cookies är du välkommen att kontakta oss på ${email}. Läs mer om hur vi behandlar personuppgifter i vår [integritetspolicy](/privacy).`,
        },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      metaTitle: "Privacy Policy",
      metaDescription: "How Nordic Pixel processes your personal data under the General Data Protection Regulation (GDPR).",
      intro: `This policy explains how ${legalName} ("Nordic Pixel", "we") processes your personal data when you visit our website or contact us. We process personal data in accordance with the EU General Data Protection Regulation (GDPR) and supplementary Swedish legislation.`,
      body: [
        { type: "h2", text: "Data controller" },
        {
          type: "p",
          text: `The data controller is ${legalName}, Swedish corporate identity number ${orgNumber}, ${address}. You can reach us at ${email}.`,
        },
        { type: "h2", text: "What data we process" },
        {
          type: "p",
          text: "We process the data you provide to us and some technical data generated when you use the website:",
        },
        {
          type: "ul",
          items: [
            "**Contact form:** name, company, email address, phone number (optional), the service and budget your inquiry concerns, and your message.",
            "**Communication:** information you share when you email or call us, and our continued correspondence with you.",
            "**Technical data:** IP address, browser and time of visit, recorded in server logs for operation and security.",
          ],
        },
        {
          type: "p",
          text: "We currently use no cookies or analytics or marketing tools on the website. Read more in our [cookie policy](/cookies).",
        },
        { type: "h2", text: "Why we process your data, and on what legal basis" },
        {
          type: "ul",
          items: [
            "**Answering inquiries and preparing proposals** — to take steps at your request before entering into a contract (Article 6(1)(b) GDPR) or, when you contact us on behalf of a company, based on our legitimate interest in responding to business inquiries (Article 6(1)(f) GDPR).",
            "**Delivering assignments and contracts** — when you or your company become a client (Article 6(1)(b) GDPR).",
            "**Operation, security and preventing abuse** — for example to prevent spam through the contact form (legitimate interest, Article 6(1)(f) GDPR).",
            "**Complying with legal obligations** — for example under the Swedish Bookkeeping Act when you are a client (Article 6(1)(c) GDPR).",
          ],
        },
        { type: "h2", text: "How long we keep your data" },
        {
          type: "p",
          text: "We don't keep personal data longer than necessary. Inquiries that do not lead to an assignment are deleted no later than [12] months after our last contact. Client data is kept for as long as the assignment lasts and thereafter for as long as the law requires, for example seven years for accounting records under the Swedish Bookkeeping Act. Server logs are kept for a short period according to our hosting provider's routines.",
        },
        { type: "h2", text: "Who we share your data with" },
        {
          type: "p",
          text: "We never sell your personal data. We only share it with providers that help us run our business and that process the data on our behalf under data processing agreements:",
        },
        {
          type: "ul",
          items: [
            "**Hosting:** [HOSTING PROVIDER, e.g. Vercel Inc.] — hosts the website.",
            "**Email delivery:** [EMAIL DELIVERY PROVIDER, e.g. Resend] — delivers messages from the contact form to us.",
            "**Email and office tools:** [EMAIL / OFFICE PROVIDER] — used for our correspondence with you.",
          ],
        },
        {
          type: "p",
          text: "We may also disclose data where we are required to by law or by a decision of a public authority.",
        },
        { type: "h2", text: "Transfers outside the EU/EEA" },
        {
          type: "p",
          text: "Some of our providers may process data outside the EU/EEA, for example in the United States. In those cases we ensure that the transfer is supported by the GDPR, for example through the European Commission's adequacy decision for the EU–U.S. Data Privacy Framework or the European Commission's standard contractual clauses.",
        },
        { type: "h2", text: "Your rights" },
        { type: "p", text: "You have the right to:" },
        {
          type: "ul",
          items: [
            "receive information about, and access to, the personal data we process about you,",
            "have inaccurate data corrected,",
            "have your data erased, for example when it is no longer needed,",
            "request that processing is restricted,",
            "object to processing based on our legitimate interest,",
            "receive data you have provided in a machine-readable format (data portability).",
          ],
        },
        {
          type: "p",
          text: `Contact us at ${email} to exercise your rights. If you believe we process your data incorrectly, you can lodge a complaint with the Swedish Authority for Privacy Protection (IMY), [imy.se](https://www.imy.se).`,
        },
        { type: "h2", text: "Changes to this policy" },
        {
          type: "p",
          text: "We may update this policy, for example if we start using new services. The latest version is always available on this page.",
        },
      ],
    },
    terms: {
      title: "Terms of Use",
      metaTitle: "Terms of Use",
      metaDescription: "Terms for using the Nordic Pixel website.",
      intro: `These terms apply to the use of the website operated by ${legalName} ("Nordic Pixel", "we"). By using the website, you accept these terms.`,
      body: [
        { type: "h2", text: "Website content" },
        {
          type: "p",
          text: "The information on this website is general and provided for information purposes. We aim to keep it accurate and up to date, but cannot guarantee that it is always complete or free of errors. The content does not constitute a binding offer — proposals, prices and terms for assignments are provided separately and in writing.",
        },
        { type: "h2", text: "Intellectual property" },
        {
          type: "p",
          text: "All content on the website — such as text, design, logos, graphics and code — belongs to Nordic Pixel or our licensors and is protected by copyright and trademark law. You may not copy, republish or use the content commercially without our written permission. Short quotes with a clear reference to the source are permitted.",
        },
        { type: "h2", text: "Inquiries through the website" },
        {
          type: "p",
          text: "Sending an inquiry through the contact form does not create an agreement. Assignments are always governed by a separate agreement or a written quote.",
        },
        { type: "h2", text: "Links to other websites" },
        {
          type: "p",
          text: "The website may contain links to external websites. We are not responsible for the content of those websites or for how they process personal data.",
        },
        { type: "h2", text: "Limitation of liability" },
        {
          type: "p",
          text: "To the extent permitted by applicable law, we are not liable for any damage arising from the use of the website or from the website being temporarily unavailable.",
        },
        { type: "h2", text: "Personal data and cookies" },
        {
          type: "p",
          text: "How we process personal data is described in our [privacy policy](/privacy). Information about cookies is available in our [cookie policy](/cookies).",
        },
        { type: "h2", text: "Governing law and disputes" },
        {
          type: "p",
          text: "These terms are governed by Swedish law. Disputes shall primarily be resolved through dialogue and otherwise be settled by the general courts of Sweden.",
        },
        { type: "h2", text: "Changes and contact" },
        {
          type: "p",
          text: `We may update these terms when needed. The latest version is always available on this page. Questions are answered at ${email}.`,
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      metaTitle: "Cookie Policy",
      metaDescription: "Information about how the Nordic Pixel website uses cookies.",
      intro: "This page explains what cookies are and how our website uses them.",
      body: [
        { type: "h2", text: "What are cookies?" },
        {
          type: "p",
          text: "Cookies are small text files that a website stores on your computer, phone or tablet. They are used, for example, to remember settings, measure visits or show ads. Similar technologies, such as local storage in the browser, are covered by the same rules.",
        },
        { type: "h2", text: "How we use cookies" },
        {
          type: "p",
          text: "Our website currently uses **no cookies** — not for analytics, marketing or any other purpose — and no similar technologies that store information in your browser. That's why we don't show a cookie banner.",
        },
        {
          type: "p",
          text: "The website also doesn't load any external services, fonts or third-party scripts. Fonts are served directly from our own server.",
        },
        { type: "h2", text: "If we start using cookies" },
        {
          type: "p",
          text: "If we decide to use analytics tools in the future, we will update this policy and, where the Swedish Electronic Communications Act requires it, ask for your consent before any non-essential cookies are stored.",
        },
        { type: "h2", text: "Managing cookies in your browser" },
        {
          type: "p",
          text: "You can delete cookies and choose which cookies to allow in your browser settings at any time. See your browser's help pages for details.",
        },
        { type: "h2", text: "Questions" },
        {
          type: "p",
          text: `If you have questions about our use of cookies, you're welcome to contact us at ${email}. Read more about how we process personal data in our [privacy policy](/privacy).`,
        },
      ],
    },
  },
};

export function getLegalPage(locale: Locale, id: LegalPageId): LegalPage {
  return PAGES[locale][id];
}
