import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STRUCTURED_ARTICLES } from "@/lib/blogArticles";
import type { BlogBlock } from "@/lib/blogArticles/types";
import { DEDICATED_BLOG_SLUGS } from "@/lib/blogDedicatedSlugs";
import { getBlogPostsForLocale } from "@/lib/blogPosts";
import type { Locale } from "@/i18n/routing";

const LOCALES: Locale[] = ["sq", "en"];
const APP_LOCALE_DIR = path.resolve(__dirname, "../../app/[locale]");

// /services/<slug> vjen nga një rrugë dinamike; një faqe Next s'mund të eksportojë listën, ndaj lexohet nga burimi
const SERVICE_SLUGS = new Set(
  [
    ...(/const SERVICE_SLUGS = \[([^\]]+)\]/.exec(
      readFileSync(path.join(APP_LOCALE_DIR, "services", "[slug]", "page.tsx"), "utf8")
    )?.[1] ?? "").matchAll(/"([^"]+)"/g),
  ].map((m) => m[1])
);

function pageExists(href: string) {
  const service = /^\/services\/([^/]+)$/.exec(href);
  if (service && SERVICE_SLUGS.has(service[1])) return true;
  return existsSync(path.join(APP_LOCALE_DIR, ...href.split("/").filter(Boolean), "page.tsx"));
}

function blockText(b: BlogBlock): string[] {
  if ("h2" in b) return [b.h2];
  if ("p" in b) return [b.p];
  if ("note" in b) return [b.note];
  return "ul" in b ? b.ul : b.ol;
}

function blockKind(b: BlogBlock) {
  return Object.keys(b)[0];
}

describe("lib/blogArticles", () => {
  it("çdo skedar artikulli është te STRUCTURED_ARTICLES", () => {
    const files = readdirSync(__dirname)
      .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "types.ts" && f !== "index.ts")
      .map((f) => f.replace(/\.ts$/, ""))
      .sort();
    expect(STRUCTURED_ARTICLES.map((a) => a.slug).sort()).toEqual(files);
  });

  for (const article of STRUCTURED_ARTICLES) {
    describe(article.slug, () => {
      it("ka faqen e vet dhe është te DEDICATED_BLOG_SLUGS", () => {
        expect(existsSync(path.join(APP_LOCALE_DIR, "blog", article.slug, "page.tsx"))).toBe(true);
        expect(DEDICATED_BLOG_SLUGS.has(article.slug)).toBe(true);
      });

      it("sq dhe en kanë të njëjtën strukturë blloqesh", () => {
        const sq = article.sq.blocks.map((b) => `${blockKind(b)}:${blockText(b).length}`);
        const en = article.en.blocks.map((b) => `${blockKind(b)}:${blockText(b).length}`);
        expect(en).toEqual(sq);
      });

      for (const locale of LOCALES) {
        const a = article[locale];
        const posts = getBlogPostsForLocale(locale);

        it(`${locale}: hyrja te lib/blogPosts përputhet me artikullin`, () => {
          const post = posts.find((p) => p.slug === article.slug);
          expect(post).toMatchObject({ title: a.title, category: a.category, excerpt: a.description, date: a.date });
        });

        it(`${locale}: artikujt e lidhur ekzistojnë, me titullin dhe kategorinë e tyre`, () => {
          for (const r of a.related) {
            const post = posts.find((p) => p.slug === r.slug);
            expect(post, r.slug).toMatchObject({ title: r.title, category: r.category });
          }
        });

        it(`${locale}: lidhjet brenda tekstit çojnë te faqe që ekzistojnë`, () => {
          const hrefs = a.blocks.flatMap(blockText).flatMap((t) => [...t.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1]));
          for (const href of hrefs) {
            const blog = /^\/blog\/([^/]+)$/.exec(href);
            const ok = blog ? posts.some((p) => p.slug === blog[1]) : pageExists(href);
            expect(ok, href).toBe(true);
          }
        });
      }
    });
  }
});
