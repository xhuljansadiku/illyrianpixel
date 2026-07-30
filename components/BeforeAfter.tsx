"use client";

import { useRef } from "react";
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
      className={`before-after-frame group relative flex flex-col self-start overflow-hidden rounded-[1.1rem] border bg-[#0d0d0d] transition-all duration-500 hover:-translate-y-1 ${
        isAfter
          ? "border-accent/30 shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-accent/60 hover:shadow-[0_26px_70px_rgba(171,131,57,0.22)]"
          : "border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-white/25"
      }`}
    >
      {isAfter && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px z-0 rounded-[1.1rem] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(171,131,57,0.55), transparent 60%)" }}
        />
      )}
      <div className="relative z-[1] flex items-center gap-2 border-b border-white/10 bg-[#141414] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span
          className={`ml-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.14em] ${
            isAfter ? "bg-accent/15 text-accent" : "bg-red-500/10 text-red-400/70"
          }`}
        >
          {label}
        </span>
      </div>
      <div
        className={`relative z-[1] w-[86vw] max-w-sm bg-[#111111] md:w-auto md:max-w-none ${SHARED_HEIGHT}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 86vw, 45vw" className="object-contain" />
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
            <span className="rounded-full border border-accent/30 bg-accent/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent/90">
              {t("badge")}
            </span>
            <p className="text-sm text-white/55">{ITEM.name}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-8">
          <Frame src={ITEM.before} alt={`${ITEM.name} — ${t("altBefore")}`} label={t("labelBefore")} width={ITEM.before_w} height={ITEM.before_h} tone="before" />
          <Frame src={ITEM.after} alt={`${ITEM.name} — ${t("altAfter")}`} label={t("labelAfter")} width={ITEM.after_w} height={ITEM.after_h} tone="after" />
        </div>
      </div>
    </section>
  );
}
