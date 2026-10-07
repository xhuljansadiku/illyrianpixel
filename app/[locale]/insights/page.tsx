import type { Metadata } from "next";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/content/dictionaries";
import { getArticles } from "@/content/insights";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({ locale, href: "/insights", title: meta.insights.title, description: meta.insights.description });
}

export default async function InsightsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.insightsPage;
  const articles = getArticles(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.common.home, href: "/" },
          { name: page.allCrumb, href: "/insights" },
        ])}
      />

      <PageHero
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [{ label: dict.common.home, href: "/" }, { label: page.allCrumb }],
        }}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      />

      <section className="section">
        <div className="container">
          <ul className="article-grid" role="list">
            {articles.map((article, index) => (
              <li key={article.id} data-reveal="" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                <ArticleCard
                  article={article}
                  locale={locale}
                  index={index}
                  readingLabel={dict.common.minutesRead(article.readingMinutes)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={page.ctaTitle}
        text={page.ctaText}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source="insights-cta"
      />
    </>
  );
}
