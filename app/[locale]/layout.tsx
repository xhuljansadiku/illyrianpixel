import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import HtmlLangSync from "@/components/HtmlLangSync";
import MarketingChrome from "@/components/MarketingChrome";

type Props = {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enables static rendering for this locale — must run before any
  // getTranslations()/useTranslations() call in this tree.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSync />
      <MarketingChrome>{children}</MarketingChrome>
    </NextIntlClientProvider>
  );
}
