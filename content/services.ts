import type { FaqItem, Locale, Localized, ServiceId, StaticPathname, TitledText } from "./types";

export type Service = {
  id: ServiceId;
  /** Internal route — localized by next-intl (e.g. /sv/tjanster/webbutveckling). */
  href: StaticPathname;
  number: string;
  title: string;
  shortTitle: string;
  /** One-liner used in service lists. */
  summary: string;
  /** Lead paragraph on the service page. */
  intro: string;
  metaTitle: string;
  metaDescription: string;
  included: TitledText[];
  fit: string[];
  approach: TitledText[];
  /** Platforms and tools — only list what is actually offered. Empty = section hidden. */
  tools: string[];
  faqs: FaqItem[];
  related: ServiceId[];
};

type ServiceBase = Pick<Service, "id" | "href" | "number" | "tools" | "related">;
type ServiceCopy = Omit<Service, keyof ServiceBase>;

const BASE: ServiceBase[] = [
  {
    id: "web-development",
    href: "/services/web-development",
    number: "01",
    tools: ["Next.js", "React", "TypeScript", "WordPress"],
    related: ["e-commerce", "maintenance-growth"],
  },
  {
    id: "e-commerce",
    href: "/services/e-commerce",
    number: "02",
    tools: ["Shopify", "WooCommerce", "Klarna", "Swish"],
    related: ["web-development", "seo-google-ads"],
  },
  {
    id: "seo-google-ads",
    href: "/services/seo-google-ads",
    number: "03",
    tools: ["Google Search Console", "Google Analytics 4", "Google Ads", "Google Tag Manager"],
    related: ["digital-marketing", "web-development"],
  },
  {
    id: "branding-content",
    href: "/services/branding-content",
    number: "04",
    tools: [],
    related: ["web-development", "digital-marketing"],
  },
  {
    id: "digital-marketing",
    href: "/services/digital-marketing",
    number: "05",
    tools: ["Meta Ads", "LinkedIn Ads", "Google Analytics 4"],
    related: ["seo-google-ads", "branding-content"],
  },
  {
    id: "maintenance-growth",
    href: "/services/maintenance-growth",
    number: "06",
    tools: ["Google Analytics 4", "Google Search Console", "WordPress", "Next.js"],
    related: ["web-development", "seo-google-ads"],
  },
];

