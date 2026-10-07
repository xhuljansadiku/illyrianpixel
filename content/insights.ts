import { INSIGHT_SLUGS } from "./insight-slugs";
import type { ContentBlock, Locale, Localized } from "./types";

export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  body: ContentBlock[];
};

type ArticleCopy = Omit<Article, "id" | "slug" | "publishedAt" | "updatedAt" | "readingMinutes">;

type ArticleSource = {
  id: string;
  publishedAt: string;
  updatedAt?: string;
  copy: Localized<ArticleCopy>;
};

const ARTICLES: ArticleSource[] = [
  {
    id: "seo-vs-google-ads",
    publishedAt: "2026-10-06",
    copy: {
      sv: {
        category: "SEO & Google Ads",
        title: "SEO eller Google Ads – var ska ditt företag lägga budgeten?",
        excerpt:
          "Båda kanalerna kan ge kunder via Google, men de fungerar på helt olika sätt. Så väljer du rätt – eller kombinerar dem smart.",
        metaTitle: "SEO eller Google Ads? Så väljer ditt företag rätt",
        metaDescription:
          "SEO eller Google Ads – vad ska ditt företag satsa på? Skillnaderna, när respektive kanal passar bäst och varför kombinationen ofta ger mest.",
        body: [
          {
            type: "p",
            text: "När någon söker efter det du säljer finns det två sätt att synas i Google: i annonserna högst upp på sidan eller i de organiska resultaten under dem. Med Google Ads betalar du för att synas. Med SEO förtjänar du din plats. Båda kan ge nya kunder – men de fungerar på helt olika sätt, och vad som passar bäst beror på var ditt företag befinner sig i dag.",
          },
          { type: "h2", text: "Så fungerar Google Ads" },
          {
            type: "p",
            text: "I Google Ads väljer du vilka sökningar du vill synas på och betalar när någon klickar på din annons. En välbyggd kampanj kan börja ge besökare samma dag som den startar, och du styr exakt vilka sökord, regioner och tider du syns på.",
          },
          {
            type: "p",
            text: "Baksidan är lika enkel: när du slutar betala upphör trafiken. Kostnaden beror dessutom på konkurrensen, så i konkurrensutsatta branscher kan varje klick bli dyrt. Annonser fungerar bäst när varje klick leder till en sida som är byggd för att konvertera.",
          },
          { type: "h2", text: "Så fungerar SEO" },
          {
            type: "p",
            text: "Sökmotoroptimering handlar om att göra din webbplats till det bästa svaret på det dina kunder letar efter. Det kräver en snabb och tekniskt välbyggd webbplats, innehåll som besvarar verkliga frågor och signaler som visar Google att ditt företag går att lita på.",
          },
          {
            type: "p",
            text: "SEO tar längre tid att bygga upp. Beroende på utgångsläge och konkurrens tar det ofta månader innan placeringarna på viktiga sökord rör sig. Men effekten växer över tid: en sida som rankar bra fortsätter att ge besökare utan någon kostnad per klick.",
          },
          { type: "h2", text: "De viktigaste skillnaderna" },
          {
            type: "ul",
            items: [
              "**Snabbhet:** Google Ads kan ge trafik från första dagen. SEO byggs upp gradvis under flera månader.",
              "**Kostnadsmodell:** Med annonser betalar du per klick. Med SEO investerar du i arbete och innehåll, inte i varje besök.",
              "**Varaktighet:** Annonstrafiken upphör när budgeten tar slut. Bra placeringar kan hålla i sig långt efter att arbetet är gjort.",
              "**Kontroll:** Med annonser styr du sökord, budget och tider i detalj. De organiska placeringarna avgörs av Google.",
              "**Förtroende:** Många användare hoppar över annonserna och klickar på de organiska resultaten – medan andra gärna klickar på det som först besvarar deras fråga.",
            ],
          },
          { type: "h2", text: "När Google Ads är rätt val" },
          {
            type: "ul",
            items: [
              "Du har en ny webbplats eller ett nytt företag som ännu inte syns organiskt.",
              "Du ska lansera en produkt, en kampanj eller ett säsongserbjudande.",
              "Du vill testa vilka sökord som faktiskt leder till kunder innan du investerar i innehåll.",
              "Varje ny kund är värd mycket, så även dyra klick kan löna sig.",
            ],
          },
          { type: "h2", text: "När SEO är rätt val" },
          {
            type: "ul",
            items: [
              "Du bygger för lång sikt och vill ha ett jämnt flöde av förfrågningar.",
              "Dina kunder gör noggrann research innan de köper.",
              "Du vill bli mindre beroende av betalda kanaler över tid.",
              "Din bransch har många frågor som bra innehåll kan besvara.",
            ],
          },
          { type: "h2", text: "Det starkaste alternativet är ofta båda" },
          {
            type: "p",
            text: "SEO och Google Ads konkurrerar inte med varandra – de förstärker varandra. Annonserna ger snabb data om vilka sökningar som konverterar, vilket hjälper dig att prioritera innehållet i SEO-arbetet. När de organiska placeringarna växer kan du flytta annonsbudgeten till de sökord där du ännu inte syns. Och landningssidor som förbättras för den ena kanalen ger bättre resultat i den andra.",
          },
          { type: "h2", text: "Börja med grunden" },
          {
            type: "p",
            text: "Båda kanalerna leder till samma ställe: din webbplats. Om den är långsam, otydlig eller gör det svårt att kontakta dig når varken annonser eller placeringar sin fulla potential. Se till att du har en snabb webbplats, ett tydligt budskap och konverteringsspårning på plats – utan mätning går det inte att veta vad som fungerar.",
          },
          {
            type: "callout",
            title: "Osäker på var du ska börja?",
            text: "Vi kan gå igenom ditt nuläge och rekommendera en plan som passar dina mål och din budget. [Hör av dig](/contact).",
          },
        ],
      },
      en: {
        category: "SEO & Google Ads",
        title: "SEO or Google Ads — where should your business invest?",
        excerpt:
          "Both channels can bring customers from Google, but they work in completely different ways. Here's how to choose — or combine them wisely.",
        metaTitle: "SEO or Google Ads? How to choose for your business",
        metaDescription:
          "SEO or Google Ads — where should your business invest? The key differences, when each channel fits best and why combining them often works best.",
        body: [
          {
            type: "p",
            text: "When someone searches for what you sell, there are two ways to show up on Google: in the ads at the top of the page, or in the organic results below them. With Google Ads you pay to be seen. With SEO you earn your place. Both can bring new customers — but they work in very different ways, and the right choice depends on where your business is today.",
          },
          { type: "h2", text: "How Google Ads works" },
          {
            type: "p",
            text: "In Google Ads you choose the searches you want to appear for and pay when someone clicks your ad. A well-built campaign can start bringing visitors on the day it goes live, and you control exactly which keywords, regions and times you appear for.",
          },
          {
            type: "p",
            text: "The flip side is just as simple: when you stop paying, the traffic stops. Costs also depend on competition, so in crowded industries each click can be expensive. Ads work best when every click leads to a page that is built to convert.",
          },
          { type: "h2", text: "How SEO works" },
          {
            type: "p",
            text: "Search engine optimisation is about making your website the best possible answer to what your customers are looking for. That takes a fast, technically sound website, content that answers real questions, and signals that show Google your business can be trusted.",
          },
          {
            type: "p",
            text: "SEO takes longer to build. Depending on your starting point and your competitors, it often takes months before rankings move on important keywords. But the effect compounds: a page that ranks well keeps bringing visitors without a cost per click.",
          },
          { type: "h2", text: "The key differences" },
          {
            type: "ul",
            items: [
              "**Speed:** Google Ads can deliver traffic from day one. SEO builds gradually over several months.",
              "**Cost model:** With ads you pay per click. With SEO you invest in work and content, not in each visit.",
              "**Durability:** Ad traffic stops when the budget runs out. Good rankings can last long after the work is done.",
              "**Control:** With ads you control keywords, budget and timing in detail. Organic rankings are decided by Google.",
              "**Trust:** Many users skip the ads and click the organic results — while others happily click whatever answers their question first.",
            ],
          },
          { type: "h2", text: "When Google Ads is the right choice" },
          {
            type: "ul",
            items: [
              "You have a new website or business that isn't yet visible organically.",
              "You are launching a product, a campaign or a seasonal offer.",
              "You want to test which keywords actually lead to customers before investing in content.",
              "Each new customer is worth a lot, so even expensive clicks can pay off.",
            ],
          },
          { type: "h2", text: "When SEO is the right choice" },
          {
            type: "ul",
            items: [
              "You are building for the long term and want a steady flow of inquiries.",
              "Your customers research carefully before they buy.",
              "You want to become less dependent on paid channels over time.",
              "Your industry has many questions that good content can answer.",
            ],
          },
          { type: "h2", text: "The strongest option is often both" },
          {
            type: "p",
            text: "SEO and Google Ads don't compete — they strengthen each other. Ads give you fast data on which searches convert, which helps you prioritise your SEO content. As organic rankings grow, you can shift the ad budget to the keywords where you're not yet visible. And landing pages improved for one channel deliver better results in the other.",
          },
          { type: "h2", text: "Start with the foundation" },
          {
            type: "p",
            text: "Both channels lead to the same place: your website. If it is slow, unclear or makes it hard to get in touch, neither ads nor rankings will reach their potential. Make sure you have a fast website, a clear message and conversion tracking in place — without measurement, there's no way to know what works.",
          },
          {
            type: "callout",
            title: "Not sure where to start?",
            text: "We can review your current position and recommend a plan that fits your goals and budget. [Get in touch](/contact).",
          },
        ],
      },
    },
  },
  {
    id: "website-checklist",
    publishedAt: "2026-10-06",
    copy: {
      sv: {
        category: "Webbutveckling",
        title: "Checklista inför en ny webbplats: 10 saker att förbereda",
        excerpt:
          "Med rätt förberedelser blir webbprojektet snabbare, mer kostnadseffektivt och bättre. Här är vad du bör ha klart innan du pratar med en byrå.",
        metaTitle: "Checklista inför ny webbplats – 10 saker att förbereda",
        metaDescription:
          "Ska du ta fram en ny webbplats? Tio saker att förbereda innan du kontaktar en webbyrå – från mål och innehåll till integrationer, budget och tiden efter lansering.",
        body: [
          {
            type: "p",
            text: "En ny webbplats är en stor investering, både i pengar och tid. De projekt som går smidigast är sällan de största eller dyraste – det är de där grundarbetet gjordes tidigt. Använd den här checklistan innan du kontaktar en byrå. Du behöver inte ha alla svar, men ju mer du har tänkt igenom, desto bättre blir både förslaget och resultatet.",
          },
          { type: "h2", text: "1. Bestäm vad webbplatsen ska uppnå" },
          {
            type: "p",
            text: "Börja med målet, inte med designen. Ska webbplatsen ge förfrågningar, sälja produkter, stötta rekrytering eller bygga förtroende inför försäljning? Ett tydligt huvudmål styr alla beslut som följer – från struktur till innehåll.",
          },
          { type: "h2", text: "2. Beskriv din målgrupp" },
          {
            type: "p",
            text: "Vilka är dina viktigaste kunder, och vad behöver de veta innan de väljer dig? Skriv ner deras vanligaste frågor och invändningar. Svaren blir ofta det viktigaste innehållet på webbplatsen.",
          },
          { type: "h2", text: "3. Se över det du redan har" },
          {
            type: "p",
            text: "Om du har en webbplats i dag – ta reda på vad som fungerar. Vilka sidor har flest besökare? Vilka ger förfrågningar? Vilka sökord rankar du på? En ny webbplats ska bygga vidare på det som fungerar, inte nollställa det.",
          },
          { type: "h2", text: "4. Samla exempel" },
          {
            type: "p",
            text: "Spara webbplatser du gillar – och sådana du inte gillar – och notera varför. Det kan handla om struktur, tonalitet, bilder eller hur lätt det är att hitta information. Exempel gör det mycket enklare att prata om design.",
          },
          { type: "h2", text: "5. Planera innehållet tidigt" },
          {
            type: "p",
            text: "Innehållet är den vanligaste anledningen till att webbprojekt blir försenade. Vem skriver texterna? Finns det bilder på team, lokaler eller produkter? Har ni kundcase att visa? Bestäm tidigt vem som ansvarar för vad.",
          },
          { type: "h2", text: "6. Bestäm vad ni behöver kunna redigera själva" },
          {
            type: "p",
            text: "Fundera på vem som ska uppdatera webbplatsen efter lansering och hur ofta. Nyheter, lediga jobb, produkter och kundcase kan behöva vara enkla att hantera, medan andra delar sällan ändras. Det påverkar både teknikval och budget.",
          },
          { type: "h2", text: "7. Lista era integrationer" },
          {
            type: "p",
            text: "Vilka system ska webbplatsen kopplas till? Vanliga exempel är CRM, bokningssystem, nyhetsbrev, e-handel, betalningar och analysverktyg. Integrationerna är ofta där komplexiteten finns, så det lönar sig att identifiera dem tidigt.",
          },
          { type: "h2", text: "8. Sätt en budgetram" },
          {
            type: "p",
            text: "Du behöver ingen exakt siffra, men en ram hjälper byrån att föreslå rätt lösning. Med en realistisk budget kan byrån prioritera det som skapar mest värde i stället för att gissa.",
          },
          { type: "h2", text: "9. Bestäm vem som fattar besluten" },
          {
            type: "p",
            text: "Projekt går snabbare när det är tydligt vem som ger återkoppling och vem som godkänner. Utse en huvudkontakt och håll gruppen av beslutsfattare liten – många nya åsikter sent i processen blir dyra.",
          },
          { type: "h2", text: "10. Tänk längre än till lanseringen" },
          {
            type: "p",
            text: "Lanseringen är starten, inte målgången. Vem ansvarar för uppdateringar, säkerhet och vidareutveckling? Hur ska ni mäta om webbplatsen levererar? Planera för underhåll, SEO och marknadsföring redan från början.",
          },
          { type: "h2", text: "Ta med checklistan till första mötet" },
          {
            type: "p",
            text: "En bra byrå hjälper dig med varje punkt på listan – men ju mer du har tänkt igenom, desto mer träffsäkert blir förslaget. Du sparar tid, undviker överraskningar och får en webbplats som är byggd för ditt företag från första dagen.",
          },
          {
            type: "callout",
            title: "Planerar du en ny webbplats?",
            text: "Berätta om ditt projekt så hjälper vi dig med nästa steg. [Starta ett projekt](/contact).",
          },
        ],
      },
      en: {
        category: "Web development",
        title: "Website project checklist: 10 things to prepare",
        excerpt:
          "The right preparation makes a website project faster, more cost-effective and better. Here's what to have in place before you talk to an agency.",
        metaTitle: "Website project checklist — 10 things to prepare",
        metaDescription:
          "Planning a new website? Ten things to prepare before you contact a web agency — from goals and content to integrations, budget and life after launch.",
        body: [
          {
            type: "p",
            text: "A new website is a big investment of both money and time. The projects that run smoothest are rarely the biggest or most expensive — they're the ones where the groundwork was done early. Use this checklist before you contact an agency. You don't need every answer, but the more you have thought through, the better both the proposal and the result will be.",
          },
          { type: "h2", text: "1. Define what the website should achieve" },
          {
            type: "p",
            text: "Start with the goal, not the design. Should the website generate inquiries, sell products, support recruitment or build credibility ahead of sales? A clear primary goal guides every decision that follows — from structure to content.",
          },
          { type: "h2", text: "2. Describe your target audience" },
          {
            type: "p",
            text: "Who are your most important customers, and what do they need to know before they choose you? Write down their most common questions and objections. The answers often become the most important content on the website.",
          },
          { type: "h2", text: "3. Review what you already have" },
          {
            type: "p",
            text: "If you have a website today, find out what works. Which pages get the most visitors? Which ones generate inquiries? Which keywords do you rank for? A new website should build on what works — not reset it.",
          },
          { type: "h2", text: "4. Collect examples" },
          {
            type: "p",
            text: "Save websites you like — and ones you don't — and note why. It could be the structure, the tone, the images or how easy it is to find information. Examples make it much easier to talk about design.",
          },
          { type: "h2", text: "5. Plan the content early" },
          {
            type: "p",
            text: "Content is the most common reason website projects are delayed. Who writes the copy? Do you have photos of your team, premises or products? Are there case studies you can show? Decide early who is responsible for what.",
          },
          { type: "h2", text: "6. Decide what you need to edit yourselves" },
          {
            type: "p",
            text: "Think about who will update the website after launch and how often. News, job listings, products and case studies may need to be easy to manage, while other parts rarely change. It affects both the choice of technology and the budget.",
          },
          { type: "h2", text: "7. List your integrations" },
          {
            type: "p",
            text: "Which systems should the website connect to? Common examples are CRM, booking systems, newsletters, e-commerce, payments and analytics tools. Integrations are often where the complexity lies, so it pays to identify them early.",
          },
          { type: "h2", text: "8. Set a budget range" },
          {
            type: "p",
            text: "You don't need an exact figure, but a range helps the agency propose the right solution. With a realistic budget, the agency can prioritise what creates the most value instead of guessing.",
          },
          { type: "h2", text: "9. Decide who makes the decisions" },
          {
            type: "p",
            text: "Projects move faster when it's clear who gives feedback and who approves. Appoint one main contact and keep the group of decision-makers small — lots of new opinions late in the process are expensive.",
          },
          { type: "h2", text: "10. Think beyond the launch" },
          {
            type: "p",
            text: "Launch is the start, not the finish line. Who is responsible for updates, security and further development? How will you measure whether the website delivers? Plan for maintenance, SEO and marketing from the very beginning.",
          },
          { type: "h2", text: "Bring the checklist to the first meeting" },
          {
            type: "p",
            text: "A good agency will help you with every point on this list — but the more you have thought through, the more precise the proposal will be. You'll save time, avoid surprises and get a website that is built for your business from day one.",
          },
          {
            type: "callout",
            title: "Planning a new website?",
            text: "Tell us about your project and we'll help you with the next step. [Start a project](/contact).",
          },
        ],
      },
    },
  },
  {
    id: "ecommerce-platform",
    publishedAt: "2026-10-06",
    copy: {
      sv: {
        category: "E-handel",
        title: "Shopify, WooCommerce eller skräddarsytt? Så väljer du e-handelsplattform",
        excerpt:
          "Plattformen påverkar allt från lanseringstid till löpande kostnader. En genomgång av de vanligaste alternativen – och när de passar.",
        metaTitle: "Shopify, WooCommerce eller skräddarsytt? Välj rätt e-handel",
        metaDescription:
          "Shopify, WooCommerce eller en skräddarsydd lösning? Så väljer du e-handelsplattform – fördelar, nackdelar och vad du ska tänka på när du säljer i Sverige.",
        body: [
          {
            type: "p",
            text: "Valet av e-handelsplattform är ett av de viktigaste besluten när du startar eller bygger om en webbutik. Det påverkar hur snabbt du kan lansera, vad butiken kostar att driva, vilka integrationer som är möjliga och hur mycket ditt team kan hantera på egen hand. Det finns ingen plattform som är bäst för alla – men det finns oftast en som är bäst för dig.",
          },
          { type: "h2", text: "Shopify: snabbt att lansera, enkelt att driva" },
          {
            type: "p",
            text: "Shopify är en molnbaserad plattform där hosting, säkerhet och uppdateringar sköts åt dig. Du får en stabil kassa, ett stort utbud av appar och teman och en administration som är lätt att lära sig. För många små och medelstora butiker är det den snabbaste vägen till en professionell webbutik.",
          },
          {
            type: "p",
            text: "Priset är mindre kontroll och löpande kostnader. Du betalar en månadsavgift, ofta appar utöver det, och eventuellt transaktionsavgifter beroende på abonnemang och betalningslösning. Vissa djupare anpassningar – särskilt i kassan – begränsas av plattformen.",
          },
          {
            type: "p",
            text: "**Passar om:** du vill lansera snabbt, hålla nere underhållet och säljer ett relativt standardiserat sortiment.",
          },
          { type: "h2", text: "WooCommerce: flexibelt och byggt på WordPress" },
          {
            type: "p",
            text: "WooCommerce är ett e-handelstillägg med öppen källkod för WordPress. Det ger dig stor frihet: du väljer hosting, kan anpassa nästan allt och slipper låsa in dig hos en plattform. Det är ett naturligt val om din webbplats redan bygger på WordPress eller om innehåll spelar en stor roll i din försäljning.",
          },
          {
            type: "p",
            text: "Friheten kommer med ett ansvar. Du behöver en pålitlig hosting, regelbundna uppdateringar av WordPress, teman och tillägg, och någon som håller koll på säkerhet och prestanda.",
          },
          {
            type: "p",
            text: "**Passar om:** du behöver flexibilitet, redan använder WordPress eller vill kombinera en innehållsrik webbplats med en butik.",
          },
          { type: "h2", text: "Skräddarsytt och headless: maximal kontroll" },
          {
            type: "p",
            text: "I en skräddarsydd eller headless lösning byggs butikens framsida separat – till exempel i Next.js – och kopplas till ett e-handelssystem via API:er. Det ger full kontroll över design, prestanda och integrationer, och gör det möjligt att bygga upplevelser som standardteman inte klarar.",
          },
          {
            type: "p",
            text: "Det kräver också en större budget och en utvecklingspartner på lång sikt. För många butiker är det mer än de behöver – men för varumärken med unika krav kan det bli en konkurrensfördel.",
          },
          {
            type: "p",
            text: "**Passar om:** du har stora volymer, komplexa integrationer eller krav som standardplattformar inte kan möta.",
          },
          { type: "h2", text: "Frågor att besvara innan du väljer" },
          {
            type: "ul",
            items: [
              "Hur många produkter och varianter har du, och hur ofta förändras de?",
              "Vilka betalsätt förväntar sig dina kunder – till exempel Klarna, Swish eller kort?",
              "Vilka system behöver kopplas ihop: affärssystem, lager, bokföring, frakt?",
              "Vilka marknader, språk och valutor ska du sälja i?",
              "Vem ska driva och underhålla butiken i vardagen?",
              "Vilken budget har du – för lansering och för löpande kostnader de första åren?",
            ],
          },
          { type: "h2", text: "Att sälja i Sverige: tänk på detta" },
          {
            type: "p",
            text: "Svenska kunder har tydliga förväntningar. Klarna och Swish är självklara betalsätt för många butiker, och leverans till ombud förväntas ofta som ett alternativ till hemleverans. Priser till konsumenter ska visas inklusive moms, och köpvillkoren måste spegla konsumenträttigheter som 14 dagars ångerrätt vid distansköp. Välj plattform och leverantörer som stödjer detta från början.",
          },
          { type: "h2", text: "Vårt råd: börja med dina krav" },
          {
            type: "p",
            text: "Välj inte plattform för att en konkurrent använder den – välj utifrån dina produkter, dina processer och dina planer. Kartlägg vad butiken behöver klara i dag och om två till tre år, och låt det avgöra. Rätt plattform är den som ditt team kan växa med.",
          },
          {
            type: "callout",
            title: "Behöver du hjälp att välja?",
            text: "Vi ger ärliga råd om plattform utifrån dina behov – och bygger butiken när du är redo. [Kontakta oss](/contact).",
          },
        ],
      },
      en: {
        category: "E-commerce",
        title: "Shopify, WooCommerce or custom? How to choose an e-commerce platform",
        excerpt:
          "Your platform affects everything from launch time to running costs. An overview of the most common options — and when each one fits.",
        metaTitle: "Shopify, WooCommerce or custom? Choosing an e-commerce platform",
        metaDescription:
          "Shopify, WooCommerce or a custom build? How to choose an e-commerce platform — pros, cons and what to keep in mind when selling in Sweden.",
        body: [
          {
            type: "p",
            text: "Choosing an e-commerce platform is one of the most important decisions you make when starting or rebuilding an online store. It affects how quickly you can launch, what the store costs to run, which integrations are possible and how much your team can manage on its own. No platform is best for everyone — but there is usually one that is best for you.",
          },
          { type: "h2", text: "Shopify: fast to launch, easy to run" },
          {
            type: "p",
            text: "Shopify is a hosted platform where hosting, security and updates are handled for you. You get a stable checkout, a large ecosystem of apps and themes, and an admin that is easy to learn. For many small and medium-sized stores, it is the fastest route to a professional online store.",
          },
          {
            type: "p",
            text: "The trade-off is less control and recurring costs. You pay a monthly subscription, often apps on top of that, and possibly transaction fees depending on your plan and payment setup. Some deeper customisations — especially in the checkout — are limited by the platform.",
          },
          {
            type: "p",
            text: "**A good fit if:** you want to launch quickly, keep maintenance low and sell a fairly standard range of products.",
          },
          { type: "h2", text: "WooCommerce: flexible and built on WordPress" },
          {
            type: "p",
            text: "WooCommerce is an open-source e-commerce plugin for WordPress. It gives you a lot of freedom: you choose your hosting, can customise almost everything and avoid being locked into one platform. It's a natural choice if your website already runs on WordPress or if content plays a big role in your sales.",
          },
          {
            type: "p",
            text: "That freedom comes with responsibility. You need reliable hosting, regular updates of WordPress, themes and plugins, and someone who keeps an eye on security and performance.",
          },
          {
            type: "p",
            text: "**A good fit if:** you need flexibility, already use WordPress or want to combine a content-rich website with a store.",
          },
          { type: "h2", text: "Custom and headless: maximum control" },
          {
            type: "p",
            text: "In a custom or headless solution, the storefront is built separately — for example in Next.js — and connected to a commerce backend through APIs. This gives you full control over design, performance and integrations, and makes it possible to build experiences that standard themes can't.",
          },
          {
            type: "p",
            text: "It also requires a larger budget and a long-term development partner. For many stores it's more than they need — but for brands with unique requirements it can become a competitive advantage.",
          },
          {
            type: "p",
            text: "**A good fit if:** you have high volumes, complex integrations or requirements that standard platforms can't meet.",
          },
          { type: "h2", text: "Questions to answer before you choose" },
          {
            type: "ul",
            items: [
              "How many products and variants do you have, and how often do they change?",
              "Which payment methods do your customers expect — such as Klarna, Swish or card?",
              "Which systems need to be connected: ERP, inventory, accounting, shipping?",
              "Which markets, languages and currencies will you sell in?",
              "Who will run and maintain the store day to day?",
              "What is your budget — for the launch and for running costs over the first years?",
            ],
          },
          { type: "h2", text: "Selling in Sweden: what to keep in mind" },
          {
            type: "p",
            text: "Swedish shoppers have clear expectations. Klarna and Swish are standard payment methods for many stores, and delivery to a pickup point is often expected as an alternative to home delivery. Prices for consumers must be shown including VAT, and your terms must reflect consumer rights such as the 14-day right of withdrawal for distance purchases. Choose a platform and providers that support this from the start.",
          },
          { type: "h2", text: "Our advice: start with your requirements" },
          {
            type: "p",
            text: "Don't choose a platform because a competitor uses it — choose based on your products, your processes and your plans. Map what the store needs to handle today and in two to three years, and let that decide. The right platform is the one your team can grow with.",
          },
          {
            type: "callout",
            title: "Need help choosing?",
            text: "We give honest platform advice based on your needs — and build the store when you're ready. [Contact us](/contact).",
          },
        ],
      },
    },
  },
];

function countWords(blocks: ContentBlock[]): number {
  const text = blocks
    .map((block) => {
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      if (block.type === "callout") return `${block.title ?? ""} ${block.text}`;
      return block.text;
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

function slugFor(id: string, locale: Locale): string {
  const entry = INSIGHT_SLUGS.find((item) => item.id === id);
  if (!entry) throw new Error(`Missing slug for article "${id}"`);
  return entry.slugs[locale];
}

export function getArticles(locale: Locale): Article[] {
  return ARTICLES.map(({ id, publishedAt, updatedAt, copy }) => {
    const localized = copy[locale];
    return {
      id,
      slug: slugFor(id, locale),
      publishedAt,
      updatedAt,
      readingMinutes: Math.max(2, Math.round(countWords(localized.body) / 200)),
      ...localized,
    };
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticle(locale: Locale, slug: string): Article | null {
  return getArticles(locale).find((article) => article.slug === slug) ?? null;
}
