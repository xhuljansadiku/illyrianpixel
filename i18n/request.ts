import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Copy lives in typed dictionaries (content/), so next-intl only needs the
// locale here. The locale comes from the [locale] segment — never from
// headers() or cookies() — which keeps every page statically renderable.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    timeZone: "Europe/Stockholm",
    messages: {},
  };
});
