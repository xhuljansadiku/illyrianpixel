// Lead scoring automatik — i pastër (pa side effects), përdoret në admin UI.

type ScorableContact = {
  budget: string | null;
  timeline: string | null;
  service: string | null;
  business_name: string | null;
  message: string | null;
  discount_code: string | null;
  created_at: string;
};

export type LeadScore = {
  score: number; // 0–100
  label: "A" | "B" | "C";
  reasons: string[];
};

// Vlerat që formulari i kontaktit ruan në DB (2026-10-21). Gamat ndjekin paketat (€349–€1,999):
// më parë ishin "< €1,000 / … / €7,000+" dhe pothuajse çdo lead binte te e para. Etiketat e
// përkthyera janë te messages/*/contact.json `budgets` — vlera mbetet e njëjtë në sq dhe en.
export const CONTACT_BUDGETS = [
  { value: "Nën €500", key: "under500" },
  { value: "€500 – €1,000", key: "500to1000" },
  { value: "€1,000 – €2,000", key: "1000to2000" },
  { value: "Mbi €2,000", key: "over2000" },
  { value: "Nuk e di ende", key: "unsure" },
] as const;

/** Buxhetet që e shënojnë kontaktin si "PRIORITET" (Telegram + email) — të rejat + të vjetrat */
export const PRIORITY_BUDGETS = ["Mbi €2,000", "€3,000 – €7,000", "€7,000+"];

// Afati ruhet gjithmonë në shqip (më parë ruhej në gjuhën e faqes dhe kërkesat nga /en s'merrnin pikë)
export const CONTACT_TIMELINES = [
  { value: "ASAP", key: "asap" },
  { value: "2-4 javë", key: "weeks" },
  { value: "1-2 muaj", key: "months" },
  { value: "Fleksibël", key: "flexible" },
] as const;

const BUDGET_POINTS: [string, number][] = [
  ["Mbi €2,000", 32],
  ["€1,000 – €2,000", 24],
  ["€500 – €1,000", 16],
  ["Nën €500", 6],
  ["Nuk e di ende", 8],
  // Gamat e vjetra — kontaktet e ruajtura para 2026-10-21
  ["€7,000+", 35],
  ["€3,000 – €7,000", 28],
  ["€1,000 – €3,000", 18],
  ["< €1,000", 6],
];

const TIMELINE_POINTS: [string, number][] = [
  ["ASAP", 20],
  ["2-4 javë", 14],
  ["1-2 muaj", 8],
  ["Fleksibël", 4],
  // Kontaktet e vjetra nga /en ruheshin në anglisht
  ["2-4 weeks", 14],
  ["1-2 months", 8],
  ["Flexible", 4],
];

const HIGH_VALUE_SERVICES = ["e-commerce", "ecommerce", "website", "web"];

export function leadScore(c: ScorableContact, duplicateCount = 1): LeadScore {
  let score = 0;
  const reasons: string[] = [];

  const budgetMatch = BUDGET_POINTS.find(([b]) => c.budget === b);
  if (budgetMatch) {
    score += budgetMatch[1];
    reasons.push(`Buxheti ${budgetMatch[0]} (+${budgetMatch[1]})`);
  } else if (c.budget) {
    score += 10;
    reasons.push("Buxhet i panjohur (+10)");
  }

  const timelineMatch = TIMELINE_POINTS.find(([t]) => c.timeline === t);
  if (timelineMatch) {
    score += timelineMatch[1];
    reasons.push(`Afati ${timelineMatch[0]} (+${timelineMatch[1]})`);
  }

  if (c.business_name?.trim()) {
    score += 10;
    reasons.push("Ka biznes (+10)");
  }

  const msgLen = (c.message ?? "").trim().length;
  if (msgLen >= 200) {
    score += 10;
    reasons.push("Mesazh i detajuar (+10)");
  } else if (msgLen >= 80) {
    score += 6;
    reasons.push("Mesazh mesatar (+6)");
  }

  const service = (c.service ?? "").toLowerCase();
  if (HIGH_VALUE_SERVICES.some((s) => service.includes(s))) {
    score += 10;
    reasons.push("Shërbim me vlerë të lartë (+10)");
  } else if (service) {
    score += 5;
    reasons.push("Shërbim i përzgjedhur (+5)");
  }

  if (c.discount_code) {
    score += 5;
    reasons.push("Përdori kod zbritjeje (+5)");
  }

  if (duplicateCount >= 2) {
    score += 8;
    reasons.push(`Na kontaktoi ${duplicateCount}× (+8)`);
  }

  const ageHours = (Date.now() - new Date(c.created_at).getTime()) / 3_600_000;
  if (ageHours <= 48) {
    score += 10;
    reasons.push("Kontakt i freskët < 48h (+10)");
  }

  const clamped = Math.min(100, score);
  const label: LeadScore["label"] = clamped >= 70 ? "A" : clamped >= 45 ? "B" : "C";
  return { score: clamped, label, reasons };
}

export const LEAD_LABEL_STYLES: Record<LeadScore["label"], string> = {
  A: "border-red-400/40 bg-red-400/10 text-red-400",
  B: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
  C: "border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] text-[rgb(var(--a-text-rgb)/0.5)]",
};

export const LEAD_LABEL_TEXT: Record<LeadScore["label"], string> = {
  A: "🔥 A",
  B: "B",
  C: "C",
};
