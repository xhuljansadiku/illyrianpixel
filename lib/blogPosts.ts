import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "./blogPosts.sq";
import { blogPosts as sqPosts } from "./blogPosts.sq";
import { blogPosts as enPosts } from "./blogPosts.en";

export type { BlogPost } from "./blogPosts.sq";

// Default export stays Albanian — used by admin/API/internal tooling that has
// no locale concept (app/admin, sitemap, the [slug] fallback route).
export const blogPosts = sqPosts;
export const getBlogPostBySlug = (slug: string) => sqPosts.find((post) => post.slug === slug);

const CATALOG: Record<Locale, BlogPost[]> = { sq: sqPosts, en: enPosts };

export function getBlogPostsForLocale(locale: Locale): BlogPost[] {
  return CATALOG[locale];
}

export function getBlogPostBySlugForLocale(locale: Locale, slug: string): BlogPost | undefined {
  return CATALOG[locale].find((post) => post.slug === slug);
}
