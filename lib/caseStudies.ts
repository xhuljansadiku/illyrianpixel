export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  location: string;
  flagCodes: string[];
  year: string;
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
    intro:
      "Sistem i plotë dixhital për një kompani industriale serioze.\nNdërtuam identitetin e brandit, strukturën e përmbajtjes dhe një website të qartë që komunikon vlerën menjëherë.\n\nPrezencë profesionale që krijon besim dhe tërheq klientë të duhur.",
    problem:
      "Oferta dhe eksperienca e kompanisë nuk pasqyroheshin qartë online, duke krijuar paqartësi në llojin e projekteve dhe ritmin e kontakteve hyrëse.",
    solution:
      "Ndërtuam strukturë të pastër me seksione service-first, proof konkret dhe flow navigimi që e çon përdoruesin drejt kërkesës pa friction.",
    result: "Klientët e duhur, mesazhi i duhur e bëmë website-in të flasë për ta.",
    metrics: ["Mesazh B2B i strukturuar", "Navigim pa friction", "Kërkesa industriale cilësore"],
    tags: ["Branding", "Content (IT/EN)", "Website"],
    heroImage: "/images/projects/esm-group.png",
    liveUrl: "https://esm-group.eu/"
  },
  {
    slug: "bardhi-wellness",
    title: "Bardhi Wellness",
    category: "Brand Personal",
    location: "Prishtinë & Köln",
    flagCodes: ["xk", "de"],
    year: "2026",
    intro:
      "Sistem i plotë për shitje online për një brand personal në fitness.\nNdërtuam identitetin, strukturën e ofertës dhe një website me pagesa të integruara për një proces të thjeshtë dhe të qartë.\n\nMë pak pyetje, më shumë blerje – një eksperiencë që kthen vizitorët në klientë.",
    problem:
      "Informacioni ekzistonte, por hierarkia e përmbajtjes dhe narrativa e ofertës nuk e mbështesnin plotësisht perceptimin profesional të brandit.",
    solution:
      "Organizuam përmbajtjen sipas intentit të përdoruesit, qartësuam paketat dhe forcuam seksionet që ndërtojnë besim para kontaktit.",
    result: "Vizitorët kuptojnë, vendosin dhe kontaktojnë më shpejt.",
    metrics: ["Ofertë e qartë dhe e strukturuar", "Brand me autoritet personal", "Vendimmarrje pa hezitim"],
    tags: ["Branding", "Content", "Website", "Payments (Stripe/PayPal)"],
    heroImage: "/images/projects/bardhi-wellness.png",
    liveUrl: "https://www.bardhiwellness.com/"
  },
  {
    slug: "hauswerk-niederbayern",
    title: "Hauswerk Niederbayern",
    category: "Local Services Website",
    location: "Straubing, Gjermani",
    flagCodes: ["de"],
    year: "2026",
    intro:
      "Pozicionuam shërbimet qartë për tregun lokal gjerman, klientët gjejnë ofertën shpejt dhe nisin kontaktin me pritshmëri të sakta.",
    problem:
      "Vizitorët nuk arrinin gjithmonë të kuptonin menjëherë shërbimin përkatës dhe hapin e duhur për të dërguar kërkesë.",
    solution:
      "Krijuam hierarchy të fortë në homepage, ndarje të qarta të shërbimeve dhe CTA të drejtpërdrejta për kontakt të menjëhershëm.",
    result: "Klientët lokalë gjejnë shërbimin dhe nisin kontaktin direkt.",
    metrics: ["Shërbime të dalluara qartë", "CTA i drejtpërdrejtë", "Kërkesa me pritshmëri të sakta"],
    tags: ["Local Service", "Lead Flow", "Clarity"],
    heroImage: "/images/projects/hauswerk-niederbayern.png",
    liveUrl: "https://hauswerk-niederbayern.de/"
  },
  {
    slug: "palushi-brothers",
    title: "Palushi Brothers Construction",
    category: "Website për Kompani Ndërtimi",
    location: "Londër, UK",
    flagCodes: ["gb"],
    year: "2026",
    intro:
      "Sistem i plotë për gjenerim kontaktesh për një kompani ndërtimi në Londër.\nNdërtuam identitetin, strukturën e përmbajtjes dhe një website të optimizuar për besim, i mbështetur me Google Ads për të sjellë klientë të rinj.\n\nNjë prezencë që krijon besim dhe gjeneron kërkesa reale nga klientë të duhur.",
    problem:
      "Vizitorët vinin me pritshmëri të ndryshme dhe pa një kuadër të qartë të shërbimeve, gjë që e bënte më të vështirë filtrimin e kërkesave.",
    solution:
      "Riorganizuam seksionet e ofertës, proof-it dhe kontaktit për të vendosur një rrjedhë më bindëse nga interesi te kërkesa.",
    result: "Vizitorët besojnë dhe nisin bisedë serioze, jo hezitim.",
    metrics: ["Proof social i dukshëm", "Shërbime të kuptueshme", "Biseda hyrëse cilësore"],
    tags: ["Branding", "Content", "Website", "Google Ads"],
    heroImage: "/images/projects/palushi-brothers.png",
    liveUrl: "https://www.palushibrothers.co.uk/"
  },
  {
    slug: "ilirjana-shehu-photography",
    title: "Ilirjana Shehu Photography",
    category: "Portfolio Website",
    location: "Tiranë, Shqipëri",
    flagCodes: ["al"],
    year: "2026",
    intro:
      "Portofoli tregon stilin dhe cilësinë e punës pa zhurmë, imazhi flet, rrjedha është e qetë, impakti është i menjëhershëm.",
    problem:
      "Projektet fotografike nuk kishin nje kornize editoriale te qarte online, duke humbur ritmin dhe efektin ne prezantim.",
    solution:
      "Ndërtuam strukturë minimaliste, hierarchy të pastër dhe fokus të fortë te punimet për të rritur cilësinë e perceptimit.",
    result: "Portofoli flet vetë, pa zhurmë, me ritëm dhe impakt.",
    metrics: ["Galeri me ritëm editorial", "Navigim i qetë dhe i fokusuar", "Cilësia e punës në plan të parë"],
    tags: ["Photography", "Portfolio", "Editorial"],
    heroImage: "/images/projects/ilirjana-shehu-photography.png",
    liveUrl: ""
  },
  {
    slug: "suli-group-trockenbau",
    title: "Suli Group Trockenbau",
    category: "Corporate Services Website",
    location: "Nyrëmberg, Gjermani",
    flagCodes: ["de"],
    year: "2026",
    intro:
      "Website korporativ që komunikon ofertën e kompanisë me autoritet, vizitori orientohet drejt kontaktit pa hezitim.",
    problem:
      "Mesazhi i shërbimeve ishte i shpërndarë dhe nuk theksonte mjaftueshëm pikat kyçe të diferencimit të kompanisë.",
    solution:
      "Riorganizuam përmbajtjen me seksione të qarta, CTA të fokusuara dhe estetikë të kontrolluar dark-luxury.",
    result: "Oferta komunikon me autoritet, vizitori orientohet drejt kontaktit.",
    metrics: ["Estetikë dark-luxury e kontrolluar", "Seksione shërbimesh të qarta", "Kontakt pa hezitim"],
    tags: ["Construction", "Corporate", "Lead Gen"],
    heroImage: "/images/projects/suli-group-trockenbau.png",
    liveUrl: ""
  }
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((item) => item.slug === slug);






