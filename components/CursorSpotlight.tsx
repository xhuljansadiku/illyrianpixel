"use client";

import { useEffect, useRef, useState } from "react";
import { getIsMobile, useReducedMotion } from "@/lib/gsap";
import { mouseBus } from "@/lib/mouseBus";

export default function CursorSpotlight() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const raf = useRef<number | null>(null);
  const pending = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduced || getIsMobile()) return;
    const root = document.documentElement;
    const flush = () => {
      raf.current = null;
      root.style.setProperty("--cursor-spot-x", `${pending.current.x}px`);
      root.style.setProperty("--cursor-spot-y", `${pending.current.y}px`);
    };
    return mouseBus.onMove((x, y) => {
      pending.current = { x, y };
      if (raf.current == null) raf.current = window.requestAnimationFrame(flush);
    });
  }, [mounted, reduced]);

  if (!mounted || reduced || getIsMobile()) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen"
      style={{
        background:
          "radial-gradient(520px circle at var(--cursor-spot-x,50%) var(--cursor-spot-y,40%), rgba(171, 131, 57,0.07), transparent 62%)",
      }}
    />
  );
}
