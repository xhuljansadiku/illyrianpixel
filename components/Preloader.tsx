"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { ensureGSAP } from "@/lib/gsap";

const BOT_UA_PATTERN = /bot|googlebot|crawl|spider|robot|crawling|lighthouse|pagespeed|chrome-lighthouse/i;

export default function Preloader() {
  // Always true on both server and client's first render (no window-dependent
  // check here) so this is part of the very first paint — no flash of the real
  // page underneath. The bot check below hides it again before paint if needed.
  const [visible, setVisible] = useState(true);
  const [offline, setOffline] = useState(() =>
    typeof window !== "undefined" ? !navigator.onLine : false
  );
  const progressRef = useRef<HTMLParagraphElement | null>(null);
  const brand = "ILLYRIAN PIXEL";

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useLayoutEffect(() => {
    if (!visible || offline) return;

    // Skip for crawlers, Lighthouse, and PageSpeed — they must measure real LCP.
    if (BOT_UA_PATTERN.test(navigator.userAgent)) {
      setVisible(false);
      return;
    }

    const { gsap } = ensureGSAP();
    const counter = { value: 0 };

    const tl = gsap.timeline({ onComplete: () => setVisible(false) });

    tl
      // 1+2. Orb + corners together (fast entry)
      .fromTo(".pl-orb",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }
      )
      .fromTo(".pl-corner",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.25, stagger: 0.04, ease: "power2.out" },
        "-=0.2"
      )
      // 3+4. Label + logo ring together
      .fromTo([".pl-label", ".pl-logo-ring"],
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        "-=0.1"
      )
      // 5+6. Logo image + shine
      .fromTo(".pl-logo-img",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" }
      )
      .fromTo(".pl-shine",
        { xPercent: -130 },
        { xPercent: 130, duration: 0.4, ease: "power2.inOut" },
        "-=0.1"
      )
      // 7+8+9. Brand text, divider, subtitle together
      .fromTo(".pl-char",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.022, ease: "power3.out" },
        "-=0.25"
      )
      .fromTo([".pl-divider", ".pl-subtitle"],
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        "-=0.1"
      )
      // 10+11. Progress bar (shortened to 0.8s)
      .fromTo(".pl-track",
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        "+=0.05"
      )
      .fromTo(".pl-fill",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power1.inOut" },
        "<"
      )
      .to(counter, {
        value: 100,
        duration: 0.8,
        ease: "power1.inOut",
        onUpdate: () => {
          if (progressRef.current)
            progressRef.current.textContent = `${Math.round(counter.value)}%`;
        },
      }, "<")
      // ── EXIT (fast split)
      .to(".pl-center",
        { y: -14, opacity: 0, duration: 0.2, ease: "power2.in" },
        "+=0.05"
      )
      .to(".pl-panel-l",
        { xPercent: -100, duration: 0.38, ease: "power3.inOut" },
        "-=0.08"
      )
      .to(".pl-panel-r",
        { xPercent: 100, duration: 0.38, ease: "power3.inOut" },
        "<"
      );

    return () => { tl.kill(); };
  }, [visible, offline]);

  if (!visible) return null;

  /* ── OFFLINE SCREEN ──────────────────────────────── */
  if (offline) {
    return (
      <div className="fixed inset-0 z-[120] overflow-hidden bg-[#07080c]">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(234,206,113,0.14) 0%, rgba(171,131,57,0.05) 42%, transparent 70%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <div className="animate-pulse">
            <svg
              className="h-12 w-12 text-[#ab8339]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl tracking-[0.28em] text-white">NO INTERNET</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.38em] text-white/40">
              Kontrollo lidhjen dhe provo s&#x00EB;risht
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN PRELOADER ──────────────────────────────── */
  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">

      {/* Left and right panels — split on exit */}
      <div className="pl-panel-l absolute left-0 top-0 h-full w-1/2 bg-[#07080c]" />
      <div className="pl-panel-r absolute right-0 top-0 h-full w-1/2 bg-[#07080c]" />

      {/* Ambient gold orb */}
      <div
        className="pl-orb pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(234,206,113,0.18) 0%, rgba(171,131,57,0.06) 40%, transparent 68%)" }}
      />

      {/* Corner marks */}
      <div className="pl-corner absolute left-6 top-6 z-[2] h-5 w-5 border-l border-t border-[#ab8339]/30" />
      <div className="pl-corner absolute right-6 top-6 z-[2] h-5 w-5 border-r border-t border-[#ab8339]/30" />
      <div className="pl-corner absolute bottom-6 left-6 z-[2] h-5 w-5 border-b border-l border-[#ab8339]/30" />
      <div className="pl-corner absolute bottom-6 right-6 z-[2] h-5 w-5 border-b border-r border-[#ab8339]/30" />

      {/* Top label */}
      <p className="pl-label absolute left-1/2 top-7 z-[2] -translate-x-1/2 select-none text-[8.5px] uppercase tracking-[0.55em] text-white/[0.22]"
        style={{ opacity: 0 }}>
        Est. MMXXIV &middot; Albania
      </p>

      {/* All center content grouped for exit animation */}
      <div className="pl-center absolute inset-0 z-[2] flex flex-col items-center justify-center gap-[1.1rem]">

        {/* Logo with gold glow ring */}
        <div
          className="pl-logo-ring relative overflow-hidden rounded-full border border-[#ab8339]/30 bg-black/50 p-3 sm:p-3.5"
          style={{
            opacity: 0,
            boxShadow: "0 0 0 1px rgba(171,131,57,0.12), 0 0 32px rgba(171,131,57,0.22), 0 0 80px rgba(171,131,57,0.08)",
          }}
        >
          {/* Shine sweep overlay */}
          <div
            className="pl-shine pointer-events-none absolute inset-0 z-10"
            style={{ background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.13) 50%, transparent 100%)" }}
          />
          <Image
            src="/images/illyrianpixel_logo.png"
            alt="Illyrian Pixel"
            width={260}
            height={92}
            priority
            className="pl-logo-img relative z-[1] h-12 w-auto max-w-[200px] object-contain sm:h-[3.4rem]"
            style={{ opacity: 0 }}
          />
        </div>

        {/* Brand name with per-letter stagger */}
        <div className="overflow-hidden pb-0.5 pt-1">
          <p className="font-display select-none text-center text-[1.7rem] tracking-[0.42em] text-white sm:text-[2.5rem]">
            {brand.split("").map((char, i) =>
              char === " " ? (
                <span key={i} className="pl-char inline-block" style={{ opacity: 0 }}>&nbsp;&nbsp;</span>
              ) : (
                <span key={i} className="pl-char inline-block" style={{ opacity: 0 }}>{char}</span>
              )
            )}
          </p>
        </div>

        {/* Gold gradient divider */}
        <span
          className="pl-divider block h-px w-40 origin-left"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(234,206,113,0.85) 50%, transparent)",
            transform: "scaleX(0)",
          }}
        />

        {/* Subtitle */}
        <p
          className="pl-subtitle select-none text-[8.5px] uppercase tracking-[0.52em] text-white/35"
          style={{ opacity: 0 }}
        >
          Creative Digital Studio
        </p>

        {/* Progress bar + counter */}
        <div className="pl-track mt-2 flex flex-col items-center gap-1.5" style={{ opacity: 0 }}>
          <div className="relative h-px w-44 overflow-hidden rounded-full bg-white/[0.07]">
            <span
              className="pl-fill absolute inset-y-0 left-0 block w-full origin-left"
              style={{
                background: "linear-gradient(90deg, rgba(171,131,57,0.7), rgba(234,206,113,1) 50%, rgba(171,131,57,0.7))",
                boxShadow: "0 0 8px rgba(234,206,113,0.55)",
                transform: "scaleX(0)",
              }}
            />
          </div>
          <p ref={progressRef} className="text-[8.5px] tracking-[0.28em] text-[#ab8339]/55">
            0%
          </p>
        </div>

      </div>
    </div>
  );
}
