import { company, realValue, socialLinks } from "@/content/company";
import type { FaqItem } from "@/content/types";
import { LOCALE_LABELS, routing, type Locale } from "@/i18n/routing";
import { SITE_NAME, localizedUrl, ogImageUrl, type Href } from "./seo";
import { SITE_URL, absoluteUrl } from "./site-url";

/**
 * schema.org builders. Only real data goes in here: placeholder company details
 * ("[EMAIL]" etc.) are left out automatically, and there are no ratings or
 * reviews until real ones exist.
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type Schema = Record<string, unknown>;

const AREA_SERVED = [
  { "@type": "Country", name: "Sweden" },
  { "@type": "Country", name: "Norway" },
  { "@type": "Country", name: "Denmark" },
  { "@type": "Country", name: "Finland" },
  { "@type": "Place", name: "Europe" },
];

export function organizationSchema(description: string): Schema {
  const legalName = realValue(company.legalName);
  const email = realValue(company.email);
  const telephone = realValue(company.phone);
  const sameAs = socialLinks().map((link) => link.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    ...(legalName && { legalName }),
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/brand/nordic-pixel-logo-512.png"),
    description,
    areaServed: AREA_SERVED,
    knowsAbout: [
      "Web design",
      "Web development",
      "E-commerce",
      "Search engine optimization",
      "Google Ads",
      "Branding",
      "Digital marketing",
    ],
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteSchema(locale: Locale): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: localizedUrl(locale, "/"),
    inLanguage: routing.locales.map((l) => LOCALE_LABELS[l].htmlLang),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function serviceSchema(options: {
  locale: Locale;
  href: Href;
  name: string;
  description: string;
  serviceType: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${localizedUrl(options.locale, options.href)}#service`,
    name: options.name,
    serviceType: options.serviceType,
    description: options.description,
    url: localizedUrl(options.locale, options.href),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: AREA_SERVED,
    inLanguage: LOCALE_LABELS[options.locale].htmlLang,
  };
}

export function breadcrumbSchema(locale: Locale, items: { name: string; href: Href }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.href),
    })),
  };
}

export function articleSchema(options: {
  locale: Locale;
  href: Href;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
}): Schema {
  const url = localizedUrl(options.locale, options.href);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: options.headline,
    description: options.description,
    inLanguage: LOCALE_LABELS[options.locale].htmlLang,
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    mainEntityOfPage: url,
    image: ogImageUrl(options.locale),
    author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function faqSchema(items: FaqItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Serializes JSON-LD for a <script> tag. "<" is escaped so that content such as
 * "</script>" inside a string can never close the tag.
 */
export function serializeJsonLd(data: Schema | Schema[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
