"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const MAX_DEG = 3.25;

/** Subtle 3D tilt on pointer position. Desktop only; caller passes `enabled`. */
export function useDepthTilt<T extends HTMLElement>(enabled: boolean): RefObject<T> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = Math.max(-MAX_DEG, Math.min(MAX_DEG, -py * 2 * MAX_DEG));
      const ry = Math.max(-MAX_DEG, Math.min(MAX_DEG, px * 2 * MAX_DEG));
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };

    const onLeave = () => {
      el.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
      el.style.transform = "";
    };
  }, [enabled]);

  return ref as RefObject<T>;
}
