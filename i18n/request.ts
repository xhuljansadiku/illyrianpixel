import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

const NAMESPACES = ["common", "home", "services", "pricing", "contact", "projects", "legal", "blog"] as const;

async function loadMessages(locale: Locale) {
  const namespaces = await Promise.all(NAMESPACES.map((ns) => import(`../messages/${locale}/${ns}.json`)));

  const messages: Record<string, unknown> = {};
  NAMESPACES.forEach((ns, i) => {
    messages[ns] = namespaces[i].default;
  });

  return messages;
}

// Locale is resolved from the `[locale]` route segment (requestLocale),
// never from headers()/cookies() — that's what keeps this compatible with
// static rendering. See plans/agile-toasting-planet.md for why this matters.
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale as Locale),
  };
});
