"use client";

import { useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com";

export default function CalendlyBooking() {
  const [open, setOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(".calendly-panel", { opacity: 0, y: 18, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" });
  }, [open]);

  return (
    <>
      <section id="booking" className="cinematic-section border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
        <div className="section-wrap py-20 md:py-24">
          <SectionMark label="BOOKING" />
          <h2 className="section-title mt-3 max-w-4xl">Rezervo një call strategjik.</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62">
            20 minuta për të vlerësuar nevojën, ritmin dhe hapat e parë pa humbur kohë.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-magnetic="true"
            className="mt-7 inline-flex rounded-full border border-accent/70 bg-accent px-6 py-3 text-[11px] tracking-[0.16em] text-black transition hover:bg-[#d5ad4f]"
          >
            REZERVO NJË CALL
          </button>
        </div>
      </section>
      {open ? (
        <div className="fixed inset-0 z-[105] grid place-items-center bg-black/68 px-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="calendly-panel h-[min(78vh,720px)] w-full max-w-4xl overflow-hidden rounded-[1rem] border border-white/12 bg-[#0f0f0f]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-[11px] tracking-[0.16em] text-white/65">REZERVO CALL</p>
              <button type="button" onClick={() => setOpen(false)} className="text-xl text-white/62" aria-label="Mbyll">
                ×
              </button>
            </div>
            <iframe title="Calendly booking" src={CALENDLY_URL} className="h-[calc(100%-49px)] w-full" loading="lazy" />
          </div>
        </div>
      ) : null}
    </>
  );
}
