import { describe, expect, it } from "vitest";
import { buildMetadata, buildBreadcrumb, buildServiceSchema, seo } from "./seo";

describe("buildMetadata", () => {
  it("falls back to site defaults when called with no arguments", () => {
    const meta = buildMetadata();
    expect(meta.title).toBe("Illyrian Pixel");
    expect(meta.description).toBe(seo.defaultDescription);
    expect(meta.alternates?.canonical).toBe(seo.siteUrl);
  });

  it("appends the brand suffix to a custom title", () => {
    const meta = buildMetadata("Çmimet");
    expect(meta.title).toBe("Çmimet | Illyrian Pixel");
    expect((meta.openGraph as { title?: string })?.title).toBe("Çmimet | Illyrian Pixel");
    expect((meta.twitter as { title?: string })?.title).toBe("Çmimet | Illyrian Pixel");
  });

  it("builds the canonical URL from the path — every page must declare itself, not the homepage", () => {
    const meta = buildMetadata("Shërbimet", "Përmbledhje", "/sherbimet");
    expect(meta.alternates?.canonical).toBe("https://illyrianpixel.com/sherbimet");
    expect((meta.openGraph as { url?: string })?.url).toBe("https://illyrianpixel.com/sherbimet");
  });

  it("mirrors the same path across sq, sq-AL and x-default hreflang entries", () => {
    const meta = buildMetadata("X", "Y", "/blog/post-1");
    const langs = meta.alternates?.languages as Record<string, string>;
    expect(langs.sq).toBe("https://illyrianpixel.com/blog/post-1");
    expect(langs["sq-AL"]).toBe("https://illyrianpixel.com/blog/post-1");
    expect(langs["x-default"]).toBe("https://illyrianpixel.com/blog/post-1");
  });

  it("only includes keywords when a non-empty array is given", () => {
    expect(buildMetadata().keywords).toBeUndefined();
    expect(buildMetadata("T", "D", "/", []).keywords).toBeUndefined();
    expect(buildMetadata("T", "D", "/", ["seo", "web"]).keywords).toEqual(["seo", "web"]);
  });
});

describe("buildMetadata sqOnly option", () => {
  it("keeps the sq canonical even when locale is en", () => {
    const meta = buildMetadata("X", "Y", "/diaspora/gjermani", undefined, "en", { sqOnly: true });
    expect(meta.alternates?.canonical).toBe("https://illyrianpixel.com/diaspora/gjermani");
  });

  it("omits the en hreflang alternate", () => {
    const meta = buildMetadata("X", "Y", "/diaspora/gjermani", undefined, "en", { sqOnly: true });
    const langs = meta.alternates?.languages as Record<string, string>;
    expect(langs.en).toBeUndefined();
    expect(langs.sq).toBe("https://illyrianpixel.com/diaspora/gjermani");
  });

  it("marks the en render noindex,follow but leaves sq indexable", () => {
    const enMeta = buildMetadata("X", "Y", "/diaspora/gjermani", undefined, "en", { sqOnly: true });
    expect(enMeta.robots).toEqual({ index: false, follow: true });

    const sqMeta = buildMetadata("X", "Y", "/diaspora/gjermani", undefined, "sq", { sqOnly: true });
    expect(sqMeta.robots).toBeUndefined();
  });

  it("does not change existing call sites that omit the option", () => {
    const meta = buildMetadata("X", "Y", "/sherbimet", undefined, "en");
    expect(meta.alternates?.canonical).toBe("https://illyrianpixel.com/en/sherbimet");
    expect((meta.alternates?.languages as Record<string, string>).en).toBe("https://illyrianpixel.com/en/sherbimet");
  });
});

describe("buildBreadcrumb", () => {
  it("numbers items starting at 1 in the given order", () => {
    const crumb = buildBreadcrumb([
      { name: "Ballina", url: "https://illyrianpixel.com" },
      { name: "Blog", url: "https://illyrianpixel.com/blog" },
    ]);
    expect(crumb.itemListElement[0]).toMatchObject({ position: 1, name: "Ballina" });
    expect(crumb.itemListElement[1]).toMatchObject({ position: 2, name: "Blog" });
  });

  it("produces a valid schema.org type", () => {
    const crumb = buildBreadcrumb([{ name: "X", url: "https://illyrianpixel.com/x" }]);
    expect(crumb["@type"]).toBe("BreadcrumbList");
  });
});

describe("buildServiceSchema", () => {
  it("links the service back to the organization and the given URL", () => {
    const schema = buildServiceSchema("SEO", "SEO description", "https://illyrianpixel.com/services/seo");
    expect(schema.name).toBe("SEO");
    expect(schema.url).toBe("https://illyrianpixel.com/services/seo");
    expect(schema.provider).toEqual({ "@id": "https://illyrianpixel.com/#organization" });
    expect(schema["@id"]).toBe("https://illyrianpixel.com/services/seo#service");
  });
});
