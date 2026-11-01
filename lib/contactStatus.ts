// Statuset e një kërkese (kontakti) — burimi i vetëm për panelin, API-të dhe cron-et.
// 2026-11-02: "Mbyllur" ndahej në "Fituar" dhe "Humbur" — më parë përzieheshin, ndaj
// norma e konvertimit s'kishte kuptim dhe s'dihej pse humbisnin klientët.
// Vlera "done" mbetet në DB (të dhënat e vjetra) dhe tani do të thotë "Fituar".

export const CONTACT_STATUSES = ["new", "in-progress", "quoted", "done", "lost"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  new: "E re",
  "in-progress": "Në bisedë",
  quoted: "Ofertë e dërguar",
  done: "Fituar",
  lost: "Humbur",
};

// Statuset ku puna me kërkesën ka mbaruar — s'kërkojnë më kujtesa apo ndjekje
export const CLOSED_CONTACT_STATUSES: readonly ContactStatus[] = ["done", "lost"];

export function isClosedContactStatus(status: string | null | undefined): boolean {
  return CLOSED_CONTACT_STATUSES.includes((status || "new") as ContactStatus);
}

export function isContactStatus(value: unknown): value is ContactStatus {
  return typeof value === "string" && (CONTACT_STATUSES as readonly string[]).includes(value);
}

// Pse humbi kërkesa — ruhet te contact_logs (action "lost_reason"), pa migrim në DB
export const LOST_REASONS = ["price", "timing", "no-reply", "competitor", "other"] as const;
export type LostReason = (typeof LOST_REASONS)[number];

export const LOST_REASON_LABELS: Record<LostReason, string> = {
  price: "Çmimi",
  timing: "Koha / s'është gati",
  "no-reply": "S'u përgjigj më",
  competitor: "Zgjodhi dikë tjetër",
  other: "Tjetër",
};

export function isLostReason(value: unknown): value is LostReason {
  return typeof value === "string" && (LOST_REASONS as readonly string[]).includes(value);
}
