import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { LEGAL_UPDATED, getLegalPage, type LegalPageId } from "@/content/legal";
import type { StaticPathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { formatDate } from "../insights/ArticleCard";
import { JsonLd } from "../seo/JsonLd";
import { ContentBlocks, RichText } from "../ui/RichText";
import { PageHero } from "./PageHero";

const HREFS: Record<LegalPageId, StaticPathname> = {
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
};

export function legalMetadata(locale: Locale, id: LegalPageId): Metadata {
  const page = getLegalPage(locale, id);
  return buildMetadata({ locale, href: HREFS[id], title: page.metaTitle, description: page.metaDescription });
}

export function LegalPage({ locale, id }: { locale: Locale; id: LegalPageId }) {
  const dict = getDictionary(locale);
  const page = getLegalPage(locale, id);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.common.home, href: "/" },
          { name: page.title, href: HREFS[id] },
        ])}
      />
      <PageHero
        compact
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [{ label: dict.common.home, href: "/" }, { label: page.title }],
        }}
        title={page.title}
        meta={
          <span>
            {dict.legal.updated} <time dateTime={LEGAL_UPDATED}>{formatDate(LEGAL_UPDATED, locale)}</time>
          </span>
        }
      />
      <section className="legal-body">
        <div className="container">
          <p className="legal-body__intro">
            <RichText text={page.intro} />
          </p>
          <div className="prose">
            <ContentBlocks blocks={page.body} />
          </div>
        </div>
      </section>
    </>
  );
}
