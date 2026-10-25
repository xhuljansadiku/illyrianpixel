import { headers } from "next/headers";
import NextIntlClientProvider from "@/components/ClientIntlProvider";
import NotFoundScreen from "@/components/NotFoundScreen";
import RootDocument from "@/components/RootDocument";
import common from "@/messages/sq/common.json";
import commonEn from "@/messages/en/common.json";

// Titull neutral: e njëjta metadata vlen edhe për /en/... (faqet 404 s'indeksohen)
export const metadata = {
  title: "404 · Illyrian Pixel",
};

// URL-të që s'përputhen me asnjë rrugë (p.sh. /nope.png). notFound() brenda [locale]
// e kap app/[locale]/not-found.tsx.
// Jashtë segmentit [locale] s'ka mesazhe të ngarkuara — Navbar/Footer kanë nevojë për "common".
// app/layout.tsx s'ka <html>, prandaj 404-ja e sjell vetë me RootDocument.
// 2026-10-25: këtu bien edhe /en/... të panjohura (p.sh. /en/blog/slug-i-panjohur, nga
// dynamicParams = false) — më parë dilnin shqip. Middleware-i i next-intl e vendos gjuhën
// te header-i X-NEXT-INTL-LOCALE.
export default async function NotFound() {
  const locale = (await headers()).get("x-next-intl-locale") === "en" ? "en" : "sq";
  return (
    <RootDocument lang={locale}>
      <NextIntlClientProvider locale={locale} timeZone="Europe/Tirane" messages={{ common: locale === "en" ? commonEn : common }}>
        <NotFoundScreen />
      </NextIntlClientProvider>
    </RootDocument>
  );
}
