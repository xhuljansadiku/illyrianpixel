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
    title: "Si të rrisësh klientët online pa djegur buxhetin",
    category: "Rritje",
    excerpt: "Nga struktura e ofertës te rrjedha e faqes: çfarë ndryshon realisht konvertimin.",
    date: "Prill 2026",
    content: [
      "Shumë biznese fokusohen te trafiku, por humbin në konvertim. Problemi shpesh nuk është reklama, por përputhja mes mesazhit dhe eksperiencës së faqes.",
      "Nis me një ofertë të qartë mbi fold, një proof i besueshëm dhe një CTA të vetme dominuese për çdo seksion.",
      "Mat vetëm 3 gjëra në fillim: klikim CTA, formular i nisur, formular i dërguar. Pastaj optimizo."
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
    title: "Pse SEO është kritik për biznese serioze",
    category: "SEO",
    excerpt: "SEO nuk është vetëm pozicionim: është kanal kërkese me intent të lartë.",
    date: "Prill 2026",
    content: [
      "Një faqe pa SEO është si showroom pa rrugë hyrëse. Mund të duket bukur, por nuk sjell kërkesë të qëndrueshme.",
      "SEO modern fillon nga strukturimi i faqeve sipas intentit: informim, krahasim, vendim.",
      "Kombino SEO me proof social dhe një funnel të qartë për të kthyer trafikun organik në klientë realë."
    ]
  }
];

export const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
