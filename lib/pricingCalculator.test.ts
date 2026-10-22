import { describe, expect, it } from "vitest";
import { calculatorEstimate, parseCalculatorPrice } from "@/lib/pricingCalculator";

const LANGUAGE = { price: 150 };
const BLOG = { price: 120 };
const MAINTENANCE = { price: 49, monthly: true };

describe("parseCalculatorPrice", () => {
  it("lexon çmimet e paketave", () => {
    expect(parseCalculatorPrice("€349")).toBe(349);
    expect(parseCalculatorPrice("€1,199")).toBe(1199);
    expect(parseCalculatorPrice("Nga €1,200")).toBe(1200);
    expect(parseCalculatorPrice("Ofertë")).toBe(0);
  });
});

describe("calculatorEstimate (vlerat e llogaritura me dorë)", () => {
  it("website Business pa shtesa: €599, 2 klientë nga €300", () => {
    expect(calculatorEstimate("€599", false, [], 300)).toEqual({ total: 599, extrasMonthly: 0, isFrom: false, paybackCount: 2 });
  });

  it("website Basic + gjuhë e dytë + blog: 349 + 150 + 120 = €619", () => {
    expect(calculatorEstimate("€349", false, [LANGUAGE, BLOG], 300).total).toBe(619);
  });

  it("mirëmbajtja mujore s'hyn në totalin një-herë, shfaqet veç", () => {
    const r = calculatorEstimate("€699", false, [LANGUAGE, MAINTENANCE], 300);
    expect(r.total).toBe(849);
    expect(r.extrasMonthly).toBe(49);
  });

  it("paketat mujore injorojnë shtesat", () => {
    const r = calculatorEstimate("€379", true, [LANGUAGE, MAINTENANCE], 300);
    expect(r.total).toBe(379);
    expect(r.extrasMonthly).toBe(0);
    expect(r.paybackCount).toBe(2); // ceil(379 / 300)
  });

  it("çmimi 'Nga' shënohet si i tillë", () => {
    expect(calculatorEstimate("Nga €1,200", false, [], 300).isFrom).toBe(true);
    expect(calculatorEstimate("From €1,200", false, [], 300).isFrom).toBe(true);
  });

  it("numri i klientëve rrumbullakoset lart, minimumi 1", () => {
    expect(calculatorEstimate("€600", false, [], 300).paybackCount).toBe(2);
    expect(calculatorEstimate("€601", false, [], 300).paybackCount).toBe(3);
    expect(calculatorEstimate("€49", true, [], 300).paybackCount).toBe(1);
  });

  it("fusha bosh ose vlerë shumë e vogël → s'jep numër absurd", () => {
    expect(calculatorEstimate("€599", false, [], 0).paybackCount).toBeNull();
    expect(calculatorEstimate("€599", false, [], 5).paybackCount).toBeNull();
    expect(calculatorEstimate("€599", false, [], 10).paybackCount).toBe(60);
  });
});
