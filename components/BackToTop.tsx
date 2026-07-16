"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useIsomorphicLayoutEffect } from "@/lib/gsap";

const fabButtonClass =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/70 bg-[#0b0b0b]/88 text-accent shadow-[0_10px_28px_rgba(0,0,0,0.38)] backdrop-blur-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(171, 131, 57,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]";

const hoverLabelClass =
  "pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/14 bg-[#111]/92 px-3 py-2 text-[11px] font-medium tracking-wide text-accent shadow-[0_12px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 ease-out";

export default function BackToTop() {
  const t = useTranslations("common.backToTop");
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const progress = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      setVisible(progress > 0.34);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-4 z-50 transition-all duration-300 md:left-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="group relative">
        <span
          className={`${hoverLabelClass} -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}
          aria-hidden
        >
          {t("label")}
        </span>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label={t("label")}
          className={fabButtonClass}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
