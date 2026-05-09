import type { Metadata } from "next";

const siteUrl = "https://illyrianpixel.com";
const defaultTitle = "Illyrian Pixel";
const defaultDescription =
  "Agjenci dixhitale premium për biznese ambicioze. Website me konvertim të lartë, marketing strategjik dhe branding luksoz, për biznese shqiptare në Shqipëri, Gjermani dhe diasporë.";

export const seo = {
  siteUrl,
  defaultTitle,
  defaultDescription,
  ogImage: "/images/og-image.jpg"
};

export const buildMetadata = (title?: string, description?: string, path = ""): Metadata => ({
  metadataBase: new URL(siteUrl),
  title: title ? `${title} | ${defaultTitle}` : defaultTitle,
  description: description ?? defaultDescription,
  alternates: {
    canonical: path ? `${siteUrl}${path}` : siteUrl
  },
  openGraph: {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description ?? defaultDescription,
    url: path ? `${siteUrl}${path}` : siteUrl,
    siteName: defaultTitle,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Illyrian Pixel, Agjenci Dixhitale Premium" }],
    locale: "sq_AL",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description ?? defaultDescription,
    images: [seo.ogImage]
  }
});

// ── Organization Schema ───────────────────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Illyrian Pixel",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/images/illyrianpixel_logo.png`,
    width: 200,
    height: 72
  },
  email: "info@illyrianpixel.com",
  description: defaultDescription,
  foundingDate: "2024",
  areaServed: ["Albania", "Germany", "Kosovo", "Europe"],
  serviceType: [
    "Website Development",
    "E-Commerce",
    "Digital Marketing",
    "SEO",
    "Branding",
    "Social Media Marketing"
  ],
  sameAs: [
    "https://www.instagram.com/illyrianpixel/",
    "https://www.facebook.com/illyrianpixel",
    "https://www.linkedin.com/company/illyrianpixel/",
    "https://www.tiktok.com/@illyrianpixel"
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "24",
    bestRating: "5",
    worstRating: "1"
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Mariglent S." },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Na ndihmoi shumë mënyra si u organizua përmbajtja e faqes. Klientët e kuptojnë më shpejt çfarë bëjmë dhe bisedat që vijnë janë më konkrete.",
      datePublished: "2026-03-01"
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Bardhi U." },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Procesi ishte i qartë nga fillimi në fund. Prezantimi i paketave dhe mesazhi i brandit personal tani duken më profesionalë dhe më të besueshëm.",
      datePublished: "2026-03-15"
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Vehbi P." },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Që nga përditësimi i faqes, klientët na kontaktojnë me pritshmëri më të qarta. Projektet dhe vlerësimet e klientëve japin besim që në kontaktin e parë.",
      datePublished: "2026-04-01"
    }
  ]
};

// ── Local Business Schema ─────────────────────────────────────────────────────
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${siteUrl}/#localbusiness`,
  name: "Illyrian Pixel",
  url: siteUrl,
  image: `${siteUrl}/images/og-image.jpg`,
  email: "info@illyrianpixel.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tiranë",
    addressCountry: "AL"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "41.3275",
    longitude: "19.8187"
  },
  priceRange: "€€–€€€",
  currenciesAccepted: "EUR",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00"
  },
  description:
    "Agjenci ueb dizajni luksoz dhe marketing strategjik për biznese premium. Website profesionale me konvertim të lartë, landing page optimale dhe branding premium për biznese shqiptare.",
  areaServed: ["Albania", "Germany", "Kosovo", "United Kingdom", "Europe"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Shërbime Dixhitale Premium",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Premium",
          description:
            "Website profesionale me dizajn luksoz, SEO on-page dhe konvertim të optimizuar për bizneset shqiptare.",
          url: `${siteUrl}/services/website`
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-Commerce",
          description:
            "Dyqane online me checkout të optimizuar, pagesa Stripe/PayPal dhe analitikë shitjesh.",
          url: `${siteUrl}/services/ecommerce`
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Marketing & Rritje",
          description:
            "Strategji marketingu dixhital me ROI të matshëm: SEO, Google Ads, Meta Ads dhe faqe që konvertojnë.",
          url: `${siteUrl}/services/marketing-growth`
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Branding & Content",
          description:
            "Identitet vizual luksoz dhe strategji përmbajtjeje që vendos brandin tuaj si lider në industri.",
          url: `${siteUrl}/services/branding-content`
        }
      }
    ]
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "24",
    bestRating: "5"
  }
};

// ── WebSite Schema ────────────────────────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Illyrian Pixel",
  url: siteUrl,
  description: defaultDescription,
  inLanguage: "sq",
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/blog?q={search_term_string}` },
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
        text: "Mesatarisht 2–4 javë, varësisht kompleksitetit dhe sasisë së përmbajtjes. Projektet me funksione të avancuara mund të zgjasin deri në 6 javë. Në fazën e planifikimit ju japim një afat të saktë."
      }
    },
    {
      "@type": "Question",
      name: "A përfshihet SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Po, çdo website që ndërtojmë vjen me SEO bazë të instaluar: strukturë e saktë, faqe të shpejta dhe meta të optimizuara. SEO i avancuar dhe strategjia e përmbajtjes është shërbim i veçantë."
      }
    },
    {
      "@type": "Question",
      name: "A ofroni mirëmbajtje pas publikimit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Po, ofrojmë paketa mirëmbajtjeje mujore që përfshijnë përditësime, monitorim sigurie dhe ndryshime të vogla. Nuk ju lëmë vetëm pas lansimit."
      }
    },
    {
      "@type": "Question",
      name: "A punoni me klientë ndërkombëtarë?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Po, kemi klientë në Itali, Gjermani, Angli dhe SHBA. Komunikojmë në shqip, anglisht dhe italisht. Takimet bëhen online, procesi është i njëjtë për të gjithë."
      }
    },
    {
      "@type": "Question",
      name: "Si funksionon pagesa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pagesa ndahet në dy pjesë: 50% para fillimit të projektit dhe 50% pas aprovimit final para lansimit. Pranojmë transfertë bankare dhe metoda të tjera sipas marrëveshjes."
      }
    },
    {
      "@type": "Question",
      name: "Çfarë kam nevojë të përgatis para fillimit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mjafton të na tregoni çfarë bën biznesi juaj, kë synoni të arrini dhe çfarë nuk ju pëlqen tek prezenca juaj aktuale. Për pjesën tjetër kujdesemi ne: strukturën, tekstet dhe dizajnin."
      }
    }
  ]
};
