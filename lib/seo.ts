import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

const siteUrl = "https://illyrianpixel.com";
const defaultTitle = "Illyrian Pixel";
const defaultDescription =
  "Agjenci dixhitale premium — Website, E-Commerce, SEO & Marketing për biznese shqiptare në Shqipëri, Kosovë dhe diasporë. Konsultim falas, plan brenda 24–48h.";

export const seo = {
  siteUrl,
  defaultTitle,
  defaultDescription,
  ogImage: `${siteUrl}/images/og-image.jpg`
};

// ── buildMetadata ─────────────────────────────────────────────────────────────
const TITLE_MAX = 70;

export const buildMetadata = (
  title?: string,
  description?: string,
  path = "",
  keywords?: string[],
  locale: Locale = "sq",
  opts?: { sqOnly?: boolean }
): Metadata => {
  const sqUrl = path ? `${siteUrl}${path}` : siteUrl;
  const enUrl = path ? `${siteUrl}/en${path}` : `${siteUrl}/en`;
  const sqOnly = opts?.sqOnly ?? false;
  const canonicalUrl = sqOnly || locale !== "en" ? sqUrl : enUrl;
  // Bing e raporton si gabim titullin mbi 70 shkronja (2026-10-24) — kur titulli me
  // " | Illyrian Pixel" kalon kufirin, prapashtesa hiqet; marka mbetet te og:site_name.
  const branded = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const fullTitle = title && branded.length > TITLE_MAX ? title : branded;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description: description ?? defaultDescription,
    ...(keywords?.length ? { keywords } : {}),
    ...(sqOnly && locale === "en" ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages: sqOnly
        ? { "sq": sqUrl, "sq-AL": sqUrl, "x-default": sqUrl }
        : { "sq": sqUrl, "sq-AL": sqUrl, "en": enUrl, "x-default": sqUrl }
    },
    openGraph: {
      title: fullTitle,
      description: description ?? defaultDescription,
      url: canonicalUrl,
      siteName: "Illyrian Pixel",
      images: [{
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: "Illyrian Pixel — Agjenci Dixhitale Premium për Biznese Shqiptare"
      }],
      locale: locale === "en" ? "en_US" : "sq_AL",
      // og:locale:alternate — Facebook/LinkedIn shohin që faqja ka edhe versionin në gjuhën tjetër
      ...(sqOnly ? {} : { alternateLocale: locale === "en" ? ["sq_AL"] : ["en_US"] }),
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      site: "@illyrianpixel",
      creator: "@illyrianpixel",
      title: fullTitle,
      description: description ?? defaultDescription,
      images: [{
        url: seo.ogImage,
        alt: "Illyrian Pixel — Agjenci Dixhitale Premium"
      }]
    }
  };
};

// ── Organization Schema ───────────────────────────────────────────────────────
// Vendet ku shërbejmë (2026-10-22) — një listë e vetme për Organization, LocalBusiness dhe Service.
// Më parë Service kishte vetëm 4 vende. Klientë realë: AL, XK, DE, IT, UK, SE, US; CH/CA nga faqet e diasporës.
const AREA_SERVED = ["Albania", "Kosovo", "Germany", "United Kingdom", "Switzerland", "Italy", "Sweden", "United States", "Canada"].map(
  (name) => ({ "@type": "Country", name })
);

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Illyrian Pixel",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    "@id": `${siteUrl}/#logo`,
    url: `${siteUrl}/images/illyrianpixel_logo.png`,
    contentUrl: `${siteUrl}/images/illyrianpixel_logo.png`,
    width: 200,
    height: 72,
    caption: "Illyrian Pixel"
  },
  image: `${siteUrl}/images/og-image.jpg`,
  email: "info@illyrianpixel.com",
  telephone: "+355694726827",
  description: defaultDescription,
  // Q-14 (2026-10-22): 2024 s'u konfirmua; pronari ka eksperiencë që nga 2020, agjencia doli live 2026 → pa foundingDate
  // foundingDate: "2024",
  legalName: "Illyrian Pixel",
  areaServed: [...AREA_SERVED, { "@type": "AdministrativeArea", name: "Europe" }],
  knowsAbout: [
    "Web Design", "E-Commerce", "SEO", "Digital Marketing",
    "Branding", "Social Media Marketing", "Google Ads"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+355694726827",
    contactType: "customer service",
    email: "info@illyrianpixel.com",
    availableLanguage: ["Albanian", "English", "German", "Croatian"],
    areaServed: ["AL", "XK", "DE", "GB", "CH", "IT", "SE", "US", "CA"]
  },
  sameAs: [
    "https://www.instagram.com/illyrianpixel/",
    "https://www.facebook.com/illyrianpixel",
    "https://www.linkedin.com/company/illyrianpixel/",
    "https://www.tiktok.com/@illyrianpixel"
  ]
  // aggregateRating/review u hoqën qëllimisht (2026-07-25): biznesi është i ri,
  // s'ka ende review reale në Google Business Profile. Google ndalon shprehimisht
  // review të rreme/vetë-krijuara në schema — rrezikon çaktivizim të rich
  // results ose "manual action". Shtoji këtu vetëm kur të ketë review reale nga GBP.
};

