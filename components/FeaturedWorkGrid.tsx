"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import { caseStudies } from "@/lib/caseStudies";

// Projekt i shfaqur — nga lib/caseStudies (statik) ose nga admini (portfolio_items)
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

export default function FeaturedWorkGrid({ items }: { items?: FeaturedItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  const featuredProjects: FeaturedItem[] =
    items && items.length > 0
      ? items
      : caseStudies.filter((project) =>
          ["esm-group", "bardhi-wellness", "palushi-brothers"].includes(project.slug)
        );

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-chapters-intro > *",
        { opacity: 0, y: 26, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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

  const hoveredProject = hoveredIdx !== null ? featuredProjects[hoveredIdx] : null;
  const showCursorPreview = finePointer && !reducedMotion;

  return (
    <section id="featured-work" ref={sectionRef} className="cinematic-section section-tone-work relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(171,131,57,0.08),transparent_36%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.05),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(171,131,57,0.04),transparent_48%,rgba(171,131,57,0.03))] animate-[featuredAmbient_20s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:repeating-radial-gradient(circle_at_0_0,rgba(255,255,255,0.4)_0_1px,transparent_1px_4px)]" />

      <div className="section-wrap featured-chapters-intro">
        <SectionMark label="PROJEKTET" />
        <h2 className="section-title mt-3 max-w-4xl">
          {"Projekte që sjellin "}
          <span className="text-accent">{"klientë realë"}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
          {"Ndërtuar për performancë dhe rritje të biznesit."}
        </p>
      </div>

      <div ref={listRef} className="section-wrap mt-4 md:mt-10">
        <div className="border-t border-white/10">
          {featuredProjects.map((project, idx) => {
            const mood = MOOD_COLORS[idx % MOOD_COLORS.length];
            const isHovered = hoveredIdx === idx;
            const isLink = Boolean(project.liveUrl);

            const rowInner = (
              <>
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
                  <span className="font-body text-[11px] uppercase tracking-[0.18em] text-white/40">
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
                  {isLink ? "Shiko" : "Së shpejti"}
                  {isLink && <span aria-hidden>{"→"}</span>}
                </span>

                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500"
                  style={{ backgroundColor: mood, transform: isHovered ? "scaleX(1)" : "scaleX(0)" }}
                  aria-hidden
                />
              </>
            );

            const rowClassName =
              "featured-row group relative flex w-full items-center border-b border-white/10 py-7 text-left transition-colors duration-300 hover:bg-white/[0.02] md:py-9";

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

      <div className="section-wrap pb-2 pt-12">
        <Link href="/projektet" className="luxury-link">
          {"Të gjitha projektet "}
          <span aria-hidden>{"→"}</span>
        </Link>
      </div>
    </section>
  );
}
