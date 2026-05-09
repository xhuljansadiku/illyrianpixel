"use client";

import { useId } from "react";
import type { ServiceCategory } from "@/lib/serviceCategories";

/** Shared shell: same placement & visibility for all service hero accents */
const SERVICE_HERO_DECOR_SHELL =
  "pointer-events-none absolute top-1/2 z-0 hidden -translate-y-[45%] md:block -right-2 lg:right-4";

const HERO_DECOR_FLOAT = "motion-safe:animate-[serviceCardFloat_6s_ease-in-out_infinite] motion-reduce:animate-none";

const HERO_DECOR_GLOW =
  "drop-shadow-[0_0_28px_rgba(212,175,55,0.35)] motion-safe:animate-[brandingOrbitGlow_4s_ease-in-out_infinite] motion-reduce:animate-none";

const HERO_DECOR_SVG_FRAME =
  "h-[min(280px,42vw)] w-auto max-w-[240px] md:h-[min(320px,36vw)] md:max-w-[280px] lg:h-[340px] lg:max-w-[300px]";

/** Floating wireframe "A", marketing growth hero accent */
export function MarketingGeometricA({ className = "" }: { className?: string }) {
  return (
    <div className={`${HERO_DECOR_FLOAT} ${className}`} aria-hidden>
      <svg
        viewBox="0 0 200 220"
        className={`${HERO_DECOR_SVG_FRAME} opacity-[0.26] md:opacity-[0.32] ${HERO_DECOR_GLOW}`}
        fill="none"
      >
        <defs>
          <linearGradient id="svc-hero-mkt-a-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.35)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#svc-hero-mkt-a-stroke)"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M100 28 L164 188 M100 28 L36 188 M62 132 L138 132" opacity="0.95" />
          <path d="M76 96 L124 96 M88 72 L112 72" strokeWidth="0.75" opacity="0.45" />
          <path d="M100 40 L100 72 M72 118 L128 118" strokeDasharray="4 5" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}

/** Large isometric wireframe cube, Web & E-Commerce hero */
export function WebWireframeCube({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <div className={`select-none ${className}`} aria-hidden>
      <div className={HERO_DECOR_FLOAT}>
        <div className="mx-auto w-fit" style={{ perspective: "920px" }}>
          <div
            className="mx-auto w-fit motion-safe:animate-[serviceHeroCubeRotateY_52s_linear_infinite] motion-reduce:animate-none"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden" as const,
              transformOrigin: "50% 48%",
            }}
          >
            <svg
              viewBox="0 0 320 340"
              className={`${HERO_DECOR_SVG_FRAME} opacity-[0.26] md:opacity-[0.32] ${HERO_DECOR_GLOW}`}
              fill="none"
            >
              <defs>
                <radialGradient id={`${uid}-cube-aura`} cx="50%" cy="46%" r="58%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                  <stop offset="45%" stopColor="#D4AF37" stopOpacity="0.035" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <linearGradient id={`${uid}-cube-edge`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.42)" stopOpacity="1" />
                </linearGradient>
                <filter id={`${uid}-cube-soft`} x="-35%" y="-35%" width="170%" height="170%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse cx="160" cy="175" rx="148" ry="128" fill={`url(#${uid}-cube-aura)`} />
              <g
                opacity="0.5"
                filter={`url(#${uid}-cube-soft)`}
                stroke="#D4AF37"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M160 48 L235 96 L235 168 L160 216 L85 168 L85 96 Z" />
                <path d="M160 48 L160 122 M85 96 L160 122 M235 96 L160 122" />
                <path d="M160 122 L160 216" strokeDasharray="5 6" opacity="0.85" />
                <path d="M160 122 L102 150 M160 122 L218 150" />
                <path d="M102 150 L160 182 L218 150" strokeWidth="1.6" opacity="0.75" />
              </g>
              <g
                stroke={`url(#${uid}-cube-edge)`}
                strokeWidth="1.05"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M160 48 L235 96 L235 168 L160 216 L85 168 L85 96 Z" />
                <path d="M160 48 L160 122 M85 96 L160 122 M235 96 L160 122" />
                <path d="M160 122 L160 216" strokeDasharray="5 6" opacity="0.72" />
                <path d="M160 122 L102 150 M160 122 L218 150" opacity="0.92" />
                <path d="M102 150 L160 182 L218 150" opacity="0.8" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Orbit motif with gold glow, branding hero accent */
export function BrandingOrbitGlow({ className = "" }: { className?: string }) {
  return (
    <div className={`${HERO_DECOR_FLOAT} ${className}`} aria-hidden>
      <svg
        viewBox="0 0 240 240"
        className={`${HERO_DECOR_SVG_FRAME} opacity-[0.26] md:opacity-[0.32] ${HERO_DECOR_GLOW}`}
        fill="none"
      >
        <defs>
          <radialGradient id="svc-hero-orbit-core" cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#D4AF37" stopOpacity="0.08" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="svc-hero-orbit-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="120" cy="120" r="38" fill="url(#svc-hero-orbit-core)" opacity="0.85" />
        <g
          stroke="#D4AF37"
          strokeWidth="1"
          opacity="0.55"
          filter="url(#svc-hero-orbit-soft)"
        >
          <ellipse cx="120" cy="120" rx="92" ry="44" transform="rotate(-28 120 120)" />
          <ellipse cx="120" cy="120" rx="92" ry="44" transform="rotate(32 120 120)" />
          <ellipse cx="120" cy="120" rx="92" ry="44" transform="rotate(90 120 120)" />
        </g>
        <circle cx="120" cy="120" r="4" fill="#D4AF37" fillOpacity="0.75" />
        <circle cx="168" cy="88" r="3.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="78" cy="152" r="2.8" fill="#D4AF37" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

export function ServiceHeroDecoration({ slug }: { slug: ServiceCategory["slug"] }) {
  if (slug === "website" || slug === "ecommerce") {
    return <WebWireframeCube className={SERVICE_HERO_DECOR_SHELL} />;
  }
  if (slug === "marketing-growth") {
    return <MarketingGeometricA className={SERVICE_HERO_DECOR_SHELL} />;
  }
  if (slug === "branding-content") {
    return <BrandingOrbitGlow className={SERVICE_HERO_DECOR_SHELL} />;
  }
  return null;
}
