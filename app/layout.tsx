import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { localBusinessSchema, organizationSchema, seo } from "@/lib/seo";
import InquiryModal from "@/components/InquiryModal";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel"
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: "Illyrian Pixel",
    template: "%s | Illyrian Pixel"
  },
  description: seo.defaultDescription,
  openGraph: {
    title: "Illyrian Pixel",
    description: seo.defaultDescription,
    url: seo.siteUrl,
    siteName: "Illyrian Pixel",
    locale: "sq_AL",
    type: "website",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Illyrian Pixel" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Illyrian Pixel",
    description: seo.defaultDescription,
    images: [seo.ogImage]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body className={`${body.variable} ${display.variable} ${pixel.variable} bg-bg font-body text-text`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
        <InquiryModal />
      </body>
    </html>
  );
}