const COPY: Localized<Record<ServiceId, ServiceCopy>> = {
  sv: {
    "web-development": {
      title: "Webbdesign & webbutveckling",
      shortTitle: "Webbutveckling",
      summary: "Webbplatser som ser bra ut, laddar snabbt och gör besökare till kunder.",
      intro:
        "Vi designar och utvecklar webbplatser som gör ditt företag lätt att förstå, lätt att lita på och lätt att kontakta. Snabba, tillgängliga och byggda på en grund som kan växa med dig.",
      metaTitle: "Webbdesign & webbutveckling",
      metaDescription:
        "Skräddarsydda webbplatser som är snabba, tillgängliga och konverterar. Strategi, UX, design och utveckling från ett skandinaviskt team.",
      included: [
        {
          title: "Strategi & struktur",
          text: "Vi definierar mål, målgrupper, sidstruktur och innehållshierarki innan vi designar en enda pixel.",
        },
        {
          title: "UX- & gränssnittsdesign",
          text: "Wireframes och visuell design för alla skärmstorlekar, byggd på ett konsekvent och återanvändbart designsystem.",
        },
        {
          title: "Utveckling",
          text: "Moderna och säkra lösningar i Next.js eller WordPress – valda efter dina behov, inte efter våra vanor.",
        },
        {
          title: "Publiceringsverktyg",
          text: "Ett redigeringsläge där ditt team själva kan uppdatera sidor, texter och bilder utan att ringa en utvecklare.",
        },
        {
          title: "Teknisk SEO & prestanda",
          text: "Ren kod, strukturerad data och snabba laddtider ger en stark teknisk grund för synlighet i sök.",
        },
        {
          title: "Tillgänglighet",
          text: "Vi följer WCAG-riktlinjerna så att din webbplats fungerar för fler människor, på fler enheter.",
        },
      ],
      fit: [
        "Du startar ett nytt företag, en ny produkt eller ett nytt varumärke.",
        "Din nuvarande webbplats speglar inte längre kvaliteten i ditt företag.",
        "Webbplatsen är långsam, svår att uppdatera eller svår att mäta.",
        "Du vill få fler förfrågningar från trafiken du redan har.",
      ],
      approach: [
        {
          title: "Workshop & brief",
          text: "Vi kartlägger mål, målgrupp och krav, och kommer överens om omfattning, tidplan och budget.",
        },
        {
          title: "Struktur & design",
          text: "Sidstruktur, wireframes och visuell design, som vi går igenom tillsammans vid tydliga avstämningar.",
        },
        {
          title: "Utveckling & innehåll",
          text: "Vi bygger, kopplar på integrationer och lägger in innehållet – i en testmiljö där du kan följa arbetet.",
        },
        {
          title: "Lansering & uppföljning",
          text: "Tester, omdirigeringar, mätning och lansering – följt av en genomgång av hur webbplatsen presterar.",
        },
      ],
      faqs: [
        {
          question: "Hur lång tid tar det att ta fram en ny webbplats?",
          answer:
            "De flesta företagswebbplatser tar mellan fyra och tio veckor från uppstart till lansering, beroende på omfattning. Större webbplatser med integrationer tar längre tid. Du får en tidplan tillsammans med vårt förslag.",
        },
        {
          question: "Kan ni göra om vår befintliga webbplats?",
          answer:
            "Ja. Vi börjar med att se över det som fungerar i dag – innehåll, placeringar i sök och statistik – så att den nya webbplatsen förbättrar resultatet i stället för att nollställa det.",
        },
        {
          question: "Kan vi uppdatera webbplatsen själva?",
          answer:
            "Ja. Vi sätter upp ett publiceringsverktyg som passar ditt team och visar hur det fungerar innan lansering.",
        },
      ],
    },
    "e-commerce": {
      title: "E-handel",
      shortTitle: "E-handel",
      summary: "Högpresterande e-handel i Shopify, WooCommerce och skräddarsydda lösningar.",
      intro:
        "Vi bygger e-handel som är enkel att handla i, enkel att administrera och redo att skala – i Shopify, WooCommerce eller en skräddarsydd lösning, beroende på vad ditt företag behöver.",
      metaTitle: "E-handel – Shopify & WooCommerce",
      metaDescription:
        "E-handel byggd i Shopify, WooCommerce eller skräddarsydda lösningar. Konverteringsfokuserad design, betalningar, integrationer och stöd för tillväxt.",
      included: [
        {
          title: "Plattformsrådgivning",
          text: "En ärlig rekommendation om Shopify, WooCommerce eller en skräddarsydd lösning, utifrån dina produkter, volymer och planer.",
        },
        {
          title: "Butiksdesign",
          text: "Produktsidor, kategorier, sök och kassa som gör det enkelt att handla – på alla enheter.",
        },
        {
          title: "Betalning & frakt",
          text: "Uppsättning av betalsätt som Klarna, Swish och kortbetalning, samt frakt- och momsregler.",
        },
        {
          title: "Integrationer",
          text: "Kopplingar till lager, affärssystem, bokföring, marknadsföringsverktyg och andra system du redan använder.",
        },
        {
          title: "Migrering",
          text: "Flytt av produkter, kunder och orderhistorik från en befintlig plattform – utan att tappa synlighet i sök.",
        },
        {
          title: "Konverteringsoptimering",
          text: "Löpande förbättringar av produktsidor, varukorg och kassa baserat på verklig användardata.",
        },
      ],
      fit: [
        "Du ska börja sälja online för första gången.",
        "Din nuvarande butik är långsam, föråldrad eller svår att administrera.",
        "Du har vuxit ur din plattform och behöver integrationer.",
        "Du vill sälja till kunder i hela Norden eller Europa.",
      ],
      approach: [
        {
          title: "Kartläggning",
          text: "Produkter, kunder, logistik och system – vi kartlägger hur ditt företag faktiskt fungerar.",
        },
        {
          title: "Plattform & design",
          text: "Vi väljer plattform och designar köpupplevelsen från produktsida till orderbekräftelse.",
        },
        {
          title: "Bygg & integrera",
          text: "Butiksuppsättning, tema eller skräddarsydd utveckling, betalningar, frakt och integrationer.",
        },
        {
          title: "Lansera & optimera",
          text: "En testad lansering, mätning på plats och löpande förbättringar när de riktiga kunderna kommer.",
        },
      ],
      faqs: [
        {
          question: "Shopify eller WooCommerce – vad är bäst?",
          answer:
            "Det beror på dina produkter, din budget och hur mycket kontroll du behöver. Shopify går snabbt att lansera och kräver lite underhåll, medan WooCommerce ger större flexibilitet i WordPress. Vi rekommenderar det som passar din situation.",
        },
        {
          question: "Kan ni flytta vår befintliga butik till en ny plattform?",
          answer:
            "Ja. Vi migrerar produkter, kunder och ordrar och sätter upp omdirigeringar så att du behåller dina placeringar i sök.",
        },
        {
          question: "Kan ni sätta upp Klarna och Swish?",
          answer:
            "Ja. Vi sätter upp de betalsätt som svenska kunder förväntar sig, som Klarna, Swish och kortbetalning, via den betalleverantör som passar din butik.",
        },
      ],
    },
    "seo-google-ads": {
      title: "SEO & Google Ads",
      shortTitle: "SEO & Google Ads",
      summary: "Öka synligheten, locka rätt trafik och gör sökningar till kunder.",
      intro:
        "Vi hjälper rätt kunder att hitta dig – med långsiktig sökmotoroptimering och Google Ads-kampanjer som mäts mot verkliga affärsmål, inte mot fåfänga siffror.",
      metaTitle: "SEO & Google Ads",
      metaDescription:
        "Sökmotoroptimering och Google Ads för svenska och nordiska företag. Teknisk SEO, innehåll, lokal SEO och kampanjer som går att mäta.",
      included: [
        {
          title: "SEO-analys",
          text: "En genomgång av teknik och innehåll som visar vad som håller tillbaka din synlighet och vad som bör åtgärdas först.",
        },
        {
          title: "Sökords- & innehållsstrategi",
          text: "Analys av vad dina kunder söker efter, omsatt i en tydlig plan för sidor och innehåll.",
        },
        {
          title: "Teknisk SEO",
          text: "Laddtider, indexering, strukturerad data och webbplatsens arkitektur – grunden som sökmotorerna bygger på.",
        },
        {
          title: "Lokal SEO",
          text: "Google Företagsprofil och lokala signaler för företag som har kunder i specifika städer eller regioner.",
        },
        {
          title: "Annonsering i Google Ads",
          text: "Sök-, Performance Max- och remarketingkampanjer som sätts upp och optimeras mot dina mål.",
        },
        {
          title: "Mätning & rapportering",
          text: "Konverteringsspårning i Google Analytics 4 och tydliga rapporter som du faktiskt kan använda.",
        },
      ],
      fit: [
        "Dina konkurrenter syns i Google – men inte du.",
        "Du får trafik, men inte rätt sorts trafik.",
        "Du annonserar utan att veta vad det ger tillbaka.",
        "Du vill ha ett jämnt flöde av förfrågningar som inte bara bygger på sociala medier.",
      ],
      approach: [
        {
          title: "Analys & mål",
          text: "Vi går igenom ditt nuläge, dina konkurrenter och din mätning, och definierar vad framgång betyder.",
        },
        {
          title: "Strategi",
          text: "Prioriterade sökord, innehållsplan och kampanjstruktur, anpassade efter din budget.",
        },
        {
          title: "Genomförande",
          text: "Tekniska åtgärder, innehållsproduktion och kampanjuppsättning, i fokuserade etapper.",
        },
        {
          title: "Mät & förbättra",
          text: "Månatlig rapportering och löpande optimering utifrån vad datan visar.",
        },
      ],
      faqs: [
        {
          question: "Hur lång tid tar det innan SEO ger resultat?",
          answer:
            "SEO är en långsiktig investering. Tekniska förbättringar kan ge effekt inom några veckor, medan placeringar på konkurrensutsatta sökord oftast kräver flera månaders kontinuerligt arbete.",
        },
        {
          question: "Garanterar ni förstaplatsen på Google?",
          answer:
            "Nej – och var försiktig med den som gör det. Ingen styr Googles rankning. Vi fokuserar på arbetet som förbättrar synligheten över tid och rapporterar öppet om utvecklingen.",
        },
        {
          question: "Äger vi vårt Google Ads-konto?",
          answer:
            "Ja. Kampanjerna körs i ett konto som tillhör ditt företag, så att du behåller all data och historik även om vi slutar samarbeta.",
        },
      ],
    },
    "branding-content": {
      title: "Branding & innehåll",
      shortTitle: "Branding",
      summary: "Bygg en konsekvent varumärkesidentitet i hela din digitala närvaro.",
      intro:
        "Vi formar hur ditt företag ser ut, låter och känns – från logotyp och visuell identitet till orden och bilderna som bär ditt varumärke i varje kanal.",
      metaTitle: "Branding & innehåll",
      metaDescription:
        "Varumärkesidentitet, logotyp, tonalitet och innehåll för webb och sociala medier. Konsekvent och igenkännbar branding för växande företag.",
      included: [
        {
          title: "Varumärkesplattform",
          text: "Positionering, värderingar och budskap som gör det tydligt vad du står för och varför kunder ska välja dig.",
        },
        {
          title: "Visuell identitet",
          text: "Logotyp, färger, typografi och grafiska element, utformade som ett sammanhängande system.",
        },
        {
          title: "Grafisk manual",
          text: "En praktisk guide som hjälper ditt team och dina partners att använda varumärket konsekvent.",
        },
        {
          title: "Tonalitet",
          text: "Hur ditt varumärke låter – definierat med exempel, så att varje text låter som du.",
        },
        {
          title: "Webb- & marknadsföringstexter",
          text: "Tydliga och övertygande texter på svenska och engelska för webbplats, kampanjer och säljmaterial.",
        },
        {
          title: "Bild & grafik",
          text: "Riktlinjer för foto och illustration, samt grafiska mallar för sociala medier och presentationer.",
        },
      ],
      fit: [
        "Du startar ett nytt företag eller lanserar ett nytt erbjudande.",
        "Ditt varumärke ser olika ut i varje kanal.",
        "Företaget har vuxit, men varumärket har inte hängt med.",
        "Du behöver innehåll som förklarar vad du gör – tydligt.",
      ],
      approach: [
        {
          title: "Insikt",
          text: "Intervjuer, workshops och en genomgång av din marknad och dina konkurrenter.",
        },
        {
          title: "Plattform",
          text: "Positionering, budskap och personlighet, förankrade innan designarbetet börjar.",
        },
        {
          title: "Identitet",
          text: "Visuella koncept, förfining och ett komplett identitetssystem.",
        },
        {
          title: "Implementering",
          text: "Riktlinjer, mallar och implementering på din webbplats och i dina kanaler.",
        },
      ],
      faqs: [
        {
          question: "Gör ni bara logotyper?",
          answer:
            "Vi rekommenderar sällan en logotyp på egen hand. En logotyp fungerar bäst som en del av en helhet – färger, typografi och riktlinjer – så att varumärket känns konsekvent överallt där det syns.",
        },
        {
          question: "Kan ni skriva innehåll på både svenska och engelska?",
          answer:
            "Ja. Vi skriver och anpassar innehåll på svenska och engelska, så att ditt varumärke låter naturligt på båda språken.",
        },
        {
          question: "Kan ni förnya vårt befintliga varumärke i stället för att börja om?",
          answer:
            "Ja. Ofta blir det bästa resultatet en vidareutveckling – där du behåller det som kunderna redan känner igen och lyfter helheten och kvaliteten.",
        },
      ],
    },
    "digital-marketing": {
      title: "Digital marknadsföring",
      shortTitle: "Digital marknadsföring",
      summary: "Sociala medier, kampanjer, innehåll och leadsgenerering.",
      intro:
        "Vi planerar och driver marknadsföring som gör uppmärksamhet till affärer – kampanjer, sociala medier och innehåll kopplat till tydliga mål och följt upp med verklig data.",
      metaTitle: "Digital marknadsföring",
      metaDescription:
        "Digital marknadsföring för växande företag: sociala medier, annonsering på Meta och LinkedIn, innehållsmarknadsföring, e-post och leadsgenerering.",
      included: [
        {
          title: "Marknadsföringsstrategi",
          text: "Kanaler, budskap och budgetprioriteringar baserade på var dina kunder faktiskt finns.",
        },
        {
          title: "Sociala medier",
          text: "Innehållsplanering, produktion och community management för de plattformar som är viktiga för dig.",
        },
        {
          title: "Annonsering i sociala medier",
          text: "Kampanjer på Meta, LinkedIn och andra plattformar, med tydlig målgruppsstyrning och tester av budskap och kreativ.",
        },
        {
          title: "Innehållsmarknadsföring",
          text: "Artiklar, guider och kundcase som bygger förtroende och stöttar din försäljning.",
        },
        {
          title: "E-post & automation",
          text: "Nyhetsbrev och automatiserade flöden som vårdar leads och får kunder att komma tillbaka.",
        },
        {
          title: "Leadsgenerering",
          text: "Landningssidor, erbjudanden och uppföljningsflöden som gör besökare till kvalificerade leads.",
        },
      ],
      fit: [
        "Du publicerar i sociala medier, men det leder ingenstans.",
        "Du behöver ett jämnt flöde av nya leads.",
        "Du ska lansera en produkt, tjänst eller kampanj.",
        "Du vill ha marknadsföring som är planerad, inte improviserad.",
      ],
      approach: [
        { title: "Planera", text: "Mål, målgrupper, kanaler och en realistisk budget." },
        { title: "Skapa", text: "Innehåll och kampanjmaterial anpassat för varje kanal." },
        { title: "Lansera", text: "Kampanjer live, med mätning på plats från första dagen." },
        { title: "Lära", text: "Regelbunden rapportering och justeringar baserat på resultaten." },
      ],
      faqs: [
        {
          question: "Vilka sociala medier ska vi finnas i?",
          answer:
            "Bara de som dina kunder använder. För många B2B-företag är det LinkedIn, för konsumentvarumärken ofta Instagram, Facebook eller TikTok. Vi hjälper dig att prioritera i stället för att sprida dig för tunt.",
        },
        {
          question: "Ingår annonsbudgeten i ert arvode?",
          answer:
            "Nej. Annonskostnaden betalas direkt till plattformarna, så att du alltid ser exakt vad som går till annonser och vad som går till vårt arbete.",
        },
        {
          question: "Hur vet vi att marknadsföringen fungerar?",
          answer:
            "Vi kommer överens om mål och nyckeltal från start, sätter upp mätning och rapporterar på de siffror som betyder något för ditt företag – som leads, försäljning och kostnad per ny kund.",
        },
      ],
    },
    "maintenance-growth": {
      title: "Underhåll & tillväxt",
      shortTitle: "Underhåll",
      summary: "Löpande uppdateringar, optimering, säkerhet, analys och support.",
      intro:
        "En webbplats blir aldrig helt färdig. Vi håller din säker, snabb och uppdaterad – och hjälper den att bli bättre månad för månad med datadriven optimering.",
      metaTitle: "Underhåll & tillväxt för webbplatser",
      metaDescription:
        "Löpande underhåll av webbplatser: säkerhetsuppdateringar, backup, övervakning, prestanda, analys och kontinuerliga förbättringar – som ett månatligt samarbete.",
      included: [
        {
          title: "Uppdateringar & säkerhet",
          text: "Regelbundna uppdateringar av plattform, tillägg och beroenden, samt säkerhetsövervakning.",
        },
        {
          title: "Backup & drift",
          text: "Automatisk backup och övervakning, så att problem upptäcks tidigt och åtgärdas snabbt.",
        },
        {
          title: "Prestanda",
          text: "Laddtider och Core Web Vitals följs upp över tid – inte bara vid lansering.",
        },
        {
          title: "Analys & insikter",
          text: "Rapporter som visar hur webbplatsen presterar och var möjligheterna finns.",
        },
        {
          title: "Löpande förbättringar",
          text: "Nya sidor, funktioner och designförbättringar, prioriterade tillsammans med dig.",
        },
        {
          title: "Support",
          text: "Ett team som känner din webbplats och hjälper till när du behöver ändringar eller har frågor.",
        },
      ],
      fit: [
        "Ingen i ditt team har ansvar för webbplatsen.",
        "Webbplatsen har inte uppdaterats sedan lanseringen.",
        "Du oroar dig för säkerhet, driftstopp eller förlorad data.",
        "Du vill att webbplatsen ska fortsätta bli bättre över tid.",
      ],
      approach: [
        { title: "Hälsokontroll", text: "Vi går igenom webbplatsens nuläge, hosting och säkerhet." },
        { title: "Plan", text: "Vi kommer överens om rätt supportnivå och en lista med prioriteringar." },
        { title: "Löpande skötsel", text: "Uppdateringar, övervakning och backup sker kontinuerligt i bakgrunden." },
        {
          title: "Månatliga förbättringar",
          text: "Regelbundna avstämningar och förbättringar utifrån data och dina mål.",
        },
      ],
      faqs: [
        {
          question: "Kan ni ta hand om en webbplats som ni inte har byggt?",
          answer:
            "Oftast, ja. Vi börjar med en teknisk genomgång för att förstå kodbas, hosting och eventuella risker innan vi tar över.",
        },
        {
          question: "Måste vi skriva ett långt avtal?",
          answer:
            "Underhåll erbjuds som ett månatligt paket. Omfattning och uppsägningstid kommer vi överens om i förslaget, utifrån dina behov.",
        },
        {
          question: "Vad händer om något går sönder?",
          answer:
            "Vi övervakar din webbplats och agerar på problem enligt avtalet. Svarstider definieras i ditt paket, så att du alltid vet vad du kan förvänta dig.",
        },
      ],
    },
  },
  en: {
    "web-development": {
      title: "Web Design & Development",
      shortTitle: "Web Development",
      summary: "Websites designed to look great, perform fast and convert visitors into customers.",
      intro:
        "We design and develop websites that make your business easy to understand, easy to trust and easy to contact. Fast, accessible and built on a foundation that can grow with you.",
      metaTitle: "Web Design & Development",
      metaDescription:
        "Custom websites designed for performance, accessibility and conversion. Strategy, UX, design and development from one Scandinavian team.",
      included: [
        {
          title: "Strategy & structure",
          text: "We define goals, audiences, sitemap and content hierarchy before a single pixel is designed.",
        },
        {
          title: "UX & interface design",
          text: "Wireframes and visual design for every screen size, built on a consistent, reusable design system.",
        },
        {
          title: "Development",
          text: "Modern, secure builds in Next.js or WordPress — chosen for your needs, not for our habits.",
        },
        {
          title: "Content management",
          text: "An editing setup that lets your team update pages, texts and images without calling a developer.",
        },
        {
          title: "Technical SEO & speed",
          text: "Clean markup, structured data and fast load times give you a strong technical foundation for search.",
        },
        {
          title: "Accessibility",
          text: "We follow the WCAG guidelines so that your website works for more people, on more devices.",
        },
      ],
      fit: [
        "You are launching a new company, product or brand.",
        "Your current website no longer reflects the quality of your business.",
        "Your website is slow, hard to update or difficult to measure.",
        "You want more inquiries from the traffic you already have.",
      ],
      approach: [
        {
          title: "Workshop & brief",
          text: "We map your goals, audience and requirements, and agree on scope, timeline and budget.",
        },
        {
          title: "Structure & design",
          text: "Sitemap, wireframes and visual design, reviewed together with you at clear checkpoints.",
        },
        {
          title: "Development & content",
          text: "We build, connect integrations and add your content — on a staging site where you can follow along.",
        },
        {
          title: "Launch & follow-up",
          text: "Testing, redirects, analytics and launch — followed by a review of how the website performs.",
        },
      ],
      faqs: [
        {
          question: "How long does a new website take?",
          answer:
            "Most company websites take between four and ten weeks from kickoff to launch, depending on scope. Larger websites with integrations take longer. You'll get a timeline together with our proposal.",
        },
        {
          question: "Can you redesign our existing website?",
          answer:
            "Yes. We start by reviewing what works today — content, search rankings and analytics — so that the new website improves your results instead of resetting them.",
        },
        {
          question: "Will we be able to update the website ourselves?",
          answer:
            "Yes. We set up a content management system that suits your team and show you how it works before launch.",
        },
      ],
    },
    "e-commerce": {
      title: "E-Commerce",
      shortTitle: "E-Commerce",
      summary: "High-performing Shopify, WooCommerce and custom e-commerce experiences.",
      intro:
        "We build online stores that are easy to shop, easy to manage and ready to scale — on Shopify, WooCommerce or a custom solution, depending on what your business needs.",
      metaTitle: "E-Commerce Development — Shopify & WooCommerce",
      metaDescription:
        "Online stores built on Shopify, WooCommerce or custom solutions. Conversion-focused design, payments, integrations and support for growth.",
      included: [
        {
          title: "Platform advice",
          text: "An honest recommendation on Shopify, WooCommerce or a custom solution, based on your products, volumes and plans.",
        },
        {
          title: "Store design",
          text: "Product pages, collections, search and checkout designed to make buying simple — on every device.",
        },
        {
          title: "Payments & shipping",
          text: "Setup of payment methods such as Klarna, Swish and card payments, plus shipping and VAT rules.",
        },
        {
          title: "Integrations",
          text: "Connections to inventory, ERP, accounting, marketing tools and other systems you already use.",
        },
        {
          title: "Migration",
          text: "Moving products, customers and order history from an existing platform — without losing search visibility.",
        },
        {
          title: "Conversion optimisation",
          text: "Continuous improvements to product pages, cart and checkout based on real user data.",
        },
      ],
      fit: [
        "You are about to start selling online for the first time.",
        "Your current store is slow, outdated or hard to manage.",
        "You have outgrown your platform and need integrations.",
        "You want to sell to customers across the Nordics or Europe.",
      ],
      approach: [
        {
          title: "Discovery",
          text: "Products, customers, logistics and systems — we map how your business actually works.",
        },
        {
          title: "Platform & design",
          text: "We choose the platform and design the shopping experience from product page to order confirmation.",
        },
        {
          title: "Build & integrate",
          text: "Store setup, theme or custom development, payments, shipping and integrations.",
        },
        {
          title: "Launch & optimise",
          text: "A tested launch, tracking in place and continuous improvements once real customers arrive.",
        },
      ],
      faqs: [
        {
          question: "Shopify or WooCommerce — which is better?",
          answer:
            "It depends on your products, your budget and how much control you need. Shopify is fast to launch and low-maintenance, while WooCommerce offers more flexibility within WordPress. We recommend what fits your situation.",
        },
        {
          question: "Can you move our existing store to a new platform?",
          answer:
            "Yes. We migrate products, customers and orders, and set up redirects so that you keep your search rankings.",
        },
        {
          question: "Can you set up Klarna and Swish?",
          answer:
            "Yes. We set up the payment methods Swedish customers expect, such as Klarna, Swish and card payments, through the payment provider that suits your store.",
        },
      ],
    },
    "seo-google-ads": {
      title: "SEO & Google Ads",
      shortTitle: "SEO & Google Ads",
      summary: "Increase visibility, attract qualified traffic and turn searches into customers.",
      intro:
        "We help the right customers find you — with long-term search engine optimisation and Google Ads campaigns measured against real business goals, not vanity metrics.",
      metaTitle: "SEO & Google Ads",
      metaDescription:
        "Search engine optimisation and Google Ads for Swedish and Nordic businesses. Technical SEO, content, local SEO and measurable campaigns.",
      included: [
        {
          title: "SEO audit",
          text: "A technical and content review that shows what holds your visibility back and what to fix first.",
        },
        {
          title: "Keyword & content strategy",
          text: "Research into what your customers search for, turned into a clear plan for pages and content.",
        },
        {
          title: "Technical SEO",
          text: "Load times, indexing, structured data and site architecture — the foundation search engines rely on.",
        },
        {
          title: "Local SEO",
          text: "Google Business Profile and local signals for businesses that serve customers in specific cities or regions.",
        },
        {
          title: "Google Ads management",
          text: "Search, Performance Max and remarketing campaigns, set up and optimised against your goals.",
        },
        {
          title: "Tracking & reporting",
          text: "Conversion tracking in Google Analytics 4 and clear reports you can actually use.",
        },
      ],
      fit: [
        "Your competitors show up in Google — you don't.",
        "You get traffic, but not the right kind.",
        "You advertise without knowing what it returns.",
        "You want a steady flow of inquiries that doesn't rely on social media alone.",
      ],
      approach: [
        {
          title: "Audit & goals",
          text: "We review your current position, your competitors and your tracking, and define what success means.",
        },
        {
          title: "Strategy",
          text: "Keyword priorities, content plan and campaign structure, adapted to your budget.",
        },
        {
          title: "Execution",
          text: "Technical fixes, content production and campaign setup, delivered in focused iterations.",
        },
        {
          title: "Measure & improve",
          text: "Monthly reporting and continuous optimisation based on what the data shows.",
        },
      ],
      faqs: [
        {
          question: "How long does SEO take to show results?",
          answer:
            "SEO is a long-term investment. Technical improvements can have an effect within weeks, while rankings for competitive keywords usually take several months of consistent work.",
        },
        {
          question: "Do you guarantee the first position on Google?",
          answer:
            "No — and be careful with anyone who does. Nobody controls Google's rankings. We focus on the work that improves visibility over time and report openly on progress.",
        },
        {
          question: "Do we own our Google Ads account?",
          answer:
            "Yes. Campaigns run in an account that belongs to your company, so you keep all data and history even if we stop working together.",
        },
      ],
    },
    "branding-content": {
      title: "Branding & Content",
      shortTitle: "Branding",
      summary: "Build a consistent brand identity across your digital presence.",
      intro:
        "We shape how your business looks, sounds and feels — from logo and visual identity to the words and images that carry your brand across every channel.",
      metaTitle: "Branding & Content",
      metaDescription:
        "Brand identity, logo design, tone of voice and content for web and social media. Consistent, recognisable branding for growing businesses.",
      included: [
        {
          title: "Brand platform",
          text: "Positioning, values and messaging that make it clear what you stand for and why customers should choose you.",
        },
        {
          title: "Visual identity",
          text: "Logo, colours, typography and graphic elements, designed as one coherent system.",
        },
        {
          title: "Brand guidelines",
          text: "A practical guide that helps your team and partners use the brand consistently.",
        },
        {
          title: "Tone of voice",
          text: "How your brand speaks — defined with examples, so that every text sounds like you.",
        },
        {
          title: "Website & marketing copy",
          text: "Clear, persuasive copy in Swedish and English for your website, campaigns and sales material.",
        },
        {
          title: "Imagery & graphics",
          text: "Guidelines for photography and illustration, plus graphic templates for social media and presentations.",
        },
      ],
      fit: [
        "You are starting a new company or launching a new offer.",
        "Your brand looks different in every channel.",
        "Your company has grown, but your brand hasn't kept up.",
        "You need content that explains what you do — clearly.",
      ],
      approach: [
        { title: "Insight", text: "Interviews, workshops and a review of your market and competitors." },
        { title: "Platform", text: "Positioning, messaging and personality, agreed before design starts." },
        { title: "Identity", text: "Visual concepts, refinement and a complete identity system." },
        { title: "Rollout", text: "Guidelines, templates and implementation on your website and channels." },
      ],
      faqs: [
        {
          question: "Do you only design logos?",
          answer:
            "We rarely recommend a logo on its own. A logo works best as part of a whole — colours, typography and guidelines — so that the brand feels consistent wherever it appears.",
        },
        {
          question: "Can you write content in both Swedish and English?",
          answer:
            "Yes. We write and adapt content in Swedish and English, so that your brand sounds natural in both languages.",
        },
        {
          question: "Can you refresh our existing brand instead of starting over?",
          answer:
            "Yes. Often the best result is an evolution — keeping what customers already recognise while raising consistency and quality.",
        },
      ],
    },
    "digital-marketing": {
      title: "Digital Marketing",
      shortTitle: "Digital Marketing",
      summary: "Social media, campaigns, content and lead generation.",
      intro:
        "We plan and run marketing that turns attention into business — campaigns, social media and content tied to clear goals and followed up with real data.",
      metaTitle: "Digital Marketing",
      metaDescription:
        "Digital marketing for growing businesses: social media, paid campaigns on Meta and LinkedIn, content marketing, email and lead generation.",
      included: [
        {
          title: "Marketing strategy",
          text: "Channels, messages and budget priorities based on where your customers actually spend their time.",
        },
        {
          title: "Social media",
          text: "Content planning, production and community management for the platforms that matter to you.",
        },
        {
          title: "Paid social",
          text: "Campaigns on Meta, LinkedIn and other platforms, with clear targeting and testing of messages and creative.",
        },
        {
          title: "Content marketing",
          text: "Articles, guides and case studies that build trust and support your sales.",
        },
        {
          title: "Email & automation",
          text: "Newsletters and automated flows that nurture leads and bring customers back.",
        },
        {
          title: "Lead generation",
          text: "Landing pages, offers and follow-up flows that turn visitors into qualified leads.",
        },
      ],
      fit: [
        "You post on social media, but it doesn't lead anywhere.",
        "You need a steady flow of new leads.",
        "You are launching a product, service or campaign.",
        "You want marketing that is planned, not improvised.",
      ],
      approach: [
        { title: "Plan", text: "Goals, audiences, channels and a realistic budget." },
        { title: "Create", text: "Content and campaign material adapted to each channel." },
        { title: "Launch", text: "Campaigns go live, with tracking in place from day one." },
        { title: "Learn", text: "Regular reporting and adjustments based on the results." },
      ],
      faqs: [
        {
          question: "Which social media platforms should we be on?",
          answer:
            "Only the ones your customers use. For many B2B companies that's LinkedIn; for consumer brands it's often Instagram, Facebook or TikTok. We help you prioritise instead of spreading yourself too thin.",
        },
        {
          question: "Is the advertising budget included in your fee?",
          answer:
            "No. Media spend is paid directly to the platforms, so you always see exactly what goes to ads and what goes to our work.",
        },
        {
          question: "How do we know if the marketing works?",
          answer:
            "We agree on goals and metrics from the start, set up tracking and report on the numbers that matter to your business — such as leads, sales and cost per new customer.",
        },
      ],
    },
    "maintenance-growth": {
      title: "Maintenance & Growth",
      shortTitle: "Maintenance",
      summary: "Continuous updates, optimisation, security, analytics and support.",
      intro:
        "A website is never truly finished. We keep yours secure, fast and up to date — and help it improve month after month with data-driven optimisation.",
      metaTitle: "Website Maintenance & Growth",
      metaDescription:
        "Ongoing website maintenance: security updates, backups, monitoring, performance, analytics and continuous improvements — as a monthly partnership.",
      included: [
        {
          title: "Updates & security",
          text: "Regular updates of platform, plugins and dependencies, plus security monitoring.",
        },
        {
          title: "Backups & uptime",
          text: "Automated backups and monitoring, so that problems are caught early and fixed fast.",
        },
        {
          title: "Performance",
          text: "Load times and Core Web Vitals followed up over time — not only at launch.",
        },
        {
          title: "Analytics & insights",
          text: "Reports that show how your website performs and where the opportunities are.",
        },
        {
          title: "Continuous improvements",
          text: "New pages, features and design improvements, prioritised together with you.",
        },
        {
          title: "Support",
          text: "A team that knows your website and helps when you need changes or have questions.",
        },
      ],
      fit: [
        "Nobody in your team owns the website.",
        "Your website hasn't been updated since it launched.",
        "You worry about security, downtime or lost data.",
        "You want your website to keep getting better over time.",
      ],
      approach: [
        { title: "Health check", text: "We review the current state of your website, hosting and security." },
        { title: "Plan", text: "We agree on the right level of support and a list of priorities." },
        { title: "Ongoing care", text: "Updates, monitoring and backups run continuously in the background." },
        {
          title: "Monthly improvements",
          text: "Regular check-ins and improvements based on data and your goals.",
        },
      ],
      faqs: [
        {
          question: "Can you maintain a website you didn't build?",
          answer:
            "Usually, yes. We start with a technical review to understand the codebase, hosting and any risks before we take over.",
        },
        {
          question: "Do we have to sign a long contract?",
          answer:
            "Maintenance is offered as a monthly package. Scope and notice period are agreed in the proposal, based on your needs.",
        },
        {
          question: "What happens if something breaks?",
          answer:
            "We monitor your website and act on issues according to the agreement. Response times are defined in your package, so you always know what to expect.",
        },
      ],
    },
  },
};

export const SERVICE_IDS: ServiceId[] = BASE.map((service) => service.id);

export function isServiceId(value: string): value is ServiceId {
  return (SERVICE_IDS as string[]).includes(value);
}

export function getServices(locale: Locale): Service[] {
  return BASE.map((base) => ({ ...base, ...COPY[locale][base.id] }));
}

export function getService(locale: Locale, id: ServiceId): Service {
  const base = BASE.find((service) => service.id === id);
  if (!base) throw new Error(`Unknown service: ${id}`);
  return { ...base, ...COPY[locale][id] };
}
