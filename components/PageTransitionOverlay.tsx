"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export default function PageTransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const { gsap } = ensureGSAP();
    const overlay = overlayRef.current;
    if (!overlay) return;

    const onTransition = (event: Event) => {
      const custom = event as CustomEvent<{ href?: string }>;
      const href = custom.detail?.href;
      if (!href) return;
      if (reduced) {
        router.push(href);
        return;
      }
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { pointerEvents: "auto" });
      gsap
        .timeline()
        .fromTo(overlay, { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power3.inOut" })
        .call(() => router.push(href))
        .to(overlay, { opacity: 0, clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, delay: 0.25, ease: "power3.inOut" })
        .set(overlay, { pointerEvents: "none" });
    };

    window.addEventListener("case-transition", onTransition as EventListener);
    return () => window.removeEventListener("case-transition", onTransition as EventListener);
  }, [router, reduced]);

  return <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[130] bg-[#0b0b0b] opacity-0" />;
}
