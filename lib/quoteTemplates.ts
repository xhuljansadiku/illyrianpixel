// Shabllone ofertash — artikuj të parambushur për dokumentet më të shpeshta.
// Mbahen në kod (pa DB): ndryshohen rrallë dhe kështu s'kanë asnjë mirëmbajtje.
// Çmimet lexohen nga paketat e /cmimet: kur ishin shkruar me dorë mbetën pas
// (website €1,500 kur Premium kushton €899). Përshkrimet ndjekin listat e paketave.
import type { QuoteItem } from "@/lib/quotes";
import type { ServiceCategory } from "@/lib/serviceCategories";
import { serviceCategories } from "@/lib/serviceCategories.sq";
import { SEO_MONTHLY } from "@/lib/seoAdsPricing";
import { parseEuro, paymentPlan } from "@/lib/pricingPsychology";

export type QuoteTemplate = {
  id: string;
  label: string;
  kind: "quote" | "invoice";
  items: QuoteItem[];
  notes: string;
};

/** Paketa e /cmimet me çmimin si numër (0 nëse s'gjendet — testi e kap) */
function pkg(slug: ServiceCategory["slug"], name: string) {
  const p = serviceCategories.find((c) => c.slug === slug)?.packages.find((x) => x.name === name);
  return { price: (p && parseEuro(p.price)) || 0, gift: p?.gift };
}

/** Dhurata e paketës si rresht €0 — premtimi shkruhet në ofertë */
const giftItems = (gift: string | undefined): QuoteItem[] => (gift ? [{ description: gift, qty: 1, price: 0 }] : []);

/** Rregulli i pagesës sipas shumës: deri në €1,000 50/50, mbi të 3 këste */
function paymentNote(amount: number, end = "para publikimit"): string {
  return paymentPlan(amount).kind === "split"
    ? `Pagesa: 50% paradhënie dhe 50% ${end}.`
    : `Pagesa në 3 këste: 40% në fillim, 30% pas aprovimit të dizajnit, 30% ${end}.`;
}

const business = pkg("website", "Business");
const premium = pkg("website", "Premium");
const shop = pkg("ecommerce", "Growth");
const maintenance = pkg("mirembajtja", "Basic");
const branding = pkg("branding-content", "Standard");

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: "website-business",
    label: "Website Business",
    kind: "quote",
    items: [
      { description: "Website Business — deri në 8 faqe, 1–2 gjuhë, strukturë e optimizuar për konvertim", qty: 1, price: business.price },
      ...giftItems(business.gift),
    ],
    notes: `Përfshihet: dizajn profesional, formular kontakti, SEO bazë, Google Analytics, optimizim për celular dhe shpejtësi.\n${paymentNote(business.price)}\nAfati: 2–4 javë nga miratimi i dizajnit.`,
  },
  {
    id: "website-premium",
    label: "Website Premium",
    kind: "quote",
    items: [
      { description: "Website Premium — dizajn 100% i personalizuar, deri në 8 faqe, 1–2 gjuhë", qty: 1, price: premium.price },
      ...giftItems(premium.gift),
    ],
    notes: `Përfshihet: SEO i avancuar (on-page), integrime (WhatsApp, booking etj.), funnel dhe CTA strategjike, Google Analytics, optimizim për celular dhe shpejtësi.\n${paymentNote(premium.price)}\nAfati: 2–4 javë nga miratimi i dizajnit.`,
  },
  {
    id: "ecommerce",
    label: "Dyqan Online (E-commerce)",
    kind: "quote",
    items: [
      { description: "Dyqan online Growth — deri në 100 produkte, filtra, kategori dhe kërkim", qty: 1, price: shop.price },
      ...giftItems(shop.gift),
    ],
    notes: `Përfshihet: pagesa të integruara, checkout i optimizuar për konvertim, analitikë shitjesh dhe Google Analytics, SEO bazë për produkte dhe kategori.\n${paymentNote(shop.price)}\nAfati: 4–6 javë.`,
  },
  {
    id: "seo-mujor",
    label: "SEO Mujore",
    kind: "quote",
    items: [
      { description: "SEO Basic mujor — 10–15 fjalë kyçe, optimizim on-page, Google Search Console", qty: 1, price: SEO_MONTHLY.starter },
    ],
    notes: "Shërbim mujor pa kontratë afatgjatë — raport i pozicioneve çdo fund muaji.",
  },
  {
    id: "mirembajtje",
    label: "Mirëmbajtje Mujore",
    kind: "invoice",
    items: [
      { description: "Mirëmbajtje mujore Basic — monitorim, backup, përditësime", qty: 1, price: maintenance.price },
    ],
    notes: "Përfshihet: monitorim uptime 24/7, backup javor i plotë, përditësime CMS, plugin dhe tema, raport mujor, support me email brenda 48 orësh.",
  },
  {
    id: "branding",
    label: "Branding & Logo",
    kind: "quote",
    items: [
      { description: "Identitet vizual Standard — logo, paleta e zgjeruar, elementë grafikë", qty: 1, price: branding.price },
    ],
    notes: `Përfshihet: logo profesionale (koncepte + final), ikona dhe pattern, kartëvizita, 1 template, versione për web dhe print, guidelines (PDF).\n${paymentNote(branding.price, "në dorëzim")}`,
  },
];
