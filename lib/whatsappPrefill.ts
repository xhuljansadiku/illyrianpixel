/** +355 69 472 6827, vetëm shifra për wa.me */
export const DEFAULT_WHATSAPP_E164 = "355694726827";

/** Rreshtat për `wa.me?text=`; dy të parët përdoren edhe në hover të FAB. */
export const WHATSAPP_PREFILL_LINES = [
  "Përshëndetje 👋,",
  "",
  "Dëshiroj të marr një ofertë për shërbimet tuaja.",
  "",
  "• Emri / Biznesi: ",
  "• Shërbimi: ",
  "• Buxheti: ",
  "• Afati: "
] as const;

export const WHATSAPP_PREFILL_LINES_EN = [
  "Hello 👋,",
  "",
  "I'd like to get a quote for your services.",
  "",
  "• Name / Business: ",
  "• Service: ",
  "• Budget: ",
  "• Timeline: "
] as const;

function prefillFor(locale?: string): readonly string[] {
  return locale === "en" ? WHATSAPP_PREFILL_LINES_EN : WHATSAPP_PREFILL_LINES;
}

export function buildWhatsAppChatHref(rawNumber: string, locale?: string): string {
  const digits = rawNumber.replace(/\D/g, "") || DEFAULT_WHATSAPP_E164;
  const encodedPrefill = encodeURIComponent(prefillFor(locale).join("\n"));
  return `https://wa.me/${digits}?text=${encodedPrefill}`;
}

/** Dy rreshtat e parë me tekst — për hover preview të FAB-it. */
export function whatsappPreviewLines(locale?: string): [string, string] {
  const lines = prefillFor(locale);
  return [lines[0], lines[2]];
}
