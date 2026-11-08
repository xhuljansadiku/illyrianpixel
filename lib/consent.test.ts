import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_NEEDED_ATTR,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  consentGateScript,
  consentSignals,
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

// Shfletues i rremë për Basic Consent Mode. Moduli ka gjendje (GA niset një herë), ndaj importohet i ri çdo herë.
async function browser({ hostname = "illyrianpixel.com", cookie = "" } = {}) {
  vi.resetModules();
  stubStorage();
  const scripts: string[] = [];
  const cookies = { value: cookie };
  const reload = vi.fn();
  const win: Record<string, unknown> = {
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    requestIdleCallback: (run: () => void) => run(),
  };
  vi.stubGlobal("window", win);
  vi.stubGlobal("location", { hostname, reload });
  vi.stubGlobal("document", {
    readyState: "complete",
    createElement: () => ({}),
    head: { appendChild: (el: { src: string }) => void scripts.push(el.src) },
    get cookie() {
      return cookies.value;
    },
    set cookie(line: string) {
      // Max-Age=0: cookie-ja fshihet
      const name = line.split("=")[0];
      cookies.value = cookies.value.split("; ").filter((c) => c.split("=")[0] !== name).join("; ");
    },
  });
  const consent = await import("./consent");
  const { trackEvent } = await import("./track");
  const dataLayer = () => ((win.dataLayer as IArguments[] | undefined) ?? []).map((args) => Array.from(args));
  const gtagScripts = () => scripts.filter((src) => src.includes("googletagmanager.com"));
  return { consent, trackEvent, win, dataLayer, gtagScripts, cookies, reload };
}

describe("Basic Consent Mode", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("loads nothing from Google before a choice is made, and drops events instead of queueing them", async () => {
    const b = await browser();
    b.consent.applyConsent(b.consent.readConsent());
    b.trackEvent("contact_click", { channel: "whatsapp" });
    expect(b.win.gtag).toBeUndefined();
    expect(b.win.dataLayer).toBeUndefined();
    expect(b.gtagScripts()).toHaveLength(0);
  });

  it("loads nothing from Google when every optional category is rejected", async () => {
    const b = await browser();
    b.consent.saveConsent({ analytics: false, marketing: false });
    expect(b.win.gtag).toBeUndefined();
    expect(b.gtagScripts()).toHaveLength(0);
    expect(b.reload).not.toHaveBeenCalled();
  });

  it("does not load GA for marketing without analytics", async () => {
    const b = await browser();
    b.consent.saveConsent({ analytics: false, marketing: true });
    expect(b.win.gtag).toBeUndefined();
    expect(b.gtagScripts()).toHaveLength(0);
  });

  it("sets denied defaults, then the choice, before config and before the script", async () => {
    const b = await browser();
    b.consent.saveConsent({ analytics: true, marketing: false });
    const commands = b.dataLayer();
    expect(commands.map(([cmd, arg]) => (cmd === "consent" ? `consent:${arg}` : cmd))).toEqual([
      "consent:default",
      "consent:update",
      "js",
      "config",
    ]);
    expect(commands[0][2]).toEqual(consentSignals({ analytics: false, marketing: false }));
    expect(commands[1][2]).toEqual(consentSignals({ analytics: true, marketing: false }));
    expect(commands[3][1]).toBe("G-82MBE7PY5B");
    expect(b.gtagScripts()).toEqual(["https://www.googletagmanager.com/gtag/js?id=G-82MBE7PY5B"]);
  });

  it("grants marketing signals only when marketing is accepted", async () => {
    const b = await browser();
    b.consent.saveConsent({ analytics: true, marketing: true });
    expect(b.dataLayer()[1][2]).toEqual(consentSignals({ analytics: true, marketing: true }));
  });

  it("initialises GA exactly once and updates consent on later changes", async () => {
    const b = await browser();
    b.consent.saveConsent({ analytics: true, marketing: false });
    b.consent.applyConsent({ analytics: true, marketing: false });
    b.consent.saveConsent({ analytics: true, marketing: true });
    expect(b.gtagScripts()).toHaveLength(1);
    expect(b.dataLayer().filter(([cmd]) => cmd === "config")).toHaveLength(1);
    expect(b.dataLayer().at(-1)?.[2]).toEqual(consentSignals({ analytics: true, marketing: true }));
    expect(b.reload).not.toHaveBeenCalled();
  });

  it("queues events after consent while gtag.js is still loading", async () => {
    const b = await browser();
    b.consent.saveConsent({ analytics: true, marketing: false });
    b.trackEvent("generate_lead", { event_category: "contact_form" });
    expect(b.dataLayer().at(-1)).toEqual(["event", "generate_lead", { event_category: "contact_form" }]);
  });

  it.each(["localhost", "127.0.0.1", "illyrianpixel-git-feat-x-xhuljan.vercel.app", "illyrianpixel.vercel.app"])(
    "never starts GA on %s",
    async (hostname) => {
      const b = await browser({ hostname });
      b.consent.saveConsent({ analytics: true, marketing: true });
      expect(b.win.gtag).toBeUndefined();
      expect(b.gtagScripts()).toHaveLength(0);
    },
  );

  it("stops GA immediately on withdrawal, clears its cookies and reloads", async () => {
    const b = await browser({ cookie: "_ga=1; _ga_82MBE7PY5B=2; _gcl_au=3; other=4" });
    b.consent.saveConsent({ analytics: true, marketing: true });
    b.consent.saveConsent({ analytics: false, marketing: false });
    expect(b.win["ga-disable-G-82MBE7PY5B"]).toBe(true);
    expect(b.win.gtag).toBeUndefined();
    expect(b.cookies.value).toBe("other=4");
    expect(b.reload).toHaveBeenCalledTimes(1);

    const queued = b.dataLayer().length;
    b.trackEvent("contact_click", { channel: "email" });
    expect(b.dataLayer()).toHaveLength(queued);
  });

  it("clears leftover GA cookies on load when there is no analytics consent", async () => {
    const b = await browser({ cookie: "_ga=1; _gcl_au=3" });
    b.consent.applyConsent(null);
    expect(b.cookies.value).toBe("");
    expect(b.reload).not.toHaveBeenCalled();
  });

  it("keeps GA running but clears ad cookies when only marketing is withdrawn", async () => {
    const b = await browser({ cookie: "_ga=1; _gcl_au=3" });
    b.consent.saveConsent({ analytics: true, marketing: true });
    b.consent.saveConsent({ analytics: true, marketing: false });
    expect(b.win.gtag).toBeTypeOf("function");
    expect(b.dataLayer().at(-1)?.[2]).toEqual(consentSignals({ analytics: true, marketing: false }));
    expect(b.cookies.value).toBe("_ga=1");
    expect(b.reload).not.toHaveBeenCalled();
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
