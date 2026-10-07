import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import MarketingChrome from "@/components/MarketingChrome";
import RootDocument from "@/components/RootDocument";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Vetëm "sq" dhe "en" — çdo segment tjetër (p.sh. /nope.png, që s'kalon nga
// middleware sepse ka pikë) kthen 404 direkt, në vend që të renderohet si
// locale e panjohur dhe të rrëzohet me 500 në runtime. Trashëgohet nga faqet
// fëmijë; blog/[slug] e mbishkruan sepse postimet nga admini s'janë në build.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enables static rendering for this locale — must run before any
  // getTranslations()/useTranslations() call in this tree.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <RootDocument lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <MarketingChrome>{children}</MarketingChrome>
      </NextIntlClientProvider>
    </RootDocument>
  );
}
