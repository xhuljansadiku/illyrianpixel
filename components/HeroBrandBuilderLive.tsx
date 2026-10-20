"use client";

// "Ndërto brandin tënd" — version që luan vetë (2026-10-20).
// Kur hapet faqja, shkruan vetë emra biznesesh shembull, ndërron stilin dhe mini-faqja
// transformohet live. Sapo vizitori fokuson fushën ose zgjedh stil, demo ndalon dhe merr ai kontrollin.
// Demo ecën vetëm kur komponenti është në ekran dhe tab-i aktiv; me reduced-motion s'luan fare.
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Style = "elegant" | "modern" | "bold";

const STYLES: Record<Style, { bg: string; fg: string; accent: string; soft: string; font: string; upper: boolean }> = {
  elegant: { bg: "#0e0c09", fg: "#f5efe3", accent: "#d4af61", soft: "rgba(212,175,97,0.14)", font: "var(--font-display), Georgia, serif", upper: false },
  modern: { bg: "#f4f6fb", fg: "#101828", accent: "#2f6bff", soft: "rgba(47,107,255,0.10)", font: "var(--font-body), system-ui, sans-serif", upper: false },
  bold: { bg: "#c2410c", fg: "#fff7ed", accent: "#111111", soft: "rgba(17,17,17,0.18)", font: "var(--font-body), system-ui, sans-serif", upper: true },
};
const ORDER: Style[] = ["elegant", "modern", "bold"];

type Sample = { name: string; style: Style; tagline: string; cta: string; items: [string, string, string] };

// Biznese shembull (të sajuara, jo klientë realë) — tregojnë sa ndryshe del çdo brand
const SAMPLES: Record<"sq" | "en", Sample[]> = {
  sq: [
    { name: "Pastiçeri Luna", style: "elegant", tagline: "Ëmbëlsira me shpirt, çdo ditë.", cta: "Porosit online", items: ["Torta", "Ëmbëlsira", "Kafe"] },
    { name: "Klinika Dentare Arben", style: "modern", tagline: "Buzëqeshje e shëndetshme, pa pritje.", cta: "Rezervo takim", items: ["Kontroll", "Zbardhim", "Implante"] },
    { name: "Ndërtim Shqiponja", style: "bold", tagline: "Ndërtojmë shpejt. Ndërtojmë mirë.", cta: "Kërko ofertë", items: ["Shtëpi", "Fasada", "Çati"] },
    { name: "Hotel Butrinti", style: "elegant", tagline: "Pushime pranë detit, si në shtëpi.", cta: "Rezervo dhomë", items: ["Dhoma", "Restorant", "Plazh"] },
  ],
  en: [
    { name: "Luna Pastry", style: "elegant", tagline: "Sweets made with soul, every day.", cta: "Order online", items: ["Cakes", "Pastries", "Coffee"] },
    { name: "Arben Dental Clinic", style: "modern", tagline: "Healthy smiles, no waiting.", cta: "Book a visit", items: ["Check-up", "Whitening", "Implants"] },
    { name: "Eagle Construction", style: "bold", tagline: "We build fast. We build right.", cta: "Get a quote", items: ["Homes", "Facades", "Roofs"] },
    { name: "Hotel Butrinti", style: "elegant", tagline: "Seaside stays that feel like home.", cta: "Book a room", items: ["Rooms", "Restaurant", "Beach"] },
  ],
};

const TYPE_MS = 70;
const ERASE_MS = 30;
const HOLD_MS = 2800;

const toDomain = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");

function Visual({ style }: { style: Style }) {
  const s = STYLES[style];
  // Dekor abstrakt sipas stilit — në vend të fotove (pa peshë, pa licenca)
  if (style === "elegant") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg" style={{ background: `radial-gradient(circle at 35% 30%, ${s.accent}55, transparent 55%), ${s.soft}` }}>
        <div className="absolute inset-4 rounded-full border" style={{ borderColor: `${s.accent}66` }} />
        <div className="absolute inset-10 rounded-full border" style={{ borderColor: `${s.accent}33` }} />
      </div>
    );
  }
  if (style === "modern") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${s.accent}, #7aa2ff)` }}>
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-3xl bg-white/25" />
        <div className="absolute left-4 top-4 h-10 w-16 rounded-xl bg-white/80" />
        <div className="absolute left-4 top-16 h-2 w-20 rounded-full bg-white/50" />
      </div>
    );
  }
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `repeating-linear-gradient(-45deg, ${s.accent} 0 14px, transparent 14px 28px)` }}
    >
      <div className="absolute inset-x-3 bottom-3 h-1/3" style={{ background: s.accent }} />
    </div>
  );
}

