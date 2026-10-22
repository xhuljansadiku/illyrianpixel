import type { Metadata } from "next";
import { buildMetadata, seo as seoConfig, buildBreadcrumb, jsonLd } from "@/lib/seo";
import DiasporaHubPage from "@/components/DiasporaHubPage";
import { DIASPORA_COUNTRY_SLUGS } from "@/lib/diasporaShared";
import { getDiasporaContent } from "@/lib/diasporaContent";
import type { Locale } from "@/i18n/routing";

type RouteParams = { locale: Locale };
type Props = { params: Promise<RouteParams> };

const META: Record<Locale, { title: string; desc: string; home: string; hub: string }> = {
  sq: {
    title: "Website për Biznese Shqiptare në Diasporë",
    desc: "Ndërtojmë website për biznese shqiptare në Gjermani, Britaninë e Madhe, Zvicër, Itali, SHBA dhe Kanada. Konsultim falas, plan brenda 24–48h, komunikim 100% në shqip.",
    home: "Ballina",
    hub: "Diasporë",
  },
  en: {
    title: "Websites for Albanian Businesses in the Diaspora",
    desc: "We build websites for Albanian-owned businesses in Germany, the UK, Switzerland, Italy, the USA and Canada. Free consultation, plan within 24–48h, 100% communication in Albanian.",
    home: "Home",
    hub: "Diaspora",
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const m = META[locale] ?? META.sq;
  return buildMetadata(m.title, m.desc, "/diaspora", undefined, locale);
}

export const revalidate = 300;

export default async function DiasporaIndexPage(props: Props) {
  const { locale } = await props.params;
  const m = META[locale] ?? META.sq;
  const prefix = locale === "en" ? "/en" : "";
  const content = getDiasporaContent(locale);
  const countries = DIASPORA_COUNTRY_SLUGS.map((slug) => ({
    slug,
    countryLabel: content[slug].countryLabel,
    flagCode: content[slug].flagCode,
    hookLine: content[slug].hookLine,
  }));

  const breadcrumbSchema = buildBreadcrumb([
    { name: m.home, url: `${seoConfig.siteUrl}${prefix}` },
    { name: m.hub, url: `${seoConfig.siteUrl}${prefix}/diaspora` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <DiasporaHubPage countries={countries} />
    </>
  );
}
