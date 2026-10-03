import NextIntlClientProvider from "@/components/ClientIntlProvider";
import NotFoundScreen from "@/components/NotFoundScreen";
import RootDocument from "@/components/RootDocument";
import common from "@/messages/sq/common.json";

export const metadata = {
  title: "404 — Faqja nuk u gjet",
  description: "Faqja që kërkuat nuk ekziston.",
};

// URL-të që s'përputhen me asnjë rrugë (p.sh. /nope.png). notFound() brenda [locale]
// e kap app/[locale]/not-found.tsx.
// Jashtë segmentit [locale] s'ka mesazhe të ngarkuara — Navbar/Footer kanë nevojë për "common".
// app/layout.tsx s'ka <html>, prandaj 404-ja e sjell vetë me RootDocument.
export default function NotFound() {
  return (
    <RootDocument lang="sq">
      <NextIntlClientProvider locale="sq" timeZone="Europe/Tirane" messages={{ common }}>
        <NotFoundScreen />
      </NextIntlClientProvider>
    </RootDocument>
  );
}
