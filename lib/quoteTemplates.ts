// Shabllone ofertash — artikuj të parambushur për dokumentet më të shpeshta.
// Mbahen në kod (pa DB): ndryshohen rrallë dhe kështu s'kanë asnjë mirëmbajtje.
import type { QuoteItem } from "@/lib/quotes";

export type QuoteTemplate = {
  id: string;
  label: string;
  kind: "quote" | "invoice";
  items: QuoteItem[];
  notes: string;
};

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: "website-premium",
    label: "Website Premium",
    kind: "quote",
    items: [
      { description: "Website premium deri në 8 faqe — dizajn i personalizuar", qty: 1, price: 1200 },
      { description: "Optimizim SEO bazë + shpejtësi", qty: 1, price: 200 },
      { description: "Formular kontakti + lidhje WhatsApp", qty: 1, price: 100 },
    ],
    notes:
      "Përfshihet: dizajn responsiv, SEO bazë, trajnim 1-orësh për përdorim.\nPagesa: 50% paradhënie, 50% para publikimit.\nAfati: 2–4 javë nga miratimi i dizajnit.",
  },
  {
    id: "ecommerce",
    label: "Dyqan Online (E-commerce)",
    kind: "quote",
    items: [
      { description: "Dyqan online — deri në 100 produkte", qty: 1, price: 2000 },
      { description: "Integrim pagesash online", qty: 1, price: 300 },
      { description: "Trajnim për menaxhim produktesh e porosish", qty: 1, price: 150 },
    ],
    notes:
      "Përfshihet: katalog produktesh, shportë, pagesa online, panel porosish.\nPagesa: 50% paradhënie, 50% para publikimit.\nAfati: 4–6 javë.",
  },
  {
    id: "seo-mujor",
    label: "SEO Mujore",
    kind: "quote",
    items: [
      { description: "Optimizim SEO mujor — kërkim fjalësh kyçe, on-page, raport", qty: 1, price: 250 },
    ],
    notes: "Shërbim mujor pa kontratë afatgjatë — raport progresi çdo fund muaji.",
  },
  {
    id: "mirembajtje",
    label: "Mirëmbajtje Mujore",
    kind: "invoice",
    items: [
      { description: "Mirëmbajtje mujore website — përditësime, siguri, ndryshime të vogla", qty: 1, price: 50 },
    ],
    notes: "Përfshihet: backup, monitorim sigurie, deri në 2 orë ndryshime të vogla në muaj.",
  },
  {
    id: "branding",
    label: "Branding & Logo",
    kind: "quote",
    items: [
      { description: "Dizajn logoje — 3 koncepte + revizione", qty: 1, price: 350 },
      { description: "Paketë identiteti vizual (ngjyra, fonte, udhëzues)", qty: 1, price: 250 },
    ],
    notes: "Dorëzohen: skedarët burimorë (AI/SVG), versionet për web e print, udhëzuesi i brendit.",
  },
];
