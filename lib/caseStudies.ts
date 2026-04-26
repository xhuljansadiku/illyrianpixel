export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  year: string;
  intro: string;
  problem: string;
  solution: string;
  result: string;
  metrics: string[];
  heroImage: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "atelier-prime",
    title: "Atelier Prime",
    category: "Ribrandim E-commerce",
    year: "2026",
    intro:
      "Një transformim i plotë i eksperiencës së blerjes për një brand me target premium dhe cikël të shkurtër vendimmarrjeje.",
    problem:
      "Brandi kishte trafik cilësor, por rrjedha e faqes nuk transmetonte besim dhe produktet premium humbnin vlerën në prezantim.",
    solution:
      "Ristrukturuam arkitekturën e përmbajtjes, dizajnuam një sistem editorial për produktet dhe optimizuam checkout-in për vendime më të shpejta.",
    result:
      "Eksperienca u bë më e qartë, më e qetë dhe më bindëse, duke përmirësuar ndjeshëm cilësinë e kërkesave dhe vlerën e porosive.",
    metrics: ["+42% lead-e të kualifikuara", "AOV më i lartë në 8 javë", "-27% drop-off në checkout"],
    heroImage: "/images/work-01.svg"
  },
  {
    slug: "maison-verre",
    title: "Maison Verre",
    category: "Website për Fushatë Luksi",
    year: "2026",
    intro:
      "Një microsite editorial për lançimin e koleksionit, i ndërtuar për të rritur kohëzgjatjen e sesionit dhe intentin e blerjes.",
    problem:
      "Fushata kishte vizual të fortë, por landing-u nuk mbante ritëm narrativ dhe përdoruesit dilnin para seksionit kyç të ofertës.",
    solution:
      "Krijuam scroll narrative me progres të kontrolluar, tipografi të fortë dhe CTA të vendosura sipas sjelljes së përdoruesit.",
    result:
      "Përdoruesit qëndruan më gjatë, panë më shumë seksione dhe kaluan në kërkesë me frekuencë më të lartë.",
    metrics: ["2.3x kohë në faqe", "-34% bounce rate", "+19% CTR në CTA kryesore"],
    heroImage: "/images/work-02.svg"
  },
  {
    slug: "nocturne-hotel",
    title: "Nocturne Hotel",
    category: "Eksperiencë Rezervimi Imersive",
    year: "2025",
    intro:
      "Redizajnim i funnel-it të rezervimeve për të ulur varësinë nga OTA dhe rritur rezervimet direkte me marzh më të lartë.",
    problem:
      "Përdoruesit fillonin rezervimin por e ndërprisnin në hapat e fundit për shkak të paqartësisë në paketat dhe diferencimit.",
    solution:
      "Ndërtuam një rrjedhë rezervimi me hierarki të fortë vizuale, krahasim të qartë të paketave dhe mikro-ndërveprime konfirmuese.",
    result:
      "Procesi u bë më i kuptueshëm dhe më i shpejtë, duke rritur konvertimin e kanalit direkt.",
    metrics: ["+31% rezervime direkte", "-22% braktisje në hapin final", "+14% vlerë mesatare rezervimi"],
    heroImage: "/images/work-03.svg"
  },
  {
    slug: "linea-capital",
    title: "Linea Capital",
    category: "Platformë Korporative Editoriale",
    year: "2025",
    intro:
      "Platformë për një firmë financiare që kishte nevojë për prezencë më të qartë, autoritare dhe më bindëse për lead-et enterprise.",
    problem:
      "Mesazhi ishte i shpërndarë dhe përdoruesit nuk arrinin të kuptonin shpejt ofertën kryesore të kompanisë.",
    solution:
      "Zhvilluam një strukturë editoriale me hierarki të qartë, seksione proof-driven dhe CTA me kontekst sipas fazës së leximit.",
    result:
      "Faqja komunikon qartë vlerën e biznesit dhe përshpejton kalimin nga interesi në kërkesë konkrete bashkëpunimi.",
    metrics: ["+58% përfundim kërkesash", "+33% kohë në seksionet kyçe", "+21% klikime në CTA kryesore"],
    heroImage: "/images/work-04.svg"
  }
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((item) => item.slug === slug);
