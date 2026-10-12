"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";

const FLAG: Record<Locale, string> = {
  sq: "al",
  en: "gb",
};

// Physical-looking on/off switch: the knob carries the active flag and slides
// across the track; navigation starts once the slide has finished.
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("common.nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [visual, setVisual] = useState<Locale>(locale);

  useEffect(() => setVisual(locale), [locale]);

  const isEn = visual === "en";
  const next: Locale = locale === "sq" ? "en" : "sq";

  const toggle = () => {
    if (isPending) return;
    setVisual(next);
    window.setTimeout(() => {
      startTransition(() => router.replace(pathname, { locale: next }));
    }, 280);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={`${t("langSwitchAria")}: ${isEn ? t("langEn") : t("langAl")}`}
      onClick={toggle}
      className={`group relative h-9 w-[76px] shrink-0 touch-manipulation rounded-full border border-white/15 bg-gradient-to-b from-[#050505] to-[#1a1a1a] shadow-[inset_0_2px_5px_rgba(0,0,0,0.85),inset_0_-1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-300 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:h-10 sm:w-[84px] ${className}`}
    >
      {/* track labels */}
      <span
        aria-hidden
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 font-ui text-[10px] font-bold tracking-[0.5px] transition-opacity duration-300 sm:text-[11px] ${
          isEn ? "text-white/45 opacity-100" : "opacity-0"
        }`}
      >
        SQ
      </span>
      <span
        aria-hidden
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 font-ui text-[10px] font-bold tracking-[0.5px] transition-opacity duration-300 sm:text-[11px] ${
          isEn ? "opacity-0" : "text-white/45 opacity-100"
        }`}
      >
        EN
      </span>

      {/* knob */}
      <span
        aria-hidden
        className={`absolute left-[3px] top-[3px] h-[28px] w-[28px] overflow-hidden rounded-full ring-1 ring-white/25 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-[280ms] ease-[cubic-bezier(0.34,1.4,0.64,1)] group-active:scale-95 sm:h-[32px] sm:w-[32px] ${
          isEn ? "translate-x-[40px] sm:translate-x-[44px]" : "translate-x-0"
        }`}
      >
        <Image
          src={`/flags/4x3/${FLAG[visual]}.svg`}
          unoptimized
          width={32}
          height={32}
          alt=""
          className="h-full w-full scale-[1.35] object-cover"
        />
        {/* glossy highlight for a domed look */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/45 via-white/5 to-black/25" />
      </span>
    </button>
  );
}
