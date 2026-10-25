"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Komponent klient me useLocale(), jo getLocale() në server: not-found renderohet
// në pemën e ÇDO faqeje, dhe getLocale() mund të bjerë te headers() → faqet dinamike.
const COPY = {
  sq: {
    label: "GABIM 404",
    title: "Faqja nuk u gjet",
    body: "URL-ja që kërkuat nuk ekziston ose është zhvendosur. Kthehuni në faqen kryesore dhe vazhdoni eksplorimin.",
    back: "← Kthehu në faqen kryesore",
  },
  en: {
    label: "ERROR 404",
    title: "Page not found",
    body: "The URL you requested doesn't exist or has been moved. Head back to the homepage and keep exploring.",
    back: "← Back to home",
  },
};

export default function NotFoundScreen() {
  const locale = useLocale();
  const t = locale === "en" ? COPY.en : COPY.sq;

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
        <p className="font-pixel text-xs tracking-widest text-accent mb-6">{t.label}</p>

        <h1
          className="font-display text-[clamp(6rem,20vw,14rem)] leading-none text-text/10 select-none"
          aria-hidden="true"
        >
          404
        </h1>

        <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-text mt-4 mb-4">
          {t.title}
        </h2>

        <p className="text-muted text-sm max-w-md mb-10 leading-relaxed">
          {t.body}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-accent/40 text-accent px-8 py-3 text-sm tracking-widest uppercase hover:bg-accent/10 transition-colors duration-300"
        >
          {t.back}
        </Link>
      </main>
      <Footer />
    </>
  );
}
