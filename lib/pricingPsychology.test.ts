import { describe, expect, it } from "vitest";
import { parseEuro, paybackClients, paymentPlan, perDay, priceFraming } from "./pricingPsychology";

describe("parseEuro", () => {
  it("reads fixed euro prices only", () => {
    expect(parseEuro("€349")).toBe(349);
    expect(parseEuro("€1,199")).toBe(1199);
    expect(parseEuro("Nga €1,200")).toBeNull();
    expect(parseEuro("Ofertë")).toBeNull();
  });
});

describe("paymentPlan", () => {
  it("splits up to €1,000 into now + launch that add up to the price", () => {
    expect(paymentPlan(599)).toEqual({ kind: "split", now: 300, launch: 299 });
    expect(paymentPlan(349)).toEqual({ kind: "split", now: 175, launch: 174 });
    expect(paymentPlan(899)).toEqual({ kind: "split", now: 450, launch: 449 });
    expect(paymentPlan(1000).kind).toBe("split");
  });

  it("offers 40/30/30 instalments above €1,000, summing to the exact price", () => {
    expect(paymentPlan(1199)).toEqual({ kind: "installments", parts: [480, 360, 359] });
    expect(paymentPlan(1999)).toEqual({ kind: "installments", parts: [800, 600, 599] });
  });
});

describe("payback and per-day framing", () => {
  it("rounds clients up so the claim is never optimistic", () => {
    expect(paybackClients(349)).toBe(2);
    expect(paybackClients(599)).toBe(2);
    expect(paybackClients(899)).toBe(3);
    expect(paybackClients(100)).toBe(1);
  });

  it("computes the daily cost of monthly packages", () => {
    expect(perDay(249)).toBe(8.3);
    expect(perDay(49)).toBe(1.6);
  });

  it("picks the right framing per category", () => {
    expect(priceFraming("website", "€599", false, 147)).toEqual({
      plan: { kind: "split", now: 300, launch: 299 },
      payback: 2,
      perDay: 1.6,
      perDayYear: true,
      totalValue: 746,
    });
    expect(priceFraming("website", "€349", false).totalValue).toBeUndefined();
    expect(priceFraming("branding-content", "€250", false)).toEqual({
      plan: { kind: "split", now: 125, launch: 125 },
      payback: undefined,
      perDay: undefined,
      perDayYear: undefined,
      totalValue: undefined,
    });
    expect(priceFraming("smm", "€330", true)).toEqual({ perDay: 11 });
    expect(priceFraming("aplikacione-mobile", "Ofertë", false)).toEqual({});
  });
});
