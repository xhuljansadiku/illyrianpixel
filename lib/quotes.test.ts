import { describe, expect, it } from "vitest";
import { parseQuoteItems, quoteTotals, formatMoney } from "./quotes";

describe("quoteTotals", () => {
  it("computes subtotal, tax and total with no discount", () => {
    const items = [{ description: "Website", qty: 1, price: 1000 }];
    const totals = quoteTotals(items, 0, 20);
    expect(totals.subtotal).toBe(1000);
    expect(totals.discount).toBe(0);
    expect(totals.tax).toBe(200);
    expect(totals.total).toBe(1200);
  });

  it("applies a flat discount before computing tax", () => {
    const items = [{ description: "Website", qty: 1, price: 1000 }];
    const totals = quoteTotals(items, 100, 20);
    expect(totals.subtotal).toBe(1000);
    expect(totals.discount).toBe(100);
    expect(totals.tax).toBe(180); // (1000-100)*0.20
    expect(totals.total).toBe(1080);
  });

  it("clamps a discount larger than the subtotal instead of going negative", () => {
    const items = [{ description: "Website", qty: 1, price: 100 }];
    const totals = quoteTotals(items, 500, 0);
    expect(totals.discount).toBe(100); // clamped to subtotal
    expect(totals.total).toBe(0);
  });

  it("sums multiple line items with quantities", () => {
    const items = [
      { description: "Website", qty: 1, price: 1000 },
      { description: "Logo", qty: 2, price: 150 },
    ];
    const totals = quoteTotals(items, 0, 0);
    expect(totals.subtotal).toBe(1300);
  });

  it("treats a 0% tax rate as zero tax", () => {
    const items = [{ description: "Website", qty: 1, price: 500 }];
    const totals = quoteTotals(items, 0, 0);
    expect(totals.tax).toBe(0);
    expect(totals.total).toBe(500);
  });
});

describe("parseQuoteItems", () => {
  it("accepts a well-formed item list", () => {
    const items = parseQuoteItems([{ description: "Website", qty: 1, price: 1000 }]);
    expect(items).toEqual([{ description: "Website", qty: 1, price: 1000 }]);
  });

  it("rejects an empty array", () => {
    expect(parseQuoteItems([])).toBeNull();
  });

  it("rejects more than 30 items", () => {
    const items = Array.from({ length: 31 }, (_, i) => ({ description: `Item ${i}`, qty: 1, price: 1 }));
    expect(parseQuoteItems(items)).toBeNull();
  });

  it("rejects an item with zero or negative quantity", () => {
    expect(parseQuoteItems([{ description: "X", qty: 0, price: 10 }])).toBeNull();
    expect(parseQuoteItems([{ description: "X", qty: -1, price: 10 }])).toBeNull();
  });

  it("rejects an item with a negative price", () => {
    expect(parseQuoteItems([{ description: "X", qty: 1, price: -10 }])).toBeNull();
  });

  it("rejects an item with an empty description", () => {
    expect(parseQuoteItems([{ description: "  ", qty: 1, price: 10 }])).toBeNull();
  });

  it("rejects non-array input", () => {
    expect(parseQuoteItems("not an array")).toBeNull();
    expect(parseQuoteItems(null)).toBeNull();
    expect(parseQuoteItems(undefined)).toBeNull();
  });

  it("truncates an overlong description instead of rejecting it", () => {
    const longDesc = "x".repeat(400);
    const items = parseQuoteItems([{ description: longDesc, qty: 1, price: 10 }]);
    expect(items?.[0].description.length).toBe(300);
  });
});

describe("formatMoney", () => {
  it("formats whole euro amounts without decimals", () => {
    expect(formatMoney(1000)).toBe("€1.000");
  });

  it("formats fractional amounts with up to 2 decimals", () => {
    expect(formatMoney(199.5)).toBe("€199,5");
  });
});
