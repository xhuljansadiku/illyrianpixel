// Nga erdhi vizitori që dërgoi kërkesën (2026-11-08). Mbahet vetëm në memorie, pa cookies dhe pa
// localStorage: mbijeton navigimin brenda faqes, humbet kur faqja rifreskohet ose hapet skedë e re.
// Dërgohet te serveri vetëm bashkë me formularin. Click ID-të e reklamave nuk ruhen, vetëm lloji i tyre.
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const CLICK_SOURCES = {
  gclid: "google_ads",
  gbraid: "google_ads",
  wbraid: "google_ads",
  msclkid: "microsoft_ads",
  fbclid: "meta",
} as const;

const ALLOWED_CLICK_SOURCES: readonly string[] = Object.values(CLICK_SOURCES);
const REFERRER_PROTOCOLS = ["http:", "https:", "android-app:"];

export type LeadAttribution = Partial<
  Record<(typeof UTM_KEYS)[number] | "click_source" | "landing_path" | "referrer_host", string>
>;

// Vjen nga URL ose nga një kërkesë e hapur: vetëm karaktere të zakonshme, dhe asgjë që një
// spreadsheet ta lexojë si formulë kur eksportohen kontaktet.
function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[^\p{L}\p{N} ._~:/|()+-]/gu, "")
    .replace(/^[\s+-]+/, "")
    .trim()
    .slice(0, max);
}

/** Pranon vetëm fushat e njohura në formën e pritur. Përdoret edhe në server, para ruajtjes. */
export function sanitizeAttribution(input: unknown): LeadAttribution {
  if (!input || typeof input !== "object") return {};
  const raw = input as Record<string, unknown>;
  const clean: LeadAttribution = {};

  for (const key of UTM_KEYS) {
    const value = cleanText(raw[key], 150);
    if (value) clean[key] = value;
  }
  if (typeof raw.click_source === "string" && ALLOWED_CLICK_SOURCES.includes(raw.click_source)) {
    clean.click_source = raw.click_source;
  }
  if (typeof raw.landing_path === "string" && raw.landing_path.startsWith("/") && !raw.landing_path.startsWith("//")) {
    const path = raw.landing_path.replace(/[^\p{L}\p{N}/._~-]/gu, "").slice(0, 200);
    if (path) clean.landing_path = path;
  }
  if (typeof raw.referrer_host === "string" && /^[a-z0-9.-]{1,120}$/i.test(raw.referrer_host)) {
    clean.referrer_host = raw.referrer_host.toLowerCase();
  }
  return clean;
}

function referrerHost(referrer: string, ownHost: string): string | undefined {
  try {
    const url = new URL(referrer);
    if (!REFERRER_PROTOCOLS.includes(url.protocol)) return undefined;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return host && host !== ownHost ? host : undefined;
  } catch {
    return undefined; // referrer bosh ose i pavlefshëm
  }
}

/** Faqja e hyrjes pa query (mund të mbajë tekst të vizitorit) dhe vetëm domeni i referrer-it. */
export function parseAttribution(href: string, referrer: string): LeadAttribution {
  const url = new URL(href);
  const raw: Record<string, unknown> = {
    landing_path: url.pathname,
    referrer_host: referrerHost(referrer, url.hostname.toLowerCase().replace(/^www\./, "")),
  };
  for (const key of UTM_KEYS) raw[key] = url.searchParams.get(key);
  for (const [param, source] of Object.entries(CLICK_SOURCES)) {
    if (url.searchParams.has(param)) {
      raw.click_source = source;
      break;
    }
  }
  return sanitizeAttribution(raw);
}

const CLICK_SOURCE_LABELS: Record<string, string> = {
  google_ads: "Google Ads",
  microsoft_ads: "Microsoft Ads",
  meta: "Meta",
};

type StoredAttribution = { [K in keyof LeadAttribution]?: string | null };

/** Burimi i kërkesës për panelin; `null` për kërkesat e vjetra, të ardhura para se ta ruanim. */
export function leadSourceLabel(lead: StoredAttribution): string | null {
  if (lead.utm_source) return lead.utm_medium ? `${lead.utm_source} / ${lead.utm_medium}` : lead.utm_source;
  if (lead.click_source) return CLICK_SOURCE_LABELS[lead.click_source] ?? lead.click_source;
  if (lead.referrer_host) return lead.referrer_host;
  return lead.landing_path ? "Direkt" : null;
}

let captured: LeadAttribution | null = null;

/** Thirret në ngarkimin e parë: ruan hyrjen e parë dhe i injoron navigimet e mëvonshme. */
export function captureAttribution(): void {
  if (captured || typeof window === "undefined") return;
  captured = parseAttribution(window.location.href, document.referrer);
}

export function getAttribution(): LeadAttribution {
  return captured ?? {};
}
