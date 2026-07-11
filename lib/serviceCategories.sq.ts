import { activeWebHeroVariant } from "@/lib/webHeroVariants.sq";

export type ServiceFeatureBullet = {
  emphasis: string;
  detail: string;
};

export type ServicePackage = {
  name: string;
  price: string;
  priceNote?: string;
  ideal: string;
  tagline?: string;
  features: string[];
  notIncluded?: string[];
  featureBullets?: ServiceFeatureBullet[];
  featured?: boolean;
  cta?: string;
};

export type ServiceCategory = {
  slug: "website" | "ecommerce" | "seo-google-ads" | "branding-content" | "smm" | "mirembajtja";
  title: string;
  headline: string;
  subheadline?: string;
  short: string;
  description: string;
  icon: string;
  subServices: string[];
  packages: ServicePackage[];
  ctaPrimary?: string;
  ctaSecondary?: string;
  trustLine?: string;
};

export const serviceCategories: ServiceCategory[] = [
  // ─── 1. WEBSITE ────────────────────────────────────────────────────────────
  {
    slug: "website",
    title: "Website",
    ...activeWebHeroVariant,
    subServices: [
      "Website që gjeneron kërkesa reale",
      "SEO që ju sjell klientë",
      "Shpejtësi që rrit konvertimin",
      "Dizajn që krijon besim",
      "I thjeshtë për t'u menaxhuar",
    ],
    short:
      "Website moderne për biznese që duan më shumë klientë,\njo vetëm prezencë online.",
    icon: "◈",
    packages: [
      {
        name: "Basic",
        price: "€349",
        ideal: "Faqe biznesi e pastër dhe serioze.\nKlientët ju gjejnë, ju kontaktojnë.",
        features: [
          "Dizajn profesional dhe i pastër",
          "Deri në 5 faqe",
          "Form kontakti",
          "SEO bazë",
          "Mobile-first & i shpejtë",
        ],
      },
      {
        name: "Business",
        price: "€599",
        ideal: "Struktura e duhur, mesazhi i duhur.\nKlientët mbërrijnë dhe ndjekin hapin tjetër.",
        features: [
          "Gjithçka nga Basic",
          "Deri në 8 faqe",
          "Strukturë e optimizuar për konvertim",
          "Google Analytics",
          "1–2 gjuhë",
          "Mobile & speed optimization",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€899",
        ideal: "Dizajn i personalizuar, SEO i avancuar dhe funnel konvertimi nga vizitori te klienti.",
        features: [
          "Gjithçka nga Business",
          "Dizajn 100% custom",
          "SEO i avancuar (on-page)",
          "Integrime (WhatsApp, booking, etj.)",
          "Funnels & CTA strategjike",
        ],
      },
      {
        name: "Custom",
        price: "Nga €1,200",
        ideal: "E-Commerce, funksione speciale ose integrime?\nNe e ndërtojmë nga zero për nevojat tuaja.",
        features: [
          "Gjithçka nga Premium",
          "E-Commerce ose funksione speciale",
          "Integrime të avancuara",
          "CMS i personalizuar",
          "Mbështetje e dedikuar",
        ],
        cta: "Kërko ofertë",
      },
    ],
  },

  // ─── 2. E-COMMERCE ─────────────────────────────────────────────────────────
  {
    slug: "ecommerce",
    title: "E-Commerce",
    headline: "Krijim dyqan online\n(e-commerce) që shet 24/7,\nçdo ditë, pa pushim.",
    subheadline:
      "Ndërtojmë dyqane online që konvertojnë, checkout i optimizuar dhe pagesa të integruara për më shumë shitje.",
    short:
      "Dyqane online premium me checkout të optimizuar, pagesa dhe analitikë,\npër bizneset shqiptare që duan të shesin online.",
    description: "",
    icon: "◈",
    ctaPrimary: "Fillo të shesësh online →",
    ctaSecondary: "Punet tona",
    trustLine: "Konsultim falas · Strategji brenda 24h · Pa detyrim",
    subServices: [
      "Shitje 24/7",
      "Checkout që konverton",
      "Pagesa të thjeshta",
      "Shitje pa ndalesë",
      "Analitikë shitjesh",
    ],
    packages: [
      {
        name: "Starter",
        price: "€699",
        tagline: "Dyqan që fillon të shesë menjëherë",
        ideal: "Hapi i parë i saktë online.\nProdukte, pagesa dhe checkout gati për shitje.",
        features: [
          "Deri në 30 produkte",
          "Pagesa të integruara",
          "Checkout i optimizuar",
          "Mobile-first & i shpejtë",
          "Form porosie + konfirmim automatik",
        ],
      },
      {
        name: "Growth",
        price: "€1,199",
        tagline: "Dyqan që rrit shitjet çdo muaj",
        ideal: "Struktura e duhur për të kthyer vizitorët në blerës dhe blerësit në klientë të rregullt.",
        features: [
          "Deri në 100 produkte",
          "Filtra, kategori dhe kërkim i avancuar",
          "Checkout i optimizuar për konvertim",
          "Analitikë shitjesh dhe Google Analytics",
          "SEO bazë për produkte dhe kategori",
        ],
        featured: true,
      },
      {
        name: "Advanced",
        price: "€1,999",
        tagline: "Platformë e-commerce për shkallëzim",
        ideal: "Sistem i plotë për bizneset që duan të dominojnë online pa kufij, pa kompromis.",
        features: [
          "Pa limit produktesh",
          "Oferta shtesë & rekomandime që rrisin shitjen",
          "Email automatik, konfirmim porosie & rikuperim karroce braktisur",
          "SEO i avancuar për produkte dhe kategori",
          "Faqe e shpejtë dhe e optimizuar për Google",
        ],
      },
    ],
  },

  // ─── 3. SEO & GOOGLE ADS ─────────────────────────────────────────────────
  {
    slug: "seo-google-ads",
    title: "SEO & Google Ads",
    headline: "SEO dhe Google Ads, që sjellin klientë, jo vetëm klikime.",
    subheadline:
      "SEO teknik dhe fushata Google Ads, ndërtuar si sistem konvertimi për biznese shqiptare.",
    short:
      "Më shumë thirrje, mesazhe dhe shitje, jo më shumë pritje.\nSEO + Google Ads + faqe që konvertojnë, matur në para.",
    description: "",
    icon: "◉",
    subServices: [
      "Klientë, jo trafik",
      "SEO që renditet",
      "Google Ads me ROI",
      "Rezultate të matshme",
      "Strategji, jo eksperiment",
    ],
    packages: [
      {
        name: "Starter",
        price: "€149",
        priceNote: "/ muaj",
        ideal: "Filloni me Google Ads sot, plus bazat e SEO.\nBuxhet i vogël, rezultatet e para brenda muajit.",
        features: [
          "Vendosja e Google Ads",
          "1 fushatë aktive",
          "SEO bazë (on-page)",
          "Ndjekje e rezultateve",
          "Raport çdo muaj",
        ],
        cta: "Fillo Tani",
      },
      {
        name: "Growth",
        price: "€249",
        priceNote: "/ muaj",
        ideal: "Google Ads optimizohen çdo javë, SEO ju ngjit në Google.\nKlientë të rinj çdo muaj, buxheti nën kontroll.",
        features: [
          "Google Ads i avancuar",
          "2–3 fushata aktive",
          "SEO i plotë (on-page)",
          "Optimizim i buxhetit çdo javë",
          "Raport çdo 2 javë + 1 takim në muaj",
        ],
        featured: true,
        cta: "Fillo Tani",
      },
      {
        name: "Pro",
        price: "€399",
        priceNote: "/ muaj",
        ideal: "Google Ads i plotë, SEO teknik dhe teste A/B.\nÇdo vendim mbështetet në numra, jo në mendim.",
        features: [
          "Google Ads i plotë (Search + Display)",
          "SEO teknik i avancuar",
          "Teste A/B për fushatat",
          "Optimizim i kostos për klient (CPA/ROAS)",
          "Raport çdo javë + 2 takime në muaj",
        ],
        cta: "Fillo Tani",
      },
    ],
  },

  // ─── 4. SOCIAL MEDIA MARKETING ─────────────────────────────────────────────
  {
    slug: "smm",
    title: "Social Media",
    headline: "Menaxhim social media profesional për biznese shqiptare.",
    subheadline:
      "Content, dizajn dhe posting të rregullt në Instagram, Facebook dhe TikTok, për biznese që duan të rriten online.",
    short:
      "Menaxhim i plotë i social media: content, dizajn, posting dhe angazhim, për bizneset shqiptare që duan prani të rregullt dhe profesionale.",
    description: "",
    icon: "◉",
    ctaPrimary: "Fillo sot →",
    ctaSecondary: "Punet tona",
    trustLine: "Konsultim falas · Pa detyrim · Plan brenda 24h",
    subServices: [
      "Instagram & Facebook",
      "Reels & TikTok",
      "Content & Dizajn",
      "Posting i rregullt",
      "Rritje e matshme",
    ],
    packages: [
      {
        name: "Starter",
        price: "€200",
        priceNote: "/ muaj",
        tagline: "Prani e rregullt dhe profesionale",
        ideal: "10 postime + 2 Reels çdo muaj.\nGjithçka gati: dizajn, caption, posting.",
        features: [
          "10 postime/muaj (feed + caption)",
          "2 Reels/muaj",
          "2 platforma (Instagram + Facebook)",
          "Dizajn grafik sipas identitetit tuaj",
          "Hashtags strategjikë",
          "Raport mujor i performancës",
        ],
      },
      {
        name: "Growth",
        price: "€330",
        priceNote: "/ muaj",
        tagline: "Content që rrit audiencën çdo muaj",
        ideal: "15 postime + 3 Reels në 3 platforma.\nAngazhim aktiv dhe raportim 2-javësh.",
        features: [
          "15 postime/muaj (feed + caption)",
          "3 Reels/muaj",
          "3 platforma\n(Instagram + Facebook + Threads)",
          "Hashtags strategjikë",
          "Raport 2-javësh i detajuar",
        ],
        featured: true,
      },
      {
        name: "Pro",
        price: "€400",
        priceNote: "/ muaj",
        tagline: "Prani maksimale në çdo platformë",
        ideal: "20 postime + 5 Reels në të gjitha platformat.\nStrategji e plotë, ekzekutim dhe raportim javor.",
        features: [
          "20 postime/muaj + Stories ditore",
          "5 Reels / Video",
          "Të gjitha platformat",
          "Ads management bazë (Meta Ads)",
          "Hashtags strategjikë",
          "Call strategjik mujor + raport javor",
        ],
      },
    ],
  },

  // ─── 5. BRANDING & CONTENT ─────────────────────────────────────────────────
  {
    slug: "branding-content",
    title: "Branding & Content",
    headline: "Branding dhe identitet vizual profesional për biznese shqiptare.",
    subheadline:
      "Logo, identitet vizual dhe content që ndërtojnë besim dhe tërheqin klientët e duhur.",
    short:
      "Pozicionim, identitet dhe përmbajtje për marka që duan status, besim dhe klientë më të përzgjedhur, jo thjesht më shumë dukshmëri.",
    description: "",
    icon: "◆",
    ctaPrimary: "Fillo sot →",
    ctaSecondary: "Punet tona",
    trustLine: "Konsultim falas · Pa detyrim · Përgjigje brenda 24h",
    subServices: [
      "Logo & Identitet vizual",
      "Brand i qartë",
      "Dizajn premium",
      "Content profesional",
      "Besim i menjëhershëm",
    ],
    packages: [
      {
        name: "Basic",
        price: "€250",
        tagline: "Logo dhe paleta e markës",
        ideal: "Logo profesionale dhe paleta e ngjyrave, themeli i identitetit tuaj vizual.",
        features: [
          "Logo profesionale (koncepte + final)",
          "Paleta e ngjyrave",
          "Versione për web dhe print",
          "Guidelines bazë (PDF)",
        ],
      },
      {
        name: "Standard",
        price: "€500",
        tagline: "Identitet vizual i plotë",
        ideal: "Logo, paleta dhe identitet vizual i plotë, gati për çdo material dhe platformë.",
        features: [
          "Gjithçka nga Basic",
          "Identitet vizual i plotë (ikona, pattern, elementë grafikë)",
          "Paleta e zgjeruar (sekondare + neutrale)",
          "Kartëvizita",
          "1 Template",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€850",
        tagline: "Design i plotë i markës",
        ideal: "Logo, identitet vizual dhe design i plotë i markës, me paletë dhe brand kit për çdo skenë.",
        features: [
          "Gjithçka nga Standard",
          "Design i plotë i materialeve (broshura, prezantime, packaging)",
          "Brand Kit i plotë (PDF + Figma/Canva)",
          "Paleta e ngjyrave për çdo platformë",
          "Mbështetje pas dorëzimit",
        ],
      },
    ],
  },

  // ─── 6. MIRËMBAJTJA ────────────────────────────────────────────────────────
  {
    slug: "mirembajtja",
    title: "Mirëmbajtja",
    headline: "Mirëmbajtje, optimizim dhe rindërtim website për biznese shqiptare.",
    subheadline:
      "Mbajmë faqen tuaj gjithmonë online, e shpejtë dhe e sigurt. Edhe faqe të vjetra i rindërtojmë dhe i optimizojmë.",
    short:
      "Faqja juaj online, e shpejtë dhe e sigurt, çdo ditë.",
    description: "",
    icon: "◈",
    ctaPrimary: "Fillo sot →",
    ctaSecondary: "Punet tona",
    trustLine: "Konsultim falas · Aktivizim brenda 24h · Pa obligim",
    subServices: [
      "Monitorim 24/7",
      "Optimizim i vazhdueshëm",
      "Rindërtim faqesh të vjetra",
      "Siguri & backup ditor",
      "Reagim i menjëhershëm",
    ],
    packages: [
      {
        name: "Basic",
        price: "€49",
        priceNote: "/ muaj",
        tagline: "Mbrojtje bazë",
        ideal: "Faqja juaj e mbikëqyrur dhe e sigurt, pa kosto të lartë.",
        features: [
          "Monitorim uptime 24/7 me njoftime",
          "Backup javor i plotë",
          "Përditësime CMS, plugin dhe tema",
          "Raport mujor i shëndetit të faqes",
          "Support email me përgjigje brenda 48h",
        ],
        featureBullets: [
          { emphasis: "Monitorim 24/7", detail: "ju njoftojmë menjëherë nëse faqja bie." },
          { emphasis: "Backup javor", detail: "kopje e plotë çdo javë, gati për rikthim shpejt." },
          { emphasis: "Përditësime", detail: "mbajmë gjithçka të përditësuar dhe të sigurt." },
          { emphasis: "Raport mujor", detail: "ju tregojmë çdo muaj si po shkon faqja." },
        ],
      },
      {
        name: "Pro",
        price: "€99",
        priceNote: "/ muaj",
        tagline: "Mirëmbajtje e plotë",
        ideal: "Mbrojtje dhe shpejtësi maksimale, për biznese që nuk durojnë ndërprerje.",
        features: [
          "Monitorim uptime 24/7 me SMS dhe email",
          "Backup ditor i automatizuar",
          "Sigurim SSL, firewall dhe skanim malware",
          "Optimizim cache dhe shpejtësi çdo muaj",
          "Ndërhyrje teknike deri 2 orë/muaj",
          "Support prioritar me përgjigje brenda 4h",
        ],
        featureBullets: [
          { emphasis: "Backup ditor", detail: "kopje e re çdo ditë, humbni maksimum një ditë pune." },
          { emphasis: "Siguri e avancuar", detail: "firewall, skanim virusesh dhe SSL, faqja e mbrojtur mirë." },
          { emphasis: "Optimizim shpejtësie", detail: "faqja bëhet më e shpejtë çdo muaj." },
          { emphasis: "2h ndërhyrje/muaj", detail: "ndryshime dhe rregullime falas, sa herë të duhet." },
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€149",
        priceNote: "/ muaj",
        tagline: "Partner teknik i plotë",
        ideal: "Mbështetje e plotë pa limit, për biznese me trafik të lartë ose dyqan online aktiv.",
        features: [
          "Monitorim avancuar me alarme në kohë reale",
          "Backup ditor + backup javor off-site",
          "Siguri enterprise: WAF, anti-DDoS, skanim ditor",
          "Optimizim i vazhdueshëm Core Web Vitals",
          "Ndërhyrje teknike pa limit",
          "Support prioritar me përgjigje brenda 1h",
          "Raport javor i performancës dhe sigurisë",
        ],
        featureBullets: [
          { emphasis: "Ndërhyrje pa limit", detail: "çdo ndryshim teknik, sa herë të duhet, pa kosto shtesë." },
          { emphasis: "Siguri e nivelit më të lartë", detail: "mbrojtje si platformat e mëdha, kundër sulmeve dhe viruseve." },
          { emphasis: "Optimizim për Google", detail: "faqja bëhet më e shpejtë, Google ju vendos më lart." },
          { emphasis: "Përgjigje brenda 1h", detail: "problemi nuk pret, as zgjidhja jonë." },
        ],
      },
    ],
  },
];

export const serviceCategoryBySlug = (slug: string) =>
  serviceCategories.find((item) => item.slug === slug);
