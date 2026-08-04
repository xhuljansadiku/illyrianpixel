import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

const siteUrl = "https://illyrianpixel.com";
const defaultTitle = "Illyrian Pixel";
const defaultDescription =
  "Agjenci dixhitale premium — Website, E-Commerce, SEO & Marketing për biznese shqiptare në Shqipëri, Kosovë dhe diasporë. Konsultim falas, plan brenda 24h.";

export const seo = {
  siteUrl,
  defaultTitle,
  defaultDescription,
  ogImage: `${siteUrl}/images/og-image.jpg`
};

// ── buildMetadata ─────────────────────────────────────────────────────────────
export const buildMetadata = (
  title?: string,
  description?: string,
  path = "",
  keywords?: string[],
  locale: Locale = "sq"
): Metadata => {
  const sqUrl = path ? `${siteUrl}${path}` : siteUrl;
  const enUrl = path ? `${siteUrl}/en${path}` : `${siteUrl}/en`;
  const canonicalUrl = locale === "en" ? enUrl : sqUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description ?? defaultDescription,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "sq": sqUrl,
        "sq-AL": sqUrl,
        "en": enUrl,
        "x-default": sqUrl,
      }
    },
    openGraph: {
      title: title ? `${title} | ${defaultTitle}` : defaultTitle,
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
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      site: "@illyrianpixel",
      creator: "@illyrianpixel",
      title: title ? `${title} | ${defaultTitle}` : defaultTitle,
      description: description ?? defaultDescription,
      images: [{
        url: seo.ogImage,
        alt: "Illyrian Pixel — Agjenci Dixhitale Premium"
      }]
    }
  };
};

// ── Organization Schema ───────────────────────────────────────────────────────
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
  foundingDate: "2024",
  legalName: "Illyrian Pixel",
  areaServed: [
    { "@type": "Country", name: "Albania" },
    { "@type": "Country", name: "Kosovo" },
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "AdministrativeArea", name: "Europe" }
  ],
  knowsAbout: [
    "Web Design", "E-Commerce", "SEO", "Digital Marketing",
    "Branding", "Social Media Marketing", "Google Ads"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+355694726827",
    contactType: "customer service",
    email: "info@illyrianpixel.com",
    availableLanguage: ["Albanian", "English", "Italian"],
    areaServed: ["AL", "XK", "DE", "GB"],
    contactOption: "TollFree"
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    }
  ],
  description:
    "Agjenci ueb dizajni premium dhe marketing strategjik për biznese shqiptare. Website profesionale, SEO, Google Ads, E-Commerce dhe Branding me rezultate të matshme.",
  areaServed: [
    { "@type": "Country", name: "Albania" },
    { "@type": "Country", name: "Kosovo" },
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "United Kingdom" }
  ],
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
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Sa zgjat ndërtimi i një website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mesatarisht 2–4 javë, varësisht kompleksitetit. Projektet me funksione të avancuara mund të zgjasin deri në 6 javë. Në fazën e planifikimit ju japim afat të saktë."
      }
    },
    {
      "@type": "Question",
      name: "A përfshihet SEO në çmim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Po, çdo website vjen me SEO bazë: strukturë e saktë, faqe të shpejta dhe meta të optimizuara. SEO i avancuar dhe strategjia e përmbajtjes është shërbim i veçantë."
      }
    },
    {
      "@type": "Question",
      name: "A ofroni mirëmbajtje pas publikimit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Po, ofrojmë paketa mirëmbajtjeje mujore: përditësime, monitorim sigurie dhe ndryshime të vogla. Nuk ju lëmë vetëm pas lansimit."
      }
    },
    {
      "@type": "Question",
      name: "A punoni me klientë ndërkombëtarë?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Po, kemi klientë në Gjermani, Angli, Itali dhe SHBA. Komunikojmë në shqip, anglisht dhe italisht. Takimet bëhen online."
      }
    },
    {
      "@type": "Question",
      name: "Si funksionon pagesa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "50% para fillimit dhe 50% pas aprovimit final para lansimit. Pranojmë transfertë bankare dhe metoda të tjera sipas marrëveshjes."
      }
    },
    {
      "@type": "Question",
      name: "Çfarë duhet të përgatisim para fillimit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mjafton të na tregoni çfarë bën biznesi, kë synoni dhe çfarë nuk ju pëlqen në prezencën aktuale. Strukturën, tekstet dhe dizajnin i kujdesemi ne."
      }
    },
    {
      "@type": "Question",
      name: "Sa kushton një website profesional?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Çmimi fillon nga €800 për faqe prezantuese dhe varion sipas kompleksitetit. E-commerce dhe projekte të plota marketing fillojnë nga €1,500. Konsultim falas pa asnjë obligim."
      }
    }
  ]
};

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
  areaServed: ["Albania", "Kosovo", "Germany", "Europe"],
  serviceType: name,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "EUR",
    seller: { "@id": `${siteUrl}/#organization` }
  }
});
