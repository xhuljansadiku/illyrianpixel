import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, buildBreadcrumb, seo as seoConfig, jsonLd } from "@/lib/seo";
import { DIASPORA_COUNTRY_SLUGS, type CountrySlug } from "@/lib/diasporaShared";
import { getDiasporaContent } from "@/lib/diasporaContent";
import DiasporaCountryPage from "@/components/DiasporaCountryPage";
import type { Locale } from "@/i18n/routing";

type RouteParams = { locale: Locale; country: string };
type Props = { params: Promise<RouteParams> };

export function generateStaticParams() {
  return DIASPORA_COUNTRY_SLUGS.map((country) => ({ country }));
}

const SEO_SQ: Record<CountrySlug, { title: string; desc: string }> = {
  "gjermani": {
    title: "Website për Biznese Shqiptare në Gjermani",
    desc: "Ndërtojmë website profesionale për biznese shqiptare në Gjermani. Klientë realë (Hauswerk Niederbayern, Suli Group). Konsultim falas, plan brenda 24–48h.",
  },
  "britani": {
    title: "Website për Biznese Shqiptare në Britaninë e Madhe",
    desc: "Ndërtojmë website profesionale për biznese shqiptare në UK. Klient real (Palushi Brothers, Londër). Konsultim falas, plan brenda 24–48h.",
  },
  "zvicer": {
    title: "Website për Biznese Shqiptare në Zvicër",
    desc: "Ndërtojmë website profesionale, të nivelit zviceran, për biznese shqiptare në Zvicër. Komunikim 100% në shqip. Konsultim falas, plan brenda 24–48h.",
  },
  "itali": {
    title: "Website Dygjuhësh për Biznese Shqiptare në Itali",
    desc: "Ndërtojmë website dygjuhëshe shqip/italisht për biznese shqiptare në Itali. Klient real (ESM Group, Milano). Konsultim falas, plan brenda 24–48h.",
  },
  "shba-kanada": {
    title: "Website për Biznese Shqiptare në SHBA & Kanada",
    desc: "Ndërtojmë website profesionale për biznese shqiptare në SHBA dhe Kanada, që punojnë edhe kur ju flini. Klient real në Nju Jork (Roofon NYC). Konsultim falas, plan brenda 24–48h.",
  },
};

const SEO_EN: Record<CountrySlug, { title: string; desc: string }> = {
  "gjermani": {
    title: "Websites for Albanian Businesses in Germany",
    desc: "Professional websites for Albanian-owned businesses in Germany. Real clients (Hauswerk Niederbayern, Suli Group). Free consultation, plan within 24–48h.",
  },
  "britani": {
    title: "Websites for Albanian Businesses in the UK",
    desc: "Professional websites for Albanian-owned businesses in the UK. Real client (Palushi Brothers, London). Free consultation, plan within 24–48h.",
  },
  "zvicer": {
    title: "Websites for Albanian Businesses in Switzerland",
    desc: "Professional, Swiss-level websites for Albanian-owned businesses in Switzerland. 100% communication in Albanian. Free consultation, plan within 24–48h.",
  },
  "itali": {
    title: "Bilingual Websites for Albanian Businesses in Italy",
    desc: "Bilingual Albanian/Italian websites for Albanian-owned businesses in Italy. Real client (ESM Group, Milan). Free consultation, plan within 24–48h.",
  },
  "shba-kanada": {
    title: "Websites for Albanian Businesses in the USA & Canada",
    desc: "Professional websites for Albanian-owned businesses in the USA and Canada that keep working while you sleep. Real client in New York (Roofon NYC). Free consultation, plan within 24–48h.",
  },
};

const seoFor = (locale: Locale) => (locale === "en" ? SEO_EN : SEO_SQ);

const CRUMBS: Record<Locale, { home: string; hub: string }> = {
  sq: { home: "Ballina", hub: "Diasporë" },
  en: { home: "Home", hub: "Diaspora" },
};

const AREA_SERVED: Record<CountrySlug, string[]> = {
  "gjermani": ["Germany"],
  "britani": ["United Kingdom"],
  "zvicer": ["Switzerland"],
  "itali": ["Italy"],
  "shba-kanada": ["United States", "Canada"],
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, country } = await props.params;
  const seo = seoFor(locale)[country as CountrySlug];
  if (!seo) return buildMetadata(CRUMBS[locale].hub, undefined, "/diaspora", undefined, locale);
  return buildMetadata(seo.title, seo.desc, `/diaspora/${country}`, undefined, locale);
}

export const revalidate = 300;

export default async function DiasporaCountryRoute(props: Props) {
  const { locale, country } = await props.params;
  if (!DIASPORA_COUNTRY_SLUGS.includes(country as CountrySlug)) notFound();

  const slug = country as CountrySlug;
  const content = getDiasporaContent(locale)[slug];
  const seo = seoFor(locale)[slug];
  const crumbs = CRUMBS[locale] ?? CRUMBS.sq;
  const prefix = locale === "en" ? "/en" : "";
  if (!content) notFound();

  const url = `${seoConfig.siteUrl}${prefix}/diaspora/${slug}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: seo.title,
    description: seo.desc,
    url,
    provider: { "@id": `${seoConfig.siteUrl}/#organization` },
    areaServed: AREA_SERVED[slug],
    serviceType: "Website Development",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      seller: { "@id": `${seoConfig.siteUrl}/#organization` },
    },
  };

  const breadcrumbSchema = buildBreadcrumb([
    { name: crumbs.home, url: `${seoConfig.siteUrl}${prefix}` },
    { name: crumbs.hub, url: `${seoConfig.siteUrl}${prefix}/diaspora` },
    { name: content.countryLabel, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <DiasporaCountryPage content={content} />
    </>
  );
}
