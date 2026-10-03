"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OPEN_COOKIE_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

const NONE: ConsentChoice = { analytics: false, marketing: false };
const ALL: ConsentChoice = { analytics: true, marketing: true };

function Switch({ checked, label, disabled, onChange }: { checked: boolean; label: string; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition duration-200 disabled:cursor-not-allowed disabled:opacity-55 ${
        checked ? "border-accent/60 bg-accent/70" : "border-white/15 bg-white/[0.06]"
      }`}
    >
      <span className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-all duration-200 ${checked ? "left-[21px]" : "left-[2px]"}`} />
    </button>
  );
}

export default function CookieConsent() {
  const t = useTranslations("common.cookieConsent");
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(NONE);

  useEffect(() => {
    // "Cilësimet e cookies" në footer hap direkt pamjen me kategoritë, me zgjedhjen aktuale —
    // tërheqja e pëlqimit duhet të jetë po aq e lehtë sa dhënia (GDPR, Neni 7(3)).
    const openSettings = () => {
      setChoice(readConsent() ?? NONE);
      setDetails(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    const timer = readConsent() === null ? window.setTimeout(() => setVisible(true), 1200) : undefined;
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
      window.clearTimeout(timer);
    };
  }, []);

  const save = (next: ConsentChoice) => {
    saveConsent(next);
    setVisible(false);
    setDetails(false);
  };

  if (!visible) return null;

  const categories: { key: keyof ConsentChoice | "necessary"; title: string; desc: string }[] = [
    { key: "necessary", title: t("necessaryTitle"), desc: t("necessaryDesc") },
    { key: "analytics", title: t("analyticsTitle"), desc: t("analyticsDesc") },
    { key: "marketing", title: t("marketingTitle"), desc: t("marketingDesc") },
  ];

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      // Nën md lë vend djathtas për butonin e King Genti (z-[111], 48px në right-4),
      // që të mos mbulojë butonat e banner-it — pa ia ulur z-index-in (shih 45557c6).
      className="fixed bottom-3 left-3 right-[4.5rem] z-[110] max-h-[85dvh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e0e]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md md:bottom-6 md:left-1/2 md:right-auto md:w-[calc(100%-2rem)] md:max-w-lg md:-translate-x-1/2 md:p-6"
    >
      <p className="font-display text-[1.05rem] font-semibold leading-snug text-white">
        {t("title")}
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
        {t("body")}{" "}
        <Link href="/privacy" className="text-accent/80 underline underline-offset-2 hover:text-accent">{t("privacyLink")}</Link>.
      </p>

      {details ? (
        <ul className="mt-4 space-y-3">
          {categories.map(({ key, title, desc }) => (
            <li key={key} className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-white/85">{title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-white/55">{desc}</p>
              </div>
              {key === "necessary" ? (
                <Switch checked disabled label={title} />
              ) : (
                <Switch checked={choice[key]} label={title} onChange={(v) => setChoice((c) => ({ ...c, [key]: v }))} />
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="my-4 h-px bg-white/[0.06]" />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => save(ALL)}
          className="interactive-button ip-cta-primary flex-1 justify-center text-[12px] sm:flex-none"
        >
          {t("acceptAll")}
        </button>
        {details ? (
          <button
            type="button"
            onClick={() => save(choice)}
            className="flex-1 justify-center rounded-full border border-white/14 px-5 py-2.5 text-[12px] tracking-[0.1em] text-white/70 transition duration-200 hover:border-white/28 hover:text-white sm:flex-none"
          >
            {t("save")}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => save(NONE)}
              className="flex-1 justify-center rounded-full border border-white/14 px-5 py-2.5 text-[12px] tracking-[0.1em] text-white/55 transition duration-200 hover:border-white/28 hover:text-white/80 sm:flex-none"
            >
              {t("essentialOnly")}
            </button>
            <button
              type="button"
              onClick={() => {
                setChoice(readConsent() ?? NONE);
                setDetails(true);
              }}
              className="w-full px-2 py-1.5 text-center text-[12px] tracking-[0.06em] text-white/55 underline underline-offset-2 transition hover:text-white/75 sm:w-auto"
            >
              {t("customize")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
