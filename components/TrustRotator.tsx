"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/gsap";

// Client countries, in display order. The last slot is the "7 countries" summary.
const COUNTRIES = ["de", "it", "gb", "se", "us", "al", "xk"] as const;
const STEP_MS = 2000;
const SUMMARY_MS = 3500;

function Flag({ code, size = 16 }: { code: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-bg"
      style={{ width: size, height: size }}
    >
      <Image
        src={`https://flagcdn.com/w40/${code}.png`}
        width={size}
        height={size}
        alt=""
        className="h-full w-full object-cover"
      />
    </span>
  );
}

// "Clients in 🇩🇪 Germany" → "🇮🇹 Italy" → … → "7 countries", rolling vertically.
export default function TrustRotator() {
  const t = useTranslations("common.nav");
  const reduced = useReducedMotion();
  const slots = COUNTRIES.length + 1;
  // Start on the summary so SSR and the first paint show the full claim.
  const [index, setIndex] = useState<number>(COUNTRIES.length);
  const [snapping, setSnapping] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const isSummary = index === COUNTRIES.length;
    const id = window.setTimeout(
      () => {
        if (isSummary) {
          // Fade out, jump back to the first country without sliding, fade in.
          setSnapping(true);
          window.setTimeout(() => {
            setIndex(0);
            window.requestAnimationFrame(() => setSnapping(false));
          }, 300);
        } else {
          setIndex((i) => i + 1);
        }
      },
      isSummary ? SUMMARY_MS : STEP_MS
    );
    return () => window.clearTimeout(id);
  }, [index, reduced]);

  const shown = reduced ? COUNTRIES.length : index;

  return (
    <span className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-white/60 sm:text-[11px]">
      <span>{t("trustPrefix")}</span>
      <span className="relative h-5 overflow-hidden" aria-live="off">
        <span
          className={`flex flex-col ${
            snapping ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          }`}
          style={{ transform: `translateY(-${(shown * 100) / slots}%)` }}
        >
          {COUNTRIES.map((code) => (
            <span key={code} className="flex h-5 items-center gap-1.5 text-white/90" aria-hidden>
              <Flag code={code} />
              {t(`trustCountries.${code}`)}
            </span>
          ))}
          <span className="flex h-5 items-center gap-2 text-accentLight">
            <span className="flex items-center -space-x-1" aria-hidden>
              {COUNTRIES.map((code) => (
                <Flag key={code} code={code} size={14} />
              ))}
            </span>
            {t("trustAll")}
          </span>
        </span>
      </span>
    </span>
  );
}
