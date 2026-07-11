"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

// app/layout.tsx owns the single <html> tag for the whole app (admin, api,
// oferta/klienti/feedback included) and can't read the [locale] segment's
// params, so it hardcodes lang="sq". This corrects it client-side for the
// localized marketing tree once we know the real locale.
export default function HtmlLangSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
