// FAQ për faqet e shërbimeve (2026-10-24, auditimi GEO): pyetjet "Sa kushton / Sa zgjat / Çfarë
// përfshihet" janë formati që Google dhe AI-të citojnë më shpesh. Vetëm fakte që janë tashmë në
// faqe (paketat, afatet dhe pagesat nga FAQ-ja e faqes kryesore). Çmimet lexohen nga paketat PAS
// ndryshimeve te /admin (applyOverridesToCategory), që FAQ-ja të mos mbetet me çmim të vjetër.
import type { Locale } from "@/i18n/routing";
import type { ServiceCategory, ServicePackage } from "@/lib/serviceCategories";

export type ServiceFaq = { q: string; a: string };

const price = (cat: { packages: ServicePackage[] }, name: string) => {
  const p = cat.packages.find((x) => x.name === name);
  if (!p) return "";
  return p.priceNote ? `${p.price}${p.priceNote.replace(/^\s*\/\s*/, "/")}` : p.price;
};

const PAYMENT: Record<Locale, ServiceFaq> = {
  sq: {
    q: "Si funksionon pagesa?",
    a: "Për projektet deri në €1,000: 50% paradhënie për të nisur punën dhe 50% para publikimit. Mbi €1,000: 3 këste, 40% në fillim, 30% kur aprovoni dizajnin dhe 30% para lansimit.",
  },
  en: {
    q: "How does payment work?",
    a: "For projects up to €1,000: 50% upfront to start work and 50% before launch. Above €1,000: 3 instalments, 40% at the start, 30% when you approve the design and 30% before launch.",
  },
};

type Builder = (c: ServiceCategory) => ServiceFaq[];

