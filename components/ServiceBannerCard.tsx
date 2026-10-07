"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ServiceCardHeroVisual from "@/components/ServiceCardHeroVisual";
import { useReducedMotion } from "@/lib/gsap";
import type { ServiceOverviewCard } from "@/lib/serviceOverviewCards";

type Props = {
  service: ServiceOverviewCard;
  reversed?: boolean;
  headingAs?: "h2" | "h3";
  cardRef?: (node: HTMLAnchorElement | null) => void;
};

export default function ServiceBannerCard({ service, reversed = false, headingAs = "h2", cardRef }: Props) {
  const t = useTranslations("home.servicesSection");
  const spaceIdx = service.title.indexOf(" ");
  const firstWord = spaceIdx > -1 ? service.title.slice(0, spaceIdx) : service.title;
  const rest = spaceIdx > -1 ? service.title.slice(spaceIdx) : "";

  const Heading = headingAs;
  const reducedMotion = useReducedMotion();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !finePointer) return;
    const node = linkRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    node.style.transform = `translateY(-4px) rotateX(${(0.5 - py) * 4}deg) rotateY(${(px - 0.5) * 6}deg)`;
    node.style.setProperty("--spot-x", `${px * 100}%`);
    node.style.setProperty("--spot-y", `${py * 100}%`);
  };

  const handleMouseLeave = () => {
    linkRef.current?.style.removeProperty("transform");
  };

  return (
    <Link
      href={service.href}
      ref={(node) => {
        linkRef.current = node;
        cardRef?.(node);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(140deg,#111111_0%,#0d0d0d_55%,#0f0f0f_100%)] shadow-[0_16px_48px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] will-change-transform hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,175,55,0.35),0_0_48px_rgba(212,175,55,0.1)] sm:flex-row sm:min-h-[260px]"
    >
      {/* Top accent line */}
      <div
        className="pointer-events-none absolute inset-x-8 top-0 z-[4] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_10%_50%,rgba(171,131,57,0.06),transparent_60%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {/* Cursor-tracked spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle 260px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(212,175,55,0.14), transparent 70%)" }}
        aria-hidden
      />

      {/* Shimmer sweep */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100"
        aria-hidden
      />

      {/* Visual panel */}
      <div
        className={`relative flex min-h-[220px] flex-shrink-0 items-center justify-center border-white/[0.06] bg-[rgba(255,255,255,0.018)] p-8 sm:min-h-0 sm:w-[38%] sm:p-10 ${
          reversed ? "sm:order-last sm:border-l" : "sm:border-r"
        }`}
      >
        {/* Inner glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,rgba(171,131,57,0.07),transparent_65%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <div className="relative z-[2] w-full max-w-[230px]">
          <ServiceCardHeroVisual variant={service.visualVariant} />
        </div>
      </div>

      {/* Content panel */}
      <div className="relative z-[2] flex flex-col justify-center gap-5 p-8 sm:w-[62%] sm:p-10 lg:p-14">
        {/* Ordinal */}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/35 transition-colors duration-300 group-hover:text-[#D4AF37]/60">
          {service.ordinal}
        </span>

        <Heading className="font-display text-[clamp(1.65rem,3.2vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
          <span className="text-[#D4AF37] transition-all duration-300 group-hover:[text-shadow:0_0_28px_rgba(212,175,55,0.45)]">
            {firstWord}
          </span>
          {rest && <span className="text-white/90">{rest}</span>}
        </Heading>

        <p className="max-w-[52ch] font-body text-[0.9375rem] leading-[1.72] text-white/50 transition-colors duration-300 group-hover:text-white/65">
          {service.desc}
        </p>

        <div>
          <span className="inline-flex items-center gap-2.5 rounded-[6px] bg-[#D4AF37] px-5 py-2.5 font-body text-[11px] font-bold uppercase tracking-[1.5px] text-[#0a0a0a] shadow-[0_2px_12px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:bg-[#eace71] group-hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)]">
            {t("cardCta")}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
