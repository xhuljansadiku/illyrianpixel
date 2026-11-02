export type WebHeroVariant = {
  headline: string;
  subheadline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustLine: string;
  subServices: string[];
};

// ─── VARIANT 1: PREMIUM / LUXURY ───────────────────────────────────────────
// Tone: Exclusive, confident, elegant. Speaks to discerning business owners
// who see digital presence as a strategic asset, not a commodity.
export const heroVariantPremium: WebHeroVariant = {
  headline: "Prezencë dixhitale e klasit të parë, ndërtuar për bizneset që nuk bëjnë kompromise.",
  subheadline:
    "Çdo projekt është një investim strategjik, dizajn i papërsëritshëm, arkitekturë konvertimi dhe autoritet dixhital i ndërtuar për t'u qëndruar.",
  description:
    "Punojmë me biznese selektive që kuptojnë vlerën e prezencës dixhitale të nivelit të lartë. Nëse keni standarde të larta dhe doni një partner që i respekton, jemi gati.",
  ctaPrimary: "Rezervo Konsultimin Privat",
  ctaSecondary: "Zbulo Procesin",
  trustLine: "Konfidencialitet i plotë · Ekzekutim pa kompromis · Angazhim me rezultat",
  subServices: [
    "Dizajn Nivel Botëror",
    "Autoritet i Qëndrueshëm",
    "Arkitekturë Premium",
    "Prezencë Globale",
    "Zgjidhje Ekskluzive",
  ],
};

// ─── VARIANT 2: DIRECT / AGGRESSIVE SALES ──────────────────────────────────
// Tone: Blunt, urgent, loss-aversion-driven. Every second costs them clients.
// Competitor framing, real-time FOMO, hard close.
export const heroVariantAggressive: WebHeroVariant = {
  headline: "Krijim website profesional që sjell klientë.",
  // Text audit 2 (2026-11-02): subheadline hequr, përsëriste H1 ("Ndërtojmë website që duken profesionale dhe kthejnë vizitorët në klientë realë.")
  subheadline: "",
  description: "",
  ctaPrimary: "Merr ofertë falas",
  ctaSecondary: "Shiko Projektet",
  trustLine: "Përgjigje brenda 24 orësh",
  subServices: [
    "Website premium",
    "SEO që sjell klientë",
    "Shpejtësi e lartë",
    "Dizajn custom",
    "CMS i thjeshtë",
  ],
};

// ─── VARIANT 3: MINIMAL / APPLE-STYLE ──────────────────────────────────────
// Tone: Spare, precise, confident silence. Every word earns its place.
// No urgency tactics, just quiet authority and clarity of purpose.
export const heroVariantMinimal: WebHeroVariant = {
  headline: "Faqja e përsosur nuk ekziston, deri sa e ndërtojmë ne.",
  subheadline: "Precizion. Performancë. Rezultate të matshme.",
  description:
    "Ndërtojmë sisteme dixhitale të pastra, të shpejta dhe efektive, pa zhurmë, pa tepri. Vetëm ato që punojnë.",
  ctaPrimary: "Fillo Projektin",
  ctaSecondary: "Shiko Punën",
  trustLine: "Konsultim falas · Transparencë totale · Pa obligim",
  subServices: [
    "Web i qartë & i shpejtë",
    "E-Commerce i pastër",
    "SEO i fokusuar",
    "Mobile e natyrshme",
    "Custom & Minimal",
  ],
};

// ─── ACTIVE VARIANT ─────────────────────────────────────────────────────────
// Change this one line to switch the hero between all three variants.
export const activeWebHeroVariant: WebHeroVariant = heroVariantAggressive;
