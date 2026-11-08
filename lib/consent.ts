// Pëlqimi për cookies — GDPR/ePrivacy. Dy kategori, secila me zgjedhje më vete:
//   • analytics — Google Analytics + Microsoft Clarity
//   • marketing — Google Ads (matja e konvertimeve, reklama të personalizuara)
//
// • Basic Consent Mode v2 (2026-11-08): gtag.js ngarkohet VETËM pas pëlqimit për analitikë.
//   Pa pëlqim s'ka asnjë script, kërkesë apo cookie të Google, dhe asgjë s'mbahet në radhë.
// • Clarity (regjistron sesionet) ngarkohet VETËM pas pëlqimit për analitikë.
// • Zgjedhja ruhet në localStorage si { v, analytics, marketing, ts } dhe skadon pas
//   12 muajsh. Vlerat e vjetra "accepted"/"declined" s'vlejnë më ("declined" nuk
//   respektohej para versionit 2), ndaj çdo vizitor pyetet sërish një herë.

export const CONSENT_STORAGE_KEY = "ip_cookie_consent";
export const CONSENT_VERSION = 2;
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Event-i që hap sërish banner-in (link-u "Cilësimet e cookies" në footer). */
export const OPEN_COOKIE_SETTINGS_EVENT = "ip:open-cookie-settings";

/** Lëshohet pasi vizitori ruan një zgjedhje (p.sh. NewsletterPopup pret këtë para se të hapet). */
export const CONSENT_SAVED_EVENT = "ip:consent-saved";

/** Atributi në <html> që vendos consentGateScript() kur s'ka pëlqim të vlefshëm. */
export const CONSENT_NEEDED_ATTR = "data-consent-needed";

export const GA_ID = "G-82MBE7PY5B";
const CLARITY_ID = "wnyi2atnrw";

// Vetëm domeni i prodhimit i dërgon të dhëna pronës GA4 — jo localhost, jo preview-t e Vercel.
// Hostname dhe jo env: s'varet nga cilësimet e projektit në Vercel, që prodhimi të mos prishet.
const ANALYTICS_HOSTS = ["illyrianpixel.com", "www.illyrianpixel.com"];

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
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
};

// "stopped" zgjat deri në ringarkim: një gtag.js i ngarkuar s'hiqet dot nga faqja.
let gaState: "off" | "running" | "stopped" = "off";
let clarityLoaded = false;

/** Pas `load` + kohë të lirë (si `lazyOnload` më parë), që GA të mos rëndojë ngarkimin e faqes. */
function whenPageIsIdle(run: () => void) {
  const schedule = () => {
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 1);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
}

/**
 * Nis GA4 një herë të vetme, vetëm me pëlqim për analitikë dhe vetëm në domenin e prodhimit.
 * `gtag` dhe dataLayer krijohen menjëherë: ngjarjet pas pëlqimit presin aty derisa të vijë gtag.js.
 * Default "denied" + update me zgjedhjen, të dyja para script-it dhe para `config`.
 */
function startGoogleAnalytics(choice: ConsentChoice) {
  if (!choice.analytics || gaState !== "off" || !ANALYTICS_HOSTS.includes(location.hostname)) return;
  gaState = "running";

  const w = window as AnalyticsWindow;
  w.dataLayer = w.dataLayer || [];
  // gtag.js njeh vetëm objektin `arguments`, jo një array
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("consent", "default", consentSignals({ analytics: false, marketing: false }));
  w.gtag("consent", "update", consentSignals(choice));
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { anonymize_ip: true });

  whenPageIsIdle(() => {
    if (gaState !== "running") return; // pëlqimi u tërhoq para se të ngarkohej
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  });
}

