import RootDocument from "@/components/RootDocument";
import RootNotFound from "@/components/RootNotFound";

// Titull neutral: e njëjta metadata vlen edhe për /en/... (faqet 404 s'indeksohen)
export const metadata = {
  title: "404 · Illyrian Pixel",
};

// URL-të që s'përputhen me asnjë rrugë (p.sh. /nope.png). notFound() brenda [locale]
// e kap app/[locale]/not-found.tsx.
// app/layout.tsx s'ka <html>, prandaj 404-ja e sjell vetë me RootDocument.
// KUJDES: asnjë API dinamike këtu (headers(), cookies(), getLocale()): not-found renderohet
// në pemën e çdo faqeje, dhe një e tillë i bën dinamike të gjitha (ndodhi më 2026-10-25).
// Gjuhën (sq/en) e zgjedh RootNotFound në klient nga URL-ja.
export default function NotFound() {
  return (
    <RootDocument lang="sq">
      <RootNotFound />
    </RootDocument>
  );
}
