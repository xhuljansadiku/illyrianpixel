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
