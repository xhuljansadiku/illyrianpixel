// Pëlqimi për cookies analitike (Google Analytics + Microsoft Clarity) — GDPR/ePrivacy.
//
// • Google Analytics ngarkohet gjithmonë, por me Google Consent Mode v2 në "denied":
//   pa cookies e pa identifikues, derisa vizitori të klikojë "Prano".
// • Clarity (regjistron sesionet) ngarkohet VETËM pas pëlqimit.
// • Zgjedhja ruhet në localStorage si { v, analytics, ts } dhe skadon pas 12 muajsh.
//   Vlerat e vjetra "accepted"/"declined" s'vlejnë më ("declined" nuk respektohej
//   para versionit 2), ndaj çdo vizitor pyetet sërish një herë.

export const CONSENT_STORAGE_KEY = "ip_cookie_consent";
export const CONSENT_VERSION = 2;
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Event-i që hap sërish banner-in (link-u "Cilësimet e cookies" në footer). */
export const OPEN_COOKIE_SETTINGS_EVENT = "ip:open-cookie-settings";

export const GA_ID = "G-82MBE7PY5B";
const CLARITY_ID = "wnyi2atnrw";

// Admini dhe faqet me token (oferta, portali i klientit, feedback): pa GA e pa Clarity —
// URL-ja përmban token-in e aksesit të klientit, dhe Clarity do regjistronte të dhëna klientësh.
const PRIVATE_PATH_PREFIXES = ["/admin", "/oferta", "/klienti", "/feedback"];

export function isPrivatePath(pathname: string | null) {
  return PRIVATE_PATH_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`));
}

type StoredConsent = { v: number; analytics: boolean; ts: string };

/** true/false = vizitori ka zgjedhur; null = s'ka zgjedhur ende (ose zgjedhja ka skaduar). */
export function readConsent(): boolean | null {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null") as StoredConsent | null;
    if (!stored || stored.v !== CONSENT_VERSION || typeof stored.analytics !== "boolean") return null;
    if (!(Date.now() - Date.parse(stored.ts) < CONSENT_MAX_AGE_MS)) return null;
    return stored.analytics;
  } catch {
    return null; // JSON i vjetër ("accepted") ose localStorage i bllokuar
  }
}

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
};

let clarityLoaded = false;

export function loadClarity() {
  if (clarityLoaded) return;
  clarityLoaded = true;
  const w = window as AnalyticsWindow;
  // E njëjta radhë (queue) si snippet-i zyrtar i Clarity
  w.clarity =
    w.clarity ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      (w.clarity!.q = w.clarity!.q || []).push(arguments);
    };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
  w.clarity("consent");
}

const ANALYTICS_COOKIE = /^(_ga|_gid|_gat|_clck|_clsk|_cltk)/;

function clearAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!ANALYTICS_COOKIE.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function saveConsent(analytics: boolean) {
  const wasGranted = readConsent() === true;
  try {
    const value: StoredConsent = { v: CONSENT_VERSION, analytics, ts: new Date().toISOString() };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage i bllokuar — zgjedhja vlen vetëm për këtë faqe
  }

  const w = window as AnalyticsWindow;
  // Nëse gtag s'është ngarkuar ende, script-i "ga4-init" e lexon vetë zgjedhjen nga localStorage.
  w.gtag?.("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });

  if (analytics) {
    loadClarity();
  } else if (wasGranted) {
    // Tërheqje e pëlqimit: fshij cookies analitike dhe rifresko që Clarity të ndalet.
    clearAnalyticsCookies();
    location.reload();
  }
}

/**
 * Script-i inline i GA: vendos default-in "denied" PARA `config`, pastaj aplikon
 * zgjedhjen e ruajtur (vizitor që kthehet). Gjenerohet nga konstantet e mësipërme,
 * që të mos dalë nga sinkroni me readConsent().
 */
export function gaInitScript() {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    try {
      var c = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null');
      if (c && c.v === ${CONSENT_VERSION} && c.analytics === true && Date.now() - Date.parse(c.ts) < ${CONSENT_MAX_AGE_MS}) {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      }
    } catch (e) {}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
}
