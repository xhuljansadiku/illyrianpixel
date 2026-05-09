"use client";

import { useId } from "react";

export type ServiceCardVisualVariant = "web" | "marketing" | "branding" | "ecommerce" | "smm" | "maintenance";

const GOLD = "#D4AF37";
const FROST = "rgba(255,255,255,0.42)";
const FROST_SOFT = "rgba(255,255,255,0.18)";

type Props = {
  variant: ServiceCardVisualVariant;
};

export default function ServiceCardHeroVisual({ variant }: Props) {
  const raw = useId().replace(/:/g, "");
  const i = (s: string) => `${raw}-${s}`;

  const wrap =
    "pointer-events-none relative mx-auto flex h-[118px] w-full max-w-[196px] shrink-0 select-none items-center justify-center motion-safe:animate-[serviceCardFloat_4.8s_ease-in-out_infinite] transition-[filter] duration-500 ease-out group-hover:[filter:drop-shadow(0_0_22px_rgba(212,175,55,0.5))_drop-shadow(0_0_48px_rgba(212,175,55,0.22))] motion-reduce:animate-none motion-reduce:group-hover:filter-none md:h-[134px] md:max-w-[216px]";

  if (variant === "web") {
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 240 200" className="h-full w-full overflow-visible" fill="none">
          <defs>
            <linearGradient id={i("web-gold")} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.9" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Browser window */}
          <rect x="16" y="16" width="208" height="158" rx="10"
            stroke={`url(#${i("web-gold")})`} strokeWidth="1.1"
            fill="rgba(255,255,255,0.022)" />

          {/* Browser chrome bar */}
          <rect x="16" y="16" width="208" height="28" rx="10" fill="rgba(255,255,255,0.05)" />
          <rect x="16" y="34" width="208" height="10" fill="rgba(255,255,255,0.05)" />

          {/* Window dots */}
          <circle cx="34" cy="30" r="3.5" fill={GOLD} fillOpacity="0.75" />
          <circle cx="46" cy="30" r="3.5" fill={FROST_SOFT} />
          <circle cx="58" cy="30" r="3.5" fill={FROST_SOFT} />

          {/* URL bar */}
          <rect x="72" y="23" width="118" height="14" rx="7"
            fill="rgba(255,255,255,0.06)" stroke={FROST_SOFT} strokeWidth="0.5" />

          {/* Cart icon top-right */}
          <path d="M204 23 L201 23 L198 32 L212 32 L214 27 L198 27"
            stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" />
          <circle cx="200" cy="34.5" r="1.8" fill={GOLD} fillOpacity="0.75" />
          <circle cx="210" cy="34.5" r="1.8" fill={GOLD} fillOpacity="0.75" />
          {/* Cart badge */}
          <circle cx="214" cy="22" r="4.5" fill={GOLD} fillOpacity="0.9"
            className="motion-safe:animate-[serviceMarketingPulse_2.2s_ease-in-out_infinite] motion-reduce:animate-none [transform-box:fill-box] [transform-origin:center]" />

          {/* Separator */}
          <line x1="16" y1="44" x2="224" y2="44" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

          {/* Product image placeholder */}
          <rect x="24" y="52" width="82" height="82" rx="7"
            fill="rgba(255,255,255,0.04)" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.35"
            className="motion-safe:animate-[serviceWebGridBreathe_4.5s_ease-in-out_infinite] motion-reduce:animate-none" />
          <circle cx="65" cy="93" r="18" fill="rgba(255,255,255,0.04)" stroke={FROST_SOFT} strokeWidth="0.6" />
          <path d="M52 106 L65 75 L78 106 M59 96 L71 96"
            stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />

          {/* Product info, right */}
          {/* Title */}
          <rect x="116" y="56" width="88" height="6" rx="3" fill={FROST} fillOpacity="0.45" />
          <rect x="116" y="67" width="64" height="5" rx="2.5" fill={FROST_SOFT} />

          {/* Stars */}
          <rect x="116" y="80" width="52" height="4" rx="2" fill={GOLD} fillOpacity="0.3" />

          {/* Price */}
          <rect x="116" y="92" width="46" height="9" rx="4.5" fill={GOLD} fillOpacity="0.65" />
          <rect x="168" y="94" width="28" height="5" rx="2.5" fill={FROST_SOFT} />

          {/* Add to cart button */}
          <rect x="116" y="110" width="94" height="22" rx="7"
            fill={GOLD} fillOpacity="0.16" stroke={GOLD} strokeWidth="0.85" strokeOpacity="0.75"
            className="motion-safe:animate-[serviceWebGridBreathe_3.5s_ease-in-out_infinite] motion-reduce:animate-none" />
          <rect x="133" y="118" width="60" height="5" rx="2.5" fill={GOLD} fillOpacity="0.65" />

          {/* Product thumbnails bottom */}
          {[24, 68, 112, 156].map((x, idx) => (
            <rect key={idx} x={x} y="146" width="36" height="22" rx="5"
              fill="rgba(255,255,255,0.03)"
              stroke={idx === 3 ? GOLD : FROST_SOFT}
              strokeWidth={idx === 3 ? "0.7" : "0.4"}
              strokeOpacity={idx === 3 ? 0.6 : 0.3} />
          ))}
          <rect x="200" y="146" width="22" height="22" rx="5"
            fill={GOLD} fillOpacity="0.1" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.5" />
        </svg>
      </div>
    );
  }

  if (variant === "marketing") {
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 240 200" className="h-full w-full overflow-visible" fill="none">
          <defs>
            <linearGradient id={i("seo-line")} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.15" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Search bar */}
          <rect x="20" y="18" width="200" height="26" rx="13"
            fill="rgba(255,255,255,0.04)" stroke={GOLD} strokeWidth="0.9" strokeOpacity="0.6" />
          {/* Magnifying glass */}
          <circle cx="38" cy="31" r="6.5" stroke={GOLD} strokeWidth="1.1" strokeOpacity="0.8" />
          <line x1="43" y1="36" x2="48.5" y2="41.5" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8" />
          {/* Search text */}
          <rect x="56" y="27" width="108" height="8" rx="4" fill={FROST_SOFT} />
          {/* Search button */}
          <rect x="174" y="22" width="38" height="18" rx="9"
            fill={GOLD} fillOpacity="0.18" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.6" />
          <rect x="181" y="28" width="24" height="5" rx="2.5" fill={GOLD} fillOpacity="0.7" />

          {/* Result rows */}
          {/* #1 */}
          <rect x="20" y="56" width="7" height="7" rx="2" fill={GOLD} fillOpacity="0.9" />
          <rect x="34" y="56" width="128" height="7" rx="3.5" fill={FROST} fillOpacity="0.55" />
          <rect x="34" y="68" width="86" height="4" rx="2" fill={FROST_SOFT} />
          {/* #2 */}
          <rect x="20" y="82" width="7" height="7" rx="2" fill={GOLD} fillOpacity="0.45" />
          <rect x="34" y="82" width="108" height="7" rx="3.5" fill={FROST_SOFT} />
          <rect x="34" y="94" width="70" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
          {/* #3 */}
          <rect x="20" y="108" width="7" height="7" rx="2" fill={GOLD} fillOpacity="0.2" />
          <rect x="34" y="108" width="90" height="7" rx="3.5" fill="rgba(255,255,255,0.12)" />
          <rect x="34" y="120" width="60" height="4" rx="2" fill="rgba(255,255,255,0.07)" />

          {/* Divider */}
          <line x1="20" y1="134" x2="220" y2="134" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

          {/* Growth chart */}
          <polyline
            points="24,178 58,168 92,158 126,148 156,134 186,118 212,102"
            stroke={`url(#${i("seo-line")})`} strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            className="motion-safe:animate-[serviceWebGridBreathe_3.5s_ease-in-out_infinite] motion-reduce:animate-none" />
          {/* Axis */}
          <line x1="20" y1="136" x2="20" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="20" y1="180" x2="220" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          {/* Top dot + arrow */}
          <circle cx="212" cy="102" r="4" fill={GOLD}
            className="motion-safe:animate-[serviceMarketingPulse_2s_ease-in-out_infinite] motion-reduce:animate-none [transform-box:fill-box] [transform-origin:center]" />
          <path d="M207 92 L212 82 L217 92" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" />
        </svg>
      </div>
    );
  }

  if (variant === "ecommerce") {
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 240 200" className="h-full w-full overflow-visible" fill="none">
          <defs>
            <linearGradient id={i("ec-gold")} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.9" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Shopping bag */}
          <path d="M82 92 L158 92 L148 162 L92 162 Z"
            stroke={`url(#${i("ec-gold")})`} strokeWidth="1.2" fill="rgba(255,255,255,0.025)" strokeLinejoin="round" />
          {/* Handles */}
          <path d="M102 92 Q102 66 120 66 Q138 66 138 92"
            stroke={GOLD} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.8" />

          {/* Items inside */}
          <rect x="96" y="110" width="22" height="22" rx="4" fill="rgba(255,255,255,0.05)" stroke={FROST_SOFT} strokeWidth="0.5" />
          <rect x="122" y="110" width="22" height="22" rx="4" fill="rgba(255,255,255,0.05)" stroke={FROST_SOFT} strokeWidth="0.5" />
          <rect x="109" y="136" width="22" height="16" rx="4" fill={GOLD} fillOpacity="0.12" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.5" />

          {/* Price tag badge */}
          <rect x="148" y="64" width="44" height="22" rx="8" fill={GOLD} fillOpacity="0.85" />
          <rect x="154" y="70" width="32" height="10" rx="3" fill="rgba(10,10,10,0.25)" />

          {/* Cart count */}
          <circle cx="172" cy="54" r="11" fill={GOLD} fillOpacity="0.9"
            className="motion-safe:animate-[serviceMarketingPulse_2.2s_ease-in-out_infinite] motion-reduce:animate-none [transform-box:fill-box] [transform-origin:center]" />

          {/* Mini product, left */}
          <rect x="28" y="60" width="42" height="54" rx="6" fill="rgba(255,255,255,0.025)" stroke={FROST_SOFT} strokeWidth="0.4" />
          <rect x="32" y="64" width="34" height="30" rx="4" fill="rgba(255,255,255,0.04)" />
          <rect x="32" y="100" width="22" height="4" rx="2" fill={FROST_SOFT} />
          <rect x="32" y="108" width="16" height="3" rx="1.5" fill={GOLD} fillOpacity="0.45" />

          {/* Mini product, right */}
          <rect x="170" y="104" width="42" height="54" rx="6" fill="rgba(255,255,255,0.025)" stroke={FROST_SOFT} strokeWidth="0.4" />
          <rect x="174" y="108" width="34" height="30" rx="4" fill="rgba(255,255,255,0.04)" />
          <rect x="174" y="144" width="22" height="4" rx="2" fill={FROST_SOFT} />
          <rect x="174" y="152" width="16" height="3" rx="1.5" fill={GOLD} fillOpacity="0.45" />

          {/* Floating sparkles */}
          <circle cx="50" cy="170" r="3" fill={GOLD} fillOpacity="0.5"
            className="motion-safe:animate-[serviceCardFloat_4s_ease-in-out_infinite] motion-reduce:animate-none [animation-delay:-1s]" />
          <circle cx="192" cy="52" r="2.5" fill={FROST} fillOpacity="0.4"
            className="motion-safe:animate-[serviceCardFloat_3.5s_ease-in-out_infinite] motion-reduce:animate-none [animation-delay:-0.5s]" />
        </svg>
      </div>
    );
  }

  if (variant === "smm") {
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 240 200" className="h-full w-full overflow-visible" fill="none">
          {/* Phone frame */}
          <rect x="68" y="10" width="104" height="178" rx="16"
            stroke={GOLD} strokeWidth="1.1" strokeOpacity="0.7" fill="rgba(255,255,255,0.022)" />
          <rect x="72" y="26" width="96" height="146" rx="8" fill="rgba(255,255,255,0.018)" />
          {/* Notch */}
          <rect x="100" y="14" width="40" height="8" rx="4" fill="rgba(0,0,0,0.4)" />

          {/* Profile row */}
          <circle cx="86" cy="44" r="8" fill="rgba(255,255,255,0.07)" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.6" />
          <rect x="100" y="39" width="48" height="6" rx="3" fill={FROST} fillOpacity="0.45" />
          <rect x="100" y="49" width="32" height="4" rx="2" fill={FROST_SOFT} />

          {/* Post image */}
          <rect x="72" y="62" width="96" height="54" rx="4"
            fill="rgba(255,255,255,0.04)" stroke={FROST_SOFT} strokeWidth="0.4"
            className="motion-safe:animate-[serviceWebGridBreathe_4s_ease-in-out_infinite] motion-reduce:animate-none" />

          {/* Engagement row */}
          <path d="M82 126 Q84 121 88 126 Q92 121 94 126" stroke={GOLD} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeOpacity="0.75" />
          <rect x="102" y="122" width="14" height="7" rx="3" fill="rgba(255,255,255,0.06)" stroke={FROST_SOFT} strokeWidth="0.4" />
          <rect x="120" y="122" width="14" height="7" rx="3" fill="rgba(255,255,255,0.06)" stroke={FROST_SOFT} strokeWidth="0.4" />
          <rect x="142" y="122" width="20" height="7" rx="3" fill={GOLD} fillOpacity="0.15" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.5" />

          {/* Mini post grid */}
          <rect x="72" y="136" width="28" height="28" rx="4" fill="rgba(255,255,255,0.04)" stroke={FROST_SOFT} strokeWidth="0.3" />
          <rect x="104" y="136" width="28" height="28" rx="4" fill="rgba(255,255,255,0.04)" stroke={FROST_SOFT} strokeWidth="0.3" />
          <rect x="136" y="136" width="28" height="28" rx="4" fill={GOLD} fillOpacity="0.08" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.45" />

          {/* Notification bubble */}
          <circle cx="188" cy="42" r="14" fill={GOLD} fillOpacity="0.11" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.6"
            className="motion-safe:animate-[serviceMarketingPulse_2.4s_ease-in-out_infinite] motion-reduce:animate-none [transform-box:fill-box] [transform-origin:center]" />
          <rect x="182" y="38" width="12" height="8" rx="2" fill={GOLD} fillOpacity="0.65" />

          {/* Like bubble, left */}
          <circle cx="50" cy="88" r="10" fill="rgba(255,255,255,0.04)" stroke={FROST_SOFT} strokeWidth="0.6"
            className="motion-safe:animate-[serviceCardFloat_3.8s_ease-in-out_infinite] motion-reduce:animate-none [animation-delay:-1.2s]" />
          <rect x="44" y="85" width="12" height="6" rx="2" fill={FROST_SOFT} />
        </svg>
      </div>
    );
  }

  if (variant === "maintenance") {
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 240 200" className="h-full w-full overflow-visible" fill="none">
          <defs>
            <radialGradient id={i("maint-glow")} cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.12" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow */}
          <ellipse cx="120" cy="90" rx="70" ry="60" fill={`url(#${i("maint-glow")})`} />

          {/* Shield */}
          <path d="M120 22 L170 44 L170 106 Q170 148 120 170 Q70 148 70 106 L70 44 Z"
            stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.65" fill="rgba(255,255,255,0.022)" strokeLinejoin="round" />
          <path d="M120 34 L158 52 L158 106 Q158 138 120 156 Q82 138 82 106 L82 52 Z"
            stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.25" fill="rgba(212,175,55,0.03)" strokeLinejoin="round" />

          {/* Checkmark */}
          <path d="M100 94 L113 110 L144 76"
            stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92"
            className="motion-safe:animate-[serviceWebGridBreathe_4s_ease-in-out_infinite] motion-reduce:animate-none" />

          {/* Orbiting dots */}
          <g className="motion-safe:origin-[120px_94px] motion-safe:animate-[serviceBrandingRotate_10s_linear_infinite] motion-reduce:animate-none"
            style={{ transformBox: "fill-box" as const }}>
            <circle cx="188" cy="94" r="5" fill={GOLD} fillOpacity="0.55" />
            <circle cx="120" cy="162" r="4" fill={GOLD} fillOpacity="0.3" />
            <circle cx="52" cy="94" r="5" fill={GOLD} fillOpacity="0.55" />
          </g>

          {/* Heartbeat line */}
          <polyline
            points="22,182 46,182 56,164 66,196 76,170 90,182 118,182 128,168 138,182 202,182 216,182"
            stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7"
            className="motion-safe:animate-[serviceWebGridBreathe_2.5s_ease-in-out_infinite] motion-reduce:animate-none" />

          {/* Status dots */}
          <circle cx="30" cy="26" r="5" fill={GOLD} fillOpacity="0.9"
            className="motion-safe:animate-[serviceMarketingPulse_1.8s_ease-in-out_infinite] motion-reduce:animate-none [transform-box:fill-box] [transform-origin:center]" />
          <circle cx="46" cy="26" r="5" fill={GOLD} fillOpacity="0.45" />
          <circle cx="62" cy="26" r="5" fill={FROST_SOFT} />
        </svg>
      </div>
    );
  }

  return (
    <div className={wrap} aria-hidden>
      <svg viewBox="0 0 240 200" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id={i("brand-gold")} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.9" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Brand card */}
        <rect x="16" y="14" width="124" height="172" rx="10"
          fill="rgba(255,255,255,0.022)" stroke={`url(#${i("brand-gold")})`} strokeWidth="1" />

        {/* Logo mark circle */}
        <circle cx="78" cy="68" r="34" fill="rgba(255,255,255,0.035)" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.4"
          className="motion-safe:animate-[serviceWebGridBreathe_5s_ease-in-out_infinite] motion-reduce:animate-none" />
        {/* Rotating orbit */}
        <g className="motion-safe:origin-[78px_68px] motion-safe:animate-[serviceBrandingRotate_18s_linear_infinite] motion-reduce:animate-none"
          style={{ transformBox: "fill-box" as const }}>
          <ellipse cx="78" cy="68" rx="34" ry="20" stroke={GOLD} strokeWidth="0.6" strokeDasharray="5 7" strokeOpacity="0.4" />
        </g>
        {/* Letter mark */}
        <path d="M66 56 L66 80 M66 56 L76 56 Q82 56 82 63 Q82 70 76 70 L66 70"
          stroke={GOLD} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" />
        <line x1="88" y1="56" x2="88" y2="80" stroke={FROST} strokeWidth="1.9" strokeLinecap="round" strokeOpacity="0.55" />

        {/* Brand name lines */}
        <rect x="28" y="114" width="96" height="8" rx="4" fill={FROST} fillOpacity="0.4" />
        <rect x="40" y="127" width="72" height="5" rx="2.5" fill={FROST_SOFT} />

        {/* Color swatches */}
        <line x1="28" y1="146" x2="132" y2="146" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
        {[
          [36,  162, GOLD,                    0.9],
          [56,  162, "rgba(255,255,255,1)",   0.38],
          [76,  162, "rgba(171,131,57,1)",    0.35],
          [96,  162, "rgba(255,255,255,1)",   0.12],
          [116, 162, "rgba(20,20,20,1)",      1.0],
        ].map(([cx, cy, fill, op], idx) => (
          <circle key={idx} cx={cx as number} cy={cy as number} r="9"
            fill={fill as string} fillOpacity={op as number}
            stroke={FROST_SOFT} strokeWidth="0.3" />
        ))}

        {/* Content panel, right */}
        <rect x="152" y="14" width="72" height="172" rx="10"
          fill="rgba(255,255,255,0.016)" stroke={FROST_SOFT} strokeWidth="0.5" />

        {/* Camera body */}
        <rect x="162" y="28" width="52" height="38" rx="7"
          fill="rgba(255,255,255,0.04)" stroke={FROST_SOFT} strokeWidth="0.7" />
        {/* Lens */}
        <circle cx="188" cy="47" r="12" fill="rgba(255,255,255,0.04)"
          stroke={GOLD} strokeWidth="0.9" strokeOpacity="0.55"
          className="motion-safe:animate-[serviceWebGridBreathe_4s_ease-in-out_infinite] motion-reduce:animate-none" />
        <circle cx="188" cy="47" r="6" fill="rgba(255,255,255,0.05)" stroke={FROST_SOFT} strokeWidth="0.5" />
        {/* Flash bump */}
        <rect x="162" y="28" width="14" height="8" rx="3" fill="rgba(255,255,255,0.09)" />

        {/* Content lines */}
        <rect x="162" y="76" width="52" height="6" rx="3" fill={FROST} fillOpacity="0.38" />
        <rect x="162" y="87" width="42" height="4" rx="2" fill={FROST_SOFT} />
        <rect x="162" y="96" width="36" height="4" rx="2" fill={FROST_SOFT} />

        {/* Post grid */}
        {[[162,108,24,24,true],[190,108,24,24,false],[162,136,24,24,false],[190,136,24,24,false]].map(
          ([x, y, w, h, accent], idx) => (
            <rect key={idx} x={x as number} y={y as number} width={w as number} height={h as number} rx="5"
              fill={accent ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)"}
              stroke={accent ? GOLD : FROST_SOFT}
              strokeWidth={accent ? 0.8 : 0.35}
              strokeOpacity={accent ? 0.65 : 0.25} />
          )
        )}
      </svg>
    </div>
  );
}
