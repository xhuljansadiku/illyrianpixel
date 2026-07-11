import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sq", "en"],
  defaultLocale: "sq",
  localePrefix: "as-needed",
  // The language switcher is the only way to reach /en — browser
  // Accept-Language auto-redirects would bounce existing sq traffic/links.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
