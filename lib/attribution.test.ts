import { afterEach, describe, expect, it, vi } from "vitest";
import { leadSourceLabel, parseAttribution, sanitizeAttribution } from "./attribution";

const SITE = "https://illyrianpixel.com";

describe("parseAttribution", () => {
  it("merr UTM-të dhe faqen e hyrjes", () => {
    expect(parseAttribution(`${SITE}/cmimet?utm_source=google&utm_medium=cpc&utm_campaign=tirane`, "")).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "tirane",
      landing_path: "/cmimet",
    });
  });

  it("nuk e ruan query-n te faqja e hyrjes", () => {
    expect(parseAttribution(`${SITE}/contact?biznesi=Emri%20Im`, "").landing_path).toBe("/contact");
  });

  it("ruan vetëm domenin e referrer-it", () => {
    expect(parseAttribution(`${SITE}/`, "https://www.google.com/search?q=sekret").referrer_host).toBe("google.com");
  });

  it("njeh referrer-in e aplikacioneve Android", () => {
    expect(parseAttribution(`${SITE}/`, "android-app://com.google.android.gm/").referrer_host).toBe("com.google.android.gm");
  });

  it.each([
    "https://illyrianpixel.com/blog",
    "https://www.illyrianpixel.com/blog",
    "",
    "jo-url",
    "javascript:alert(1)",
  ])("injoron referrer-in %s", (referrer) => {
    expect(parseAttribution(`${SITE}/`, referrer).referrer_host).toBeUndefined();
  });

  it.each([
    ["gclid", "google_ads"],
    ["gbraid", "google_ads"],
    ["wbraid", "google_ads"],
    ["msclkid", "microsoft_ads"],
    ["fbclid", "meta"],
  ])("ruan vetëm llojin e click ID-së %s, jo vlerën", (param, source) => {
    const result = parseAttribution(`${SITE}/?${param}=abc123`, "");
    expect(result.click_source).toBe(source);
    expect(JSON.stringify(result)).not.toContain("abc123");
  });
});

describe("sanitizeAttribution", () => {
  it.each([null, undefined, "tekst", 5])("kthen objekt bosh për %s", (input) => {
    expect(sanitizeAttribution(input)).toEqual({});
  });

  it("hedh fushat e panjohura", () => {
    expect(sanitizeAttribution({ utm_source: "google", name: "x", admin: true })).toEqual({ utm_source: "google" });
  });

  it("heq HTML-në dhe formulat e spreadsheet-it", () => {
    expect(sanitizeAttribution({ utm_source: "<b>google</b>" }).utm_source).toBe("bgoogle/b");
    expect(sanitizeAttribution({ utm_source: "=HYPERLINK(1)" }).utm_source).toBe("HYPERLINK(1)");
    expect(sanitizeAttribution({ utm_source: "+-cmd" }).utm_source).toBe("cmd");
  });

  it("kufizon gjatësitë", () => {
    expect(sanitizeAttribution({ utm_term: "a".repeat(500) }).utm_term).toHaveLength(150);
    expect(sanitizeAttribution({ landing_path: `/${"a".repeat(500)}` }).landing_path).toHaveLength(200);
  });

  it("pranon vetëm vlera të njohura për click_source", () => {
    expect(sanitizeAttribution({ click_source: "meta" })).toEqual({ click_source: "meta" });
    expect(sanitizeAttribution({ click_source: "tjeter" })).toEqual({});
  });

  it("refuzon path-e që s'janë të brendshme dhe domene të pavlefshme", () => {
    expect(sanitizeAttribution({ landing_path: "https://evil.test" })).toEqual({});
    expect(sanitizeAttribution({ landing_path: "//evil.test" })).toEqual({});
    expect(sanitizeAttribution({ referrer_host: "evil.test/<script>" })).toEqual({});
  });

  it("nuk ruan vlera që mbeten bosh pas pastrimit", () => {
    expect(sanitizeAttribution({ utm_source: "<>", utm_medium: "   " })).toEqual({});
  });

  it("nuk pranon jo-tekst", () => {
    expect(sanitizeAttribution({ utm_source: { a: 1 }, referrer_host: 5, landing_path: ["/x"] })).toEqual({});
  });
});

describe("leadSourceLabel", () => {
  it("jep përparësi UTM-ve, pastaj reklamës, pastaj referrer-it", () => {
    const all = { utm_source: "newsletter", utm_medium: "email", click_source: "meta", referrer_host: "google.com", landing_path: "/" };
    expect(leadSourceLabel(all)).toBe("newsletter / email");
    expect(leadSourceLabel({ ...all, utm_medium: null })).toBe("newsletter");
    expect(leadSourceLabel({ ...all, utm_source: null })).toBe("Meta");
    expect(leadSourceLabel({ referrer_host: "google.com", landing_path: "/" })).toBe("google.com");
  });

  it("dallon hyrjen direkte nga kërkesat e vjetra pa të dhëna", () => {
    expect(leadSourceLabel({ landing_path: "/contact" })).toBe("Direkt");
    expect(leadSourceLabel({})).toBeNull();
    expect(leadSourceLabel({ utm_source: null, landing_path: null })).toBeNull();
  });
});

describe("captureAttribution", () => {
  afterEach(() => vi.unstubAllGlobals());

  async function load() {
    vi.resetModules();
    return import("./attribution");
  }

  function stubPage(href: string, referrer: string) {
    vi.stubGlobal("window", { location: { href } });
    vi.stubGlobal("document", { referrer });
  }

  it("mban hyrjen e parë edhe pas navigimit brenda faqes", async () => {
    const a = await load();
    stubPage(`${SITE}/?utm_source=google`, "https://www.google.com/");
    a.captureAttribution();
    stubPage(`${SITE}/contact`, "https://www.google.com/");
    a.captureAttribution();
    expect(a.getAttribution()).toEqual({ utm_source: "google", landing_path: "/", referrer_host: "google.com" });
  });

  it("kthen objekt bosh para kapjes dhe në server", async () => {
    const a = await load();
    a.captureAttribution();
    expect(a.getAttribution()).toEqual({});
  });
});
