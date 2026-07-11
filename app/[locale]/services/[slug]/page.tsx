import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, buildServiceSchema, seo as seoConfig } from "@/lib/seo";
import { getServiceCategoryBySlug } from "@/lib/serviceCategories";
import { applyOverridesToCategory } from "@/lib/pricingOverrides";
import { getPricingOverrides } from "@/lib/publicContent";
import ServiceCategoryDetailPage from "@/components/ServiceCategoryDetailPage";
import type { Locale } from "@/i18n/routing";

const SERVICE_SLUGS = [
  "website",
  "ecommerce",
  "seo-google-ads",
  "branding-content",
  "smm",
  "mirembajtja",
] as const;

type RouteParams = { locale: Locale; slug: string };
type Props = { params: RouteParams | Promise<RouteParams> };

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

const SEO: Record<Locale, Record<(typeof SERVICE_SLUGS)[number], { title: string; desc: string }>> = {
  sq: {
    website: {
      title: "Website Premium me Konvertim të Lartë — Tiranë & Diasporë",
      desc: "Ndërtojmë website luksoz me dizajn editorial, SEO on-page dhe arkitekturë konvertimi. Çdo faqe është strategji, jo vetëm estetikë. Konsultim falas · Plan 24h.",
    },
    ecommerce: {
      title: "E-Commerce & Dyqane Online me ROI të Matshëm — Shqipëri",
      desc: "Dyqane online me checkout të optimizuar, pagesa të integruara dhe analitikë shitjesh. Çdo element është projektuar për të rritur vlerën mesatare të porosisë. 0 kosto konsultimi.",
    },
    "seo-google-ads": {
      title: "SEO & Google Ads për Biznese — Konvertim i Matshëm",
      desc: "SEO që ndërton autoritet dhe Google Ads të optimizuara, ndërtuar si sistem konvertimi. Më shumë klientë, jo thjesht trafik.",
    },
    "branding-content": {
      title: "Branding Identitar Luksoz — Pozicionim & Identitet Premium",
      desc: "Branding që vendos çmimin tuaj. Identitet vizual, strategji mesazhi dhe pozicionim premium që tërheq klientët e duhur dhe justifikon çmimet e larta.",
    },
    smm: {
      title: "Social Media Marketing Premium — Instagram, Facebook, TikTok",
      desc: "Menaxhim i plotë strategjik i rrjeteve sociale: content editorial, dizajn premium, posting i optimizuar dhe angazhim real. Ndërtojmë komunitet, jo vetëm followerë.",
    },
    mirembajtja: {
      title: "Mirëmbajtje Website & E-Commerce — Monitorim 24/7 & Siguri",
      desc: "Mirëmbajtje profesionale e faqes suaj: monitorim 24/7, backup ditor, siguri aktive dhe optimizim i vazhdueshëm. Faqja juaj gjithmonë online dhe e shpejtë.",
    },
  },
  en: {
    website: {
      title: "Premium High-Conversion Website — Tirana & Diaspora",
      desc: "We build luxury websites with editorial design, on-page SEO and conversion architecture. Every page is strategy, not just aesthetics. Free consultation · 24h plan.",
    },
    ecommerce: {
      title: "E-Commerce & Online Stores with Measurable ROI — Albania",
      desc: "Online stores with optimized checkout, integrated payments and sales analytics. Every element is designed to increase average order value. Free consultation.",
    },
    "seo-google-ads": {
      title: "SEO & Google Ads for Businesses — Measurable Conversion",
      desc: "SEO that builds authority and optimized Google Ads, built as a conversion system. More clients, not just traffic.",
    },
    "branding-content": {
      title: "Luxury Brand Identity — Premium Positioning & Identity",
      desc: "Branding that sets your price. Visual identity, message strategy and premium positioning that attracts the right clients and justifies higher prices.",
    },
    smm: {
      title: "Premium Social Media Marketing — Instagram, Facebook, TikTok",
      desc: "Complete strategic social media management: editorial content, premium design, optimized posting and real engagement. We build community, not just followers.",
    },
    mirembajtja: {
      title: "Website & E-Commerce Maintenance — 24/7 Monitoring & Security",
      desc: "Professional maintenance for your site: 24/7 monitoring, daily backup, active security and continuous optimization. Your site always online and fast.",
    },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await Promise.resolve(params);
  const seo = SEO[locale]?.[slug as (typeof SERVICE_SLUGS)[number]];
  if (!seo) return buildMetadata("Services", "Premium digital services for growth-focused businesses.", "", undefined, locale);
  return buildMetadata(seo.title, seo.desc, `/services/${slug}`, undefined, locale);
}

const SERVICE_LABELS: Record<Locale, Record<(typeof SERVICE_SLUGS)[number], string>> = {
  sq: {
    website: "Website Premium",
    ecommerce: "E-Commerce",
    "seo-google-ads": "SEO & Google Ads",
    "branding-content": "Branding & Content",
    smm: "Social Media",
    mirembajtja: "Mirëmbajtja",
  },
  en: {
    website: "Premium Website",
    ecommerce: "E-Commerce",
    "seo-google-ads": "SEO & Google Ads",
    "branding-content": "Branding & Content",
    smm: "Social Media",
    mirembajtja: "Maintenance",
  },
};

export const revalidate = 300;

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await Promise.resolve(params);
  if (!SERVICE_SLUGS.includes(slug as (typeof SERVICE_SLUGS)[number])) notFound();
  const baseCategory = getServiceCategoryBySlug(locale, slug);
  if (!baseCategory) notFound();
  const overrides = await getPricingOverrides().catch(() => ({}));
  const category = applyOverridesToCategory(baseCategory, overrides);

  const serviceSchema = buildServiceSchema(
    SERVICE_LABELS[locale][slug as (typeof SERVICE_SLUGS)[number]],
    SEO[locale]?.[slug as (typeof SERVICE_SLUGS)[number]]?.desc ?? "",
    `${seoConfig.siteUrl}/services/${slug}`
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seoConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: locale === "en" ? "Services" : "Shërbimet", item: `${seoConfig.siteUrl}/sherbimet` },
      { "@type": "ListItem", position: 3, name: SERVICE_LABELS[locale][slug as (typeof SERVICE_SLUGS)[number]], item: `${seoConfig.siteUrl}/services/${slug}` }
    ]
  };

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
      <ServiceCategoryDetailPage category={category} />
    </>
  );
}