/** Ndal dërgimet menjëherë: flamuri zyrtar i Google + heqja e `gtag`. Pastaj ringarkohet faqja. */
function stopGoogleAnalytics() {
  const w = window as AnalyticsWindow;
  (w as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
  w.gtag?.("consent", "update", consentSignals({ analytics: false, marketing: false }));
  delete w.gtag;
  gaState = "stopped";
}

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

/**
 * Zbaton një zgjedhje: nis ose përditëson GA dhe Clarity, ose i ndal dhe fshin cookies e kategorive
 * të refuzuara. Thirret nga banner-i, në çdo ngarkim faqeje dhe kur zgjedhja ndryshon në një skedë tjetër.
 * Kthen false kur faqja po ringarkohet: gtag.js dhe Clarity s'ndalen dot plotësisht ndryshe pasi janë ngarkuar.
 */
export function applyConsent(choice: ConsentChoice | null): boolean {
  const { analytics, marketing } = choice ?? { analytics: false, marketing: false };
  const withdrawn = !analytics && (gaState === "running" || clarityLoaded);

  if (choice && analytics) {
    if (gaState === "running") (window as AnalyticsWindow).gtag?.("consent", "update", consentSignals(choice));
    else startGoogleAnalytics(choice);
    loadClarity();
  } else if (withdrawn) {
    stopGoogleAnalytics();
  }

  if (!analytics) clearCookies(ANALYTICS_COOKIE);
  if (!marketing) clearCookies(MARKETING_COOKIE);

  if (withdrawn) location.reload();
  return !withdrawn;
}

export function saveConsent(choice: ConsentChoice) {
  try {
    const value: StoredConsent = { v: CONSENT_VERSION, ...choice, ts: new Date().toISOString() };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage i bllokuar — zgjedhja vlen vetëm për këtë faqe
  }

  if (applyConsent(choice)) window.dispatchEvent(new Event(CONSENT_SAVED_EVENT));
}

// Advanced Consent Mode: ÇAKTIVIZUAR 2026-11-08 — gtag.js ngarkohej edhe pa pëlqim dhe dërgonte
// sinjale pa cookies. Script-i inline u zëvendësua nga startGoogleAnalytics(). Për ta rikthyer,
// hiq "// Advanced Consent Mode:" këtu dhe te components/Analytics.tsx.
// Advanced Consent Mode: export function gaInitScript() {
// Advanced Consent Mode:   return `
// Advanced Consent Mode:     window.dataLayer = window.dataLayer || [];
// Advanced Consent Mode:     function gtag(){dataLayer.push(arguments);}
// Advanced Consent Mode:     gtag('consent', 'default', {
// Advanced Consent Mode:       analytics_storage: 'denied',
// Advanced Consent Mode:       ad_storage: 'denied',
// Advanced Consent Mode:       ad_user_data: 'denied',
// Advanced Consent Mode:       ad_personalization: 'denied'
// Advanced Consent Mode:     });
// Advanced Consent Mode:     try {
// Advanced Consent Mode:       var c = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null');
// Advanced Consent Mode:       if (c && c.v === ${CONSENT_VERSION} && typeof c.analytics === 'boolean' && typeof c.marketing === 'boolean'
// Advanced Consent Mode:           && Date.now() - Date.parse(c.ts) < ${CONSENT_MAX_AGE_MS}) {
// Advanced Consent Mode:         var a = c.analytics === true ? 'granted' : 'denied';
// Advanced Consent Mode:         var m = c.marketing === true ? 'granted' : 'denied';
// Advanced Consent Mode:         gtag('consent', 'update', { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m });
// Advanced Consent Mode:       }
// Advanced Consent Mode:     } catch (e) {}
// Advanced Consent Mode:     gtag('js', new Date());
// Advanced Consent Mode:     gtag('config', '${GA_ID}', { anonymize_ip: true });
// Advanced Consent Mode:   `;
// Advanced Consent Mode: }

/**
 * Script-i inline në <head> (RootDocument): para paint-it të parë shënon <html> me
 * CONSENT_NEEDED_ATTR kur s'ka pëlqim të vlefshëm. Banner-i renderohet në server i
 * fshehur (.consent-gate) dhe CSS-ja e shfaq menjëherë — pa pritur JS-në. Më parë
 * dilte pas hydration + 1.2s dhe në mobile ishte elementi LCP (~6–8s).
 * Të njëjtat kushte si readConsent().
 */
export function consentGateScript() {
  return `try{var c=JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}')||'null');if(!(c&&c.v===${CONSENT_VERSION}&&typeof c.analytics==='boolean'&&typeof c.marketing==='boolean'&&Date.now()-Date.parse(c.ts)<${CONSENT_MAX_AGE_MS}))document.documentElement.setAttribute('${CONSENT_NEEDED_ATTR}','')}catch(e){document.documentElement.setAttribute('${CONSENT_NEEDED_ATTR}','')}`;
}
