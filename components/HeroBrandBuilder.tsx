"use client";

// "Ndërto brandin tënd" — vizitori shkruan emrin e biznesit dhe zgjedh stilin; një mini-website
// krijohet menjëherë. Butoni dërgon emrin + stilin te /contact (formulari i mbush vetë).
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Style = "elegant" | "modern" | "bold";

const STYLES: Record<Style, { bg: string; fg: string; accent: string; font: string; upper: boolean }> = {
  elegant: { bg: "#0e0c09", fg: "#f5efe3", accent: "#d4af61", font: "var(--font-display), Georgia, serif", upper: false },
  modern: { bg: "#f4f6fb", fg: "#101828", accent: "#2f6bff", font: "var(--font-body), system-ui, sans-serif", upper: false },
  bold: { bg: "#c2410c", fg: "#fff7ed", accent: "#111111", font: "var(--font-body), system-ui, sans-serif", upper: true },
};
const ORDER: Style[] = ["elegant", "modern", "bold"];

const toDomain = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");

export default function HeroBrandBuilder() {
  const t = useTranslations("home.hero.builder");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [style, setStyle] = useState<Style>("elegant");

  const s = STYLES[style];
  const display = name.trim() || t("defaultName");
  const initials = display
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const domain = `www.${toDomain(display) || "biznesiyt"}.com`;
  const contactHref = name.trim()
    ? `/contact?biznesi=${encodeURIComponent(name.trim())}&stili=${encodeURIComponent(t(`styles.${style}`))}`
    : "/contact";

  return (
    <div className="w-full max-w-[560px] space-y-4 text-left">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="brand-builder-name">
          {t("inputLabel")}
        </label>
        <input
          id="brand-builder-name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 32))}
          placeholder={t("placeholder")}
          autoComplete="organization"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-[15px] text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
        />
        <div role="radiogroup" aria-label={t("styleLabel")} className="flex shrink-0 rounded-full border border-white/15 p-1">
          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={style === k}
              onClick={() => setStyle(k)}
              className={`flex-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[10.5px] uppercase tracking-[0.08em] transition-colors sm:px-3 ${
                style === k ? "bg-accent text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {t(`styles.${k}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Mini-website në dritare browser-i */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1714] p-1 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]" aria-live="polite">
        <div className="flex items-center gap-2 px-3 py-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
          <span className="mx-auto truncate rounded bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-white/50">{domain}</span>
        </div>
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-lg transition-colors duration-500"
          style={{ background: s.bg, color: s.fg, fontFamily: s.font }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500"
                style={{ background: s.accent, color: s.bg }}
              >
                {initials}
              </span>
              <span className="truncate text-sm font-semibold tracking-wide">{display}</span>
            </div>
            <div className="hidden gap-5 text-[11px] opacity-70 sm:flex" aria-hidden>
              <span>{t("nav1")}</span>
              <span>{t("nav2")}</span>
              <span>{t("nav3")}</span>
            </div>
          </div>
          <div key={display + style} className="brand-builder-in flex h-[70%] flex-col justify-center px-5 sm:px-10">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">{t("welcome")}</p>
            <p className={`mt-2 break-words text-[clamp(1.6rem,4vw,3rem)] font-bold leading-[1.02] ${s.upper ? "uppercase" : ""}`}>{display}</p>
            <p className="mt-2 text-sm opacity-75">{t(`taglines.${style}`)}</p>
            <span
              className="mt-5 inline-flex w-fit rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500"
              style={{ background: s.accent, color: s.bg }}
            >
              {t("siteCta")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-white/40">{name.trim() ? "" : t("hint")}</p>
        <Link
          href={contactHref}
          lang={locale}
          className="inline-flex items-center gap-2 border-b border-accent pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-accentLight"
        >
          {t("cta")} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
