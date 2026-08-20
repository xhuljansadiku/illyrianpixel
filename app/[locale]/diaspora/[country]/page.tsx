import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, buildBreadcrumb, seo as seoConfig } from "@/lib/seo";
import { DIASPORA_COUNTRY_SLUGS, type CountrySlug } from "@/lib/diasporaShared";
import { diasporaContent } from "@/lib/diasporaContent.sq";
import DiasporaCountryPage from "@/components/DiasporaCountryPage";
import type { Locale } from "@/i18n/routing";

type RouteParams = { locale: Locale; country: string };
type Props = { params: RouteParams | Promise<RouteParams> };

export function generateStaticParams() {
  return DIASPORA_COUNTRY_SLUGS.map((country) => ({ country }));
}

const SEO: Record<CountrySlug, { title: string; desc: string }> = {
  "gjermani": {
    title: "Website për Biznese Shqiptare në Gjermani",
    desc: "Ndërtojmë website profesionale për biznese shqiptare në Gjermani. Klientë realë (Hauswerk Niederbayern, Suli Group). Konsultim falas, plan brenda 24h.",
  },
  "britani": {
    title: "Website për Biznese Shqiptare në Britaninë e Madhe",
    desc: "Ndërtojmë website profesionale për biznese shqiptare në UK. Klient real (Palushi Brothers, Londër). Konsultim falas, plan brenda 24h.",
  },
  "zvicer": {
    title: "Website për Biznese Shqiptare në Zvicër",
    desc: "Ndërtojmë website profesionale, të nivelit zviceran, për biznese shqiptare në Zvicër. Komunikim 100% në shqip. Konsultim falas, plan brenda 24h.",
  },
  "itali": {
    title: "Website Dygjuhësh për Biznese Shqiptare në Itali",
    desc: "Ndërtojmë website dygjuhëshe shqip/italisht për biznese shqiptare në Itali. Klient real (ESM Group, Milano). Konsultim falas, plan brenda 24h.",
  },
  "shba-kanada": {
    title: "Website për Biznese Shqiptare në SHBA & Kanada",
    desc: "Ndërtojmë website profesionale për biznese shqiptare në SHBA dhe Kanada, që punojnë edhe kur ju flini. Konsultim falas, plan brenda 24h.",
  },
};

const AREA_SERVED: Record<CountrySlug, string[]> = {
  "gjermani": ["Germany"],
  "britani": ["United Kingdom"],
  "zvicer": ["Switzerland"],
  "itali": ["Italy"],
  "shba-kanada": ["United States", "Canada"],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await Promise.resolve(params);
  const seo = SEO[country as CountrySlug];
  if (!seo) return buildMetadata("Diasporë", "Website për biznese shqiptare në diasporë.", "/diaspora", undefined, locale, { sqOnly: true });
  return buildMetadata(seo.title, seo.desc, `/diaspora/${country}`, undefined, locale, { sqOnly: true });
}

export const revalidate = 300;

export default async function DiasporaCountryRoute({ params }: Props) {
  const { country } = await Promise.resolve(params);
  if (!DIASPORA_COUNTRY_SLUGS.includes(country as CountrySlug)) notFound();

  const slug = country as CountrySlug;
  const content = diasporaContent[slug];
  if (!content) notFound();

  const url = `${seoConfig.siteUrl}/diaspora/${slug}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: SEO[slug].title,
    description: SEO[slug].desc,
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
    { name: "Ballina", url: seoConfig.siteUrl },
    { name: "Diasporë", url: `${seoConfig.siteUrl}/diaspora` },
    { name: content.countryLabel, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <DiasporaCountryPage content={content} />
    </>
  );
}
