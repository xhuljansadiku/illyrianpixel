import { localBusinessSchema, organizationSchema, websiteSchema, jsonLd } from "@/lib/seo";
import { bodyClassName } from "@/lib/fonts";
import WebVitals from "@/components/WebVitals";
import PageViewTracker from "@/components/PageViewTracker";
import Analytics from "@/components/Analytics";

// <html>/<body> e përbashkët. app/layout.tsx s'mund ta lexojë segmentin [locale],
// prandaj çdo layout i nivelit të parë ([locale], admin, oferta, klienti, feedback,
// not-found) e renderon vetë këtë me gjuhën e duhur — kështu /en del me
// <html lang="en"> që në HTML-në statike, jo vetëm pas hydration.
export default function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      {/* App Router: <head> brenda layout-it është i saktë; rregulli njeh vetëm skedarët te app/ */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ── Favicons — favicon.ico, icon.png dhe apple-icon.png i shton Next nga app/ ── */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* theme-color / color-scheme vijnë nga `viewport` në app/layout.tsx */}
        <meta name="msapplication-TileColor" content="#07080c" />
        <meta name="msapplication-navbutton-color" content="#ab8339" />

        {/* ── Geo ── */}
        <meta name="geo.region" content="AL-11" />
        <meta name="geo.placename" content="Tiranë, Shqipëri" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
      </head>
      <body suppressHydrationWarning className={bodyClassName}>
        {/* Skip navigation — WCAG 2.1 AA, keyboard accessible */}
        <a href="#main-content" className="skip-nav" tabIndex={0}>
          {lang === "en" ? "Skip to main content" : "Kalo te përmbajtja kryesore"}
        </a>

        {/* ── JSON-LD Schemas ── */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
        />

        <WebVitals />
        <PageViewTracker />
        {children}

        {/* ── Analytics: GA me Consent Mode v2, Clarity vetëm pas pëlqimit (lib/consent.ts) ── */}
        <Analytics />
      </body>
    </html>
  );
}
