"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const FLAG: Record<Locale, string> = {
  sq: "al",
  en: "gb",
};

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("common.nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div
      className={`flex shrink-0 items-center gap-1 ${className}`}
      role="group"
      aria-label={t("langSwitchAria")}
    >
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={loc === locale ? "true" : undefined}
          aria-label={loc === "sq" ? t("langAl") : t("langEn")}
          className={`flex h-6 w-6 items-center justify-center overflow-hidden rounded-full transition-opacity duration-300 sm:h-7 sm:w-7 ${
            loc === locale
              ? "opacity-100 ring-1 ring-accent/70"
              : "opacity-45 hover:opacity-80"
          }`}
        >
          <Image
            src={`https://flagcdn.com/w40/${FLAG[loc]}.png`}
            width={20}
            height={20}
            alt=""
            className="h-full w-full object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