const SQ: Record<ServiceCategory["slug"], Builder> = {
  website: (c) => [
    {
      q: "Sa kushton një website?",
      a: `Paketat janë Basic ${price(c, "Basic")} (deri në 5 faqe), Business ${price(c, "Business")} (deri në 8 faqe, 1–2 gjuhë) dhe Premium ${price(c, "Premium")} (dizajn 100% custom, SEO i avancuar). Për e-commerce ose funksione speciale, oferta e personalizuar fillon ${price(c, "Custom").toLowerCase()}.`,
    },
    {
      q: "Sa zgjat ndërtimi i një website-i?",
      a: "Mesatarisht 2–4 javë, varësisht kompleksitetit dhe sasisë së përmbajtjes. Projektet me funksione të avancuara mund të zgjasin deri në 6 javë. Në fazën e planifikimit ju japim një afat të saktë.",
    },
    {
      q: "A përfshihet SEO?",
      a: "Po, çdo website vjen me SEO bazë: strukturë e saktë, faqe të shpejta dhe meta të optimizuara. Paketa Premium përfshin SEO të avancuar on-page; strategjia e vazhdueshme SEO është shërbim i veçantë.",
    },
    PAYMENT.sq,
    {
      q: "Çfarë ndodh pas publikimit?",
      a: "Paketa Basic përfshin 30 ditë rregullime falas për gabime teknike. Business dhe Premium përfshijnë 3 muaj mirëmbajtje teknike falas. Më pas mund të vazhdoni me një paketë mujore mirëmbajtjeje.",
    },
  ],
  ecommerce: (c) => [
    {
      q: "Sa kushton një dyqan online?",
      a: `Starter ${price(c, "Starter")} (deri në 30 produkte), Growth ${price(c, "Growth")} (deri në 100 produkte, filtra dhe analitikë shitjesh) dhe Advanced ${price(c, "Advanced")} (pa limit produktesh, email automatik dhe rikuperim karroce të braktisur).`,
    },
    {
      q: "A përfshihen pagesat online?",
      a: "Po. Çdo paketë përfshin pagesa të integruara dhe checkout të optimizuar, që klienti të blejë shpejt edhe nga telefoni.",
    },
    {
      q: "Sa zgjat ndërtimi i një dyqani online?",
      a: "Varet nga numri i produkteve dhe nga integrimet që duhen. Në fazën e planifikimit ju japim një afat të saktë, para se të nisë puna.",
    },
    PAYMENT.sq,
    {
      q: "Çfarë ndodh pas lansimit?",
      a: "Starter përfshin 30 ditë rregullime falas për gabime teknike. Growth dhe Advanced përfshijnë 3 muaj mirëmbajtje teknike falas.",
    },
  ],
  "aplikacione-mobile": () => [
    {
      q: "Sa kushton një aplikacion mobile?",
      a: "Çmimi jepet me ofertë, sipas numrit të ekraneve dhe funksioneve: Starter deri në 6 ekrane, Business deri në 12 ekrane me login dhe njoftime push, Premium me pagesa, backend të personalizuar dhe dizajn 100% custom. Fillimisht diskutojmë çfarë ju duhet, pastaj ju japim çmimin. Konsultimi është falas.",
    },
    {
      q: "A funksionon aplikacioni në iOS dhe Android?",
      a: "Po. Ndërtojmë aplikacione cross-platform: një kod i vetëm për të dyja platformat, me dizajn modern për iOS dhe Android.",
    },
    {
      q: "A e publikoni aplikacionin në App Store dhe Google Play?",
      a: "Po, publikimi në App Store dhe Google Play përfshihet në çdo paketë.",
    },
    {
      q: "Çfarë ndodh pas lançimit?",
      a: "Paketa Starter përfshin 30 ditë mbështetje pas lançimit. Më pas ofrojmë mirëmbajtje, dhe nëse ju duhen funksione të reja ose upgrade, ju japim çmim të veçantë për to.",
    },
  ],
  "seo-google-ads": (c) => [
    {
      q: "Sa kushton SEO dhe Google Ads?",
      a: `Starter ${price(c, "Starter")}, Growth ${price(c, "Growth")} dhe Pro ${price(c, "Pro")}. Buxheti i reklamave nuk përfshihet: e paguani ju, direkt te Google.`,
    },
    {
      q: "Kur shihen rezultatet?",
      a: "Me Google Ads, të dhënat e para i keni brenda muajit të parë. SEO kërkon më shumë kohë: për fjalë kyçe me konkurrencë të ulët, lëvizjet e para zakonisht duken pas 3–4 muajsh, dhe rezultate më të qëndrueshme pas 6 muajsh e më shumë. Askush nuk mund të garantojë vendin e parë në Google.",
    },
    {
      q: "Sa shpesh raportoni?",
      a: "Starter: raport çdo muaj. Growth: raport çdo 2 javë dhe 1 takim në muaj. Pro: raport çdo javë dhe 2 takime në muaj.",
    },
    {
      q: "A përfshihet buxheti i reklamave në çmim?",
      a: "Jo. Çmimi i paketës mbulon punën tonë (vendosjen, optimizimin dhe raportimin). Buxhetin e reklamave e paguani ju direkt te Google, kështu e kontrolloni gjithmonë vetë.",
    },
  ],
  smm: (c) => [
    {
      q: "Sa kushton menaxhimi i social media?",
      a: `Starter ${price(c, "Starter")} (10 postime dhe 2 Reels, Instagram + Facebook), Growth ${price(c, "Growth")} (15 postime dhe 3 Reels në 3 platforma) dhe Pro ${price(c, "Pro")} (20 postime, 5 Reels, Stories ditore dhe të gjitha platformat).`,
    },
    {
      q: "Kush e krijon përmbajtjen?",
      a: "Ne. Fillojmë me disa shembuj postimesh sipas identitetit tuaj; kur ju pëlqejnë, vazhdojmë me dizajnin, caption-et, hashtag-et dhe publikimin. Sa shpesh i aprovoni postimet më pas, e caktojmë bashkë sipas marrëveshjes.",
    },
    {
      q: "A përfshihen reklamat me pagesë?",
      a: "Paketa Pro përfshin menaxhim bazë të reklamave në Meta (Facebook dhe Instagram). Paketat Starter dhe Growth fokusohen te përmbajtja organike.",
    },
    {
      q: "Si e matni rezultatin?",
      a: "Me raport të performancës: çdo muaj te Starter, çdo 2 javë te Growth, dhe çdo javë plus një call strategjik mujor te Pro.",
    },
  ],
  "branding-content": (c) => [
    {
      q: "Sa kushton një logo dhe identitet vizual?",
      a: `Basic ${price(c, "Basic")} (logo dhe paleta e ngjyrave), Standard ${price(c, "Standard")} (identitet vizual i plotë, kartëvizita dhe 1 template) dhe Premium ${price(c, "Premium")} (materiale të plota si broshura dhe prezantime, plus Brand Kit).`,
    },
    {
      q: "Çfarë merrni në fund?",
      a: "Logon në versione për web dhe print, paletën e ngjyrave dhe guidelines bazë në PDF. Te Premium merrni edhe Brand Kit të plotë në PDF dhe Figma/Canva.",
    },
    PAYMENT.sq,
  ],
  mirembajtja: (c) => [
    {
      q: "Sa kushton mirëmbajtja e website-it?",
      a: `Basic ${price(c, "Basic")} (monitorim 24/7 dhe backup javor), Pro ${price(c, "Pro")} (backup ditor, siguri e avancuar dhe 2 orë ndërhyrje në muaj) dhe Premium ${price(c, "Premium")} (5 orë ndërhyrje në muaj dhe përgjigje të njëjtën ditë pune).`,
    },
    {
      q: "Çfarë ndodh nëse faqja bie?",
      a: "Faqja monitorohet 24/7 dhe ne njoftohemi automatikisht. Koha e përgjigjes varet nga paketa: brenda 48 orësh te Basic, brenda 24 orësh te Pro dhe të njëjtën ditë pune te Premium.",
    },
    {
      q: "Sa shpesh bëhet backup?",
      a: "Çdo javë te Basic, çdo ditë te Pro, dhe çdo ditë plus një backup javor jashtë serverit (off-site) te Premium.",
    },
    {
      q: "A mirëmbani faqe të ndërtuara nga të tjerë?",
      a: "Po. Marrim përsipër edhe faqe të ndërtuara nga të tjerë: i mirëmbajmë dhe i optimizojmë, dhe kur një faqe është shumë e vjetër, mund ta rindërtojmë. Aktivizimi bëhet brenda 24 orësh.",
    },
  ],
};

