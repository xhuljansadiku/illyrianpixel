import { describe, expect, it } from "vitest";
import { QUOTE_TEMPLATES } from "@/lib/quoteTemplates";

describe("QUOTE_TEMPLATES", () => {
  it("çdo shabllon ka çmim nga paketat e /cmimet (paketë e riemërtuar → 0 → dështon)", () => {
    for (const t of QUOTE_TEMPLATES) {
      expect(t.items[0].price, t.id).toBeGreaterThan(0);
    }
  });

  it("ndjek çmimet aktuale dhe rregullin e pagesës", () => {
    const byId = Object.fromEntries(QUOTE_TEMPLATES.map((t) => [t.id, t]));
    expect(byId["website-business"].items[0].price).toBe(599);
    expect(byId["website-premium"].items[0].price).toBe(899);
    expect(byId["website-premium"].notes).toContain("50% paradhënie");
    expect(byId.ecommerce.items[0].price).toBe(1199);
    expect(byId.ecommerce.notes).toContain("3 këste");
    expect(byId.ecommerce.items[1]).toMatchObject({ price: 0, description: expect.stringContaining("falas") });
  });
});
