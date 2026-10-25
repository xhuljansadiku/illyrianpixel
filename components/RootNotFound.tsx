"use client";

import { useEffect, useState } from "react";
import NextIntlClientProvider from "@/components/ClientIntlProvider";
import NotFoundScreen from "@/components/NotFoundScreen";
import common from "@/messages/sq/common.json";
import commonEn from "@/messages/en/common.json";

// 404 e app/not-found.tsx (URL të panjohura, edhe /en/... nga dynamicParams = false).
// HTML-ja statike e kësaj 404-e është e njëjtë për çdo URL, ndaj gjuha zgjidhet në klient
// pas montimit (pa mospërputhje hidratimi). headers() në app/not-found.tsx i bënte dinamike
// TË GJITHA faqet, sepse not-found renderohet në pemën e secilës (2026-10-25).
export default function RootNotFound() {
  const [locale, setLocale] = useState<"sq" | "en">("sq");
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/en" || path.startsWith("/en/")) {
      setLocale("en");
      document.documentElement.lang = "en";
    }
  }, []);
  return (
    <NextIntlClientProvider locale={locale} timeZone="Europe/Tirane" messages={{ common: locale === "en" ? commonEn : common }}>
      <NotFoundScreen />
    </NextIntlClientProvider>
  );
}
