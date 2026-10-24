export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  location: string;
  flagCodes: string[];
  year: string;
  // ≤160 shkronja për <meta description>; pa të përdoret intro (shpesh 250+ shkronja)
  metaDescription?: string;
  intro: string;
  problem: string;
  solution: string;
  result: string;
  metrics: string[];
  tags: string[];
  heroImage: string;
  liveUrl: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "esm-group",
    title: "ESM Group",
    category: "Website për Biznes Industrial",
    location: "Milano, Itali",
    flagCodes: ["it"],
    year: "2026",
    metaDescription: "ESM Group, Milano: identitet brandi, strukturë përmbajtjeje dhe website i qartë për një kompani industriale. Prezencë që krijon besim dhe sjell klientë.",
    intro:
      "Sistem i plotë dixhital për një kompani industriale serioze.\nNdërtuam identitetin e brandit, strukturën e përmbajtjes dhe një website të qartë që komunikon vlerën menjëherë.\n\nPrezencë profesionale që krijon besim dhe tërheq klientë të duhur.",
    problem:
      "Oferta dhe eksperienca e kompanisë nuk pasqyroheshin qartë online, duke krijuar paqartësi në llojin e projekteve dhe ritmin e kontakteve hyrëse.",
    solution:
      "Ndërtuam strukturë të pastër me seksione të ndara sipas shërbimeve, prova konkrete pune dhe një navigim që e çon vizitorin drejt kërkesës pa pengesa.",
    result: "Klientët e duhur, mesazhi i duhur e bëmë website-in të flasë për ta.",
    metrics: ["Mesazh i qartë për biznese", "Navigim i thjeshtë dhe i qartë", "Kërkesa industriale cilësore"],
    tags: ["Identitet brandi", "Përmbajtje (IT/EN)", "Website"],
    heroImage: "/images/projects/esm-group.avif",
    liveUrl: "https://esm-group.eu/"
  },
  {
    slug: "bardhi-wellness",
    title: "Bardhi Wellness",
    category: "Brand Personal",
    location: "Prishtinë & Köln",
    flagCodes: ["xk", "de"],
    year: "2026",
    metaDescription: "Bardhi Wellness: identitet, strukturë oferte dhe website me pagesa të integruara për një brand personal fitnessi. Më pak pyetje, më shumë blerje.",
    intro:
      "Sistem i plotë për shitje online për një brand personal në fitness.\nNdërtuam identitetin, strukturën e ofertës dhe një website me pagesa të integruara për një proces të thjeshtë dhe të qartë.\n\nMë pak pyetje, më shumë blerje, një eksperiencë që kthen vizitorët në klientë.",
    problem:
      "Informacioni ekzistonte, por hierarkia e përmbajtjes dhe narrativa e ofertës nuk e mbështesnin plotësisht perceptimin profesional të brandit.",
    solution:
      "Organizuam përmbajtjen sipas asaj që kërkon vizitori, qartësuam paketat dhe forcuam seksionet që ndërtojnë besim para kontaktit.",
    result: "Vizitorët kuptojnë, vendosin dhe kontaktojnë më shpejt.",
    metrics: ["Ofertë e qartë dhe e strukturuar", "Brand me autoritet personal", "Vendimmarrje pa hezitim"],
    tags: ["Identitet brandi", "Përmbajtje", "Website", "Pagesa online (Stripe/PayPal)"],
    heroImage: "/images/projects/bardhi-wellness.png",
    liveUrl: ""
  },
  {
    slug: "hauswerk-niederbayern",
    title: "Hauswerk Niederbayern",
    category: "Website për Shërbime Lokale",
    location: "Straubing, Gjermani",
    flagCodes: ["de"],
    year: "2026",
    intro:
      "Pozicionuam shërbimet qartë për tregun lokal gjerman, klientët gjejnë ofertën shpejt dhe nisin kontaktin me pritshmëri të sakta.",
    problem:
      "Vizitorët nuk arrinin gjithmonë të kuptonin menjëherë shërbimin përkatës dhe hapin e duhur për të dërguar kërkesë.",
    solution:
      "Krijuam një faqe kryesore të rregullt, ndarje të qarta të shërbimeve dhe butona kontakti të drejtpërdrejtë për kontakt të menjëhershëm.",
    result: "Klientët lokalë gjejnë shërbimin dhe nisin kontaktin direkt.",
    metrics: ["Shërbime të dalluara qartë", "Kontakt me një klik", "Kërkesa me pritshmëri të sakta"],
    tags: ["Shërbime lokale", "Më shumë kërkesa", "Qartësi"],
    heroImage: "/images/projects/hauswerk-niederbayern.avif",
    liveUrl: "https://hauswerk-niederbayern.de/"
  },
  {
    slug: "palushi-brothers",
    title: "Palushi Brothers Construction",
    category: "Website për Kompani Ndërtimi",
    location: "Londër, Angli",
    flagCodes: ["gb"],
    year: "2026",
    metaDescription: "Palushi Brothers, Londër: identitet, website i optimizuar për besim dhe Google Ads për një kompani ndërtimi. Kërkesa reale nga klientë të duhur.",
    intro:
      "Sistem i plotë për gjenerim kontaktesh për një kompani ndërtimi në Londër.\nNdërtuam identitetin, strukturën e përmbajtjes dhe një website të optimizuar për besim, i mbështetur me Google Ads për të sjellë klientë të rinj.\n\nNjë prezencë që krijon besim dhe gjeneron kërkesa reale nga klientë të duhur.",
    problem:
      "Vizitorët vinin me pritshmëri të ndryshme dhe pa një kuadër të qartë të shërbimeve, gjë që e bënte më të vështirë filtrimin e kërkesave.",
    solution:
      "Riorganizuam seksionet e ofertës, provave të punës dhe kontaktit për të vendosur një rrjedhë më bindëse nga interesi te kërkesa.",
    result: "Vizitorët besojnë dhe nisin bisedë serioze, jo hezitim.",
    metrics: ["Vlerësime klientësh të dukshme", "Shërbime të kuptueshme", "Biseda hyrëse cilësore"],
    tags: ["Identitet brandi", "Përmbajtje", "Website", "Google Ads"],
    heroImage: "/images/projects/palushi-brothers.png",
    liveUrl: "https://www.palushibrothers.co.uk/"
  },
  {
    slug: "roofon-nyc",
    title: "Roof ON NYC",
    category: "Website për Kompani Çatish",
    location: "Brooklyn, Nju Jork",
    flagCodes: ["us"],
    year: "2026",
    metaDescription: "Roof ON NYC: website për një kompani familjare çatish në Nju Jork, me shërbimet, zonat dhe kontakt të menjëhershëm me telefon e formular oferte.",
    intro:
      "Website për një kompani familjare çatish dhe hidroizolimi në Nju Jork.\nNdërtuam një faqe të fortë që tregon shërbimet, zonat ku punojnë dhe e bën kontaktin të menjëhershëm, me telefon dhe formular oferte.\n\nKlientët në Nju Jork e gjejnë, i besojnë dhe telefonojnë.",
    problem:
      "Shërbimet dhe zonat e mbuluara në Nju Jork e Nju Xhersi nuk paraqiteshin qartë, ndaj klientët nuk e kuptonin shpejt nëse kompania punonte në lagjen e tyre.",
    solution:
      "Ndërtuam faqe të veçanta për çdo shërbim dhe zonë, butona telefonate në çdo ekran, formular oferte me datë të preferuar dhe galeri me punë para/pas.",
    result: "Klientët gjejnë shërbimin në zonën e tyre dhe telefonojnë direkt.",
    metrics: ["Faqe për çdo zonë shërbimi", "Telefonatë me një klik", "Formular oferte i thjeshtë"],
    tags: ["Website", "SEO lokale", "Më shumë kërkesa"],
    heroImage: "/images/projects/roofon-nyc.webp",
    liveUrl: "https://www.roofonnyc.com/"
  },
  {
    slug: "ilirjana-shehu-photography",
    title: "Ilirjana Shehu Photography",
    category: "Website Portofoli",
    location: "Tiranë, Shqipëri",
    flagCodes: ["al"],
    year: "2026",
    intro:
      "Portofoli tregon stilin dhe cilësinë e punës pa zhurmë, imazhi flet, rrjedha është e qetë, impakti është i menjëhershëm.",
    problem:
      "Projektet fotografike nuk kishin një prezantim të qartë online, duke humbur ritmin dhe efektin e punës.",
    solution:
      "Ndërtuam strukturë minimaliste, renditje të pastër dhe fokus të fortë te punimet për të rritur cilësinë e perceptimit.",
    result: "Portofoli flet vetë, pa zhurmë, me ritëm dhe impakt.",
    metrics: ["Galeri si revistë fotografike", "Navigim i qetë dhe i fokusuar", "Cilësia e punës në plan të parë"],
    tags: ["Fotografi", "Portofol", "Galeri"],
    heroImage: "/images/projects/ilirjana-shehu-photography.png",
    liveUrl: "https://www.ilirjanashehu.com/"
  },
  {
    slug: "suli-group-trockenbau",
    title: "Suli Group Trockenbau",
    category: "Website Korporativ",
    location: "Nyrëmberg, Gjermani",
    flagCodes: ["de"],
    year: "2026",
    intro:
      "Website korporativ që komunikon ofertën e kompanisë me autoritet, vizitori orientohet drejt kontaktit pa hezitim.",
    problem:
      "Mesazhi i shërbimeve ishte i shpërndarë dhe nuk theksonte mjaftueshëm pikat kyçe të diferencimit të kompanisë.",
    solution:
      "Riorganizuam përmbajtjen me seksione të qarta, butona kontakti të qartë dhe një stil elegant me ngjyra të errëta.",
    result: "Oferta komunikon me autoritet, vizitori orientohet drejt kontaktit.",
    metrics: ["Stil elegant dhe premium", "Seksione shërbimesh të qarta", "Kontakt pa hezitim"],
    tags: ["Ndërtim", "Korporativ", "Më shumë kërkesa"],
    heroImage: "/images/projects/suli-group-trockenbau.png",
    liveUrl: ""
  },
  {
    slug: "gentjan-mara",
    title: "Gentjan Mara",
    category: "Platformë Fetare & Brand Personal",
    location: "Tiranë, Shqipëri",
    flagCodes: ["al"],
    year: "2026",
    metaDescription: "Platformë për një hoxhë me audiencë të gjerë shqipfolëse: ligjërata, biografi, Kurani, hadithet, kohët e namazit dhe kibla në një vend të vetëm.",
    intro:
      "Platformë dixhitale për një hoxhë me audiencë të gjerë shqipfolëse.\nBashkuam ligjëratat, biografinë dhe burime të përditshme si Kurani, hadithet, kohët e namazit dhe kibla në një vend të vetëm.\n\nNjë shtëpi online e qetë dhe e besueshme, që ndjekësit e përdorin çdo ditë.",
    problem:
      "Përmbajtja ishte e shpërndarë nëpër YouTube, Facebook dhe Instagram, pa një vend qendror ku ndjekësit të gjenin ligjëratat, burimet dhe kontaktin.",
    solution:
      "Ndërtuam platformë me hierarki të qartë: ligjërata, biografi, mjete interaktive (kohët e namazit, kibla, tesbih, kalkulator zekati) dhe formë konfidenciale \"Pyete Hoxhën\".",
    result: "Një adresë e vetme ku ndjekësit kthehen çdo ditë.",
    metrics: ["Ligjërata dhe burime në një vend", "Mjete interaktive për përdorim ditor", "Pyetje konfidenciale me një klik"],
    tags: ["Brand personal", "Përmbajtje (SQ/AR)", "Website", "Mjete interaktive"],
    heroImage: "/images/projects/gentjan-mara.png",
    liveUrl: "https://www.gentjanmara.com/"
  }
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((item) => item.slug === slug);






