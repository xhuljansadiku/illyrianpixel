import type { Metadata } from "next";
import { Cormorant_Garamond, Press_Start_2P, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { localBusinessSchema, organizationSchema, websiteSchema, seo } from "@/lib/seo";
import InquiryModal from "@/components/InquiryModal";
import SmoothScroll from "@/components/SmoothScroll";
import MagneticButtons from "@/components/MagneticButtons";
import GlobalReveals from "@/components/GlobalReveals";
import InteractiveGlow from "@/components/InteractiveGlow";

/** Primary sans: body, UI, nav, buttons, luxury boutique rhythm */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: "Illyrian Pixel, Agjenci Dixhitale Premium",
    template: "%s | Illyrian Pixel"
  },
  description: seo.defaultDescription,
  keywords: [
    "agjenci ueb dizajni luksoz",
    "landing page që konverton",
    "marketing strategjik për biznese",
    "website premium shqipëri",
    "agjensi dixhitale tiranë",
    "web design albania",
    "seo shqipëri",
    "branding luksoz"
  ],
  authors: [{ name: "Illyrian Pixel", url: seo.siteUrl }],
  creator: "Illyrian Pixel",
  publisher: "Illyrian Pixel",
  alternates: {
    canonical: seo.siteUrl,
    languages: {
      "sq": seo.siteUrl,
      "sq-AL": seo.siteUrl,
      "x-default": seo.siteUrl
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  },
  openGraph: {
    title: "Illyrian Pixel, Agjenci Dixhitale Premium",
    description: seo.defaultDescription,
    url: seo.siteUrl,
    siteName: "Illyrian Pixel",
    locale: "sq_AL",
    type: "website",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Illyrian Pixel, Agjenci Ueb Dizajni Luksoz" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Illyrian Pixel, Agjenci Dixhitale Premium",
    description: seo.defaultDescription,
    images: [seo.ogImage],
    creator: "@illyrianpixel"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${display.variable} ${pixel.variable} bg-bg font-body text-text antialiased`}
      >
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SmoothScroll>
          <InteractiveGlow />
          <MagneticButtons />
          <GlobalReveals />
          {children}
        </SmoothScroll>
        <InquiryModal />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-82MBE7PY5B"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-82MBE7PY5B');
          `}
        </Script>
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","wnyi2atnrw");
          `}
        </Script>
      </body>
    </html>
  );
}