const EN: Record<ServiceCategory["slug"], Builder> = {
  website: (c) => [
    {
      q: "How much does a website cost?",
      a: `Packages are Basic ${price(c, "Basic")} (up to 5 pages), Business ${price(c, "Business")} (up to 8 pages, 1–2 languages) and Premium ${price(c, "Premium")} (100% custom design, advanced SEO). For e-commerce or special features, a custom quote starts ${price(c, "Custom").toLowerCase()}.`,
    },
    {
      q: "How long does building a website take?",
      a: "On average 2–4 weeks, depending on complexity and the amount of content. Projects with advanced features can take up to 6 weeks. We give you an exact timeline during the planning phase.",
    },
    {
      q: "Is SEO included?",
      a: "Yes, every website comes with basic SEO: correct structure, fast pages and optimised meta tags. The Premium package includes advanced on-page SEO; ongoing SEO strategy is a separate service.",
    },
    PAYMENT.en,
    {
      q: "What happens after launch?",
      a: "The Basic package includes 30 days of free fixes for technical bugs. Business and Premium include 3 months of free technical maintenance. After that you can continue with a monthly maintenance plan.",
    },
  ],
  ecommerce: (c) => [
    {
      q: "How much does an online store cost?",
      a: `Starter ${price(c, "Starter")} (up to 30 products), Growth ${price(c, "Growth")} (up to 100 products, filters and sales analytics) and Advanced ${price(c, "Advanced")} (unlimited products, automated emails and abandoned-cart recovery).`,
    },
    {
      q: "Are online payments included?",
      a: "Yes. Every package includes integrated payments and an optimised checkout, so customers can buy quickly, even from their phone.",
    },
    {
      q: "How long does building an online store take?",
      a: "It depends on the number of products and the integrations you need. We give you an exact timeline during the planning phase, before work starts.",
    },
    PAYMENT.en,
    {
      q: "What happens after launch?",
      a: "Starter includes 30 days of free fixes for technical bugs. Growth and Advanced include 3 months of free technical maintenance.",
    },
  ],
  "aplikacione-mobile": () => [
    {
      q: "How much does a mobile app cost?",
      a: "Pricing is by quote, based on the number of screens and features: Starter up to 6 screens, Business up to 12 screens with login and push notifications, Premium with payments, a custom backend and 100% custom design. We first discuss what you need, then give you the price. The consultation is free.",
    },
    {
      q: "Does the app work on iOS and Android?",
      a: "Yes. We build cross-platform apps: one codebase for both platforms, with a modern design for iOS and Android.",
    },
    {
      q: "Do you publish the app on the App Store and Google Play?",
      a: "Yes, publishing on the App Store and Google Play is included in every package.",
    },
    {
      q: "What happens after launch?",
      a: "The Starter package includes 30 days of support after launch. After that we offer maintenance, and if you need new features or upgrades, we give you a separate price for them.",
    },
  ],
  "seo-google-ads": (c) => [
    {
      q: "How much do SEO and Google Ads cost?",
      a: `Starter ${price(c, "Starter")}, Growth ${price(c, "Growth")} and Pro ${price(c, "Pro")}. The ad budget is not included: you pay it yourself, directly to Google.`,
    },
    {
      q: "When will I see results?",
      a: "With Google Ads, you have the first data within the first month. SEO takes longer: for low-competition keywords, the first ranking movements usually show after 3–4 months, with more stable results after 6 months or more. No one can guarantee the top spot on Google.",
    },
    {
      q: "How often do you report?",
      a: "Starter: a report every month. Growth: a report every 2 weeks and 1 meeting a month. Pro: a report every week and 2 meetings a month.",
    },
    {
      q: "Is the ad budget included in the price?",
      a: "No. The package price covers our work (setup, optimisation and reporting). You pay the ad budget directly to Google, so you always stay in control of it.",
    },
  ],
  smm: (c) => [
    {
      q: "How much does social media management cost?",
      a: `Starter ${price(c, "Starter")} (10 posts and 2 Reels, Instagram + Facebook), Growth ${price(c, "Growth")} (15 posts and 3 Reels on 3 platforms) and Pro ${price(c, "Pro")} (20 posts, 5 Reels, daily Stories and all platforms).`,
    },
    {
      q: "Who creates the content?",
      a: "We do. We start with a few sample posts in your brand identity; once you like them, we continue with the design, captions, hashtags and publishing. How often you approve posts after that is agreed together.",
    },
    {
      q: "Are paid ads included?",
      a: "The Pro package includes basic Meta ads management (Facebook and Instagram). Starter and Growth focus on organic content.",
    },
    {
      q: "How do you measure results?",
      a: "With a performance report: monthly on Starter, every 2 weeks on Growth, and weekly plus a monthly strategy call on Pro.",
    },
  ],
  "branding-content": (c) => [
    {
      q: "How much does a logo and visual identity cost?",
      a: `Basic ${price(c, "Basic")} (logo and colour palette), Standard ${price(c, "Standard")} (full visual identity, business cards and 1 template) and Premium ${price(c, "Premium")} (full materials such as brochures and presentations, plus a Brand Kit).`,
    },
    {
      q: "What do you get at the end?",
      a: "Your logo in web and print versions, the colour palette and basic guidelines as a PDF. With Premium you also get a full Brand Kit in PDF and Figma/Canva.",
    },
    PAYMENT.en,
  ],
  mirembajtja: (c) => [
    {
      q: "How much does website maintenance cost?",
      a: `Basic ${price(c, "Basic")} (24/7 monitoring and weekly backups), Pro ${price(c, "Pro")} (daily backups, advanced security and 2 hours of work a month) and Premium ${price(c, "Premium")} (5 hours of work a month and same-business-day replies).`,
    },
    {
      q: "What happens if my site goes down?",
      a: "Your site is monitored 24/7 and we are alerted automatically. Response time depends on the plan: within 48 hours on Basic, within 24 hours on Pro and the same business day on Premium.",
    },
    {
      q: "How often are backups made?",
      a: "Weekly on Basic, daily on Pro, and daily plus a weekly off-site backup on Premium.",
    },
    {
      q: "Do you maintain websites built by someone else?",
      a: "Yes. We also take over sites built by others: we maintain and optimise them, and when a site is very old, we can rebuild it. Activation happens within 24 hours.",
    },
  ],
};

