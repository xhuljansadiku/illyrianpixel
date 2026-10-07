/**
 * Swedish copy (primary language). The English dictionary must match this
 * shape exactly — TypeScript enforces it via `Dictionary`.
 */
export const sv = {
  meta: {
    home: {
      title: "Nordic Pixel – webbyrå för webbdesign, e-handel och SEO",
      description:
        "Nordic Pixel är en skandinavisk digital byrå. Vi bygger webbplatser, e-handel, SEO, branding och digital marknadsföring som får företag att växa.",
    },
    services: {
      title: "Tjänster – webb, e-handel, SEO och marknadsföring",
      description:
        "Webbdesign, e-handel, SEO, Google Ads, branding, digital marknadsföring och underhåll – allt du behöver för att växa digitalt, under ett tak.",
    },
    work: {
      title: "Case – utvalda projekt",
      description: "Ett urval av webbplatser, e-handel och digitala projekt från Nordic Pixel.",
    },
    about: {
      title: "Om oss – en skandinavisk digital byrå",
      description:
        "Nordic Pixel samlar strategi, design, teknik och marknadsföring i ett team. Lär känna hur vi tänker och arbetar.",
    },
    process: {
      title: "Process – från idé till tillväxt",
      description:
        "Så arbetar vi: upptäck, strategi, design, bygg, lansera och väx. En tydlig process med avstämningar i varje steg.",
    },
    insights: {
      title: "Insikter – webb, SEO och digital tillväxt",
      description:
        "Guider och perspektiv om webbplatser, e-handel, SEO, Google Ads och digital marknadsföring.",
    },
    contact: {
      title: "Kontakt – starta ett projekt",
      description:
        "Berätta om ditt projekt. Vi återkommer med tankar och nästa steg – webbplats, e-handel, SEO eller marknadsföring.",
    },
    thanks: {
      title: "Tack för din förfrågan",
      description: "Vi har tagit emot din förfrågan och återkommer så snart vi kan.",
    },
    notFound: {
      title: "Sidan hittades inte",
      description: "Sidan du letar efter finns inte.",
    },
  },

  common: {
    skipToContent: "Hoppa till innehållet",
    startProject: "Starta ett projekt",
    contactUs: "Kontakta oss",
    viewOurWork: "Se vårt arbete",
    allServices: "Alla tjänster",
    allWork: "Alla case",
    exploreService: "Utforska tjänsten",
    viewCaseStudy: "Se case",
    readArticle: "Läs artikeln",
    readMore: "Läs mer",
    backToHome: "Till startsidan",
    breadcrumbLabel: "Brödsmulor",
    home: "Start",
    placeholder: "Platshållare",
    placeholderNote: "Innehållet ersätts med ett riktigt kundcase före lansering.",
    minutesRead: (minutes: number) => `${minutes} min läsning`,
    published: "Publicerad",
    updated: "Uppdaterad",
  },

  modal: {
    title: "Starta ett projekt",
    description: "Berätta kort om ditt projekt, så återkommer vi med tankar och nästa steg.",
    close: "Stäng",
  },

  nav: {
    label: "Huvudmeny",
    homeLabel: "Nordic Pixel – till startsidan",
    items: {
      services: "Tjänster",
      work: "Case",
      about: "Om oss",
      process: "Process",
      insights: "Insikter",
    },
    cta: "Starta ett projekt",
    openMenu: "Öppna menyn",
    closeMenu: "Stäng menyn",
    menu: "Meny",
    language: "Språk",
  },

  footer: {
    description:
      "En skandinavisk digital byrå som skapar webbplatser, e-handel och lösningar för digital tillväxt.",
    servicesHeading: "Tjänster",
    companyHeading: "Företaget",
    legalHeading: "Juridiskt",
    contactHeading: "Kontakt",
    followHeading: "Följ oss",
    country: "Sverige",
    orgNumberLabel: "Org.nr",
    legalLinks: {
      privacy: "Integritetspolicy",
      terms: "Villkor",
      cookies: "Cookies",
    },
    contactLink: "Kontakt",
    cta: "Har du ett projekt i tankarna?",
  },

  home: {
    hero: {
      eyebrow: "Digital fullservicebyrå",
      title: "Vi bygger digitala upplevelser som får företag att växa.",
      lead: "Webbplatser, e-handel, SEO, branding och digital marknadsföring för ambitiösa företag.",
      note: "Strategi, design, teknik och marknadsföring – under ett och samma tak.",
      visual: {
        url: "din-webbplats.se",
        disciplines: ["Strategi", "Design", "Teknik", "Tillväxt"],
      },
    },
    trust: {
      heading: "Förtroende från ambitiösa företag",
      fallback: "Vi bygger digitala partnerskap i Sverige och internationellt.",
      pillars: ["Strategi", "Design", "Teknik", "Marknadsföring", "Tillväxt"],
      pillarsLabel: "Det vi samlar under ett tak",
    },
    services: {
      eyebrow: "Tjänster",
      title: "Allt du behöver för att växa digitalt.",
      lead: "Från din första webbplats till en komplett strategi för digital tillväxt – vi samlar strategi, design, teknik och marknadsföring.",
    },
    why: {
      eyebrow: "Varför Nordic Pixel",
      title: "Digitalt arbete med ett tydligt affärssyfte.",
      statement: "Tydlig strategi. Bättre digitala upplevelser. Mätbar tillväxt.",
      principles: [
        { title: "Strategi", text: "Vi förstår affären innan vi designar lösningen." },
        { title: "Design", text: "Vi skapar rena, minnesvärda och användarfokuserade digitala upplevelser." },
        {
          title: "Teknik",
          text: "Vi använder modern teknik för att bygga snabba, skalbara och pålitliga lösningar.",
        },
        { title: "Tillväxt", text: "Vi optimerar även efter lansering, så att din digitala närvaro levererar." },
      ],
    },
    work: {
      eyebrow: "Case",
      title: "Utvalda case",
      lead: "Ett urval av digitala upplevelser vi har skapat för ambitiösa företag.",
      emptyTitle: "Våra första case är på väg.",
      emptyText: "Vi dokumenterar just nu våra första projekt. Vill du att ditt blir ett av dem?",
    },
    process: {
      eyebrow: "Process",
      title: "Från idé till tillväxt.",
      lead: "En tydlig process med avstämningar i varje steg – så att du alltid vet var projektet befinner sig.",
      cta: "Så arbetar vi",
    },
    tech: {
      eyebrow: "Teknik",
      title: "Byggt med modern teknik.",
      lead: "Vi väljer verktyg efter vad som ger bäst resultat för dig – inte efter vad som är trendigt.",
      groups: [
        { title: "Webb & applikationer", items: ["Next.js", "React", "TypeScript", "Node.js"] },
        { title: "E-handel & CMS", items: ["Shopify", "WooCommerce", "WordPress"] },
        { title: "Data & mätning", items: ["PostgreSQL", "Google Analytics", "Google Ads"] },
      ],
    },
    testimonials: {
      eyebrow: "Kunder",
      title: "Vad våra kunder säger",
      emptyTitle: "Låt oss göra ditt nästa projekt till ett som är värt att prata om.",
      emptyText: "Vi bygger långsiktiga samarbeten – och vi vill gärna att ditt projekt blir nästa.",
    },
    proposal: {
      eyebrow: "Investering",
      title: "Alla företag är olika.",
      text: "Vi bygger lösningar utifrån dina mål, din målgrupp och din budget.",
      points: [
        "Ett första samtal om dina mål och behov",
        "Ett skriftligt förslag med omfattning, tidplan och pris",
        "Ett upplägg som passar dig – projekt eller löpande samarbete",
      ],
      cta: "Få ett förslag",
    },
    faq: {
      eyebrow: "Frågor & svar",
      title: "Vanliga frågor",
      lead: "Hittar du inte svaret du letar efter? Hör av dig, så hjälper vi dig.",
    },
    finalCta: {
      title: "Redo att utveckla din digitala närvaro?",
      text: "Berätta vad du arbetar med. Vi hjälper dig att hitta nästa steg.",
    },
  },

  faq: [
    {
      question: "Vad kostar ett webbprojekt?",
      answer:
        "Det beror på omfattning, funktioner och innehåll. En fokuserad företagswebbplats är en mindre investering än en stor e-handel med integrationer. Efter ett kort samtal om dina mål får du ett skriftligt förslag med ett tydligt pris – utan överraskningar.",
    },
    {
      question: "Hur lång tid tar det att ta fram en webbplats?",
      answer:
        "De flesta företagswebbplatser tar mellan fyra och tio veckor från uppstart till lansering. E-handel och större plattformar tar oftast längre tid. I förslaget får du en realistisk tidplan med tydliga avstämningar.",
    },
    {
      question: "Arbetar ni med företag utanför Sverige?",
      answer:
        "Ja. Sverige är vår hemmamarknad, men vi arbetar gärna med företag i Norge, Danmark, Finland och övriga Europa. Vi arbetar på svenska och engelska, och samarbetet fungerar smidigt digitalt.",
    },
    {
      question: "Erbjuder ni löpande underhåll?",
      answer:
        "Ja. Våra paket för underhåll och tillväxt omfattar uppdateringar, säkerhet, backup, övervakning och löpande förbättringar, så att din webbplats förblir snabb och säker efter lansering.",
    },
    {
      question: "Arbetar ni med SEO?",
      answer:
        "Ja. Alla webbplatser vi bygger har en stabil teknisk SEO-grund. Vi erbjuder också löpande SEO – analyser, innehållsstrategi, tekniska förbättringar och lokal SEO.",
    },
    {
      question: "Kan ni hantera Google Ads åt oss?",
      answer:
        "Ja. Vi sätter upp, driver och optimerar Google Ads-kampanjer mot tydliga mål, med konverteringsspårning på plats. Kontot tillhör ditt företag.",
    },
    {
      question: "Kan ni göra om en befintlig webbplats?",
      answer:
        "Ja. Vi börjar med att se över det som fungerar i dag – innehåll, placeringar i sök och data – så att den nya webbplatsen förbättrar resultatet i stället för att börja om från noll.",
    },
    {
      question: "Bygger ni Shopify-butiker?",
      answer:
        "Ja. Vi designar och bygger Shopify-butiker, från anpassade teman till integrationer och migreringar. Om en annan plattform passar bättre, till exempel WooCommerce, säger vi det.",
    },
    {
      question: "Erbjuder ni månadspaket?",
      answer:
        "Ja. För underhåll, SEO, Google Ads och marknadsföring erbjuder vi månatliga samarbeten med en omfattning som anpassas efter dina mål och din budget.",
    },
  ],

  processSteps: [
    {
      id: "discover",
      title: "Upptäck",
      short: "Vi lär känna ditt företag, din målgrupp och dina mål.",
      description:
        "Vi börjar med att förstå ditt företag: mål, kunder, konkurrenter och vad som har fungerat – eller inte – tidigare. Ju bättre vi förstår affären, desto bättre blir lösningen.",
      deliverables: [
        "Uppstartsworkshop",
        "Genomgång av nuvarande webbplats, data och kanaler",
        "Gemensamma mål och nyckeltal",
      ],
      role: "Dela med dig av kunskap om ditt företag, dina kunder och dina mål.",
    },
    {
      id: "strategy",
      title: "Strategi",
      short: "Vi definierar rätt digital riktning.",
      description:
        "Vi omsätter insikterna i en tydlig riktning: vad vi ska bygga, för vem och varför. Prioriteringarna görs så att budgeten hamnar där den gör störst skillnad.",
      deliverables: ["Strategi och prioriteringar", "Sidstruktur och innehållsplan", "Omfattning och tidplan"],
      role: "Ge återkoppling och godkänn riktningen.",
    },
    {
      id: "design",
      title: "Design",
      short: "Vi omsätter strategin i en tydlig visuell upplevelse.",
      description:
        "Vi designar upplevelsen – från wireframes till färdig visuell design – och går igenom den tillsammans med dig vid tydliga avstämningar. Allt byggs på ett konsekvent designsystem.",
      deliverables: [
        "Wireframes och prototyper",
        "Visuell design för dator, surfplatta och mobil",
        "Designsystem och komponenter",
      ],
      role: "Granska designen och ge återkoppling vid överenskomna avstämningar.",
    },
    {
      id: "build",
      title: "Bygg",
      short: "Vi utvecklar lösningen med modern teknik.",
      description:
        "Vi utvecklar lösningen med modern och beprövad teknik, kopplar på de integrationer du behöver och lägger in innehållet. Du kan följa arbetet i en testmiljö.",
      deliverables: [
        "Utveckling i testmiljö",
        "Integrationer och publiceringsverktyg",
        "Teknisk SEO och tillgänglighet",
      ],
      role: "Leverera innehåll och testa i testmiljön.",
    },
    {
      id: "launch",
      title: "Lansera",
      short: "Vi testar, optimerar och lanserar.",
      description:
        "Innan lansering testar vi på riktiga enheter och webbläsare, kontrollerar prestanda och tillgänglighet och sätter upp mätning och omdirigeringar. Sedan lanserar vi – noggrant.",
      deliverables: [
        "Tester på enheter och webbläsare",
        "Analys och konverteringsspårning",
        "Lansering och omdirigeringar",
      ],
      role: "Ge ditt slutgodkännande inför lansering.",
    },
    {
      id: "grow",
      title: "Väx",
      short: "Vi fortsätter att förbättra resultatet efter lansering.",
      description:
        "Lanseringen är där den riktiga datan börjar. Vi följer upp resultatet, hittar förbättringar och fortsätter att utveckla din digitala närvaro tillsammans med dig.",
      deliverables: ["Uppföljning av resultat", "Löpande optimering", "Underhåll och support"],
      role: "Regelbundna avstämningar om resultat och prioriteringar.",
    },
  ],

  servicesPage: {
    eyebrow: "Tjänster",
    title: "Allt du behöver för att växa digitalt.",
    lead: "Från din första webbplats till en komplett strategi för digital tillväxt. Anlita oss för en enskild tjänst eller för hela kedjan – vi planerar alltid med helheten i åtanke.",
    includedLabel: "Bland annat",
    wholeTitle: "Ett team. En helhet.",
    wholeText:
      "När strategi, design, teknik och marknadsföring planeras tillsammans blir varje del starkare. Du får en kontaktyta, ett gemensamt mål och en digital närvaro som hänger ihop.",
    wholePoints: [
      "En kontaktperson genom hela projektet",
      "Gemensamma mål och mätetal för alla kanaler",
      "Ett designsystem som håller ihop varumärket",
    ],
  },

  servicePage: {
    servicesCrumb: "Tjänster",
    included: "Det här ingår",
    includedLead: "Allt anpassas efter dina mål, men det här är vad tjänsten vanligtvis omfattar.",
    fit: "Passar dig om",
    approach: "Så går det till",
    tools: "Plattformar & verktyg",
    faq: "Vanliga frågor",
    related: "Relaterade tjänster",
    ctaTitle: "Låt oss prata om ditt projekt.",
    ctaText: "Berätta vad du behöver, så återkommer vi med tankar och ett förslag på nästa steg.",
  },

  workPage: {
    eyebrow: "Case",
    title: "Utvalda case",
    lead: "Ett urval av digitala upplevelser vi har skapat för ambitiösa företag.",
  },

  caseStudy: {
    workCrumb: "Case",
    client: "Kund",
    industry: "Bransch",
    location: "Plats",
    year: "År",
    services: "Tjänster",
    challenge: "Utmaningen",
    strategy: "Strategin",
    solution: "Lösningen",
    results: "Resultat",
    gallery: "Galleri",
    desktop: "Dator",
    tablet: "Surfplatta",
    mobile: "Mobil",
    visitSite: "Besök webbplatsen",
    ctaTitle: "Har du ett projekt i tankarna?",
    ctaText: "Berätta om dina mål, så hjälper vi dig att hitta rätt väg framåt.",
    nextProject: "Nästa case",
    backToWork: "Tillbaka till alla case",
  },

  aboutPage: {
    eyebrow: "Om oss",
    title: "En digital partner för företag som vill växa.",
    lead: "Nordic Pixel är en digital fullservicebyrå. Vi samlar strategi, design, teknik och marknadsföring i ett team – så att din digitala närvaro hänger ihop och levererar.",
    storyTitle: "Helheten avgör.",
    story: [
      "Många företag har en webbplats, ett par sociala kanaler och några annonser – men ingen helhet. Resultatet blir splittrat: olika leverantörer, olika budskap och svårt att se vad som faktiskt fungerar.",
      "Vi tror på det motsatta. När strategi, design, teknik och marknadsföring planeras tillsammans blir varje del starkare. Därför arbetar vi som en långsiktig partner, inte som en leverantör av enskilda leveranser.",
    ],
    valuesTitle: "Det vi står för",
    values: [
      { title: "Tydlighet", text: "Enkla förklaringar, tydliga förslag och inga dolda kostnader." },
      { title: "Hantverk", text: "Vi bryr oss om detaljerna – i design, kod och text." },
      { title: "Partnerskap", text: "Vi tänker långsiktigt och arbetar nära ditt team." },
      { title: "Mätbarhet", text: "Vi följer upp det vi gör och fattar beslut utifrån data." },
    ],
    capabilitiesTitle: "Ett team, hela kedjan",
    capabilitiesLead: "Allt som behövs för att bygga och utveckla en stark digital närvaro – samlat på ett ställe.",
    capabilities: [
      "Strategi & analys",
      "UX & design",
      "Webb- & e-handelsutveckling",
      "SEO & annonsering",
      "Varumärke & innehåll",
      "Underhåll & support",
    ],
    nordicTitle: "Skandinavisk design. Internationell räckvidd.",
    nordicText:
      "Skandinavisk design handlar för oss om enkelhet, funktion och respekt för användaren – principer som fungerar på alla marknader. Sverige är vår hemmamarknad, och vi arbetar på svenska och engelska med företag som vill växa i Sverige, i Norden och i övriga Europa.",
  },

  processPage: {
    eyebrow: "Process",
    title: "Från idé till tillväxt.",
    lead: "Ett tydligt arbetssätt gör projekt förutsägbara. Så här tar vi ett projekt från första samtal till lansering – och vidare.",
    deliverablesLabel: "Du får",
    roleLabel: "Din roll",
    stepLabel: "Steg",
    modelsTitle: "Samarbetsformer",
    modelsLead: "Vi anpassar upplägget efter ditt behov – från ett avgränsat projekt till ett långsiktigt partnerskap.",
    models: [
      {
        title: "Projekt",
        text: "En avgränsad leverans med fast omfattning, tidplan och pris – till exempel en ny webbplats eller e-handel.",
      },
      {
        title: "Löpande partnerskap",
        text: "Ett månatligt samarbete för SEO, annonsering, marknadsföring eller vidareutveckling.",
      },
      {
        title: "Underhåll & support",
        text: "Trygg drift, uppdateringar och hjälp när du behöver det.",
      },
    ],
  },

  insightsPage: {
    eyebrow: "Insikter",
    title: "Insikter om webb, sök och digital tillväxt.",
    lead: "Praktiska guider och perspektiv för företag som vill få ut mer av sin digitala närvaro.",
    allCrumb: "Insikter",
    authorName: "Nordic Pixel",
    moreTitle: "Fler insikter",
    ctaTitle: "Vill du ha hjälp att komma vidare?",
    ctaText: "Berätta om dina mål, så hjälper vi dig att hitta nästa steg.",
  },

  contactPage: {
    eyebrow: "Kontakt",
    title: "Låt oss prata om ditt projekt.",
    lead: "Berätta vad du arbetar med – en ny webbplats, en e-handel eller en plan för tillväxt. Vi återkommer med tankar och nästa steg.",
    formTitle: "Projektförfrågan",
    nextTitle: "Vad händer sedan?",
    nextSteps: [
      { title: "Vi läser din förfrågan", text: "Vi går igenom dina mål och återkommer, normalt inom en arbetsdag." },
      { title: "Ett första samtal", text: "Ett kort samtal där vi lär känna ditt företag och dina behov." },
      { title: "Ett tydligt förslag", text: "Du får ett förslag med omfattning, tidplan och pris." },
    ],
    directTitle: "Kontakta oss direkt",
    emailLabel: "E-post",
    phoneLabel: "Telefon",
    basedIn: "Baserade i Sverige – arbetar på svenska och engelska.",
  },

  thanksPage: {
    eyebrow: "Tack",
    title: "Tack för din förfrågan!",
    text: "Vi har tagit emot ditt meddelande och återkommer normalt inom en arbetsdag.",
    secondary: "Läs om vår process",
  },

  notFound: {
    eyebrow: "404",
    title: "Den här sidan finns inte.",
    text: "Sidan kan ha flyttats eller tagits bort – eller så saknas en pixel i adressen.",
    linksTitle: "Kanske letade du efter",
  },

  error: {
    title: "Något gick fel.",
    text: "Ett oväntat fel inträffade. Försök igen, eller gå tillbaka till startsidan.",
    retry: "Försök igen",
  },

  legal: {
    updated: "Senast uppdaterad",
  },
};

export type Dictionary = typeof sv;
