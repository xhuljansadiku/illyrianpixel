import { describe, expect, it } from "vitest";
import { getServiceCategories } from "./serviceCategories";
import { getServiceFaqs } from "./serviceFaqs";
import type { Locale } from "@/i18n/routing";

describe.each<Locale>(["sq", "en"])("getServiceFaqs (%s)", (locale) => {
  const categories = getServiceCategories(locale);

  it("gives every service at least 3 questions", () => {
    for (const c of categories) expect(getServiceFaqs(c, locale).length, c.slug).toBeGreaterThanOrEqual(3);
  });

  it("never leaves a price blank (a renamed package would print 'Basic  (')", () => {
    for (const c of categories) {
      for (const f of getServiceFaqs(c, locale)) {
        expect(f.a, `${c.slug}: ${f.q}`).not.toMatch(/ {2}| [.,]|undefined/);
      }
    }
  });

  it("quotes the current package prices, so admin price overrides flow through", () => {
    const web = categories.find((c) => c.slug === "website")!;
    const answer = getServiceFaqs(web, locale)[0].a;
    for (const p of web.packages.filter((x) => x.name !== "Custom")) expect(answer).toContain(p.price);
  });
});