export function getServiceFaqs(category: ServiceCategory, locale: Locale): ServiceFaq[] {
  const builder = (locale === "en" ? EN : SQ)[category.slug];
  return builder ? builder(category) : [];
}

// ── /services/seo dhe /services/google-ads ────────────────────────────────────
// Këto faqe kanë paketat e veta (lib/seoAdsPricing, pa /admin overrides); FAQ-ja i lexon prej tyre.
type Pkgs = { packages: ServicePackage[] };

const SEO_TIMING: Record<Locale, ServiceFaq> = {
  sq: {
    q: "Kur shihen rezultatet e SEO?",
    a: "SEO kërkon kohë: për fjalë kyçe me konkurrencë të ulët, lëvizjet e para zakonisht duken pas 3–4 muajsh, dhe rezultate më të qëndrueshme pas 6 muajsh e më shumë. Askush nuk mund të garantojë vendin e parë në Google.",
  },
  en: {
    q: "When will I see SEO results?",
    a: "SEO takes time: for low-competition keywords, the first ranking movements usually show after 3–4 months, with more stable results after 6 months or more. No one can guarantee the top spot on Google.",
  },
};

export function getSeoFaqs(c: Pkgs, locale: Locale): ServiceFaq[] {
  if (locale === "en") {
    return [
      {
        q: "How much does SEO cost?",
        a: `Basic ${price(c, "Basic")} (10–15 keywords, on-page optimisation and Search Console setup), Growth ${price(c, "Growth")} (20–30 keywords, competitor analysis and technical SEO) and Pro ${price(c, "Pro")} (unlimited keywords, local + international SEO and monthly content optimisation). Prices exclude VAT.`,
      },
      SEO_TIMING.en,
      {
        q: "Do you build backlinks?",
        a: "Yes, as part of the work, but we don't promise a fixed number per month. Growth includes listings in trusted directories and local listings; Pro adds links from partners and local media where possible.",
      },
      {
        q: "How do you report progress?",
        a: "Every package includes a monthly progress report. On Growth the report comes every 2 weeks, and Pro adds a monthly strategy call.",
      },
    ];
  }
  return [
    {
      q: "Sa kushton SEO?",
      a: `Basic ${price(c, "Basic")} (10–15 fjalë kyçe, optimizim on-page dhe Search Console), Growth ${price(c, "Growth")} (20–30 fjalë kyçe, analizë e konkurrencës dhe SEO teknik) dhe Pro ${price(c, "Pro")} (fjalë kyçe pa limit, SEO lokal + ndërkombëtar dhe optimizim përmbajtjeje çdo muaj). Çmimet janë pa TVSH.`,
    },
    SEO_TIMING.sq,
    {
      q: "A ndërtoni backlinks?",
      a: "Po, si pjesë e punës, por nuk premtojmë një numër fiks në muaj. Growth përfshin regjistrim në direktori dhe lista lokale të besueshme; Pro shton lidhje nga partnerë dhe media lokale, sipas mundësive.",
    },
    {
      q: "Si raportoni progresin?",
      a: "Çdo paketë ka raport progresi çdo muaj. Te Growth raporti vjen çdo 2 javë, dhe Pro shton një call strategjik mujor.",
    },
  ];
}

