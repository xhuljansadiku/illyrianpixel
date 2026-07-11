"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export type FeaturedItem = {
  slug: string;
  title: string;
  category: string;
  location: string;
  flagCodes: string[];
  intro: string;
  metrics: string[];
  tags: string[];
  heroImage: string | null;
  liveUrl: string;
};

// Signature mood color per row instead of always gold — keeps the index feeling
// editorial without leaning on imagery for differentiation.
const MOOD_COLORS = ["#ab8339", "#c2703d", "#3f8f86", "#4f6f93", "#9c4d4d", "#7a8450"];

// Numbered editorial row list with a cursor-follow image preview on desktop.
// Shared by the homepage teaser (FeaturedWorkGrid) and the full /projektet index.
export default function ProjectIndexList({ items }: { items: FeaturedItem[] }) {
  const t = useTranslations("common.projectCard");
  const listRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!listRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-row",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 85%" },
        }
      );
    }, listRef);
    return () => ctx.revert();
  }, [items.length]);

  // Cursor-follow preview, fine-pointer desktops only.
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !finePointer || !previewRef.current) return;
    const { gsap } = ensureGSAP();
    const moveX = gsap.quickTo(previewRef.current, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(previewRef.current, "y", { duration: 0.45, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, finePointer]);

  const hoveredProject = hoveredIdx !== null ? items[hoveredIdx] : null;
  const showCursorPreview = finePointer && !reducedMotion;

  return (
    <>
      <div ref={listRef}>
        <div className="border-t border-white/10">
          {items.map((project, idx) => {
            const mood = MOOD_COLORS[idx % MOOD_COLORS.length];
            const isHovered = hoveredIdx === idx;
            const isLink = Boolean(project.liveUrl);

            const flagsPill = project.flagCodes.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/8 px-1.5 py-0.5 normal-case" aria-hidden>
                {project.flagCodes.map((code) => (
                  <Image
                    key={code}
                    src={`https://flagcdn.com/w20/${code}.png`}
                    alt=""
                    width={20}
                    height={14}
                    className="h-3.5 w-5 rounded-[2px] object-cover"
                    loading="lazy"
                    unoptimized
                  />
                ))}
              </span>
            );

            const ctaLabel = (
              <>
                {isLink ? t("view") : t("comingSoon")}
                {isLink && <span aria-hidden>{"→"}</span>}
              </>
            );

            const rowInner = (
              <>
                {/* Mobile layout: split text / photo */}
                <div className="flex w-full items-stretch gap-4 md:hidden">
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] tracking-[0.2em]">
                      <span
                        className="shrink-0 transition-colors duration-300"
                        style={{ color: isHovered ? mood : "rgba(255,255,255,0.35)" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" aria-hidden />
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[11px] uppercase leading-normal tracking-[0.14em] text-white/40">
                        <span>
                          {project.category}
                          {project.location ? ` — ${project.location}` : ""}
                        </span>
                        {flagsPill}
                      </span>
                    </div>

                    <span
                      className="font-display text-[1.5rem] font-normal leading-[1.12] tracking-[-0.01em] transition-colors duration-300"
                      style={{ color: isHovered ? mood : "#ffffff" }}
                    >
                      {project.title}
                    </span>

                    <span className="flex w-fit items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.16em] text-white/45">
                      {ctaLabel}
                    </span>
                  </div>

                  {project.heroImage && (
                    <span className="relative block aspect-[4/5] w-[36%] shrink-0 overflow-hidden rounded-xl border border-white/10">
                      <Image src={project.heroImage} alt="" fill sizes="40vw" className="object-cover" />
                    </span>
                  )}
                </div>

                {/* Desktop / tablet layout: single row */}
                <div className="hidden w-full items-center md:flex">
                  <span
                    className="font-mono text-[12px] tracking-[0.2em] transition-colors duration-300"
                    style={{ color: isHovered ? mood : "rgba(255,255,255,0.3)" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-6 md:px-10">
                    <span
                      className="font-display text-[clamp(1.6rem,4.2vw,3.4rem)] font-normal leading-[1.02] tracking-[-0.01em] transition-colors duration-300"
                      style={{ color: isHovered ? mood : "#ffffff" }}
                    >
                      {project.title}
                    </span>
                    <span className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.18em] text-white/40">
                      {flagsPill}
                      {project.category}
                      {project.location ? ` — ${project.location}` : ""}
                    </span>
                  </div>

                  {project.heroImage && (
                    <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-md border border-white/10 lg:hidden">
                      <Image src={project.heroImage} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                  )}

                  <span className="ml-4 flex shrink-0 items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.16em] text-white/35 transition-transform duration-300 group-hover:translate-x-1">
                    {ctaLabel}
                  </span>
                </div>

                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500"
                  style={{ backgroundColor: mood, transform: isHovered ? "scaleX(1)" : "scaleX(0)" }}
                  aria-hidden
                />
              </>
            );

            const rowClassName =
              "featured-row group relative flex w-full items-center border-b border-white/10 py-6 text-left transition-colors duration-300 hover:bg-white/[0.02] md:py-9";

            return isLink ? (
              <a
                key={project.slug}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClassName}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx((cur) => (cur === idx ? null : cur))}
              >
                {rowInner}
              </a>
            ) : (
              <div
                key={project.slug}
                className={`${rowClassName} cursor-default`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx((cur) => (cur === idx ? null : cur))}
              >
                {rowInner}
              </div>
            );
          })}
        </div>
      </div>

      {showCursorPreview && (
        <div
          ref={previewRef}
          className={`pointer-events-none fixed left-0 top-0 z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
            hoveredProject ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-[190px] w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0c] shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:h-[220px] md:w-[320px]">
            {hoveredProject?.heroImage && (
              <Image
                key={hoveredProject.slug}
                src={hoveredProject.heroImage}
                alt=""
                fill
                sizes="320px"
                className="object-cover"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
