import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION, gaInitScript, isPrivatePath, readConsent } from "./consent";

function stubStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  });
}

const stored = (analytics: boolean, ts = new Date().toISOString(), v = CONSENT_VERSION) =>
  JSON.stringify({ v, analytics, ts });

describe("readConsent", () => {
  beforeEach(() => stubStorage());
  afterEach(() => vi.unstubAllGlobals());

  it("returns null when the visitor has not chosen yet", () => {
    expect(readConsent()).toBeNull();
  });

  it("returns the stored choice", () => {
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(true) });
    expect(readConsent()).toBe(true);
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(false) });
    expect(readConsent()).toBe(false);
  });

  it("asks again for legacy values — 'declined' was never honoured before v2", () => {
    stubStorage({ [CONSENT_STORAGE_KEY]: "accepted" });
    expect(readConsent()).toBeNull();
    stubStorage({ [CONSENT_STORAGE_KEY]: "declined" });
    expect(readConsent()).toBeNull();
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(true, new Date().toISOString(), 1) });
    expect(readConsent()).toBeNull();
  });

  it("expires after 12 months", () => {
    const thirteenMonthsAgo = new Date(Date.now() - 395 * 86400000).toISOString();
    stubStorage({ [CONSENT_STORAGE_KEY]: stored(true, thirteenMonthsAgo) });
    expect(readConsent()).toBeNull();
  });

  it("treats blocked storage as no choice", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); } });
    expect(readConsent()).toBeNull();
  });
});

describe("gaInitScript", () => {
  it("sets consent default to denied before GA is configured", () => {
    const script = gaInitScript();
    const defaultAt = script.indexOf("'consent', 'default'");
    expect(defaultAt).toBeGreaterThan(-1);
    expect(defaultAt).toBeLessThan(script.indexOf("'config'"));
    expect(script).toContain("analytics_storage: 'denied'");
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
