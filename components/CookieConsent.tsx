"use client";

import { useEffect, useRef, useState } from "react";
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

// "gate": render-i i serverit + i pari në klient — markup-i ekziston, por shfaqet vetëm
// nëse consentGateScript() e shënoi <html> (s'ka pëlqim). Pas mount-it: "open" ose "closed".
type Phase = "gate" | "open" | "closed";

export default function CookieConsent() {
  const t = useTranslations("common.cookieConsent");
  const [phase, setPhase] = useState<Phase>("gate");
  const [details, setDetails] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(NONE);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // "Cilësimet e cookies" në footer hap direkt pamjen me kategoritë, me zgjedhjen aktuale —
    // tërheqja e pëlqimit duhet të jetë po aq e lehtë sa dhënia (GDPR, Neni 7(3)).
    const openSettings = () => {
      setChoice(readConsent() ?? NONE);
      setDetails(true);
      setPhase("open");
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    setPhase(readConsent() === null ? "open" : "closed");
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (phase === "closed") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.focus());

    const keepFocusInDialog = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      if (activeElement === dialogRef.current || !dialogRef.current?.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", keepFocusInDialog);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keepFocusInDialog);
    };
  }, [phase]);

  const save = (next: ConsentChoice) => {
    saveConsent(next);
    setPhase("closed");
    setDetails(false);
  };

  if (phase === "closed") return null;

  const categories: { key: keyof ConsentChoice | "necessary"; title: string; desc: string }[] = [
    { key: "necessary", title: t("necessaryTitle"), desc: t("necessaryDesc") },
    { key: "analytics", title: t("analyticsTitle"), desc: t("analyticsDesc") },
    { key: "marketing", title: t("marketingTitle"), desc: t("marketingDesc") },
  ];

  return (
    <div className={`${phase === "gate" ? "consent-gate " : ""}fixed inset-0 z-[250] flex items-center justify-center overflow-y-auto overscroll-contain bg-[#050505]/72 p-4 backdrop-blur-md sm:p-6`}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        tabIndex={-1}
        className="w-full max-w-[35rem] rounded-[1.6rem] border border-white/12 bg-[#121212]/95 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.62)] backdrop-blur-xl sm:p-7"
      >
        <div className="flex items-start gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 3.4 19 6v5.25c0 4.22-2.88 7.92-7 9.35-4.12-1.43-7-5.13-7-9.35V6l7-2.6Z" />
              <path d="M9.35 11.55a2.65 2.65 0 1 0 5.3 0 2.65 2.65 0 0 0-5.3 0Zm0 0H7.9m8.2 0h-1.45M12 8.9V7.45m0 8.2v1.45" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent/85">Illyrian Pixel</p>
            <h2 id="cookie-consent-title" className="mt-1.5 font-display text-[1.55rem] font-semibold leading-tight text-white sm:text-[1.75rem]">
              {t("title")}
            </h2>
          </div>
        </div>

        <p id="cookie-consent-description" className="mt-5 text-[13px] leading-[1.75] text-white/70 sm:text-[13.5px]">
          {t("body")}
        </p>
        <Link href="/privacy" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent transition hover:text-accent-light">
          {t("privacyLink")} <span aria-hidden="true">↗</span>
        </Link>

        {details ? (
          <ul className="mt-5 space-y-2.5">
            {categories.map(({ key, title, desc }) => (
              <li key={key} className="flex items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-white/90">{title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/55">{desc}</p>
                </div>
                {key === "necessary" ? (
                  <Switch checked disabled label={title} />
                ) : (
                  <Switch checked={choice[key]} label={title} onChange={(value) => setChoice((current) => ({ ...current, [key]: value }))} />
                )}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="my-5 h-px bg-white/[0.08]" />
        <div className="grid gap-2.5 sm:grid-cols-2">
          {details ? (
            <button
              type="button"
              onClick={() => save(choice)}
              className="interactive-button inline-flex min-h-[3.25rem] items-center justify-center rounded-[1rem] border border-white/[0.17] bg-white/[0.035] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:border-white/35 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/65"
            >
              {t("save")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => save(NONE)}
              className="interactive-button inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-[1rem] border border-white/[0.17] bg-white/[0.035] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:border-white/35 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/65"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-white/60" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M10 2.8 16 5v4.5c0 3.62-2.46 6.8-6 8.03C6.46 16.3 4 13.12 4 9.5V5l6-2.2Z" />
                <path d="M7.7 10.05 9.3 11.7l3.2-3.4" />
              </svg>
              {t("essentialOnly")}
            </button>
          )}
          <button
            type="button"
            onClick={() => save(ALL)}
            className="interactive-button group relative inline-flex min-h-[3.25rem] items-center justify-center gap-2 overflow-hidden rounded-[1rem] border border-[#e5be63]/80 bg-[#bd9038] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#15110a] shadow-[0_10px_24px_rgba(171,131,57,0.26),inset_0_1px_0_rgba(255,255,255,0.32)] transition duration-300 hover:border-[#f1d47e] hover:bg-[#d2a449] hover:shadow-[0_14px_32px_rgba(171,131,57,0.38),inset_0_1px_0_rgba(255,255,255,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-black/10" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2.25">
                <path d="m4.2 10.2 3.4 3.4 8.2-8.2" />
              </svg>
            </span>
            <span className="relative">{t("acceptAll")}</span>
          </button>
        </div>

        {!details ? (
          <button
            type="button"
            onClick={() => {
              setChoice(readConsent() ?? NONE);
              setDetails(true);
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-[12px] font-medium tracking-[0.04em] text-white/60 transition duration-300 hover:bg-white/[0.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/65"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 5h12M4 10h12M4 15h12M7 3.5v3M13 8.5v3M9 13.5v3" />
            </svg>
            {t("customize")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
