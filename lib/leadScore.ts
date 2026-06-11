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

const BUDGET_POINTS: [string, number][] = [
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
];

const HIGH_VALUE_SERVICES = ["e-commerce", "ecommerce", "website", "web"];

export function leadScore(c: ScorableContact): LeadScore {
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
