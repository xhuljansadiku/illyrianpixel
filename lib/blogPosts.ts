export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "si-te-rrisesh-klientet-online",
    title: "Ke trafikun. Por ku janë klientët?",
    category: "Rritje",
    excerpt:
      "Shumica e bizneseve shpenzojnë para për të sjellë njerëz në faqe dhe i humbin menjëherë.\nJo sepse oferta është e keqe, por sepse faqja nuk po bën punën e saj.",
    date: "Prill 2026",
    content: [
      "Shumica e bizneseve shpenzojnë para për të sjellë njerëz në faqe dhe i humbin menjëherë. Jo sepse oferta është e keqe, por sepse faqja nuk po bën punën e saj.",
      "Oferta e parë, dëshmia dhe autoriteti, një CTA e vetme për seksion, pastaj mat klikimet në CTA, fillimin e formularit dhe dërgimin.",
      "Rritja fillon me një faqe që di punën e saj; pastaj çdo euro reklamë kthehet mbrapsht."
    ]
  },
  {
    slug: "gabimet-kryesore-ne-website",
    title: "Gabimet që bëjnë bizneset në website (dhe si i rregullojmë)",
    category: "UX",
    excerpt: "Një listë e shkurtër e gabimeve që ulin besimin dhe shtyjnë klientin të largohet.",
    date: "Prill 2026",
    content: [
      "Gabimi #1: Hierarki e paqartë. Vizitori nuk kupton çfarë ofroni brenda 5 sekondave.",
      "Gabimi #2: CTA të shumta pa prioritet. Kur çdo gjë është e rëndësishme, asgjë nuk është.",
      "Gabimi #3: Faqe e ngadaltë në mobile. Shpejtësia është pjesë e perceptimit premium."
    ]
  },
  {
    slug: "pse-seo-eshte-kritik",
    title: "Pse SEO është kritik për biznese serioze (dhe jo një opsion)",
    category: "Strategji",
    excerpt:
      "Të kesh një website të bukur që nuk shfaqet në Google është si të hapësh një dyqan luksoz në mes të shkretëtirës.\nAskush nuk e gjen, askush nuk blen.",
    date: "Prill 2026",
    content: [
      "Google është kanali ku kërkohet zgjidhja; pa faqen e parë, biznesi është i padukshëm për shumicën e tregut.",
      "SEO ul CAC në afatgjatë dhe ndërton autoritet; PPC zhduket kur ndalon pagesa.",
      "UX dhe cilësia e faqes janë pjesë e renditjes. SEO është maratonë, shumica dështojnë sepse presin rezultate për dy javë."
    ]
  }
];

export const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
