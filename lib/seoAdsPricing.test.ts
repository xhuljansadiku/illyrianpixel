import { describe, expect, it } from "vitest";
import { ADS_MONTHLY, BUNDLE_MONTHLY, SEO_ADS_TIERS, SEO_MONTHLY, bundleSavings, euro } from "@/lib/seoAdsPricing";
import { serviceCategories as sq } from "@/lib/serviceCategories.sq";
import { serviceCategories as en } from "@/lib/serviceCategories.en";

describe("seoAdsPricing", () => {
  it("paketa e kombinuar është më e lirë se shuma, por jo më e lirë se asnjë shërbim më vete", () => {
    for (const tier of SEO_ADS_TIERS) {
      expect(BUNDLE_MONTHLY[tier]).toBeLessThan(SEO_MONTHLY[tier] + ADS_MONTHLY[tier]);
      expect(BUNDLE_MONTHLY[tier]).toBeGreaterThan(Math.max(SEO_MONTHLY[tier], ADS_MONTHLY[tier]));
    }
  });

  it("kursimi llogaritet saktë (vlera të llogaritura me dorë)", () => {
    expect(bundleSavings("starter")).toBe(30); // 99 + 120 − 189
    expect(bundleSavings("growth")).toBe(70); // 199 + 250 − 379
    expect(bundleSavings("pro")).toBe(100); // 299 + 400 − 599
  });

  it("niveli më i lartë kushton gjithmonë më shumë", () => {
    for (const table of [SEO_MONTHLY, ADS_MONTHLY, BUNDLE_MONTHLY]) {
      expect(table.starter).toBeLessThan(table.growth);
      expect(table.growth).toBeLessThan(table.pro);
    }
  });

  it("paketat seo-google-ads te /cmimet përdorin këto çmime në sq dhe en", () => {
    for (const categories of [sq, en]) {
      const prices = categories.find((c) => c.slug === "seo-google-ads")!.packages.map((p) => p.price);
      expect(prices).toEqual(SEO_ADS_TIERS.map((t) => euro(BUNDLE_MONTHLY[t])));
    }
  });

  it("euro() formaton si çmimet e tjera", () => {
    expect(euro(189)).toBe("€189");
    expect(euro(1199)).toBe("€1,199");
  });
});
