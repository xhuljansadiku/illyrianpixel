"use client";

import { useMemo, useRef, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const MESSAGES = [
  "Klient nga Tirana rezervoi një projekt",
  "+1 projekt këtë javë",
  "Website i ri u lançua",
  "Një ekip zgjodhi paketën Growth"
];

export default function SocialProofToasts() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [viewportHeight, setViewportHeight] = useState(0);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const isMobile = getIsMobile();

  const enabled = useMemo(() => !reduced && viewportHeight >= 620, [reduced, viewportHeight]);

  useIsomorphicLayoutEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    const { gsap } = ensureGSAP();
    let hideTimer: number | undefined;
    let showTimer: number | undefined;
    const initialDelay = viewportHeight < 760 ? 16000 : 10000;

    const cycle = () => {
      const next = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setMessage(next);
      setVisible(true);
      gsap.fromTo(".social-proof-toast", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      hideTimer = window.setTimeout(() => {
        gsap.to(".social-proof-toast", {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setVisible(false)
        });
      }, 3600);
      showTimer = window.setTimeout(cycle, 22000 + Math.random() * 18000);
    };

    showTimer = window.setTimeout(cycle, initialDelay);
    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      if (showTimer) window.clearTimeout(showTimer);
    };
  }, [enabled, viewportHeight]);

  useIsomorphicLayoutEffect(() => {
    if (!visible || !toastRef.current) return;
    const root = document.documentElement;
    const updateToastHeight = () => {
      root.style.setProperty("--social-proof-height", `${toastRef.current?.offsetHeight ?? 0}px`);
    };
    updateToastHeight();
    const observer = new ResizeObserver(updateToastHeight);
    observer.observe(toastRef.current);
    return () => observer.disconnect();
  }, [visible]);

  useIsomorphicLayoutEffect(() => {
    if (visible) return;
    document.documentElement.style.setProperty("--social-proof-height", "0px");
  }, [visible]);

  if (!enabled || !visible) return null;

  return (
    <div
      ref={toastRef}
      className="social-proof-toast fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center rounded-full border border-white/14 bg-[#111111]/92 px-3 py-2 backdrop-blur-md sm:bottom-6 sm:px-4 md:left-6 md:translate-x-0"
      style={{
        bottom: isMobile ? "16px" : "calc(var(--whatsapp-height, 48px) + 40px)"
      }}
    >
      <span className="mr-2 mt-[2px] inline-block h-2 w-2 rounded-full bg-accent/85" />
      <p className="text-[10px] tracking-[0.08em] text-white/74 sm:text-[11px]">{message}</p>
    </div>
  );
}
