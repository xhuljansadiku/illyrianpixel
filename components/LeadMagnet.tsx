"use client";

import { useMemo, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

export default function LeadMagnet() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const valid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(".lead-magnet-modal", { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power2.out" });
  }, [open]);

  return (
    <>
      <section id="lead-magnet" className="cinematic-section border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
        <div className="section-wrap py-20 md:py-24">
          <SectionMark label="ANALIZË FALAS" />
          <h2 className="section-title mt-3 max-w-4xl">Merr një vlerësim falas për faqen tënde.</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62">
            Lini email-in tuaj dhe ne ju dërgojmë një listë të qartë me hapat që duhet të ndërhyni menjëherë.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-7 inline-flex rounded-full border border-white/18 bg-white/[0.03] px-6 py-3 text-[11px] tracking-[0.16em] text-white/85 transition hover:border-accent/45"
          >
            MERR ANALIZËN FALAS
          </button>
        </div>
      </section>
      {open ? (
        <div className="fixed inset-0 z-[106] grid place-items-center bg-black/65 px-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="lead-magnet-modal w-full max-w-md rounded-[1rem] border border-white/12 bg-[#111111] p-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] tracking-[0.16em] text-accent/90">ANALIZË FALAS</p>
              <button type="button" onClick={() => setOpen(false)} className="text-lg text-white/65" aria-label="Mbyll">
                ×
              </button>
            </div>
            {done ? (
              <p className="rounded-lg border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-accent/95">
                Faleminderit. Checklist po vjen në email-in tënd.
              </p>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-white/62">Shkruaj email-in dhe do ta dërgojmë brenda pak minutash.</p>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email-i yt"
                  className="mt-4 h-11 w-full rounded-full border border-white/14 bg-black/35 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-accent/55"
                />
                <button
                  type="button"
                  disabled={!valid}
                  onClick={() => setDone(true)}
                  className="mt-4 inline-flex rounded-full border border-accent/70 bg-accent px-5 py-2 text-[11px] tracking-[0.16em] text-black transition hover:bg-[#d5ad4f] disabled:opacity-35"
                >
                  DËRGO
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
