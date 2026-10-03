import type { Metadata, Viewport } from "next";
import "./globals.css";
import { seo } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#07080c",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  applicationName: "Illyrian Pixel",
  // No template here — every page already appends "| Illyrian Pixel" via
  // buildMetadata()/its own title, a template would double it up.
  title: "Illyrian Pixel — Agjenci Dixhitale Premium",
  description: seo.defaultDescription,
  keywords: [
    "agjenci dixhitale shqipëri",
    "web design albania",
    "website premium tiranë",
    "seo shqipëri",
    "marketing online biznese",
    "e-commerce shqipëri",
    "branding luksoz",
    "google ads albania",
    "agjenci ueb dizajni",
    "illyrian pixel"
  ],
  authors: [{ name: "Illyrian Pixel", url: seo.siteUrl }],
  creator: "Illyrian Pixel",
  publisher: "Illyrian Pixel",
  category: "Agjenci Dixhitale",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: seo.siteUrl,
    languages: {
      "sq":      seo.siteUrl,
      "sq-AL":   seo.siteUrl,
      "x-default": seo.siteUrl
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    }
  },
  openGraph: {
    title: "Illyrian Pixel — Agjenci Dixhitale Premium",
    description: seo.defaultDescription,
    url: seo.siteUrl,
    siteName: "Illyrian Pixel",
    locale: "sq_AL",
    type: "website",
    images: [{
      url: seo.ogImage,
      width: 1200,
      height: 630,
      alt: "Illyrian Pixel — Agjenci Dixhitale Premium për Biznese Shqiptare"
    }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@illyrianpixel",
    creator: "@illyrianpixel",
    title: "Illyrian Pixel — Agjenci Dixhitale Premium",
    description: seo.defaultDescription,
    images: [{
      url: seo.ogImage,
      alt: "Illyrian Pixel — Agjenci Dixhitale Premium"
    }]
  },
  // theme-color / color-scheme → `viewport` lart; geo.* → <head> te RootDocument.
  // "language" u hoq: do të thoshte "Albanian" edhe për faqet /en.
  other: {
    "rating":        "general",
    "revisit-after": "7 days",
    "copyright":     "Illyrian Pixel 2024–2026",
  }
};

// <html>/<body> s'janë këtu: ky layout s'e njeh gjuhën e faqes. I renderon
// components/RootDocument nga çdo layout i nivelit të parë ([locale], admin, …)
// dhe app/not-found.tsx. Ky skedar mbetet vetëm për metadata, viewport dhe CSS.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
