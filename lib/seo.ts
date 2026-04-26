import type { Metadata } from "next";

const siteUrl = "https://illyrianpixel.com";
const defaultTitle = "Illyrian Pixel";
const defaultDescription =
  "Illyrian Pixel ndërton website, e-commerce dhe sisteme marketingu premium për biznese në Shqipëri, Gjermani dhe tregje ndërkombëtare.";

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
    url: siteUrl,
    siteName: defaultTitle,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: defaultTitle }],
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

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Illyrian Pixel",
  url: siteUrl,
  logo: `${siteUrl}/images/illyrian-pixel-logo.png`,
  email: "hello@illyrianpixel.com",
  areaServed: ["Albania", "Germany", "Europe"],
  serviceType: ["Website", "E-commerce", "Marketing", "SEO", "Branding", "Maintenance"]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Illyrian Pixel",
  url: siteUrl,
  image: `${siteUrl}/images/illyrian-pixel-logo.png`,
  email: "hello@illyrianpixel.com",
  areaServed: ["Albania", "Europe"],
  priceRange: "$$",
  description: defaultDescription
};
