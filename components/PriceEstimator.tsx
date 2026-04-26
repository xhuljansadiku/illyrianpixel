"use client";

import { useMemo, useRef, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const features = [
  { id: "cms", label: "CMS / redaktim" },
  { id: "copy", label: "Copy & strukturë faqesh" },
  { id: "motion", label: "Motion i kontrolluar" },
  { id: "intl", label: "Shumëgjuhësi" }
] as const;

export default function PriceEstimator() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [pages, setPages] = useState(5);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [marketing, setMarketing] = useState(false);
  const displayRef = useRef<HTMLSpanElement | null>(null);
  const loRef = useRef(2800);
  const hiRef = useRef(4200);

  useIsomorphicLayoutEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  const range = useMemo(() => {
    const base = 1200 + pages * 420;
    const featCount = features.filter((f) => picked[f.id]).length;
    const feat = featCount * 650;
    const mkt = marketing ? 1400 : 0;
    const lo = Math.round(base + feat * 0.85 + mkt * 0.7);
    const hi = Math.round(base + feat * 1.25 + mkt * 1.15);
    return { lo, hi };
  }, [pages, picked, marketing]);

  useIsomorphicLayoutEffect(() => {
    const span = displayRef.current;
    if (!span || reduced) {
      loRef.current = range.lo;
      hiRef.current = range.hi;
      return;
    }
    const { gsap } = ensureGSAP();
    const state = { lo: loRef.current, hi: hiRef.current };
    gsap.to(state, {
      lo: range.lo,
      hi: range.hi,
      duration: isMobile ? 0.35 : 0.55,
      ease: "power2.out",
      onUpdate: () => {
        loRef.current = state.lo;
        hiRef.current = state.hi;
        span.textContent = `€${Math.round(state.lo).toLocaleString("de-DE")} – €${Math.round(state.hi).toLocaleString("de-DE")}`;
      }
    });
  }, [range, reduced, isMobile]);

  return (
    <section id="price-estimator" className="cinematic-section border-t border-white/[0.06] bg-[#070707]/40">
      <div className="section-wrap">
        <p className="text-[11px] tracking-[0.22em] text-accent/90">VLERËSIM I SHPEJTË</p>
        <h2 className="mt-3 max-w-xl font-display text-[clamp(1.75rem,3.8vw,2.55rem)] leading-[0.98] text-white">
          Interval çmimi, në kohë reale.
        </h2>
        <p className="mt-3 max-w-lg text-sm text-white/60">
          Jo ofertë zyrtare — një tregues për të përputhur pritshmëritë para brief-it.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[11px] tracking-[0.18em] text-white/45">NUMRI I FAQEVE</p>
              <p className="font-display text-2xl text-white">{pages}</p>
            </div>
            <input
              type="range"
              min={3}
              max={24}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="mt-4 w-full accent-[#c89b2e]"
            />
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-md">
            <p className="text-[11px] tracking-[0.2em] text-white/45">INTERVAL</p>
            <p className="mt-2 font-display text-[clamp(1.6rem,3.4vw,2.2rem)] text-white">
              <span ref={displayRef}>
                €{range.lo.toLocaleString("de-DE")} – €{range.hi.toLocaleString("de-DE")}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-white/45">VEÇORI</p>
            <div className="mt-4 space-y-2">
              {features.map((f) => (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-white/75 hover:border-white/18"
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-[#c89b2e]"
                    checked={!!picked[f.id]}
                    onChange={() => setPicked((p) => ({ ...p, [f.id]: !p[f.id] }))}
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] text-white/45">MARKETING PAS LANÇIMIT</p>
            <div className="mt-4 flex gap-3">
              <Toggle label="Po" active={marketing} onClick={() => setMarketing(true)} />
              <Toggle label="Jo" active={!marketing} onClick={() => setMarketing(false)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] transition ${
        active ? "border-accent/75 bg-accent/12 text-white" : "border-white/14 text-white/55 hover:border-white/26"
      }`}
    >
      {label}
    </button>
  );
}
