// Ngjarje analitike të vogla (2026-10-20) — GA4 (gtag, respekton Consent Mode) + Microsoft Clarity.
// S'bën asgjë nëse skriptet s'janë ngarkuar (p.sh. pa pëlqim për cookies).
type Params = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  };
  try {
    w.gtag?.("event", name, params);
    w.clarity?.("event", name);
  } catch {
    // analitika s'duhet të prishë kurrë UI-në
  }
}

// ── Klikimet e kontaktit (2026-10-21) ─────────────────────────────────────────
// Një dëgjues i vetëm (te components/Analytics) kap çdo link wa.me / mailto: / tel: — edhe ata
// në komponentë serveri — dhe dërgon `contact_click` { channel, location }. Kurrë href-in: linku
// i WhatsApp-it mbart tekstin e parambushur, mailto/tel mbajnë adresën ose numrin.
export type ContactChannel = "whatsapp" | "email" | "phone";

export function contactChannel(href: string | null | undefined): ContactChannel | null {
  if (!href) return null;
  const h = href.trim().toLowerCase();
  if (h.startsWith("https://wa.me/") || h.startsWith("https://api.whatsapp.com/") || h.startsWith("whatsapp:")) return "whatsapp";
  if (h.startsWith("mailto:")) return "email";
  if (h.startsWith("tel:")) return "phone";
  return null;
}

/** Ku ndodhet linku: `data-track-location` i afërt, ose zona e faqes (footer / nav / dialog) */
export function contactLocation(el: Element): string {
  const tagged = el.closest<HTMLElement>("[data-track-location]");
  if (tagged?.dataset.trackLocation) return tagged.dataset.trackLocation;
  if (el.closest("footer")) return "footer";
  if (el.closest("header, nav")) return "nav";
  if (el.closest('[role="dialog"]')) return "dialog";
  return "page";
}

export function trackContactClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!link) return;
  const channel = contactChannel(link.getAttribute("href"));
  if (channel) trackEvent("contact_click", { channel, location: contactLocation(link) });
}
