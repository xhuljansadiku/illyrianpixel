import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sq", "en"],
  defaultLocale: "sq",
  localePrefix: "as-needed",
  // The language switcher is the only way to reach /en — browser
  // Accept-Language auto-redirects would bounce existing sq traffic/links.
  localeDetection: false,
  // Me localeDetection: false cookie-t NEXT_LOCALE s'i lexon askush, por middleware
  // e vendoste në çdo përgjigje HTML — një Set-Cookie i panevojshëm që pengon
  // cache-in në CDN dhe vendoset para pëlqimit për cookies.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
