"use client";

import { useMemo, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

type Goal = "sales" | "brand" | "presence";
type Budget = "s" | "m" | "l";
type Time = "fast" | "normal" | "calm";

function buildSummary(goal: Goal, budget: Budget, time: Time): string {
  const g =
    goal === "sales"
      ? "Fokus: shitje dhe konvertim i matshëm."
      : goal === "brand"
        ? "Fokus: narrativë premium dhe diferencim vizual."
        : "Fokus: prezencë e qartë dhe kredibilitet.";
  const b =
    budget === "s"
      ? "Faza 1: MVP i fortë me hierarki të pastër dhe shpejtësi."
      : budget === "m"
        ? "Faza 1–2: platformë + përmirësim të matur pas lançimit."
        : "Faza e zgjeruar: sistem (UX, përmbajtje, performancë, marketing) i lidhur.";
  const t =
    time === "fast"
      ? "Ritëm: sprint i kontrolluar me milestone të qarta."
      : time === "normal"
        ? "Ritëm: cikël standard me hapësirë për polish."
        : "Ritëm: i qetë — më shumë kërkim para dizajnit.";
  return `${g} ${b} ${t} Propozimi ynë: thirrje 20 min për përputhje + brief i shkurtër, pastaj ofertë e strukturuar pa surpriza.`;
}

export default function ProposalMiniModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("sales");
  const [budget, setBudget] = useState<Budget>("m");
  const [time, setTime] = useState<Time>("normal");

  const summary = useMemo(() => buildSummary(goal, budget, time), [goal, budget, time]);

  useIsomorphicLayoutEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setStep(0);
    };
    window.addEventListener("open-proposal-mini", onOpen as EventListener);
    return () => window.removeEventListener("open-proposal-mini", onOpen as EventListener);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(".proposal-mini-panel", { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" });
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-[102] grid place-items-center bg-black/60 px-4 backdrop-blur-sm" onClick={close}>
      <div
        className="proposal-mini-panel w-full max-w-md rounded-[1.1rem] border border-white/12 bg-[#101010]/96 p-6 md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">Mini propozim</h3>
          <button type="button" onClick={close} className="text-xl text-white/65" aria-label="Mbyll">
            ×
          </button>
        </div>
        <p className="text-[11px] tracking-[0.18em] text-white/45">
          HAPI {step + 1} / 3 — pa backend, vetëm orientim.
        </p>

        {step === 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs tracking-[0.14em] text-white/55">QËLLIMI</p>
            {(
              [
                ["sales", "Shitje / konvertim"],
                ["brand", "Brand / perceptim"],
                ["presence", "Prezencë / kredibilitet"]
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setGoal(k)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  goal === k ? "border-accent/70 bg-accent/10 text-white" : "border-white/12 text-white/70 hover:border-white/22"
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs tracking-[0.14em] text-white/55">BUXHETI (INDIKATIV)</p>
            {(
              [
                ["s", "Fillesë"],
                ["m", "Rritje"],
                ["l", "Shkallëzim"]
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setBudget(k)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  budget === k ? "border-accent/70 bg-accent/10 text-white" : "border-white/12 text-white/70 hover:border-white/22"
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs tracking-[0.14em] text-white/55">KOHA</p>
            {(
              [
                ["fast", "I ngutshëm"],
                ["normal", "Standard"],
                ["calm", "I qetë"]
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTime(k)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  time === k ? "border-accent/70 bg-accent/10 text-white" : "border-white/12 text-white/70 hover:border-white/22"
                }`}
              >
                {lab}
              </button>
            ))}
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/72">
              {summary}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-full border border-white/16 px-4 py-2 text-[11px] tracking-[0.16em] text-white/70 hover:border-white/28"
            >
              PRAPA
            </button>
          ) : null}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-full border border-accent/70 bg-accent px-5 py-2 text-[11px] tracking-[0.16em] text-black hover:bg-[#d5ad4f]"
            >
              VAZHDO
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-inquiry-modal"));
                close();
              }}
              data-magnetic="true"
              className="rounded-full border border-accent/70 bg-accent px-5 py-2 text-[11px] tracking-[0.16em] text-black hover:bg-[#d5ad4f]"
            >
              REZERVO CALL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
