import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ContactPageClient from "@/components/ContactPageClient";
import type { Locale } from "@/i18n/routing";

const META: Record<Locale, { title: string; desc: string; keywords: string[] }> = {
  sq: {
    title: "Kontakt, Bisedë Falas, Plan Brenda 24h",
    desc: "Tregoni projektin tuaj. Brenda 24 orësh merrni një plan konkret pa asnjë obligim. Agjenci premium dixhitale në Tiranë, Illyrian Pixel.",
    keywords: ["kontakt agjenci dixhitale", "konsultim falas website", "ofertë website shqipëri", "plan marketing falas", "agjenci web tiranë"],
  },
  en: {
    title: "Contact, Free Consultation, Plan Within 24h",
    desc: "Tell us about your project. Within 24 hours you'll get a concrete plan with no obligation. Premium digital agency in Tirana, Illyrian Pixel.",
    keywords: ["digital agency contact", "free website consultation", "website quote albania", "free marketing plan", "web agency tirana"],
  },
};

type Props = { params: { locale: Locale } | Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale];
  return buildMetadata(m.title, m.desc, "/contact", m.keywords, locale);
}

export default function ContactPage() {
  return <ContactPageClient />;
}
