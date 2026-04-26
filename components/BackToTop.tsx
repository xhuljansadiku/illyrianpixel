"use client";

import { useState } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const progress = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      setVisible(progress > 0.34);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label="Kthehu sipër"
      className={`fixed z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/70 bg-[#0b0b0b]/80 text-sm text-accent backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(200,155,46,0.35)] sm:h-10 sm:w-10 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{
        right: "24px",
        bottom: "calc(var(--floating-cta-height, 56px) + 40px)"
      }}
    >
      ↑
    </button>
  );
}
