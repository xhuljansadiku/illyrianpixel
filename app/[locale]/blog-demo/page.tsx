import type { Metadata } from "next";
import { getBlogPostsForLocale } from "@/lib/blogPosts";
import BlogDemoClient from "@/components/BlogDemoClient";
import type { Locale } from "@/i18n/routing";

/** DEMO (2026-11-05): 4 pamje për /blog — fshihet pasi pronari zgjedh një */
export const metadata: Metadata = {
  title: "Demo · Blogu",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: Locale }> };

export default async function BlogDemoPage(props: Props) {
  const { locale } = await props.params;
  return <BlogDemoClient posts={getBlogPostsForLocale(locale)} />;
}
