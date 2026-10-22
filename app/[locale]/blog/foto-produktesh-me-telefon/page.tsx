import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import BlogStructuredArticle, { structuredArticleMetadata } from "@/components/BlogStructuredArticle";
import article from "@/lib/blogArticles/foto-produktesh-me-telefon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  return structuredArticleMetadata(article, locale as Locale);
}

export default async function Page(props: Props) {
  const { locale } = await props.params;
  return <BlogStructuredArticle pair={article} locale={locale as Locale} />;
}
