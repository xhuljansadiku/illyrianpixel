import { describe, expect, it } from "vitest";
import { BLOG_DATES, blogArticleSchema } from "./blogDates";
import { DEDICATED_BLOG_SLUGS } from "./blogDedicatedSlugs";

describe("BLOG_DATES", () => {
  it("has dates for every dedicated blog article (sitemap lastmod + schema Article)", () => {
    for (const slug of DEDICATED_BLOG_SLUGS) expect(BLOG_DATES[slug], slug).toBeDefined();
  });

  it("never has modified before published, and uses ISO dates", () => {
    for (const [slug, d] of Object.entries(BLOG_DATES)) {
      expect(d.published, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.modified, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.modified >= d.published, slug).toBe(true);
    }
  });
});

describe("blogArticleSchema", () => {
  it("builds an Article with both dates and the locale-specific URL", () => {
    const s = blogArticleSchema("seo-tirane", "SEO Tirana", "Desc", "en");
    expect(s["@type"]).toBe("Article");
    expect(s.datePublished).toBe(BLOG_DATES["seo-tirane"].published);
    expect(s.dateModified).toBe(BLOG_DATES["seo-tirane"].modified);
    expect(s.mainEntityOfPage).toBe("https://illyrianpixel.com/en/blog/seo-tirane");
    expect(s.inLanguage).toBe("en");
  });
});
