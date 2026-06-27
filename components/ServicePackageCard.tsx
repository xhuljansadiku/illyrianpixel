"use client";

import Link from "next/link";
import type { ServicePackage } from "@/lib/serviceCategories";

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[3px] shrink-0">
      <path d="M1.5 6.5L5 10L11.5 3" stroke="#ab8339" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[3px] shrink-0">
      <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  pkg: ServicePackage;
  conversionCta?: boolean;
};

export default function ServicePackageCard({ pkg }: Props) {
  const ctaLabel = pkg.cta ?? "Fillo Tani";

  return (
    /* Wrapper gives room above the card for the badge */
    <div className="relative flex flex-col pt-5">
      {pkg.featured && (
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-accent px-4 py-[5px] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0e0d0c] shadow-[0_0_24px_rgba(171,131,57,0.45)]">
            Më e zgjedhura
          </span>
        </div>
      )}

      <div
        className={`svc-price-card service-bento-card group relative flex flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.03)] bg-[linear-gradient(160deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005)_52%,rgba(171,131,57,0.04))] p-6 backdrop-blur-[2px] transition-[border-color,box-shadow,transform,opacity] duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-y-0 before:left-[-34%] before:z-[2] before:w-[42%] before:-skew-x-12 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)] before:opacity-0 before:translate-x-[-120%] before:transition-all before:duration-[800ms] before:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:before:opacity-25 group-hover:before:translate-x-[120%] animate-[servicesIdleGlow_3.6s_ease-in-out_infinite] hover:[animation-play-state:paused] md:hover:-translate-y-0.5 ${
          pkg.featured
            ? "border-accent/35 shadow-[0_25px_80px_rgba(171,131,57,0.25)] hover:shadow-[0_28px_88px_rgba(171,131,57,0.28)]"
            : "opacity-95 hover:border-accent/35 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(171,131,57,0.15)]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_8%,rgba(171,131,57,0.065),transparent_62%)] opacity-70 transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[radial-gradient(circle_at_72%_20%,rgba(171,131,57,0.14),transparent_64%)] group-hover:opacity-100" />
        <div className="relative z-[3] flex flex-1 flex-col">

          <p className={`font-display text-[1.6rem] font-semibold tracking-[-0.01em] leading-none ${pkg.featured ? "text-accent/90" : "text-white/60"}`}>
            {pkg.name}
          </p>
          {pkg.tagline && (
            <p className="font-ui mt-1.5 text-[11px] font-bold leading-snug tracking-[1px] text-accent">
              {pkg.tagline}
            </p>
          )}

          <div className="mt-3 flex items-end gap-1.5">
            <p className="font-display text-[clamp(2rem,3.5vw,2.5rem)] font-medium leading-none tracking-[0.02em] text-text">
              {pkg.price}
            </p>
            {pkg.priceNote && (
              <p className="mb-[3px] font-ui text-[13px] text-muted">{pkg.priceNote}</p>
            )}
          </div>

          <p className="font-ui mt-2 md:whitespace-pre-line text-[12px] font-normal leading-[1.6] text-text">{pkg.ideal}</p>

          <div className="my-5 h-px bg-white/[0.07]" />

          <ul className="flex flex-col gap-3">
            {(pkg.featureBullets ?? []).length > 0
              ? pkg.featureBullets!.map((row) => (
                  <li key={row.emphasis + row.detail} className="font-ui flex items-start gap-2.5 text-[13px] font-normal leading-[1.6] text-text">
                    <CheckIcon />
                    <span>
                      <span className="font-semibold text-white/88">{row.emphasis}</span>{" "}
                      <span className="font-light">{row.detail}</span>
                    </span>
                  </li>
                ))
              : pkg.features.map((f) => (
                  <li key={f} className="font-ui flex items-start gap-2.5 text-[13px] font-normal leading-[1.6] text-text">
                    <CheckIcon />
                    <span className="font-ui font-light whitespace-pre-line">{f}</span>
                  </li>
                ))}
          </ul>

          {pkg.notIncluded && pkg.notIncluded.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2.5">
              {pkg.notIncluded.map((f) => (
                <li key={f} className="font-ui flex items-start gap-2.5 text-[12px] font-light leading-[1.5] text-white/28">
                  <XIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6">
            {pkg.featured ? (
              <Link
                href="/contact"
                className="interactive-button ip-cta-primary group inline-flex w-full items-center justify-center gap-2 !py-3.5 !text-[11px] !tracking-[1px] !text-[#0e0d0c]"
              >
                {ctaLabel}
                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            ) : (
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.02] px-4 py-3.5 font-ui text-[11px] font-semibold tracking-[1px] text-text transition-all duration-300 hover:border-accent/35 hover:bg-accent/[0.06] hover:text-white"
              >
                {ctaLabel}
                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
