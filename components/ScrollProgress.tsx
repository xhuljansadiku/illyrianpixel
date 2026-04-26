"use client";

import { useRef } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const { gsap } = ensureGSAP();
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px bg-transparent">
      <span ref={barRef} className="block h-full w-full bg-accent/90" />
    </div>
  );
}
