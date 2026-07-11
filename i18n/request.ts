import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Locale is resolved from the `[locale]` route segment (requestLocale),
// never from headers()/cookies() — that's what keeps this compatible with
// static rendering. See plans/agile-toasting-planet.md for why this matters.
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
