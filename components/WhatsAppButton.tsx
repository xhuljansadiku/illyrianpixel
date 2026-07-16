"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164, whatsappPreviewLines } from "@/lib/whatsappPrefill";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_E164;

/** Same footprint as BackToTop FAB */
const fabButtonClass =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ab8339]/45 bg-[#ab8339] text-[#0e0d0c] shadow-[0_10px_28px_rgba(171,131,57,0.35)] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ab8339]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]";

const hoverPreviewClass =
  "pointer-events-none absolute right-full top-1/2 z-[6] mr-3 w-[min(240px,calc(100vw-6rem))] -translate-y-1/2 rounded-2xl border border-white/12 bg-[#111]/92 p-3 text-left shadow-[0_12px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 ease-out";

export default function WhatsAppButton() {
  const t = useTranslations("common.whatsapp");
  const locale = useLocale();
  const href = buildWhatsAppChatHref(WHATSAPP_NUMBER, locale);
  const previewLines = whatsappPreviewLines(locale);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) return;
    const root = document.documentElement;
    const updateHeight = () => {
      root.style.setProperty("--whatsapp-height", `${buttonRef.current?.offsetHeight ?? 0}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed z-50"
      style={{
        right: "24px",
        bottom: "24px"
      }}
    >
      <div className="relative inline-flex flex-col items-end">
        <div
          id="whatsapp-fab-popover"
          role="dialog"
          aria-labelledby="whatsapp-fab-title"
          className={`absolute bottom-0 right-full z-10 mr-3 w-[min(260px,calc(100vw-6rem))] rounded-2xl border border-white/12 bg-[#111]/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 ease-out ${
            open
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-3 opacity-0"
          }`}
        >
          <p id="whatsapp-fab-title" className="text-xs text-white/82">
            {t("popoverText")}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-[#ab8339]/55 bg-[#ab8339] px-3 py-1.5 text-[11px] font-medium text-[#0e0d0c] transition-transform duration-300 hover:scale-[1.03]"
            >
              {t("openChat")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-full border border-white/18 px-3 py-1.5 text-[11px] text-white/80 transition-colors duration-200 hover:text-white"
            >
              {t("close")}
            </button>
          </div>
        </div>

        <div className="group relative">
          <div
            className={`${hoverPreviewClass} ${
              open
                ? "translate-x-2 opacity-0"
                : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
            aria-hidden
          >
            <p className="text-[12px] font-medium leading-snug text-white/90">{previewLines[0]}</p>
            <p className="mt-1.5 text-[11px] leading-snug text-white/75">{previewLines[1]}</p>
          </div>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("fabAria")}
            aria-expanded={open}
            aria-controls="whatsapp-fab-popover"
            className={fabButtonClass}
          >
            <svg viewBox="0 0 32 32" aria-hidden className="h-6 w-6 fill-current">
              <path d="M19.11 17.21c-.25-.13-1.5-.74-1.73-.82-.23-.08-.4-.12-.57.13-.17.25-.65.82-.8.99-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.39.11-.52.12-.12.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.44-.15-.01-.32-.01-.5-.01-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.16-.48-.29z" />
              <path d="M16 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.25.58 4.45 1.68 6.39L3 29l6.8-1.79c1.87 1.02 3.97 1.56 6.2 1.56 7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16 3.2zm0 23.46c-2 0-3.95-.56-5.63-1.63l-.4-.25-4.04 1.06 1.08-3.94-.26-.41A10.63 10.63 0 0 1 5.4 16c0-5.84 4.75-10.6 10.6-10.6S26.6 10.16 26.6 16 21.84 26.66 16 26.66z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
