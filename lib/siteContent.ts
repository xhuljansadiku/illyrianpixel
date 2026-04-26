export type ServiceItem = {
  slug: "websites" | "ecommerce" | "marketing" | "seo" | "branding" | "photography";
  title: string;
  short: string;
  problem: string;
  solution: string;
  deliverables: string[];
  faq: { q: string; a: string }[];
  image:
    | "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    | "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
    | "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    | "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07"
    | "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40";
};

export const servicesData: ServiceItem[] = [
  {
    slug: "websites",
    title: "Websites",
    short: "Website korporativ premium me qartësi, ritëm dhe konvertim.",
    problem: "Faqe që duken mirë por nuk komunikojnë vlerën dhe nuk konvertojnë.",
    solution: "Arkitekturë përmbajtjeje, dizajn editorial dhe performancë e kontrolluar.",
    deliverables: ["UX/UI sistem", "Zbatim Next.js", "Core SEO setup", "QA multi-device"],
    faq: [
      { q: "Sa zgjat një website premium?", a: "Mesatarisht 3-6 javë sipas volumit dhe feedback-ut." },
      { q: "A është i optimizuar për mobile?", a: "Po. Çdo ekran testohet dhe rregullohet sipas breakpoints reale." }
    ],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    short: "Eksperiencë blerjeje që rrit AOV dhe ul drop-off.",
    problem: "Trafik ka, por checkout humb përdoruesin në hapat kyç.",
    solution: "Ristrukturim i funnel-it të blerjes dhe qartësi në vendimmarrje.",
    deliverables: ["Product storytelling", "Checkout flow", "Tracking events", "Conversion QA"],
    faq: [
      { q: "A punoni me katalog të madh?", a: "Po, me strukturë që ruan qartësi edhe në volum të lartë produktesh." },
      { q: "A mund të shtojmë oferta sezonale?", a: "Po, me module të ripërdorshme për campaign blocks." }
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
  },
  {
    slug: "marketing",
    title: "Marketing",
    short: "Sistem kreativi + media buying për rritje të matshme.",
    problem: "Shpenzime reklamash pa qartësi në fitim dhe pa ritëm optimizimi.",
    solution: "Testim i kontrolluar, mesazh i fortë dhe iterim mbi KPI reale.",
    deliverables: ["Creative direction", "Funnel messaging", "Paid strategy", "Weekly optimization"],
    faq: [
      { q: "Sa shpesh raportohet performanca?", a: "Raportim periodik me metrika konkrete dhe next actions." },
      { q: "Punoni edhe me launch campaigns?", a: "Po, nga pre-launch narrative te post-launch optimization." }
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
  },
  {
    slug: "seo",
    title: "SEO",
    short: "Pozicionim organik me intent të lartë dhe strukturë të qëndrueshme.",
    problem: "Website pa trafik cilësor organik dhe pa kërkesa të qëndrueshme.",
    solution: "Mapa e intentit, strukturë faqeje dhe optimizim teknik + editorial.",
    deliverables: ["Keyword intent map", "On-page structure", "Technical cleanup", "Content cadence"],
    faq: [
      { q: "Kur shihen rezultatet?", a: "Zakonisht 2-4 muaj për lëvizje të qëndrueshme, sipas konkurrencës." },
      { q: "A përfshihet dhe content plan?", a: "Po, me tema që mbështesin pages me intent të lartë." }
    ],
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07"
  },
  {
    slug: "branding",
    title: "Branding",
    short: "Identitet i qartë që mban çmimin dhe krijon diferencim.",
    problem: "Markë e paqartë që humb në treg mes konkurentëve.",
    solution: "Pozicionim, ton i markës dhe sistem vizual me përdorim real.",
    deliverables: ["Brand strategy", "Visual identity", "Tone of voice", "Usage guidelines"],
    faq: [
      { q: "A përfshihet logo redesign?", a: "Po, kur është pjesë e nevojshme e strategjisë së re." },
      { q: "A mund të fillojmë vetëm me strategy?", a: "Po, mund të nisim me sprint strategjik dhe pastaj zbatim." }
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
  },
  {
    slug: "photography",
    title: "Photography",
    short: "Fotografi komerciale që e bën ofertën të duket premium dhe e besueshme.",
    problem: "Produkte/shërbime të mira humbin vlerë kur prezantimi vizual është i dobët.",
    solution: "Drejtim kreativ, plan set-i dhe përpunim final për imazh konsistent të markës.",
    deliverables: ["Art direction", "Product/space shooting", "Retouching", "Usage-ready exports"],
    faq: [
      { q: "A bëni edhe fotografi për social media?", a: "Po, planifikojmë sete që funksionojnë për website, ads dhe social." },
      { q: "A përfshihet editimi i fotove?", a: "Po, retouching dhe color grading për output final premium." }
    ],
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4"
  }
];

export const testimonialsCompact = [
  {
    quote: "Nga estetikë në sistem që konverton. Kjo ishte diferenca.",
    author: "Atelier Prime",
    result: "+42% lead-e të kualifikuara"
  },
  {
    quote: "Mesazh më i qartë, kërkesa më cilësore, vendime më të shpejta.",
    author: "Maison Verre",
    result: "2.3x kohë në faqe"
  }
];
