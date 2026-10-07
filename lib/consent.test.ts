import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_NEEDED_ATTR,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  consentGateScript,
  consentSignals,
  gaInitScript,
  isPrivatePath,
  readConsent,
} from "./consent";

function stubStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  });
}

const stored = (analytics: boolean, marketing: boolean, ts = new Date().toISOString(), v = CONSENT_VERSION) =>
  JSON.stringify({ v, analytics, marketing, ts });

describe("readConsent", () => {
  beforeEach(() => stubStorage());
  afterEach(() => vi.unstubAllGlobals());

  it("returns null when the visitor has not chosen yet", () => {
    expect(readConsent()).toBeNull();
  });

  it("returns each category separately", () => {
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(true, false) });
    expect(readConsent()).toEqual({ analytics: true, marketing: false });
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(false, true) });
    expect(readConsent()).toEqual({ analytics: false, marketing: true });
  });

  it("asks again for legacy values — 'declined' was never honoured before v2", () => {
    stubStorage({ [CONSENT_STORAGE_KEY]: "accepted" });
    expect(readConsent()).toBeNull();
    stubStorage({ [CONSENT_STORAGE_KEY]: "declined" });
    expect(readConsent()).toBeNull();
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(true, true, new Date().toISOString(), 1) });
    expect(readConsent()).toBeNull();
  });

  it("asks again when a category is missing", () => {
    stubStorage({ [CONSENT_STORAGE_KEY]: JSON.stringify({ v: CONSENT_VERSION, analytics: true, ts: new Date().toISOString() }) });
    expect(readConsent()).toBeNull();
  });

  it("expires after 12 months", () => {
    const thirteenMonthsAgo = new Date(Date.now() - 395 * 86400000).toISOString();
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(true, true, thirteenMonthsAgo) });
    expect(readConsent()).toBeNull();
  });

  it("treats blocked storage as no choice", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); } });
    expect(readConsent()).toBeNull();
  });
});

describe("consentSignals", () => {
  it("maps analytics and marketing to the Consent Mode v2 signals", () => {
    expect(consentSignals({ analytics: true, marketing: false })).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(consentSignals({ analytics: false, marketing: true })).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });
});

// Ekzekuton script-in inline si në shfletues dhe kthen komandat consent që shtyn në dataLayer
function runGaInit(storedValue: string | null) {
  const context: Record<string, unknown> = {
    localStorage: { getItem: () => storedValue },
    Date,
    JSON,
  };
  context.window = context;
  runInNewContext(gaInitScript(), context);
  return (context.dataLayer as IArguments[])
    .map((args) => Array.from(args))
    .filter(([cmd]) => cmd === "consent")
    .map(([, mode, signals]) => ({ mode, signals }));
}

describe("gaInitScript", () => {
  it("applies a stored choice exactly when readConsent() accepts it", () => {
    expect(runGaInit(null)).toHaveLength(1); // vetëm default
    expect(runGaInit(stored(true, false))[1]).toEqual({
      mode: "update",
      signals: consentSignals({ analytics: true, marketing: false }),
    });
    // forma pa "marketing" → readConsent() = null → pa update
    expect(runGaInit(JSON.stringify({ v: CONSENT_VERSION, analytics: true, ts: new Date().toISOString() }))).toHaveLength(1);
    expect(runGaInit("accepted")).toHaveLength(1);
  });

  it("denies every signal by default before GA is configured", () => {
    const script = gaInitScript();
    const defaultAt = script.indexOf("'consent', 'default'");
    expect(defaultAt).toBeGreaterThan(-1);
    expect(defaultAt).toBeLessThan(script.indexOf("'config'"));
    for (const signal of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
      expect(script).toContain(`${signal}: 'denied'`);
    }
  });
});

// Ekzekuton consentGateScript() si në <head> dhe tregon nëse shënoi <html> (banner-i shfaqet)
function runGate(storedValue: string | null, throwOnRead = false) {
  const attrs = new Map<string, string>();
  const context = {
    localStorage: {
      getItem: () => {
        if (throwOnRead) throw new Error("blocked");
        return storedValue;
      },
    },
    document: { documentElement: { setAttribute: (k: string, v: string) => void attrs.set(k, v) } },
    Date,
    JSON,
  };
  runInNewContext(consentGateScript(), context);
  return attrs.has(CONSENT_NEEDED_ATTR);
}

describe("consentGateScript", () => {
  it("shows the server-rendered banner exactly when readConsent() returns null", () => {
    const cases: (string | null)[] = [
      null,
      "accepted",
      stored(true, false),
      stored(false, false),
      stored(true, true, new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()),
      stored(true, true, undefined, CONSENT_VERSION - 1),
      JSON.stringify({ v: CONSENT_VERSION, analytics: true, ts: new Date().toISOString() }),
    ];
    for (const value of cases) {
      stubStorage(value === null ? {} : { [CONSENT_STORAGE_KEY]: value });
      expect(runGate(value)).toBe(readConsent() === null);
    }
    vi.unstubAllGlobals();
  });

  it("shows the banner when localStorage is blocked", () => {
    expect(runGate(null, true)).toBe(true);
  });
});

describe("isPrivatePath", () => {
  it("keeps analytics off admin and token pages only", () => {
    for (const p of ["/admin", "/admin/login", "/oferta/abc", "/klienti/abc", "/feedback/abc"]) {
      expect(isPrivatePath(p)).toBe(true);
    }
    for (const p of ["/", "/en", "/contact", "/administrata", "/blog/oferta"]) {
      expect(isPrivatePath(p)).toBe(false);
    }
  });
});
