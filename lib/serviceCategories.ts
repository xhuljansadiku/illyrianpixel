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
      "Faqe biznesi premium",
      "SEO që sjell klientë",
      "3× më shpejt se konkurrenti",
      "Dizajn 100% Custom",
      "CMS i thjeshtë",
    ],
    short:
      "Website profesionale me dizajn premium dhe SEO — ndërtuar për bizneset shqiptare në Tiranë dhe diasporë.",
    icon: "◈",
    packages: [
      {
        name: "Basic",
        price: "€650",
        tagline: "Landing Page",
        ideal: "Një faqe e fokusuar që kthen vizitorë në kërkesa — e shpejtë, e qartë, e matshme.",
        features: [
          "Deri 5 seksione të strukturuara për konvertim",
          "UX/UI i pastër, mobile-first",
          "Performance dhe Core Web Vitals në fokus",
          "HTTPS, bazë sigurie dhe praktika të mira",
          "SEO on-page bazë + meta dhe strukturë",
          "Formular / thirrje veprimi e matshme",
          "1 rishikim falas pas lançimit",
        ],
        featureBullets: [
          { emphasis: "Konvertim", detail: "deri 5 seksione, hierarki dhe CTA për kërkesa të matshme." },
          { emphasis: "SEO bazë", detail: "meta, strukturë dhe përgatitje për të shfaqur në kërkime lokale." },
          { emphasis: "Core Web Vitals", detail: "faqe e shpejtë në mobile — më pak heqje, më shumë besim." },
          { emphasis: "Siguri", detail: "HTTPS dhe praktika të mira për një prezencë profesionale." },
        ],
      },
      {
        name: "Pro",
        price: "€1,500",
        tagline: "Website Biznesi + SEO",
        ideal: "Presencë e plotë online: përmbajtje, autoritet në Google dhe rritje organike afatgjatë.",
        features: [
          "Deri 12 faqe të personalizuara",
          "CMS: përditësoni vetë pa varësi nga zhvilluesi",
          "Blog, portfolio ose galeri sipas nevojës",
          "SEO i avancuar + Google Analytics / Search Console",
          "Mikro-kopje dhe hierarki vizuale për shitje",
          "Integrime bazë (CRM, email, social)",
          "3 rishikime falas gjatë projektit",
        ],
        featureBullets: [
          { emphasis: "CMS & shkallëzim", detail: "deri 12 faqe; përditësoni vetë përmbajtjen pa zhvillues." },
          { emphasis: "SEO i avancuar", detail: "Search Console, analitikë dhe strukturë për autoritet organik." },
          { emphasis: "Shitje me fjalë", detail: "mikro-kopje dhe hierarki vizuale që udhëheqin drejt kontaktit." },
          { emphasis: "Integrime", detail: "CRM, email dhe social — rrjedhë e qartë nga vizitor në klient." },
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€2,800",
        tagline: "Website Custom i Avancuar",
        ideal: "Dizajn i papërsëritshëm me animacione, integrime të avancuara dhe teknologji të fundit — për markat që nuk pranojnë kompromis.",
        features: [
          "Dizajn 100% custom — asnjë template",
          "Animacione dhe ndërveprime premium (GSAP)",
          "Integrime API dhe sisteme të jashtme",
          "SEO teknik i thellë + strukturë schema",
          "A/B testing dhe optimizim konvertimi",
          "Support prioritar 6 muaj pas lançimit",
        ],
        featureBullets: [
          { emphasis: "Dizajn unik", detail: "asnjë template — çdo piksel i menduar për markën tuaj." },
          { emphasis: "Animacione premium", detail: "ndërveprime GSAP që bëjnë dallimin mes 'mirë' dhe 'i paharrueshëm'." },
          { emphasis: "SEO teknik", detail: "schema, breadcrumbs dhe arkitekturë për autoritet maksimal." },
          { emphasis: "Support 6 muaj", detail: "ekipi mbetet partner edhe pas lançimit — jo vetëm dorëzim." },
        ],
      },
    ],
  },

  // ─── 2. E-COMMERCE ─────────────────────────────────────────────────────────
  {
    slug: "ecommerce",
    title: "E-Commerce",
    headline: "Dyqani yt online punon 24/7 — shitje çdo ditë, pa pushim.",
    subheadline:
      "Ndërtojmë dyqane online që konvertojnë — checkout i optimizuar, pagesa të integruara dhe analitikë e matshme për çdo shitje.",
    short:
      "Dyqane online premium me checkout të optimizuar, pagesa dhe analitikë — për bizneset shqiptare që duan të shesin online.",
    description:
      "Çdo orë pa dyqan online të mirë, humbet shitje reale. Ne ndërtojmë platforma e-commerce me funksionalitet të plotë — katalog, pagesa, rikuperim karroce dhe raportim — gati për t'u shkallëzuar me biznesin tënd.",
    icon: "◈",
    ctaPrimary: "Fillo Dyqanin Tënd",
    ctaSecondary: "Shiko Si Punojmë",
    trustLine: "0 kosto konsultimi · Strategji brenda 24h · Pa obligim",
    subServices: [
      "Dyqan online 24/7",
      "Pagesa Stripe & PayPal",
      "Checkout i optimizuar",
      "Rikuperim karroce",
      "Analitikë shitjesh",
    ],
    packages: [
      {
        name: "Starter",
        price: "€1,800",
        tagline: "Dyqan bazë online",
        ideal: "Deri 100 produkte, pagesa online dhe checkout i thjeshtuar — gati për shitjet e para brenda ditëve.",
        features: [
          "Deri 100 produkte me variante dhe çmime",
          "Pagesa online (Stripe ose PayPal)",
          "Checkout i thjeshtuar, mobile-first",
          "SEO bazë për kategori dhe produkte",
          "Panel admin i thjeshtë për menaxhim",
          "1 muaj support pas lançimit",
        ],
        featureBullets: [
          { emphasis: "Katalog i shpejtë", detail: "deri 100 produkte me variante, çmime dhe stok — gati për shitje." },
          { emphasis: "Pagesa online", detail: "Stripe ose PayPal i integruar — klient paguan, ti merr njoftim." },
          { emphasis: "Checkout i pastër", detail: "hapa minimal, mobile-first — më pak braktisje karroce." },
          { emphasis: "Panel admin", detail: "intuitiv — shto dhe menaxho produkte vetë pa zhvillues." },
        ],
      },
      {
        name: "Growth",
        price: "€3,200",
        tagline: "Dyqan i plotë me marketing",
        ideal: "Katalog i pafund, rikuperim karroce, email marketing i integruar dhe analitikë e thellë — për dyqanet që duan të shkallëzohen.",
        features: [
          "Katalog i pafund me filtra të avancuar",
          "Rikuperim karroce + email automation",
          "Integrim email marketing (Klaviyo / MailChimp)",
          "Analitikë e thellë + funnel konvertimi",
          "Trust signals, reviews dhe social proof",
          "3 muaj support pas lançimit",
        ],
        featureBullets: [
          { emphasis: "Katalog pa limit", detail: "produkte, variante dhe filtra — blerësi gjen shpejt çfarë dëshiron." },
          { emphasis: "Rikuperim karroce", detail: "email automatik që kthen blerësin — shitje shtesë falas." },
          { emphasis: "Email marketing", detail: "Klaviyo ose MailChimp i integruar — fushata nga dita e lançimit." },
          { emphasis: "Analitikë e thellë", detail: "funnel, drop-off dhe konvertim — e di saktë ku humbet para." },
        ],
        featured: true,
      },
      {
        name: "Enterprise",
        price: "Nga €5,500",
        tagline: "Platformë B2B / B2C e plotë",
        ideal: "Platformë e-commerce me ERP/CRM integrim, multi-language, automatizim porosish dhe dashboard admin të personalizuar.",
        features: [
          "Platformë e plotë B2B dhe/ose B2C",
          "ERP / CRM integrim (Odoo, Salesforce etj.)",
          "Multi-language dhe multi-currency",
          "Automatizim porosish dhe workflow",
          "Dashboard admin 100% i personalizuar",
          "Support prioritar 6 muaj + SLA i garantuar",
        ],
        featureBullets: [
          { emphasis: "B2B & B2C", detail: "çmime sipas grupeve, portale dhe llogari biznesi të ndara." },
          { emphasis: "ERP/CRM", detail: "Odoo, Salesforce ose sistemi juaj — integrim i plotë i të dhënave." },
          { emphasis: "Automatizim", detail: "porosi, fatura dhe workflow — sistemi punon pa ndërhyrje manuale." },
          { emphasis: "SLA i garantuar", detail: "support prioritar 6 muaj — nuk mbeteni pa ndihmë pas lançimit." },
        ],
      },
    ],
  },

  // ─── 3. MARKETING & GROWTH ─────────────────────────────────────────────────
  {
    slug: "marketing-growth",
    title: "Marketing & Growth",
    headline: "Nuk është 'pak fat'. Është sistemi — dhe po ju kushton çdo ditë.",
    subheadline:
      "Ndërkohë që ju prisni momentin e duhur, dikush tjetër po mbyll me klientin tuaj. Ne e kthejmë heshtjen në thirrje, mesazh dhe shitje — Tiranë, Shqipëri, diasporë.",
    short:
      "Më shumë thirrje, mesazhe dhe shitje — jo më shumë pritje. Strategji + faqe që konvertojnë + reklama të matura në para.",
    description:
      "Humbja nuk është vetëm 'pak trafik'. Është orë bosh, buxhet që digjet dhe klient që zgjedh konkurrencën sepse ju nuk u dukët në momentin e vendimit. Ne e ndalim rrjedhjen — pastaj e kthejmë në rritje me numra që i lexoni në një minutë.",
    icon: "◉",
    subServices: [
      "Më pak heshtje në telefon",
      "Më pak para të djegura",
      "Më shumë kërkesa gati për shitje",
      "Vendim sot — jo nesër",
      "Tiranë & diasporë",
      "Rezultat, jo raport për raft",
    ],
    packages: [
      {
        name: "Starter",
        price: "€350",
        priceNote: "/ muaj",
        tagline: "Ndaloni humbjen — filloni me numra",
        ideal: "Për ata që nuk durojnë më 'po shohim': një bazë që sjell thirrje dhe mesazhe të matshme, jo vetëm 'dukshmëri' pa fund.",
        features: [
          "Audit SEO + plan veprimi për faqen ekzistuese",
          "On-page bazë dhe optimizim Google Business Profile ku aplikohet",
          "Një kanal reklamash (Google ose Meta) me fokus lokal",
          "Konfigurim konvertimesh dhe raport mujor i thjeshtë",
          "Udhëzime për ofertë dhe faqe destinacion",
        ],
        featureBullets: [
          { emphasis: "Më shumë kërkesa lokale", detail: "SEO bazë dhe profil biznesi — që ju gjejnë kur kërkojnë shërbimin, jo rastësisht." },
          { emphasis: "Reklama me kufi", detail: "një kanal, mesazh i qartë, buxhet që di ku shkon." },
          { emphasis: "Më shumë transparencë", detail: "konvertime të konfiguruara që tregojnë çfarë solli çfarë." },
          { emphasis: "Vendime mujore", detail: "raport i shkurtër dhe hapat për muajin tjetër — pa PDF 40 faqesh." },
        ],
      },
      {
        name: "Accelerate",
        price: "€750",
        priceNote: "/ muaj",
        tagline: "I njëjti trafik — më shumë para në xhiro",
        ideal: "Kur kërkoni rritje të menjëhershme të cilësisë së kontaktit: SEO që punon, ads që nuk flasin në zbrazëtirë, faqe që provohen derisa të mbyllë.",
        features: [
          "Roadmap SEO 90 ditë + ekzekutim mujor",
          "Meta dhe/ose Google Ads me strukturë profesionale",
          "Teste kreative, ofertash dhe segmentesh",
          "Optimizim javor CPA / ROAS dhe shënjestrimi",
          "A/B në faqe kyçe dhe formularë",
          "Raport dy-javësh + një call strategjik mujor",
        ],
        featureBullets: [
          { emphasis: "Më shumë konvertim", detail: "landing dhe forma që provohen — jo 'dizajn një herë dhe harro'." },
          { emphasis: "Më mirë nga ads", detail: "dy kanale me një histori të vetme shitjeje dhe shpërndarje buxheti sipas të dhënave." },
          { emphasis: "Më pak humbje", detail: "optimizim javor: heqim çfarë djeg para, forcojmë çfarë sjell biseda." },
          { emphasis: "Partner në vendimet tuaja", detail: "takim strategjik mujor — ju dimë pse po bëjmë çdo ndryshim." },
        ],
        featured: true,
      },
      {
        name: "Dominate",
        price: "€1,500",
        priceNote: "/ muaj",
        tagline: "Zëni mendjen e blerësit para se ta zëjë dikush tjetër",
        ideal: "Për ata që duan të dominojnë kërkimin dhe reklamën: shumë kanale, një ofertë, zero justifikime — vetëm rritje e matshme javë pas jave.",
        features: [
          "SEO i avancuar + linjë për autoritet domeni dhe përmbajtje",
          "Google Ads + Meta Ads në paralel me ri-shpërndarje buxheti",
          "Strategji funnel, oferta dhe audienca B2B/B2C",
          "Kalendar kreativ dhe përsëritje mujore",
          "Raportim javor dhe call strategjik dy-herë në muaj",
          "Mbështetje për faqe / CRO me ekipin tuaj",
        ],
        featureBullets: [
          { emphasis: "Më shumë kanale, një qëllim", detail: "SEO + Google + Meta të lidhura me të njëjtën ofertë dhe standard matjeje." },
          { emphasis: "Autoritet që shet", detail: "përmbajtje që ju vendos si zgjedhje e logjikshme para konkurrencës." },
          { emphasis: "Shkallëzim i mençur", detail: "buxheti ecën te ofertat dhe format që sjellin klientë, jo te 'dukja'." },
          { emphasis: "Partneritet i ngushtë", detail: "dy takime strategjike në muaj — vendime të shpejta, pa pritje muajsh." },
        ],
      },
    ],
  },

  // ─── 4. BRANDING & CONTENT ─────────────────────────────────────────────────
  {
    slug: "branding-content",
    title: "Branding & Content",
    headline: "Privilegj i heshtur. Prani që nuk blihet me zbritje.",
    subheadline:
      "Klientët që paguajnë më mirë zgjedhin para se të arsyetojnë — dhe zgjedhja fillon me atë që ndiejnë kur ju shohin. Ne e përkthejmë ekselencën tuaj të brendshme në një markë që duket e pazëvendësueshme.",
    short:
      "Pozicionim, identitet dhe përmbajtje për marka që duan status, besim dhe klientë më të përzgjedhur — jo thjesht më shumë dukshmëri.",
    description:
      "Marka juaj është prania juaj në dhomë edhe kur ju nuk flisni. Ne e ndërtojmë atë prani me finesë: hierarki vizuale, narrativë që ngjitet dhe një gjuhë e vetme kudo — që blerësi të ndihet i nderuar duke ju zgjedhur juve.",
    icon: "◆",
    ctaPrimary: "Planifikoni konsultën e parë",
    ctaSecondary: "Zbulo nivelin e pranisë suaj",
    trustLine: "Ekskluzivitet i kufizuar · përgjigje brenda 24 orëve · pa obligim",
    subServices: [
      "Status që ndihet",
      "Klientë më të përzgjedhur",
      "Çmime pa turp",
      "Prani në çdo prekje",
      "Trashëgimi, jo modë",
      "Partner për markë të qëndrueshme",
    ],
    packages: [
      {
        name: "Identity",
        price: "€800",
        tagline: "Prania e parë që thotë: këtu bëhet zgjedhje me kujdes",
        ideal: "Për ata që duan të ndihen si referencë edhe para se të hapet portofoli: identitet i qartë, i zbatueshëm nga ekipi, gati për çdo skenë.",
        features: [
          "Logo: koncepte + final i polish-uar",
          "Paleta, tipografi dhe rregulla hapësire",
          "Versione për web, print dhe dark/light",
          "Guidelines PDF bazë (përdorimi i markës)",
          "Eksporte gati për rrjete dhe materiale fillestare",
        ],
        featureBullets: [
          { emphasis: "Prani e menjëhershme", detail: "identitet që fton respekt — para se të flitet për shifra." },
          { emphasis: "Një standard, kudo", detail: "ngjyra, tipografi dhe rregulla që e bëjnë ekipin tuaj ambasador." },
          { emphasis: "Gati për skenën e duhur", detail: "versione për web, print dhe dark/light — i njëjti nivel digniteti." },
          { emphasis: "Trashëgimi e pastër", detail: "udhëzues që mban markën të denjë edhe kur rriteni shpejt." },
        ],
      },
      {
        name: "Evolution",
        price: "€1,800",
        tagline: "Narrativë dhe imazh për ata që zgjedhin cilësinë — jo çmimin e parë",
        ideal: "Për marka që duan të tërheqin klientë më të përzgjedhur: zë, vizual dhe përmbajtje që ndiejnë njësoj luksoze në social, sallë takimi dhe inbox.",
        features: [
          "Gjithçka nga paketa Identity",
          "Brand Kit i zgjeruar (zëri, vizuali, shembuj aplikimesh)",
          "Strategji komunikimi dhe mesazhe kyçe",
          "Sesion fotografik (3 orë) + 30 foto të edituara",
          "Templates social, kartëvizita, email signature",
        ],
        featureBullets: [
          { emphasis: "Memorie e markës", detail: "vizual dhe zë që mbeten në mendje — jo në rrjedhën e harresës." },
          { emphasis: "Ndjenja e zgjedhjes", detail: "narrativë që e bën klientin të ndihet i nderuar, jo i shitur." },
          { emphasis: "Prani e njëtrajtshme", detail: "social dhe materiale që flasin të njëjtin gjuhë luksoze." },
          { emphasis: "Imazh që mban çmimin", detail: "fotografi që e bën ofertën të duket e denjë — para negociatës." },
        ],
        featured: true,
      },
      {
        name: "Authority",
        price: "Nga €3,500",
        tagline: "Autoritet që ndihet si trashëgimi — jo si sezon",
        ideal: "Për marka që duan të zënë vendin e sipërm në mendje: strategji e plotë, identitet i zgjeruar, foto dhe video me të njëjtin ton luksoz.",
        features: [
          "Strategji marke, pozicionim dhe narrativë e plotë",
          "Identitet vizual i zgjeruar (ikona, pattern, UI tokens)",
          "Produksion foto + video (klip-e dhe materiale kampanjash)",
          "Bankë materialesh e organizuar për ekipin",
          "Kalendar editorial 3 muaj + mbështetje mujore",
          "Trajnim për ekipin mbi përdorimin e sistemit",
        ],
        featureBullets: [
          { emphasis: "Pozicion që zgjat", detail: "nga strategjia te çdo detaj që thotë: kjo është zgjedhja e vetme e denjë." },
          { emphasis: "Përmbajtje që mbush orar", detail: "foto dhe video që e bëjnë takimin të ndihet i pashmangshëm." },
          { emphasis: "Autoritet i heshtur", detail: "materiale që ju vendosin në krye të listës — pa britmë." },
          { emphasis: "Partner pas dorëzimit", detail: "editorial dhe mbështetje — marka mbetet e pastër kur rriteni." },
        ],
      },
    ],
  },

  // ─── 5. SOCIAL MEDIA MARKETING ─────────────────────────────────────────────
  {
    slug: "smm",
    title: "Social Media",
    headline: "Çdo post është mundësi shitjeje — ne e menaxhojmë gjithë prezencën tënde.",
    subheadline:
      "Social media profesionale me content strategjik, dizajn dhe posting të rregullt — kështu marka jote rritet çdo ditë pa humbur kohë.",
    short:
      "Menaxhim i plotë i social media: content, dizajn, posting dhe angazhim — për bizneset shqiptare që duan prani të rregullt dhe profesionale.",
    description:
      "Shumica e bizneseve nuk kanë kohë për social media të rregullt. Ne marrim kujdesin e plotë — nga strategjia te çdo postim — kështu ju fokusoheni vetëm në biznesin tuaj ndërsa audienca rritet çdo muaj.",
    icon: "◉",
    ctaPrimary: "Fillo Tani — Pa Kosto",
    ctaSecondary: "Shiko Paketat",
    trustLine: "0 kosto · 0 obligim · Plan konkret brenda 24 orësh",
    subServices: [
      "Instagram & Facebook",
      "Reels & Stories",
      "Content & Dizajn",
      "Posting i rregullt",
      "Angazhim aktiv",
    ],
    packages: [
      {
        name: "Starter",
        price: "€200",
        priceNote: "/ muaj",
        tagline: "Presenza bazë",
        ideal: "8 postime/muaj në 1 platformë me dizajn grafik profesional — prezencë e rregullt pa stres dhe pa bosh.",
        features: [
          "8 postime/muaj (feed + caption profesionale)",
          "1 platformë (Instagram ose Facebook)",
          "Dizajn grafik i personalizuar sipas markës",
          "Hashtag research dhe optimizim",
          "Raport mujor i performancës",
        ],
        featureBullets: [
          { emphasis: "8 postime/muaj", detail: "2 herë në javë — ritëm i qëndrueshëm që ndërton audiencë." },
          { emphasis: "Dizajn premium", detail: "grafika të personalizuara sipas identitetit të markës suaj." },
          { emphasis: "1 platformë", detail: "fokus i plotë ku jeni ju dhe klientët tuaj." },
          { emphasis: "Raport mujor", detail: "reach, engagement dhe rritje — e dini ku jeni çdo muaj." },
        ],
      },
      {
        name: "Growth",
        price: "€450",
        priceNote: "/ muaj",
        tagline: "Rritje aktive",
        ideal: "20 postime/muaj + Stories & Reels në 2 platforma — strateg i plotë me angazhim aktiv dhe raportim të detajuar çdo 2 javë.",
        features: [
          "20 postime/muaj (feed + caption)",
          "Stories ditore + 4 Reels/muaj",
          "2 platforma (Instagram + Facebook ose TikTok)",
          "Menaxhim komentesh dhe DM",
          "Hashtag + SEO social i optimizuar",
          "Raport 2-javësh i detajuar",
        ],
        featureBullets: [
          { emphasis: "20 postime + Reels", detail: "content i larmishëm — feed, stories dhe video çdo javë." },
          { emphasis: "2 platforma", detail: "prani e koordinuar me mesazh të njëjtë — dukshmëri maksimale." },
          { emphasis: "Angazhim aktiv", detail: "komente dhe DM të menaxhuara — komuniteti ndërtuar me kujdes." },
          { emphasis: "Raport 2-javësh", detail: "të dhëna të qarta — vendosim bazuar në numra, jo intuitë." },
        ],
        featured: true,
      },
      {
        name: "Pro",
        price: "€850",
        priceNote: "/ muaj",
        tagline: "Dominim social",
        ideal: "30 postime/muaj + video + ads në të gjitha platformat — agjensi e plotë sociale me strategji, ekzekutim dhe raportim javor.",
        features: [
          "30 postime/muaj + Stories të përditshme",
          "8 Reels / Video / TikTok",
          "Të gjitha platformat (IG, FB, TikTok, LinkedIn)",
          "Ads management bazë (Meta / TikTok Ads)",
          "Produksion content grafik dhe video",
          "Call strategjik mujor + raport javor",
        ],
        featureBullets: [
          { emphasis: "30 postime + video", detail: "presence e plotë çdo ditë — marka nuk heshtet kurrë." },
          { emphasis: "Të gjitha platformat", detail: "IG, FB, TikTok, LinkedIn — i njëjti standard kudo." },
          { emphasis: "Ads bazë", detail: "boost dhe fushata Meta / TikTok për rritje të shpejtë audiencë." },
          { emphasis: "Partneritet strategjik", detail: "call mujor + raport javor — gjithmonë të informuar." },
        ],
      },
    ],
  },

  // ─── 6. MIRËMBAJTJA ────────────────────────────────────────────────────────
  {
    slug: "mirembajtja",
    title: "Mirëmbajtja",
    headline: "Website juaj nuk duhet të ndalet kurrë.",
    subheadline:
      "Ne sigurojmë që ai të punojë për ju, çdo sekondë.",
    short:
      "Mirëmbajtje profesionale e website dhe e-commerce: monitorim 24/7, siguri, shpejtësi dhe përditësime — për bizneset që nuk mund të përballojnë ndërprerje.",
    description:
      "Çdo orë që faqja juaj është jashtë linje ose e ngadaltë, humbni klientë dhe besueshmëri. Ne marrim kujdesin e plotë teknik — nga sigurinë dhe backup-et te optimizimi i shpejtësisë dhe përditësimet e rregullta.",
    icon: "◈",
    ctaPrimary: "Fillo Mirëmbajtjen",
    ctaSecondary: "Shiko Paketat",
    trustLine: "0 kosto konsultimi · Aktivizim brenda 24h · Pa obligim",
    subServices: [
      "Monitorim 24/7",
      "Siguri & backup",
      "Shpejtësi & optimizim",
      "Përditësime të rregullta",
      "Support prioritar",
    ],
    packages: [
      {
        name: "Basic",
        price: "€49",
        priceNote: "/ muaj",
        tagline: "Mbrojtje bazë",
        ideal: "Monitorim aktiv, backup javor dhe përditësime bazë — faqja juaj mbetet online dhe e mbrojtur pa kosto të lartë.",
        features: [
          "Monitorim uptime 24/7 me njoftime",
          "Backup javor i plotë",
          "Përditësime CMS, plugin dhe tema",
          "Raport mujor i shëndetit të faqes",
          "Support email me përgjigje brenda 48h",
        ],
        featureBullets: [
          { emphasis: "Monitorim 24/7", detail: "njoftim i menjëhershëm kur faqja bie — jo pas orësh." },
          { emphasis: "Backup javor", detail: "kopje e plotë çdo javë — faqja rikthehet shpejt nëse ndodh diçka." },
          { emphasis: "Përditësime", detail: "CMS, plugin dhe tema — gjithmonë të sigurt dhe funksionalë." },
          { emphasis: "Raport mujor", detail: "gjendja e faqes, problemet e zgjidhura dhe hapat e radhës." },
        ],
      },
      {
        name: "Pro",
        price: "€99",
        priceNote: "/ muaj",
        tagline: "Mirëmbajtje e plotë",
        ideal: "Backup ditor, optimizim shpejtësie, siguri e avancuar dhe support prioritar — për bizneset që nuk tolerojnë ndërprerje.",
        features: [
          "Monitorim uptime 24/7 me SMS dhe email",
          "Backup ditor i automatizuar",
          "Sigurim SSL, firewall dhe skanim malware",
          "Optimizim cache dhe shpejtësi çdo muaj",
          "Ndërhyrje teknike deri 2 orë/muaj",
          "Support prioritar me përgjigje brenda 4h",
        ],
        featureBullets: [
          { emphasis: "Backup ditor", detail: "çdo ditë — nëse ndodh diçka, humbet maksimum 24 orë punë." },
          { emphasis: "Siguri e avancuar", detail: "firewall aktiv, skanim malware dhe SSL — faqja e mbrojtur si duhet." },
          { emphasis: "Optimizim shpejtësie", detail: "cache dhe performancë të optimizuara çdo muaj — jo vetëm njëherë." },
          { emphasis: "2h ndërhyrje/muaj", detail: "ndryshime, rregullime ose shtesa të vogla pa kosto shtesë." },
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€199",
        priceNote: "/ muaj",
        tagline: "Partner teknik i plotë",
        ideal: "Monitorim i avancuar, ndërhyrje pa limit, optimizim i vazhdueshëm dhe raportim javor — për bizneset me trafik të lartë ose e-commerce aktiv.",
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
          { emphasis: "Ndërhyrje pa limit", detail: "çdo ndryshim teknik, rregullim ose shtesë — pa faturë shtesë." },
          { emphasis: "Siguri enterprise", detail: "WAF, anti-DDoS dhe skanim ditor — mbrojtje si platformat e mëdha." },
          { emphasis: "Core Web Vitals", detail: "optimizim i vazhdueshëm — Google ju shpërblen me pozicion më të lartë." },
          { emphasis: "Përgjigje brenda 1h", detail: "problemi nuk pret — as zgjidhja jonë." },
        ],
      },
    ],
  },
];

export const serviceCategoryBySlug = (slug: string) =>
  serviceCategories.find((item) => item.slug === slug);
