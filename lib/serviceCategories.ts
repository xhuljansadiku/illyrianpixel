import { activeWebHeroVariant } from "@/lib/webHeroVariants";

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
  slug: "website" | "ecommerce" | "marketing-growth" | "branding-content" | "smm" | "mirembajtja";
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
      "Website profesionale me dizajn premium dhe SEO, ndërtuar për bizneset shqiptare në Tiranë dhe diasporë.",
    icon: "◈",
    packages: [
      {
        name: "Basic",
        price: "€349",
        tagline: "Fillon kontaktet, ndalet humbja",
        ideal: "Faqe biznesi e pastër dhe serioze. Klientët ju gjejnë, ju kontaktojnë.",
        features: [
          "Dizajn profesional dhe i pastër",
          "Deri në 5 faqe",
          "Form kontakti",
          "SEO bazë",
          "Mobile-first & i shpejtë",
        ],
        notIncluded: [
          "E-Commerce / shitje online",
          "Shumëgjuhësh",
        ],
      },
      {
        name: "Business",
        price: "€599",
        tagline: "Website që konverton vizitorë në klientë",
        ideal: "Struktura e duhur, mesazhi i duhur. Klientët mbërrijnë dhe ndjekin hapin tjetër.",
        features: [
          "Gjithçka nga Basic",
          "Deri në 8 faqe",
          "Strukturë e optimizuar për konvertim",
          "Google Analytics",
          "1–2 gjuhë",
          "Mobile & speed optimization",
        ],
        notIncluded: [
          "E-Commerce / shitje online",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€899",
        tagline: "Website që mbyllet vetë, pa justifikime",
        ideal: "Dizajn i personalizuar, SEO i avancuar dhe funnel konvertimi nga vizitori te klienti.",
        features: [
          "Gjithçka nga Business",
          "Dizajn 100% custom",
          "SEO i avancuar (on-page)",
          "Integrime (WhatsApp, booking, etj.)",
          "Funnels & CTA strategjike",
          "Trajnim + 30 ditë mbështetje",
        ],
        notIncluded: [
          "E-Commerce / shitje online",
        ],
      },
      {
        name: "Custom",
        price: "Nga €1,200",
        tagline: "Ndërtuar saktësisht për ju",
        ideal: "E-Commerce, funksione speciale ose integrime? Ne e ndërtojmë nga zero për nevojat tuaja.",
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
      "Dyqane online premium me checkout të optimizuar, pagesa dhe analitikë, për bizneset shqiptare që duan të shesin online.",
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
        ideal: "Hapi i parë i saktë online. Produkte, pagesa dhe checkout gati për shitje.",
        features: [
          "Deri në 30 produkte",
          "Pagesa të integruara",
          "Checkout i optimizuar",
          "Mobile-first & i shpejtë",
          "Form porosie + konfirmim automatik",
        ],
        notIncluded: [
          "Filtra & kategori të avancuara",
          "Automatizime & SEO i plotë",
        ],
      },
      {
        name: "Growth",
        price: "€1,199",
        tagline: "Dyqan që rrit shitjet çdo muaj",
        ideal: "Struktura e duhur për të kthyer vizitorët në blerës dhe blerësit në klientë të rregullt.",
        features: [
          "Deri në 200 produkte",
          "Filtra, kategori & kërkim i avancuar",
          "Checkout që redukton braktisjen",
          "Analitikë shitjesh + Google Analytics",
          "SEO bazë për produkte & kategori",
        ],
        notIncluded: [
          "Automatizime të avancuara",
        ],
        featured: true,
      },
      {
        name: "Advanced",
        price: "€1,999",
        tagline: "Platformë e-commerce për shkallëzim",
        ideal: "Sistem i plotë për bizneset që duan të dominojnë online — pa kufij, pa kompromis.",
        features: [
          "Produkte të pakufizuara",
          "Upsell, cross-sell & funnels shitjesh",
          "Automatizime (email, porosi, rikuperim karroce)",
          "SEO i avancuar për produkte & kategori",
          "Performancë & Core Web Vitals të optimizuara",
        ],
      },
    ],
  },

  // ─── 3. MARKETING & GROWTH ─────────────────────────────────────────────────
  {
    slug: "marketing-growth",
    title: "Marketing & Growth",
    headline: "Marketing dixhital për biznese që duan klientë, jo vetëm klikime.",
    subheadline:
      "SEO, Google Ads dhe Social Media, ndërtuar si sistem konvertimi për biznese shqiptare.",
    short:
      "Më shumë thirrje, mesazhe dhe shitje, jo më shumë pritje. Strategji + faqe që konvertojnë + reklama të matura në para.",
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
        tagline: "Fillon klientët, ndal humbjen",
        ideal: "Reklamat e para me ROI real. Pak buxhet, rezultate të matshme nga muaji i parë.",
        features: [
          "Setup Google ose Meta Ads",
          "1 fushatë aktive",
          "Targetim lokal i saktë",
          "Tracking i rezultateve",
          "Raport mujor i qartë",
        ],
        notIncluded: [
          "Dy kanale reklamash",
          "SEO",
        ],
        cta: "Merr ofertë",
      },
      {
        name: "Growth",
        price: "€249",
        priceNote: "/ muaj",
        tagline: "Google + Meta — dy kanale, një qëllim",
        ideal: "Fushata të optimizuara çdo javë. Klientë të rinj çdo muaj, me buxhetin nën kontroll.",
        features: [
          "Google Ads + Meta Ads",
          "2–3 fushata aktive",
          "Optimizim javor i buxhetit",
          "Targetim i avancuar & audienca",
          "Raport 2-javësh + call mujor",
        ],
        notIncluded: [
          "SEO",
          "Produksion video",
        ],
        featured: true,
        cta: "Fillo projektin",
      },
      {
        name: "Pro",
        price: "€399",
        priceNote: "/ muaj",
        tagline: "Sistem i plotë për dominim dixhital",
        ideal: "Të gjitha kanalet, SEO bazë dhe A/B testing. Strategji që fiton, jo vetëm pret.",
        features: [
          "Google + Meta + SEO bazë",
          "A/B testing i fushatave",
          "Optimizim CPA / ROAS",
          "Strategji funnel e plotë",
          "Raport javor + 2 call mujore",
        ],
        cta: "Merr strategjinë",
      },
    ],
  },

  // ─── 4. BRANDING & CONTENT ─────────────────────────────────────────────────
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
        tagline: "Identitet vizual profesional",
        ideal: "Logo profesionale, paleta ngjyrash dhe guidelines bazë, për bizneset që duan të fillojnë me prani të denjë.",
        features: [
          "Logo profesionale (koncepte + final)",
          "Paleta ngjyrash + tipografi",
          "Versione për web dhe print",
          "Guidelines bazë PDF",
          "Eksporte gati për rrjete sociale",
        ],
      },
      {
        name: "Standard",
        price: "€500",
        tagline: "Brand i plotë dhe i qëndrueshëm",
        ideal: "Identitet i zgjeruar me strategji komunikimi dhe materiale gati për çdo skenë.",
        features: [
          "Gjithçka nga Basic",
          "Brand Kit i zgjeruar",
          "Strategji komunikimi dhe mesazhe kyçe",
          "Templates social media",
          "Kartëvizita + email signature",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€850",
        tagline: "Identitet i plotë me foto profesionale",
        ideal: "Brand i plotë me sesion fotografik, bankë materialesh dhe mbështetje pas dorëzimit.",
        features: [
          "Gjithçka nga Standard",
          "Sesion fotografik (3 orë) + 30 foto të edituara",
          "Identitet vizual i zgjeruar (ikona, pattern)",
          "Bankë materialesh e organizuar",
          "Mbështetje pas dorëzimit",
        ],
      },
    ],
  },

  // ─── 5. SOCIAL MEDIA MARKETING ─────────────────────────────────────────────
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
        ideal: "10 postime + 2 Reels çdo muaj. Dizajn sipas markës, caption dhe posting — gjithçka gati.",
        features: [
          "10 postime/muaj (feed + caption)",
          "2 Reels/muaj",
          "1 platformë (Instagram ose Facebook)",
          "Dizajn grafik sipas identitetit tuaj",
          "Raport mujor i performancës",
        ],
        notIncluded: [
          "Stories ditore",
          "2 platforma",
        ],
      },
      {
        name: "Growth",
        price: "€330",
        priceNote: "/ muaj",
        tagline: "Content që rrit audiencën çdo muaj",
        ideal: "15 postime + 3 Reels në 2 platforma. Angazhim aktiv dhe raportim 2-javësh.",
        features: [
          "15 postime/muaj (feed + caption)",
          "3 Reels/muaj",
          "2 platforma (Instagram + Facebook ose TikTok)",
          "Menaxhim komentesh dhe DM",
          "Raport 2-javësh i detajuar",
        ],
        featured: true,
      },
      {
        name: "Pro",
        price: "€400",
        priceNote: "/ muaj",
        tagline: "Prani maksimale në çdo platformë",
        ideal: "20 postime + 5 Reels në të gjitha platformat. Strategji e plotë, ekzekutim dhe raportim javor.",
        features: [
          "20 postime/muaj + Stories ditore",
          "5 Reels / Video / TikTok",
          "Të gjitha platformat (IG, FB, TikTok)",
          "Ads management bazë (Meta Ads)",
          "Produksion content grafik dhe video",
          "Call strategjik mujor + raport javor",
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
      "Mirëmbajtje profesionale e website dhe e-commerce: monitorim 24/7, siguri, shpejtësi dhe përditësime, për bizneset shqiptare që nuk mund të përballojnë ndërprerje.",
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
        ideal: "Monitorim aktiv, backup javor dhe përditësime bazë, faqja juaj mbetet online dhe e mbrojtur pa kosto të lartë.",
        features: [
          "Monitorim uptime 24/7 me njoftime",
          "Backup javor i plotë",
          "Përditësime CMS, plugin dhe tema",
          "Raport mujor i shëndetit të faqes",
          "Support email me përgjigje brenda 48h",
        ],
        featureBullets: [
          { emphasis: "Monitorim 24/7", detail: "njoftim i menjëhershëm kur faqja bie, jo pas orësh." },
          { emphasis: "Backup javor", detail: "kopje e plotë çdo javë, faqja rikthehet shpejt nëse ndodh diçka." },
          { emphasis: "Përditësime", detail: "CMS, plugin dhe tema, gjithmonë të sigurt dhe funksionalë." },
          { emphasis: "Raport mujor", detail: "gjendja e faqes, problemet e zgjidhura dhe hapat e radhës." },
        ],
      },
      {
        name: "Pro",
        price: "€99",
        priceNote: "/ muaj",
        tagline: "Mirëmbajtje e plotë",
        ideal: "Backup ditor, optimizim shpejtësie, siguri e avancuar dhe support prioritar, për bizneset që nuk tolerojnë ndërprerje.",
        features: [
          "Monitorim uptime 24/7 me SMS dhe email",
          "Backup ditor i automatizuar",
          "Sigurim SSL, firewall dhe skanim malware",
          "Optimizim cache dhe shpejtësi çdo muaj",
          "Ndërhyrje teknike deri 2 orë/muaj",
          "Support prioritar me përgjigje brenda 4h",
        ],
        featureBullets: [
          { emphasis: "Backup ditor", detail: "çdo ditë, nëse ndodh diçka, humbet maksimum 24 orë punë." },
          { emphasis: "Siguri e avancuar", detail: "firewall aktiv, skanim malware dhe SSL, faqja e mbrojtur si duhet." },
          { emphasis: "Optimizim shpejtësie", detail: "cache dhe performancë të optimizuara çdo muaj, jo vetëm njëherë." },
          { emphasis: "2h ndërhyrje/muaj", detail: "ndryshime, rregullime ose shtesa të vogla pa kosto shtesë." },
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€149",
        priceNote: "/ muaj",
        tagline: "Partner teknik i plotë",
        ideal: "Monitorim i avancuar, ndërhyrje pa limit, optimizim i vazhdueshëm dhe raportim javor, për bizneset me trafik të lartë ose e-commerce aktiv.",
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
          { emphasis: "Ndërhyrje pa limit", detail: "çdo ndryshim teknik, rregullim ose shtesë, pa faturë shtesë." },
          { emphasis: "Siguri enterprise", detail: "WAF, anti-DDoS dhe skanim ditor, mbrojtje si platformat e mëdha." },
          { emphasis: "Core Web Vitals", detail: "optimizim i vazhdueshëm, Google ju shpërblen me pozicion më të lartë." },
          { emphasis: "Përgjigje brenda 1h", detail: "problemi nuk pret, as zgjidhja jonë." },
        ],
      },
    ],
  },
];

export const serviceCategoryBySlug = (slug: string) =>
  serviceCategories.find((item) => item.slug === slug);
