"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";

const WA_HREF = buildWhatsAppChatHref(DEFAULT_WHATSAPP_E164);
const SESSION_KEY = "ip_exit_shown";

// Tekstet default — mbivendosen nga cilësimet e adminit (site_settings)
const DEFAULTS = {
  eyebrow: "Para se të largoheni",
  title: "Merrni një konsultë falas sot.",
  text: "Tregoni për projektin tuaj dhe marrim një plan konkret pa kosto, pa detyrime.",
  cta: "Konsultë falas →",
};

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(DEFAULTS);
  const readyRef = useRef(false);
  const enabledRef = useRef(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Merr cilësimet nga admini — nëse popup-i është i çaktivizuar, mos e shfaq fare
    fetch("/api/popup")
      .then((res) => res.json())
      .then((data) => {
        enabledRef.current = data.enabled !== false;
        setContent({
          eyebrow: data.eyebrow || DEFAULTS.eyebrow,
          title: data.title || DEFAULTS.title,
          text: data.text || DEFAULTS.text,
          cta: data.cta || DEFAULTS.cta,
        });
      })
      .catch(() => {
        // mbaj default-et
      });

    // Prit 5 sekonda para se ta aktivizosh — vizitori duhet të ketë lexuar diçka
    const readyTimer = setTimeout(() => {
      readyRef.current = true;
    }, 5000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (!readyRef.current || !enabledRef.current) return;
      if (e.clientY <= 8) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      clearTimeout(readyTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const close = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ofertë e veçantë"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      {/* Card */}
      <div className="relative z-[1] w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e0e] p-7 shadow-[0_32px_80px_rgba(0,0,0,0.7)] md:p-9">
        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label="Mbyll"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/25 hover:text-white/70"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden>
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>

        {/* Content */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent/70">
          {content.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[clamp(1.5rem,4vw,2rem)] leading-tight text-white">
          {content.title.includes("falas") ? (
            <>
              {content.title.split("falas")[0]}
              <span className="text-accent">falas</span>
              {content.title.split("falas").slice(1).join("falas")}
            </>
          ) : (
            content.title
          )}
        </h2>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-white/55">
          {content.text}
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            onClick={close}
            className="interactive-button ip-cta-primary flex-1 justify-center"
          >
            {content.cta}
          </Link>
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-4 w-full text-center text-[11px] text-white/28 transition-colors hover:text-white/50"
        >
          Jo, faleminderit
        </button>
      </div>
    </div>
  );
}
