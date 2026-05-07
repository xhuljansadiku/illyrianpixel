"use client";

import Link from "next/link";
import { createElement } from "react";
import ServiceCardHeroVisual from "@/components/ServiceCardHeroVisual";
import type { ServiceOverviewCard } from "@/lib/serviceOverviewCards";

export type ServiceOverviewLuxCardProps = {
  service: ServiceOverviewCard;
  idx: number;
  hoveredCard: number | null;
  setHoveredCard: (idx: number | null) => void;
  cardRef?: (node: HTMLAnchorElement | null) => void;
  headingAs?: "h2" | "h3";
};

export default function ServiceOverviewLuxCard({
  service,
  idx,
  hoveredCard,
  setHoveredCard,
  cardRef,
  headingAs = "h3",
}: ServiceOverviewLuxCardProps) {
  return (
    <Link
      href={service.href}
      ref={cardRef}
      onMouseEnter={() => setHoveredCard(idx)}
      onMouseLeave={() => setHoveredCard(null)}
      className={`services-lux-grid-card service-bento-card group relative grid min-h-[420px] w-full grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden rounded-[1.35rem] border border-[#333] !bg-[linear-gradient(165deg,#0B0B0B_0%,#000000_55%,#050505_100%)] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[6px] transition-[transform,border-color,box-shadow,opacity,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform before:pointer-events-none before:absolute before:inset-y-0 before:left-[-40%] before:z-[3] before:w-[45%] before:-skew-x-12 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent)] before:opacity-0 before:translate-x-[-130%] before:transition-all before:duration-500 before:ease-out hover:before:opacity-30 hover:before:translate-x-[130%] hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_28px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,175,55,0.45),0_0_56px_rgba(212,175,55,0.18),inset_0_1px_0_rgba(212,175,55,0.12)] motion-reduce:transition-[border-color,box-shadow,opacity] motion-reduce:hover:translate-y-0 md:min-h-[448px] md:rounded-3xl md:p-8 h-full ${
        hoveredCard !== null && hoveredCard !== idx ? "opacity-[0.68]" : "opacity-100"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-6 top-0 z-[4] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent opacity-30 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <span
        className="absolute right-6 top-6 z-[7] select-none font-display text-[10px] font-light tabular-nums tracking-[0.28em] text-[#D4AF37]/30 transition-colors duration-300 group-hover:text-[#D4AF37]/75 md:right-8 md:top-8 md:text-[11px]"
        aria-hidden
      >
        {service.ordinal}
      </span>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_15%_-10%,rgba(171,131,57,0.07),transparent_55%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_90%_100%,rgba(212,175,55,0.04),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {createElement(
        headingAs,
        {
          className:
            "relative z-[6] row-start-1 block w-full min-w-0 overflow-hidden whitespace-nowrap pr-12 font-ui font-bold leading-[1.2] tracking-[1px] text-accent transition-all duration-300 ease-out group-hover:text-accentLight group-hover:[text-shadow:0_0_20px_rgba(171,131,57,0.18)] md:pr-14",
          style: { fontSize: "clamp(0.78rem, 2.8vw, 1.1rem)", fontWeight: 700 },
        },
        service.title
      )}

      <p className="relative z-[6] row-start-2 mt-4 min-h-0 max-w-[54ch] self-start font-body text-[0.9375rem] font-normal leading-[1.6] text-text transition-[color,opacity] duration-300 ease-out group-hover:text-[#ececec] md:text-[15px]">
        {service.desc}
      </p>

      <div className="relative z-[4] row-start-3 -mt-6 flex min-h-[156px] items-center justify-center md:-mt-7 md:min-h-[172px]">
        <ServiceCardHeroVisual variant={service.visualVariant} />
      </div>

      <div className="relative z-[6] row-start-4 mt-6 flex min-h-[3.5rem] w-full items-end border-t border-white/[0.09] pt-6">
        <span className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[1px] text-[var(--color-text-body)] transition-colors duration-300 group-hover:text-[rgba(171,131,57,0.98)]">
          Shiko shërbimin
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
