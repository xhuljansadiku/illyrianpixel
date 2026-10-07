import "@/styles/variables.css";
import "@/styles/globals.css";
import "@/styles/typography.css";
import "@/styles/components/buttons.css";
import "@/styles/components/navbar.css";
import "@/styles/components/cards.css";
import "@/styles/components/forms.css";
import "@/styles/components/modal.css";
import "@/styles/components/faq.css";
import "@/styles/components/footer.css";
import "@/styles/sections/hero.css";
import "@/styles/sections/page-hero.css";
import "@/styles/sections/services.css";
import "@/styles/sections/home.css";
import "@/styles/sections/work.css";
import "@/styles/sections/process.css";
import "@/styles/sections/about.css";
import "@/styles/sections/insights.css";
import "@/styles/sections/contact.css";
import "@/styles/sections/cta.css";
import "@/styles/motion.css";
import "@/styles/responsive.css";

import { NextIntlClientProvider } from "next-intl";
import { ProjectModalProvider } from "@/components/contact/ProjectModal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, type NavItem } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { getDictionary } from "@/content/dictionaries";
import { LOCALE_LABELS } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { localeParams, resolveLocale, type LocaleParams } from "@/lib/page";

export function generateStaticParams() {
  return localeParams();
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  const navItems: NavItem[] = [
    { href: "/services", label: dict.nav.items.services },
    { href: "/work", label: dict.nav.items.work },
    { href: "/about", label: dict.nav.items.about },
    { href: "/process", label: dict.nav.items.process },
    { href: "/insights", label: dict.nav.items.insights },
  ];

  return (
    <html lang={LOCALE_LABELS[locale].htmlLang} className={fontVariables}>
      <body>
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <NextIntlClientProvider locale={locale}>
          <ProjectModalProvider locale={locale} labels={dict.modal}>
            <SiteHeader
              items={navItems}
              labels={{
                nav: dict.nav.label,
                home: dict.nav.homeLabel,
                cta: dict.nav.cta,
                openMenu: dict.nav.openMenu,
                closeMenu: dict.nav.closeMenu,
                menu: dict.nav.menu,
                language: dict.nav.language,
              }}
            />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <SiteFooter locale={locale} dict={dict} />
          </ProjectModalProvider>
          <RevealObserver />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
