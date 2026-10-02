"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OPEN_COOKIE_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";

export default function CookieConsent() {
  const t = useTranslations("common.cookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const open = () => setVisible(true);
    // "Cilësimet e cookies" në footer e rihap banner-in — tërheqja e pëlqimit duhet
    // të jetë po aq e lehtë sa dhënia (GDPR, Neni 7(3)).
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    const timer = readConsent() === null ? window.setTimeout(open, 1200) : undefined;
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
      window.clearTimeout(timer);
    };
  }, []);

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      // Nën md lë vend djathtas për butonin e King Genti (z-[111], 48px në right-4),
      // që të mos mbulojë butonat e banner-it — pa ia ulur z-index-in (shih 45557c6).
      className="fixed bottom-3 left-3 right-[4.5rem] z-[110] rounded-2xl border border-white/10 bg-[#0e0e0e]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md md:bottom-6 md:left-1/2 md:right-auto md:w-[calc(100%-2rem)] md:max-w-lg md:-translate-x-1/2 md:p-6"
    >
      <div className="flex items-start gap-3.5">
        <div className="min-w-0">
          <p className="font-display text-[1.05rem] font-semibold leading-snug text-white">
            {t("title")}
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
            {t("body")}{" "}
            <Link href="/privacy" className="text-accent/80 underline underline-offset-2 hover:text-accent">{t("privacyLink")}</Link>.
          </p>
        </div>
      </div>
      <div className="my-4 h-px bg-white/[0.06]" />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => choose(true)}
          className="interactive-button ip-cta-primary flex-1 justify-center text-[12px] sm:flex-none"
        >
          {t("acceptAll")}
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 justify-center rounded-full border border-white/14 px-5 py-2.5 text-[12px] tracking-[0.1em] text-white/55 transition duration-200 hover:border-white/28 hover:text-white/80 sm:flex-none"
        >
          {t("essentialOnly")}
        </button>
      </div>
    </div>
  );
}
