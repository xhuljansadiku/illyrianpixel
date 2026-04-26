"use client";

import { useCallback, useRef, useState } from "react";
import SectionMark from "@/components/SectionMark";

export default function BeforeAfter() {
  const [pct, setPct] = useState(52);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPct(Math.min(92, Math.max(8, next)));
  }, []);

  return (
    <section id="before-after" className="cinematic-section section-tone-work">
      <div className="section-wrap">
        <SectionMark label="BEFORE / AFTER" />
        <h2 className="section-title mt-3 max-w-4xl">Transformimi i qartë i eksperiencës.</h2>
        <p className="mt-3 max-w-xl text-sm text-white/55">Tërhiq dorezën ose përdor butonat — krahasim i butë.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPct(18)}
            className="rounded-full border border-white/14 px-4 py-1.5 text-[10px] tracking-[0.18em] text-white/65 transition hover:border-accent/45 hover:text-white"
          >
            BEFORE
          </button>
          <button
            type="button"
            onClick={() => setPct(82)}
            className="rounded-full border border-accent/35 bg-accent/10 px-4 py-1.5 text-[10px] tracking-[0.18em] text-accent/90 transition hover:bg-accent/16"
          >
            AFTER
          </button>
        </div>

        <div
          ref={trackRef}
          className="before-after-track relative mt-8 h-[320px] cursor-ew-resize select-none overflow-hidden rounded-[1.2rem] border border-white/12 bg-[#111111] touch-pan-y md:h-[440px]"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            setFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            setFromClientX(e.clientX);
          }}
          onPointerUp={(e) => {
            dragging.current = false;
            try {
              (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
            } catch {
              /* ignore */
            }
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(200,155,46,0.22),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]" />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden border-r border-white/10 bg-black/50 transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          >
            <p className="absolute left-4 top-4 text-xs tracking-[0.14em] text-white/72">BEFORE</p>
            <p className="absolute bottom-4 left-4 max-w-[28ch] text-[11px] leading-relaxed text-white/45">
              Mesazh i përzier, hierarki e dobët, ritëm i ngadaltë.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0" style={{ width: `${100 - pct}%` }}>
            <p className="absolute right-4 top-4 text-xs tracking-[0.14em] text-accent/85">AFTER</p>
            <p className="absolute bottom-4 right-4 max-w-[28ch] text-right text-[11px] leading-relaxed text-white/55">
              Ofertë e qartë, kontrast i kontrolluar, rrjedhë drejt veprimit.
            </p>
          </div>
          <div
            className="before-after-handle absolute inset-y-0 z-20 w-px bg-accent/90 transition-[left] duration-200 ease-out"
            style={{ left: `${pct}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/80 bg-[#0b0b0b] text-[10px] tracking-[0.12em] text-accent shadow-[0_0_24px_rgba(200,155,46,0.18)]">
              ↔
            </div>
          </div>
        </div>

        <input
          type="range"
          min={8}
          max={92}
          value={pct}
          onChange={(event) => setPct(Number(event.target.value))}
          className="mt-5 w-full max-w-md accent-[#c89b2e]"
          aria-label="Pozicioni before / after"
        />
      </div>
    </section>
  );
}
