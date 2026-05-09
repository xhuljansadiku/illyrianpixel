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
  featureBullets?: ServiceFeatureBullet[];
  featured?: boolean;
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
        price: "€350",
        tagline: "Faqe biznesi profesionale",
        ideal: "Dizajn profesional dhe i pastër me strukturë që sjell kontakte.",
        features: [
          "Dizajn profesional dhe i pastër",
          "Deri në 5 faqe",
          "Strukturë që sjell kontakte",
          "SEO bazë",
          "Form kontakti",
        ],
      },
      {
        name: "Business",
        price: "€650",
        tagline: "Website biznesi i plotë",
        ideal: "Website me strukturë të optimizuar për konvertim dhe shumëgjuhësh.",
        features: [
          "Gjithçka nga Basic",
          "Deri në 8 faqe",
          "Strukturë e optimizuar për konvertim",
          "Google Analytics",
          "Mobile & speed optimization",
          "1–2 gjuhë",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€950",
        tagline: "Website custom i avancuar",
        ideal: "Dizajn 100% custom me strukturë të avancuar dhe integrime të plota.",
        features: [
          "Gjithçka nga Business",
          "Dizajn 100% custom",
          "Strukturë e avancuar (CTA, funnels)",
          "SEO i avancuar (on-page)",
          "Integrime (WhatsApp, booking, etj.)",
          "Trajnim për përdorim",
        ],
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
        price: "€700",
        tagline: "Dyqan bazë online",
        ideal: "Dyqan online funksional me pagesa të integruara.",
        features: [
          "Dyqan online funksional",
          "Deri në 20 produkte",
          "Pagesa të integruara",
          "Checkout i thjeshtë",
          "Mobile friendly",
        ],
      },
      {
        name: "Growth",
        price: "€1,200",
        tagline: "Dyqan i plotë me rritje",
        ideal: "Dyqan me strukturë që rrit shitjet dhe redukton braktisjen.",
        features: [
          "Gjithçka nga Starter",
          "Deri në 100 produkte",
          "Strukturë që rrit shitjet",
          "Filtra & kategori",
          "Analitikë bazë",
          "Reduktim i braktisjes",
        ],
        featured: true,
      },
      {
        name: "Advanced",
        price: "€2,000",
        tagline: "Platformë e-commerce e plotë",
        ideal: "Platformë e plotë me automatizime, SEO dhe performance të lartë.",
        features: [
          "Produkte të pakufizuara",
          "Strukturë që rrit shitjet (upsell & funnels)",
          "Checkout i optimizuar",
          "Pagesa të integruara (Stripe, PayPal)",
          "Automatizime (email, porosi, etj.)",
          "SEO për produkte & kategori",
          "Performance & shpejtësi e lartë",
          "Trajnim + support fillestar",
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
        price: "€150",
        priceNote: "/ muaj",
        tagline: "Filloni me reklama që funksionojnë",
        ideal: "Setup i plotë dhe fushata aktive me tracking të rezultateve, për bizneset që duan të fillojnë pa rrezik.",
        features: [
          "Setup i plotë (Google/Meta Ads)",
          "1–2 fushata aktive",
          "Targetim bazë",
          "Tracking i rezultateve",
          "Optimizim fillestar",
          "Raport mujor",
        ],
      },
      {
        name: "Growth",
        price: "€250",
        priceNote: "/ muaj",
        tagline: "Rritje e matshme çdo muaj",
        ideal: "Fushata të shumta, optimizim i vazhdueshëm dhe raportim i detajuar, për bizneset që duan rezultate më të shpejta.",
        features: [
          "Gjithçka nga Starter",
          "3–4 fushata aktive",
          "Google Ads + Meta Ads",
          "Targetim i avancuar dhe audienca",
          "Optimizim javor i buxhetit",
          "Raport 2-javësh i detajuar",
        ],
        featured: true,
      },
      {
        name: "Pro",
        price: "€400",
        priceNote: "/ muaj",
        tagline: "Sistem i plotë reklamimi",
        ideal: "Menaxhim i plotë i të gjitha kanaleve me SEO bazë, A/B testing dhe call strategjik mujor.",
        features: [
          "Gjithçka nga Growth",
          "SEO bazë + Ads të integruara",
          "A/B testing i fushatave",
          "Optimizim CPA / ROAS",
          "Call strategjik mujor",
          "Raport javor i performancës",
        ],
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
        price: "€120",
        priceNote: "/ muaj",
        tagline: "Presenza bazë",
        ideal: "8 postime/muaj në 1 platformë me dizajn grafik profesional, prezencë e rregullt pa stres dhe pa bosh.",
        features: [
          "8 postime/muaj (feed + caption profesionale)",
          "1 platformë (Instagram ose Facebook)",
          "Dizajn grafik i personalizuar sipas markës",
          "Hashtag research dhe optimizim",
          "Raport mujor i performancës",
        ],
      },
      {
        name: "Growth",
        price: "€250",
        priceNote: "/ muaj",
        tagline: "Rritje aktive",
        ideal: "20 postime/muaj + Stories & Reels në 2 platforma, strateg i plotë me angazhim aktiv dhe raportim të detajuar çdo 2 javë.",
        features: [
          "20 postime/muaj (feed + caption)",
          "Stories ditore + 4 Reels/muaj",
          "2 platforma (Instagram + Facebook ose TikTok)",
          "Menaxhim komentesh dhe DM",
          "Hashtag + SEO social i optimizuar",
          "Raport 2-javësh i detajuar",
        ],
        featured: true,
      },
      {
        name: "Pro",
        price: "€400",
        priceNote: "/ muaj",
        tagline: "Dominim social",
        ideal: "30 postime/muaj + video + ads në të gjitha platformat, agjensi e plotë sociale me strategji, ekzekutim dhe raportim javor.",
        features: [
          "30 postime/muaj + Stories të përditshme",
          "8 Reels / Video / TikTok",
          "Të gjitha platformat (IG, FB, TikTok, LinkedIn)",
          "Ads management bazë (Meta / TikTok Ads)",
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
