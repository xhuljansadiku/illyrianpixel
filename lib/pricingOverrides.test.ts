import { describe, expect, it } from "vitest";
import { pricingKey, applyOverridesToPackages, applyOverridesToCategory } from "./pricingOverrides";
import type { ServiceCategory, ServicePackage } from "./serviceCategories";

const packages: ServicePackage[] = [
  { name: "Starter", price: "€800", ideal: "Bizneset e reja", features: [] },
  { name: "Premium", price: "€1,500", priceNote: "nga", ideal: "Bizneset në rritje", features: [] },
];

describe("pricingKey", () => {
  it("joins category and package name with a double-pipe separator", () => {
    expect(pricingKey("website", "Premium")).toBe("website||Premium");
  });

  it("produces different keys for the same package name under different categories", () => {
    expect(pricingKey("website", "Premium")).not.toBe(pricingKey("ecommerce", "Premium"));
  });
});

describe("applyOverridesToPackages", () => {
  it("returns the original packages unchanged when there are no overrides", () => {
    expect(applyOverridesToPackages("website", packages, undefined)).toBe(packages);
  });

  it("overrides only the price of the matching package, leaving others untouched", () => {
    const result = applyOverridesToPackages("website", packages, {
      "website||Starter": { price: "€650", price_note: null },
    });
    expect(result[0].price).toBe("€650");
    expect(result[1]).toEqual(packages[1]); // Premium untouched
  });

  it("falls back to the package's own priceNote when the override has none", () => {
    const result = applyOverridesToPackages("website", packages, {
      "website||Premium": { price: "€1,200", price_note: null },
    });
    expect(result[1].priceNote).toBe("nga"); // kept from the original package
  });

  it("uses the override's price_note when one is provided", () => {
    const result = applyOverridesToPackages("website", packages, {
      "website||Premium": { price: "€1,200", price_note: "çmim i ri" },
    });
    expect(result[1].priceNote).toBe("çmim i ri");
  });

  it("does not apply an override meant for a different category slug", () => {
    const result = applyOverridesToPackages("ecommerce", packages, {
      "website||Starter": { price: "€1", price_note: null },
    });
    expect(result[0].price).toBe("€800"); // unaffected — wrong category key
  });
});

describe("applyOverridesToCategory", () => {
  const category: ServiceCategory = {
    slug: "website",
    title: "Website",
    headline: "Website premium",
    short: "Website profesional",
    description: "Website profesional për biznese",
    icon: "globe",
    subServices: [],
    packages,
  };

  it("returns the category unchanged when there are no overrides", () => {
    expect(applyOverridesToCategory(category, undefined)).toBe(category);
  });

  it("rewrites packages using the category's own slug", () => {
    const result = applyOverridesToCategory(category, {
      "website||Starter": { price: "€700", price_note: null },
    });
    expect(result.packages[0].price).toBe("€700");
    expect(result.slug).toBe("website");
  });
});
