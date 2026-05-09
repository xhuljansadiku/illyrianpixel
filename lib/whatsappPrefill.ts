/** +355 69 472 6827, vetëm shifra për wa.me */
export const DEFAULT_WHATSAPP_E164 = "355694726827";

/** Rreshtat për `wa.me?text=`; dy të parët përdoren edhe në hover të FAB. */
export const WHATSAPP_PREFILL_LINES = [
  "Përshëndetje nga Illyrian Pixel!",
  "Si mund t'ju ndihmojmë?",
  "",
  "Mund të vazhdoni kështu (redaktoni sipas jush):",
  "• Emri i biznesit: ",
  "• Çfarë keni nevojë (web, marketing, etj.): ",
  "• Afati, nëse keni: "
] as const;

const encodedPrefill = encodeURIComponent(WHATSAPP_PREFILL_LINES.join("\n"));

export function buildWhatsAppChatHref(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, "") || DEFAULT_WHATSAPP_E164;
  return `https://wa.me/${digits}?text=${encodedPrefill}`;
}
