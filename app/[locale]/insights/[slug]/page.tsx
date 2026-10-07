import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard, formatDate } from "@/components/insights/ArticleCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentBlocks } from "@/components/ui/RichText";
import { getDictionary } from "@/content/dictionaries";
import { INSIGHT_SLUGS } from "@/content/insight-slugs";
import { getArticle, getArticles } from "@/content/insights";
import { isLocale, routing, type Locale } from "@/i18n/routing";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

type ArticlePageProps = PageProps<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : routing.defaultLocale;
  return getArticles(locale).map((article) => ({ slug: article.slug }));
}

async function load(params: ArticlePageProps["params"]) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const article = getArticle(locale, slug);
  if (!article) notFound();
  return { locale, article };
}

function articleHrefs(id: string) {
  const entry = INSIGHT_SLUGS.find((item) => item.id === id);
  if (!entry) return undefined;
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, { pathname: "/insights/[slug]" as const, params: { slug: entry.slugs[locale] } }]),
  ) as Record<Locale, { pathname: "/insights/[slug]"; params: { slug: string } }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, article } = await load(params);
  return buildMetadata({
    locale,
    href: { pathname: "/insights/[slug]", params: { slug: article.slug } },
    alternates: articleHrefs(article.id),
    title: article.metaTitle,
    description: article.metaDescription,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, article } = await load(params);
  const dict = getDictionary(locale);
  const page = dict.insightsPage;
  const href = { pathname: "/insights/[slug]" as const, params: { slug: article.slug } };
  const more = getArticles(locale)
    .filter((item) => item.id !== article.id)
    .slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            locale,
            href,
            headline: article.title,
            description: article.metaDescription,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
          }),
          breadcrumbSchema(locale, [
            { name: dict.common.home, href: "/" },
            { name: page.allCrumb, href: "/insights" },
            { name: article.title, href },
          ]),
        ]}
      />

      <PageHero
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [
            { label: dict.common.home, href: "/" },
            { label: page.allCrumb, href: "/insights" },
            { label: article.title },
          ],
        }}
        eyebrow={article.category}
        title={<span className="article-header__title">{article.title}</span>}
        lead={article.excerpt}
        meta={
          <>
            <span>
              {dict.common.published}{" "}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
            </span>
            <span>{dict.common.minutesRead(article.readingMinutes)}</span>
            <span>{page.authorName}</span>
          </>
        }
      />

      <article className="article-body">
        <div className="container">
          <div className="prose">
            <ContentBlocks blocks={article.body} />
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section section--subtle" aria-labelledby="more-insights-title">
          <div className="container">
            <div className="section-header">
              <h2 id="more-insights-title" className="h3">
                {page.moreTitle}
              </h2>
            </div>
            <ul className="article-grid" role="list">
              {more.map((item, index) => (
                <li key={item.id}>
                  <ArticleCard
                    article={item}
                    locale={locale}
                    index={index + 1}
                    readingLabel={dict.common.minutesRead(item.readingMinutes)}
                    headingLevel="h3"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        title={page.ctaTitle}
        text={page.ctaText}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source={`insight:${article.id}`}
      />
    </>
  );
}
