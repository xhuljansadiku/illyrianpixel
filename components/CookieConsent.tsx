"use client";

import { useState } from "react";
import Script from "next/script";
import { useIsomorphicLayoutEffect } from "@/lib/gsap";

type ConsentState = "accepted" | "declined" | null;

const STORAGE_KEY = "ip_cookie_consent";

function CookieIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      {/* Cookie base */}
      <circle cx="14" cy="14" r="12" fill="url(#cookieGrad)" />
      {/* Bite chunk */}
      <circle cx="23.5" cy="6.5" r="5" fill="#0a0a0a" />
      {/* Chips */}
      <circle cx="10" cy="10" r="2" fill="#7a5a1e" opacity="0.9" />
      <circle cx="17" cy="13" r="1.6" fill="#7a5a1e" opacity="0.9" />
      <circle cx="11" cy="17.5" r="1.8" fill="#7a5a1e" opacity="0.9" />
      <circle cx="17.5" cy="19.5" r="1.4" fill="#7a5a1e" opacity="0.9" />
      <circle cx="8"  cy="14.5" r="1.2" fill="#7a5a1e" opacity="0.7" />
      {/* Texture dots */}
      <circle cx="13.5" cy="8"  r="0.7" fill="#c49a3a" opacity="0.5" />
      <circle cx="19"  cy="9.5" r="0.6" fill="#c49a3a" opacity="0.4" />
      <defs>
        <radialGradient id="cookieGrad" cx="38%" cy="36%" r="62%">
          <stop offset="0%"   stopColor="#e8b86d" />
          <stop offset="60%"  stopColor="#c49a3a" />
          <stop offset="100%" stopColor="#9a7220" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    if (stored) {
      setConsent(stored);
    } else {
      const t = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setConsent("declined");
    setVisible(false);
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-82MBE7PY5B"
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-82MBE7PY5B');
            `}
          </Script>
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","wnyi2atnrw");
            `}
          </Script>
        </>
      )}

      {visible && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 animate-[fadeSlideUp_0.4s_ease_forwards] rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(18,18,18,0.97)_0%,rgba(14,14,14,0.97)_100%)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(171,131,57,0.08)_inset] backdrop-blur-xl sm:bottom-6 sm:p-6"
        >
          {/* Top row: icon + title */}
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0 rounded-xl border border-[#ab8339]/20 bg-[#ab8339]/8 p-2">
              <CookieIcon />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[1.05rem] font-semibold leading-snug text-white">
                Cookies & Privatësia
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/58">
                Përdorim cookies analitike (Google Analytics, Clarity) për të kuptuar si
                ndërveprojnë vizitorët me faqen.{" "}
                <span className="text-white/36">Nuk shesim të dhëna.</span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-white/[0.06]" />

          {/* Buttons */}
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
      )}
    </>
  );
}
