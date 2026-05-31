"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ip_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0e0e0e]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start gap-3.5">
        <div className="min-w-0">
          <p className="font-display text-[1.05rem] font-semibold leading-snug text-white">
            Cookies & Privatësia
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
            Përdorim cookies analitike (Google Analytics, Clarity) për të kuptuar si ndërveprojnë vizitorët me faqen.{" "}
            <a href="/privacy" className="text-accent/80 underline underline-offset-2 hover:text-accent">Politika e privatësisë</a>.
          </p>
        </div>
      </div>
      <div className="my-4 h-px bg-white/[0.06]" />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={accept}
          className="interactive-button ip-cta-primary flex-1 justify-center text-[12px] sm:flex-none"
        >
          Prano të gjitha
        </button>
        <button
          type="button"
          onClick={decline}
          className="flex-1 justify-center rounded-full border border-white/14 px-5 py-2.5 text-[12px] tracking-[0.1em] text-white/55 transition duration-200 hover:border-white/28 hover:text-white/80 sm:flex-none"
        >
          Vetëm të nevojshme
        </button>
      </div>
    </div>
  );
}
