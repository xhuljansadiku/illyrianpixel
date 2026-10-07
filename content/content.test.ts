import { describe, expect, it } from "vitest";
import { isAppPathname, routing } from "@/i18n/routing";
import { company, isPlaceholder, realValue } from "./company";
import { en } from "./dictionaries/en";
import { sv } from "./dictionaries/sv";
import { FORM_COPY } from "./form";
import { getArticles } from "./insights";
import { INSIGHT_SLUGS, translateInsightSlug } from "./insight-slugs";
import { getLegalPage } from "./legal";
import { getProjects } from "./projects";
import { getServices } from "./services";

const locales = routing.locales;

/** Collects the shape of an object: paths of keys plus array lengths. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => [`${path}.${key}`, ...shape(child, `${path}.${key}`)]);
  }
  return [];
}

describe("dictionaries", () => {
  it("Swedish and English have exactly the same structure (incl. list lengths)", () => {
    expect(shape(en)).toEqual(shape(sv));
  });

  it("contain no empty strings", () => {
    const empty: string[] = [];
    const walk = (value: unknown, path: string) => {
      if (typeof value === "string" && value.trim() === "") empty.push(path);
      else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => walk(v, `${path}.${k}`));
    };
    walk(sv, "sv");
    walk(en, "en");
    expect(empty).toEqual([]);
  });

  it("form copy covers every locale", () => {
    expect(Object.keys(FORM_COPY).sort()).toEqual([...locales].sort());
    expect(shape(FORM_COPY.en)).toEqual(shape(FORM_COPY.sv));
  });
});

describe("services", () => {
  it.each(locales)("%s has six services with valid routes", (locale) => {
    const services = getServices(locale);
    expect(services).toHaveLength(6);
    expect(new Set(services.map((s) => s.number)).size).toBe(6);
    for (const service of services) {
      expect(isAppPathname(service.href)).toBe(true);
      expect(service.included).toHaveLength(6);
      expect(service.faqs.length).toBeGreaterThan(0);
      expect(service.related.every((id) => services.some((s) => s.id === id))).toBe(true);
    }
  });

  it("keeps structure identical across locales", () => {
    const [a, b] = locales.map((locale) => getServices(locale));
    expect(shape(b)).toEqual(shape(a));
  });
});

describe("insights", () => {
  it("every article exists in every locale with a URL-safe, unique slug", () => {
    for (const locale of locales) {
      const articles = getArticles(locale);
      expect(articles).toHaveLength(INSIGHT_SLUGS.length);
      const slugs = articles.map((a) => a.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
      articles.forEach((article) => {
        expect(article.metaDescription.length).toBeLessThanOrEqual(170);
        expect(article.body.length).toBeGreaterThan(5);
      });
    }
  });

  it("translates slugs between locales", () => {
    expect(translateInsightSlug("seo-eller-google-ads", "sv", "en")).toBe("seo-or-google-ads");
    expect(translateInsightSlug("seo-or-google-ads", "en", "sv")).toBe("seo-eller-google-ads");
    expect(translateInsightSlug("does-not-exist", "sv", "en")).toBeNull();
  });
});

describe("case studies", () => {
  it("published (non-placeholder) projects contain no [PLACEHOLDER] text", () => {
    for (const locale of locales) {
      for (const project of getProjects(locale).filter((p) => !p.placeholder)) {
        expect(JSON.stringify(project)).not.toMatch(/\[[A-Z]/);
      }
    }
  });

  it("projects have URL-safe, unique slugs", () => {
    const slugs = getProjects("sv").map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
  });
});

describe("company details", () => {
  it("treats [BRACKETS] as placeholders and never as real values", () => {
    expect(isPlaceholder("[EMAIL]")).toBe(true);
    expect(isPlaceholder("hello@example.se")).toBe(false);
    expect(realValue(company.orgNumber)).toBe(isPlaceholder(company.orgNumber) ? null : company.orgNumber);
  });
});

describe("legal pages", () => {
  it.each(locales)("%s has privacy, terms and cookie pages", (locale) => {
    for (const id of ["privacy", "terms", "cookies"] as const) {
      const page = getLegalPage(locale, id);
      expect(page.title.length).toBeGreaterThan(3);
      expect(page.body.length).toBeGreaterThan(4);
    }
  });
});

describe("brand separation", () => {
  it("contains no Illyrian Pixel references or Albanian copy", () => {
    const everything = JSON.stringify({
      sv,
      en,
      FORM_COPY,
      services: locales.map((l) => getServices(l)),
      articles: locales.map((l) => getArticles(l)),
      projects: locales.map((l) => getProjects(l)),
      legal: locales.map((l) => ["privacy", "terms", "cookies"].map((id) => getLegalPage(l, id as "privacy"))),
    });
    expect(everything).not.toMatch(/illyrian/i);
    expect(everything).not.toMatch(/shqip|tiran[eë]|kosov/i);
  });
});
