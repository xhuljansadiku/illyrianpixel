"use client";

// Karta anon lehtë në 3D drejt mausit (2026-10-20). Vetëm me maus
// (pointer: fine) dhe pa reduced-motion; s'shkakton re-render — stili vendoset direkt.
import { useRef, type ReactNode } from "react";

const MAX_DEG = 6;

export default function TiltCard({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  if (!enabled) return <>{children}</>;
  const canTilt = () =>
    enabled &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={ref}
      className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || !canTilt()) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1100px) rotateY(${px * MAX_DEG * 2}deg) rotateX(${-py * MAX_DEG * 2}deg)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