export default function HeroBrandBuilderLive() {
  const t = useTranslations("home.hero.builder");
  const locale = useLocale();
  const samples = SAMPLES[locale === "en" ? "en" : "sq"];

  const rootRef = useRef<HTMLDivElement>(null);
  const [demo, setDemo] = useState(true); // false pasi vizitori merr kontrollin
  const [sampleIdx, setSampleIdx] = useState(0);
  const [typed, setTyped] = useState(samples[0].name);
  const [name, setName] = useState("");
  const [style, setStyle] = useState<Style>(samples[0].style);

  // Makina e demos: shkruaj → mbaj → fshi → shembulli tjetër (stili ndërron në fillim të shkrimit)
  useEffect(() => {
    if (!demo) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let timer = 0;
    let visible = false;
    let idx = 0;
    let chars = samples[0].name.length;
    let phase: "hold" | "erase" | "type" = "hold";

    const step = () => {
      if (!visible || document.hidden) return; // rifillon nga syncRun
      const target = samples[idx].name;
      if (phase === "hold") {
        phase = "erase";
        timer = window.setTimeout(step, HOLD_MS);
        return;
      }
      if (phase === "erase") {
        chars -= 1;
        setTyped(target.slice(0, Math.max(0, chars)));
        if (chars <= 0) {
          idx = (idx + 1) % samples.length;
          phase = "type";
          setSampleIdx(idx);
          setStyle(samples[idx].style);
        }
        timer = window.setTimeout(step, chars <= 0 ? 350 : ERASE_MS);
        return;
      }
      chars += 1;
      setTyped(samples[idx].name.slice(0, chars));
      if (chars >= samples[idx].name.length) phase = "hold";
      timer = window.setTimeout(step, TYPE_MS);
    };

    const syncRun = () => {
      window.clearTimeout(timer);
      if (visible && !document.hidden) timer = window.setTimeout(step, 900);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      syncRun();
    });
    if (rootRef.current) io.observe(rootRef.current);
    document.addEventListener("visibilitychange", syncRun);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", syncRun);
    };
  }, [demo, samples]);

  const takeOver = (keepName: boolean) => {
    if (!demo) return;
    setDemo(false);
    setName(keepName ? typed : "");
  };

  const sample = samples[sampleIdx];
  const s = STYLES[style];
  const current = demo ? typed : name;
  const display = current.trim() || (demo ? " " : t("defaultName"));
  const initials = (current.trim() || t("defaultName"))
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const domain = `www.${toDomain(current) || (demo ? toDomain(sample.name) : "biznesiyt")}.com`;
  const tagline = demo ? sample.tagline : t(`taglines.${style}`);
  const siteCta = demo ? sample.cta : t("siteCta");
  const items = demo ? sample.items : null;
  const contactHref = !demo && name.trim()
    ? `/contact?biznesi=${encodeURIComponent(name.trim())}&stili=${encodeURIComponent(t(`styles.${style}`))}`
    : "/contact";

  return (
    <div ref={rootRef} className="w-full max-w-[560px] space-y-4 text-left">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="brand-builder-live-name">
          {t("inputLabel")}
        </label>
        <div className="relative min-w-0 flex-1">
          <input
            id="brand-builder-live-name"
            value={current}
            onFocus={() => takeOver(false)}
            onChange={(e) => setName(e.target.value.slice(0, 32))}
            placeholder={t("placeholder")}
            autoComplete="organization"
            className="w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-[15px] text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
          />
        </div>
        <div role="radiogroup" aria-label={t("styleLabel")} className="flex shrink-0 rounded-full border border-white/15 p-1">
          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={style === k}
              onClick={() => {
                takeOver(true);
                setStyle(k);
              }}
              className={`flex-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[10.5px] uppercase tracking-[0.08em] transition-colors duration-500 sm:px-3 ${
                style === k ? "bg-accent text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {t(`styles.${k}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Mini-website në dritare browser-i */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1714] p-1 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]" aria-live="off">
        <div className="relative flex items-center gap-2 px-3 py-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
          <span className="mx-auto truncate rounded bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-white/50">{domain}</span>
          {demo && (
            <span className="absolute right-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent/90">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
            </span>
          )}
        </div>
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-lg transition-[background-color,color] duration-700"
          style={{ backgroundColor: s.bg, color: s.fg, fontFamily: s.font }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-700"
                style={{ background: s.accent, color: s.bg }}
              >
                {initials}
              </span>
              <span className="truncate text-[13px] font-semibold tracking-wide">{display}</span>
            </div>
            <div className="hidden gap-5 text-[11px] opacity-70 sm:flex" aria-hidden>
              <span>{t("nav1")}</span>
              <span>{t("nav2")}</span>
              <span>{t("nav3")}</span>
            </div>
          </div>

          <div className="grid h-[62%] grid-cols-1 items-center gap-5 px-5 sm:grid-cols-[1.25fr_1fr] sm:px-8">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.3em] opacity-60">{t("welcome")}</p>
              <p className={`mt-1.5 min-h-[1.05em] break-words text-[clamp(1.4rem,3.4vw,2.5rem)] font-bold leading-[1.02] ${s.upper ? "uppercase" : ""}`}>{display}</p>
              <p key={`t-${sampleIdx}-${style}`} className="brand-builder-in mt-2 text-[12px] opacity-75">{tagline}</p>
              <span
                key={`c-${sampleIdx}-${style}`}
                className="brand-builder-in mt-4 inline-flex w-fit rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-700"
                style={{ background: s.accent, color: s.bg }}
              >
                {siteCta}
              </span>
            </div>
            <div key={`v-${style}`} className="brand-builder-in hidden aspect-square max-h-[150px] w-full sm:block">
              <Visual style={style} />
            </div>
          </div>

          {items && (
            <div key={`i-${sampleIdx}`} className="absolute inset-x-5 bottom-3 hidden gap-2 sm:flex sm:px-3" aria-hidden>
              {items.map((it, i) => (
                <span
                  key={it}
                  className="brand-builder-in flex-1 rounded-md px-2 py-1.5 text-center text-[10px] font-medium"
                  style={{ background: s.soft, animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  {it}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-white/55">{demo || !name.trim() ? t("hint") : ""}</p>
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
