"use client";

import { useEffect, useRef, useState } from "react";
import { getIsMobile, useReducedMotion } from "@/lib/gsap";

/** Soft radial lift that follows the cursor (desktop only). Pointer-events none. */
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
    const onMove = (e: MouseEvent) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (raf.current == null) raf.current = window.requestAnimationFrame(flush);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current != null) window.cancelAnimationFrame(raf.current);
    };
  }, [mounted, reduced]);

  if (!mounted || reduced || getIsMobile()) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen"
      style={{
        background:
          "radial-gradient(520px circle at var(--cursor-spot-x,50%) var(--cursor-spot-y,40%), rgba(200,155,46,0.07), transparent 62%)"
      }}
    />
  );
}