export function getGoogleAdsFaqs(c: Pkgs, locale: Locale): ServiceFaq[] {
  if (locale === "en") {
    return [
      {
        q: "How much does Google Ads management cost?",
        a: `Starter ${price(c, "Starter")} (1 Search campaign with precise local targeting), Growth ${price(c, "Growth")} (2–3 Search + Display campaigns and remarketing) and Pro ${price(c, "Pro")} (Search, Display, YouTube and Shopping Ads). These are management fees, excluding VAT.`,
      },
      {
        q: "Is the ad budget included?",
        a: "No. You pay the ad budget yourself, directly to Google, so you always control how much is spent. Our fee covers setup, optimisation and reporting.",
      },
      {
        q: "When will I see results?",
        a: "Ads start showing as soon as the campaign goes live, and you have the first data (clicks, calls, enquiries) within the first month.",
      },
      {
        q: "How do you measure results?",
        a: "Every package includes conversion tracking, so we count enquiries and calls, not just clicks. Reports come monthly on Starter, every 2 weeks with a monthly call on Growth, and weekly with 2 monthly calls on Pro.",
      },
    ];
  }
  return [
    {
      q: "Sa kushton menaxhimi i Google Ads?",
      a: `Starter ${price(c, "Starter")} (1 fushatë Search me targetim lokal të saktë), Growth ${price(c, "Growth")} (2–3 fushata Search + Display dhe remarketing) dhe Pro ${price(c, "Pro")} (Search, Display, YouTube dhe Shopping Ads). Këto janë tarifa menaxhimi, pa TVSH.`,
    },
    {
      q: "A përfshihet buxheti i reklamave?",
      a: "Jo. Buxhetin e reklamave e paguani ju, direkt te Google, kështu e kontrolloni gjithmonë sa shpenzohet. Tarifa jonë mbulon vendosjen, optimizimin dhe raportimin.",
    },
    {
      q: "Kur shihen rezultatet?",
      a: "Reklamat fillojnë të shfaqen sapo fushata aktivizohet, dhe të dhënat e para (klikime, thirrje, kërkesa) i keni brenda muajit të parë.",
    },
    {
      q: "Si e matni rezultatin?",
      a: "Çdo paketë përfshin tracking konvertimesh, që të numërojmë kërkesat dhe thirrjet, jo vetëm klikimet. Raporti vjen çdo muaj te Starter, çdo 2 javë me një call mujor te Growth, dhe çdo javë me 2 call mujore te Pro.",
    },
  ];
}
