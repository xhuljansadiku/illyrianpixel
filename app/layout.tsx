import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { localBusinessSchema, organizationSchema, websiteSchema, seo } from "@/lib/seo";
import SmoothScroll from "@/components/SmoothScroll";
import WebVitals from "@/components/WebVitals";
import PageViewTracker from "@/components/PageViewTracker";
// Defer non-critical layout components — do not block initial HTML paint
const InteractiveGlow       = dynamic(() => import("@/components/InteractiveGlow"),       { ssr: false });
const MagneticButtons       = dynamic(() => import("@/components/MagneticButtons"),       { ssr: false });
const GlobalReveals         = dynamic(() => import("@/components/GlobalReveals"),         { ssr: false });
const InquiryModal          = dynamic(() => import("@/components/InquiryModal"),          { ssr: false });
const CustomCursor          = dynamic(() => import("@/components/CustomCursor"),          { ssr: false });
const CursorTrail           = dynamic(() => import("@/components/CursorTrail"),           { ssr: false });
const BackToTop             = dynamic(() => import("@/components/BackToTop"),             { ssr: false });
const ScrollProgress        = dynamic(() => import("@/components/ScrollProgress"),        { ssr: false });
const PageTransitionOverlay = dynamic(() => import("@/components/PageTransitionOverlay"), { ssr: false });
const Preloader             = dynamic(() => import("@/components/Preloader"),             { ssr: false });
const ClientWidgets         = dynamic(() => import("@/components/ClientWidgets"),         { ssr: false });

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  applicationName: "Illyrian Pixel",
  title: {
    default: "Illyrian Pixel — Agjenci Dixhitale Premium",
    template: "%s | Illyrian Pixel"
  },
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
  other: {
    "geo.region":    "AL-11",
    "geo.placename": "Tiranë, Shqipëri",
    "geo.position":  "41.3275;19.8187",
    "ICBM":          "41.3275, 19.8187",
    "theme-color":   "#ab8339",
    "color-scheme":  "dark",
    "rating":        "general",
    "revisit-after": "7 days",
    "language":      "Albanian",
    "copyright":     "Illyrian Pixel 2024–2026",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ── Favicons ── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Theme color ── */}
        <meta name="theme-color" content="#07080c" />
        <meta name="msapplication-TileColor" content="#07080c" />
        <meta name="msapplication-navbutton-color" content="#ab8339" />

        {/* ── Geo ── */}
        <meta name="geo.region" content="AL-11" />
        <meta name="geo.placename" content="Tiranë, Shqipëri" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${display.variable} bg-bg font-body text-text antialiased`}
      >
        {/* Skip navigation — WCAG 2.1 AA, keyboard accessible */}
        <a href="#main-content" className="skip-nav" tabIndex={0}>
          Kalo te përmbajtja kryesore
        </a>


        {/* ── JSON-LD Schemas ── */}
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

        <WebVitals />
        <PageViewTracker />
        <Preloader />
        <SmoothScroll>
          <InteractiveGlow />
          <MagneticButtons />
          <GlobalReveals />
          <CustomCursor />
          <CursorTrail />
          <ScrollProgress />
          <PageTransitionOverlay />
          <BackToTop />
          <ClientWidgets />
          {children}
        </SmoothScroll>
        <InquiryModal />

        {/* ── Analytics (afterInteractive = non-blocking) ── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-82MBE7PY5B"
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-82MBE7PY5B', { anonymize_ip: true });
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
