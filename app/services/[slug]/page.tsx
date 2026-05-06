import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, seo as seoConfig } from "@/lib/seo";
import { serviceCategoryBySlug } from "@/lib/serviceCategories";
import ServiceCategoryDetailPage from "@/components/ServiceCategoryDetailPage";

const SERVICE_SLUGS = [
  "website",
  "ecommerce",
  "marketing-growth",
  "branding-content",
  "smm",
  "mirembajtja",
] as const;

type RouteParams = { slug: string };
type Props = { params: RouteParams | Promise<RouteParams> };

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

const SEO: Record<(typeof SERVICE_SLUGS)[number], { title: string; desc: string }> = {
  website: {
    title: "Website Premium me Konvertim të Lartë — Tiranë & Diasporë",
    desc: "Ndërtojmë website luksoz me dizajn editorial, SEO on-page dhe arkitekturë konvertimi. Çdo faqe është strategji, jo vetëm estetikë. Konsultim falas · Plan 24h.",
  },
  ecommerce: {
    title: "E-Commerce & Dyqane Online me ROI të Matshëm — Shqipëri",
    desc: "Dyqane online me checkout të optimizuar, pagesa të integruara dhe analitikë shitjesh. Çdo element është projektuar për të rritur vlerën mesatare të porosisë. 0 kosto konsultimi.",
  },
  "marketing-growth": {
    title: "Marketing Strategjik për Biznese — SEO, Ads & Konvertim",
    desc: "Marketing strategjik me ROI të matshëm: SEO që ndërton autoritet, Google Ads të optimizuara dhe faqe landing që konvertojnë. Më shumë klientë, jo thjesht trafik.",
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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const seo = SEO[slug as (typeof SERVICE_SLUGS)[number]];
  if (!seo) return buildMetadata("Services", "Premium digital services for growth-focused businesses.");
  return buildMetadata(seo.title, seo.desc, `/services/${slug}`);
}

const SERVICE_LABELS: Record<(typeof SERVICE_SLUGS)[number], string> = {
  website: "Website Premium",
  ecommerce: "E-Commerce",
  "marketing-growth": "Marketing & Growth",
  "branding-content": "Branding & Content",
  smm: "Social Media",
  mirembajtja: "Mirëmbajtja",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  if (!SERVICE_SLUGS.includes(slug as (typeof SERVICE_SLUGS)[number])) notFound();
  const category = serviceCategoryBySlug(slug);
  if (!category) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seoConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: "Shërbimet", item: `${seoConfig.siteUrl}/sherbimet` },
      { "@type": "ListItem", position: 3, name: SERVICE_LABELS[slug as (typeof SERVICE_SLUGS)[number]], item: `${seoConfig.siteUrl}/services/${slug}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServiceCategoryDetailPage category={category} />
    </>
  );
}