// ── Local Business Schema ─────────────────────────────────────────────────────
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${siteUrl}/#localbusiness`,
  name: "Illyrian Pixel",
  alternateName: "Illyrian Pixel Digital Agency",
  url: siteUrl,
  image: `${siteUrl}/images/og-image.jpg`,
  logo: `${siteUrl}/images/illyrianpixel_logo.png`,
  email: "info@illyrianpixel.com",
  telephone: "+355694726827",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tiranë Qendër",
    addressLocality: "Tiranë",
    addressRegion: "Tiranë",
    postalCode: "1001",
    addressCountry: "AL"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.3275,
    longitude: 19.8187
  },
  hasMap: "https://maps.google.com/?q=41.3275,19.8187",
  priceRange: "€€–€€€",
  currenciesAccepted: "EUR, ALL",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  // Q-14 (2026-10-22): orari s'u konfirmua (takimet janë online, edhe mbrëmje/fundjavë) → pa orar në schema
  // openingHoursSpecification: [
  //   {
  //     "@type": "OpeningHoursSpecification",
  //     dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  //     opens: "09:00",
  //     closes: "18:00"
  //   }
  // ],
  description:
    "Agjenci ueb dizajni premium dhe marketing strategjik për biznese shqiptare. Website profesionale, SEO, Google Ads, E-Commerce dhe Branding me rezultate të matshme.",
  areaServed: AREA_SERVED,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Shërbime Dixhitale Premium",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Premium",
          description: "Website profesionale me dizajn luksoz, SEO on-page dhe konvertim të optimizuar.",
          url: `${siteUrl}/services/website`,
          provider: { "@id": `${siteUrl}/#organization` }
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-Commerce",
          description: "Dyqane online me checkout të optimizuar, pagesa dhe analitikë shitjesh.",
          url: `${siteUrl}/services/ecommerce`,
          provider: { "@id": `${siteUrl}/#organization` }
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO & Google Ads",
          description: "Strategji SEO dhe fushata Google Ads me ROI të matshëm.",
          url: `${siteUrl}/services/seo-google-ads`,
          provider: { "@id": `${siteUrl}/#organization` }
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Social Media Marketing",
          description: "Menaxhim i plotë i rrjeteve sociale dhe content marketing.",
          url: `${siteUrl}/services/smm`,
          provider: { "@id": `${siteUrl}/#organization` }
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Branding & Identitet Vizual",
          description: "Logo, ngjyra dhe identitet vizual që ndërtojnë besim premium.",
          url: `${siteUrl}/services/branding-content`,
          provider: { "@id": `${siteUrl}/#organization` }
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Zhvillim Aplikacionesh Mobile",
          description: "Aplikacione mobile cross-platform për iOS dhe Android, nga ideja deri te App Store dhe Google Play.",
          url: `${siteUrl}/services/aplikacione-mobile`,
          provider: { "@id": `${siteUrl}/#organization` }
        }
      }
    ]
  }
  // aggregateRating u hoq qëllimisht (2026-07-25) — shih shënimin te organizationSchema.
};

// ── WebSite Schema ────────────────────────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Illyrian Pixel",
  alternateName: "Illyrian Pixel — Agjenci Dixhitale",
  url: siteUrl,
  description: defaultDescription,
  inLanguage: "sq-AL",
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/blog?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

// ── FAQ Schema (homepage) ─────────────────────────────────────────────────────
// 2026-10-20: ndërtohet nga e njëjta listë që shfaq <FAQ /> (admini → FAQ, ose fallback-u).
// Më parë ishte tekst fiks këtu dhe kishte dalë nga sinkronizimi (çmim "nga €800",
// "italisht", një pyetje që s'shfaqej) — Google kërkon që skema të përputhet me faqen.
export const buildFaqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a.replace(/\s*\n\s*/g, " ") }
  }))
});

// ── BreadcrumbList helper ─────────────────────────────────────────────────────
export const buildBreadcrumb = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

// ── ServicePage Schema helper ─────────────────────────────────────────────────
export const buildServiceSchema = (name: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${url}#service`,
  name,
  description,
  url,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: AREA_SERVED,
  serviceType: name,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "EUR",
    seller: { "@id": `${siteUrl}/#organization` }
  }
});

// JSON-LD për <script type="application/ld+json">. JSON.stringify s'e escape-on "<",
// kështu një titull me "</script>" (p.sh. nga një artikull blogu) do të mbyllte tag-un.
// Kujdes: "\\u003c" në burim = 6 shkronjat \u003c në output ("\u003c" do ishte vetë "<").
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
