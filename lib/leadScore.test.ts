import { describe, expect, it } from "vitest";
import { leadScore } from "./leadScore";

const base = {
  budget: null,
  timeline: null,
  service: null,
  business_name: null,
  message: null,
  discount_code: null,
  created_at: new Date().toISOString(),
};

describe("leadScore", () => {
  it("scores a minimal/empty lead low and labels it C", () => {
    const result = leadScore({ ...base, created_at: new Date(Date.now() - 30 * 86_400_000).toISOString() });
    expect(result.label).toBe("C");
    expect(result.score).toBeLessThan(45);
  });

  it("scores a high-budget, urgent, business lead as A", () => {
    const result = leadScore({
      ...base,
      budget: "€7,000+",
      timeline: "ASAP",
      service: "E-commerce",
      business_name: "Acme Shpk",
      message: "x".repeat(250),
      discount_code: "ILLYRIAN10",
    });
    expect(result.label).toBe("A");
    expect(result.score).toBe(100); // clamped — sum of points exceeds 100
  });

  it("never exceeds 100 even when every bonus applies", () => {
    const result = leadScore({
      ...base,
      budget: "€7,000+",
      timeline: "ASAP",
      service: "website",
      business_name: "Acme",
      message: "x".repeat(300),
      discount_code: "ANY",
    });
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("gives partial credit for an unrecognized budget string", () => {
    const withBudget = leadScore({ ...base, budget: "some custom amount" });
    const without = leadScore({ ...base, budget: null });
    expect(withBudget.score).toBeGreaterThan(without.score);
  });

  it("rewards freshness — a contact under 48h old scores higher than an old one, all else equal", () => {
    const fresh = leadScore({ ...base, created_at: new Date().toISOString() });
    const old = leadScore({ ...base, created_at: new Date(Date.now() - 90 * 86_400_000).toISOString() });
    expect(fresh.score).toBeGreaterThan(old.score);
  });

  it("recognizes high-value services case-insensitively as a substring match", () => {
    const ecommerce = leadScore({ ...base, service: "E-Commerce Premium" });
    const other = leadScore({ ...base, service: "Branding" });
    expect(ecommerce.score).toBeGreaterThan(other.score);
  });

  it("B sits strictly between the A and C thresholds", () => {
    const result = leadScore({
      ...base,
      budget: "€3,000 – €7,000", // 28
      timeline: "2-4 javë", // 14
      created_at: new Date().toISOString(), // fresh +10
    });
    expect(result.score).toBe(52);
    expect(result.score).toBeGreaterThanOrEqual(45);
    expect(result.score).toBeLessThan(70);
    expect(result.label).toBe("B");
  });
});
