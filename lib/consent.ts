// Pëlqimi për cookies — GDPR/ePrivacy. Dy kategori, secila me zgjedhje më vete:
//   • analytics — Google Analytics + Microsoft Clarity
//   • marketing — Google Ads (matja e konvertimeve, reklama të personalizuara)
//
// • gtag ngarkohet gjithmonë, por me Google Consent Mode v2 në "denied" për të katër
//   sinjalet: pa cookies e pa identifikues, derisa vizitori të pranojë.
// • Clarity (regjistron sesionet) ngarkohet VETËM pas pëlqimit për analitikë.
// • Zgjedhja ruhet në localStorage si { v, analytics, marketing, ts } dhe skadon pas
//   12 muajsh. Vlerat e vjetra "accepted"/"declined" s'vlejnë më ("declined" nuk
//   respektohej para versionit 2), ndaj çdo vizitor pyetet sërish një herë.

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

export type ConsentChoice = { analytics: boolean; marketing: boolean };
type StoredConsent = ConsentChoice & { v: number; ts: string };

/** Zgjedhja e vizitorit; null = s'ka zgjedhur ende (ose zgjedhja ka skaduar). */
export function readConsent(): ConsentChoice | null {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null") as StoredConsent | null;
    if (!stored || stored.v !== CONSENT_VERSION) return null;
    if (typeof stored.analytics !== "boolean" || typeof stored.marketing !== "boolean") return null;
    if (!(Date.now() - Date.parse(stored.ts) < CONSENT_MAX_AGE_MS)) return null;
    return { analytics: stored.analytics, marketing: stored.marketing };
  } catch {
    return null; // JSON i vjetër ("accepted") ose localStorage i bllokuar
  }
}

const granted = (on: boolean) => (on ? "granted" : "denied");

/** Sinjalet e Google Consent Mode v2 për një zgjedhje. */
export function consentSignals({ analytics, marketing }: ConsentChoice) {
  return {
    analytics_storage: granted(analytics),
    ad_storage: granted(marketing),
    ad_user_data: granted(marketing),
    ad_personalization: granted(marketing),
  };
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
const MARKETING_COOKIE = /^(_gcl|_gac)/;

function clearCookies(pattern: RegExp) {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!pattern.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function saveConsent(choice: ConsentChoice) {
  const previous = readConsent();
  try {
    const value: StoredConsent = { v: CONSENT_VERSION, ...choice, ts: new Date().toISOString() };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage i bllokuar — zgjedhja vlen vetëm për këtë faqe
  }

  const w = window as AnalyticsWindow;
  // Nëse gtag s'është ngarkuar ende, script-i "ga4-init" e lexon vetë zgjedhjen nga localStorage.
  w.gtag?.("consent", "update", consentSignals(choice));

  // Tërheqje e pëlqimit: fshij cookies e asaj kategorie
  if (previous?.marketing && !choice.marketing) clearCookies(MARKETING_COOKIE);
  if (choice.analytics) {
    loadClarity();
  } else if (previous?.analytics) {
    clearCookies(ANALYTICS_COOKIE);
    location.reload(); // Clarity s'ndalet dot ndryshe pasi është ngarkuar
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
      // Të njëjtat kushte si readConsent(), përndryshe banner-i pyet ndërsa GA vepron sikur ka pëlqim
      if (c && c.v === ${CONSENT_VERSION} && typeof c.analytics === 'boolean' && typeof c.marketing === 'boolean'
          && Date.now() - Date.parse(c.ts) < ${CONSENT_MAX_AGE_MS}) {
        var a = c.analytics === true ? 'granted' : 'denied';
        var m = c.marketing === true ? 'granted' : 'denied';
        gtag('consent', 'update', { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m });
      }
    } catch (e) {}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
}
