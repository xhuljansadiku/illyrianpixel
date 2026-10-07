"use client";

import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("langSwitchAria")}
        className={`flex h-9 items-center gap-1.5 rounded-full border bg-white/[0.03] py-1 pl-1 pr-2 text-white/85 transition-colors duration-300 hover:border-accent/55 hover:bg-white/[0.06] hover:text-accentLight sm:h-10 sm:pr-2.5 ${
          open ? "border-accent/55 bg-white/[0.06]" : "border-white/18"
        }`}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Image
            src={`https://flagcdn.com/w40/${FLAG[locale]}.png`}
            width={20}
            height={20}
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
        <span className="font-ui text-[10px] font-bold tracking-[0.5px] sm:text-[11px]">
          {locale.toUpperCase()}
        </span>
        <svg
          viewBox="0 0 12 8"
          className={`h-2 w-2.5 shrink-0 fill-none stroke-current stroke-[1.6] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("langSwitchAria")}
          className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[136px] overflow-hidden rounded-xl border border-white/10 bg-[#0e0e0e]/97 py-1 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {routing.locales.map((loc) => {
            const isActive = loc === locale;
            return (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                role="option"
                aria-selected={isActive}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 font-body text-[13px] transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={`https://flagcdn.com/w40/${FLAG[loc]}.png`}
                    width={20}
                    height={20}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="flex-1">{loc === "sq" ? t("langAl") : t("langEn")}</span>
                {isActive && (
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 shrink-0 fill-none stroke-accent stroke-[1.8]"
                    aria-hidden
                  >
                    <path d="M3 8.5L6.2 12L13 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
