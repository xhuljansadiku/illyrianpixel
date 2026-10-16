"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionMark from "@/components/SectionMark";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const ITEM = {
  name: "Palushi Brothers Construction",
  before: "/images/before-after/palushi-brothers-before.png",
  before_w: 1323,
  before_h: 936,
  after: "/images/before-after/palushi-brothers-after.png",
  after_w: 1440,
  after_h: 760,
};

// Mobile: të dyja kutitë kanë gjerësi+lartësi fikse identike (object-contain
// letterbox-on nëse s'përputhet raporti). Desktop (md+): gjerësia rrjedh nga
// aspect-ratio real i secilës foto, vetëm lartësia ndahet.
const SHARED_HEIGHT = "h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px]";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- përdoret te pamja e vjetër (e komentuar)
function Frame({
  src,
  alt,
  label,
  width,
  height,
  tone,
}: {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  tone: "before" | "after";
}) {
  const isAfter = tone === "after";
  return (
    <div
      className={`before-after-frame group relative flex flex-col self-start overflow-hidden rounded-2xl border bg-[#0d0d0d] transition-all duration-500 hover:-translate-y-1 ${
        isAfter
          ? "border-accent/30 shadow-lift hover:border-accent/60 hover:shadow-gold-lift"
          : "border-white/12 shadow-lift hover:border-white/25"
      }`}
    >
      {isAfter && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(171,131,57,0.55), transparent 60%)" }}
        />
      )}
      <div className="relative z-[1] flex items-center gap-2 border-b border-white/10 bg-[#141414] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span
          className={`ml-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.15em] ${
            isAfter ? "bg-accent/15 text-accent" : "bg-red-500/10 text-red-400/70"
          }`}
        >
          {label}
        </span>
      </div>
      <div
        className={`relative z-[1] w-[86vw] max-w-sm bg-surface md:w-auto md:max-w-none ${SHARED_HEIGHT}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 86vw, 45vw" className="object-contain" />
      </div>
    </div>
  );
}

// Rrëshqitës (2026-10-16): një dritare, site-i i vjetër sipër të riut; vija e artë tërhiqet (maus, gisht, shigjeta).
// Kur seksioni del në ekran, vija lëviz një herë vetë që klienti ta kuptojë se tërhiqet.
function CompareSlider({ before, after, ratio, labelBefore, labelAfter, altBefore, altAfter, hint, ariaLabel }: {
  before: string; after: string; ratio: string; labelBefore: string; labelAfter: string;
  altBefore: string; altAfter: string; hint: string; ariaLabel: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const dragging = useRef(false);
  const reducedMotion = useReducedMotion();

  // Një lëvizje demonstruese kur shfaqet për herë të parë
  useEffect(() => {
    const el = boxRef.current;
    if (!el || reducedMotion) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 2200);
        setPos(50 + 30 * Math.sin(t * Math.PI * 2) * (1 - t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [reducedMotion]);

  const moveTo = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="before-after-frame mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-accent/30 bg-[#0d0d0d] shadow-lift">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#141414] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[10px] tracking-[0.15em] text-white/40">palushibrothers.co.uk</span>
      </div>
      <div
        ref={boxRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        style={{ aspectRatio: ratio }}
        className="relative cursor-ew-resize touch-pan-y select-none overflow-hidden bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onPointerDown={(e) => { dragging.current = true; setTouched(true); boxRef.current?.setPointerCapture(e.pointerId); moveTo(e.clientX); }}
        onPointerMove={(e) => { if (dragging.current) moveTo(e.clientX); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); setTouched(true); setPos((p) => Math.max(0, p - 5)); }
          if (e.key === "ArrowRight") { e.preventDefault(); setTouched(true); setPos((p) => Math.min(100, p + 5)); }
        }}
      >
        <Image src={after} alt={altAfter} fill sizes="(max-width: 1100px) 100vw, 1024px" className="pointer-events-none object-cover object-top" />
        <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={altBefore} fill sizes="(max-width: 1100px) 100vw, 1024px" className="object-cover object-top" />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-semibold tracking-[0.15em] text-red-300 backdrop-blur">{labelBefore}</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold tracking-[0.15em] text-black">{labelAfter}</span>

        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent shadow-[0_0_24px_rgba(234,206,113,0.9)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black/30 bg-accent text-black shadow-gold">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
          </span>
        </div>

        {!touched && (
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            ⇆ {hint}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const t = useTranslations("home.beforeAfter");
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".before-after-heading",
        { opacity: 0, y: 22, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );
      gsap.fromTo(
        ".before-after-frame",
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="before-after" ref={sectionRef} className="cinematic-section section-tone-work relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(171,131,57,0.1),transparent_38%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(171,131,57,0.07),transparent_42%)]" />

      <div className="section-wrap relative z-[1]">
        <div className="before-after-heading flex flex-col items-center text-center md:items-start md:text-left">
          <SectionMark label={t("eyebrow")} />
          <h2 className="section-title mt-3 max-w-4xl">{t("title")}</h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <span className="ip-eyebrow rounded-full border border-accent/30 bg-accent/8 px-3 py-1">
              {t("badge")}
            </span>
            <p className="text-sm text-white/55">{ITEM.name}</p>
          </div>
        </div>

        <div className="mt-10">
          <CompareSlider
            before={ITEM.before}
            after={ITEM.after}
            // Raporti i fotos "Pas": të dyja shtrihen në të njëjtën gjerësi dhe përputhen lart
            ratio={`${ITEM.after_w} / ${ITEM.after_h}`}
            labelBefore={t("labelBefore")}
            labelAfter={t("labelAfter")}
            altBefore={`${ITEM.name} — ${t("altBefore")}`}
            altAfter={`${ITEM.name} — ${t("altAfter")}`}
            hint={t("dragHint")}
            ariaLabel={t("sliderLabel")}
          />
        </div>
        {/* Pamja e vjetër me dy dritare pranë njëra-tjetrës (para 2026-10-16):
        <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-8">
          <Frame src={ITEM.before} alt={`${ITEM.name} — ${t("altBefore")}`} label={t("labelBefore")} width={ITEM.before_w} height={ITEM.before_h} tone="before" />
          <Frame src={ITEM.after} alt={`${ITEM.name} — ${t("altAfter")}`} label={t("labelAfter")} width={ITEM.after_w} height={ITEM.after_h} tone="after" />
        </div> */}
      </div>
    </section>
  );
}
