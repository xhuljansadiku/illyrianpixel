"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

type Goal = "sales" | "brand" | "leads";
type Site = "yes" | "no";
type Budget = "starter" | "growth" | "scale";
type Timeline = "asap" | "quarter" | "flex";

type Reco = "Website" | "E-commerce" | "Marketing" | "SEO";

const steps = [
  { key: "goal", title: "Çfarë dëshiron të arrihet?" },
  { key: "site", title: "Ke website aktiv?" },
  { key: "budget", title: "Buxheti është në çfarë niveli?" },
  { key: "timeline", title: "Sa i ngutshëm është projekti?" }
] as const;

function recommend(g: Goal, s: Site, b: Budget, t: Timeline): Reco {
  if (g === "sales" && s === "no" && b !== "starter") return "E-commerce";
  if (g === "sales" && s === "yes") return "Marketing";
  if (g === "leads") return "SEO";
  if (g === "brand" && s === "no") return "Website";
  if (g === "brand" && s === "yes") return "Marketing";
  if (b === "starter" && t === "asap") return "Website";
  if (b === "scale") return "E-commerce";
  return "Website";
}

export default function StrategyQuiz() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");
  const [stepIndex, setStepIndex] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const filled = useMemo(() => {
    let n = 0;
    if (goal) n++;
    if (site) n++;
    if (budget) n++;
    if (timeline) n++;
    return n;
  }, [goal, site, budget, timeline]);

  const result = useMemo(() => {
    if (phase !== "result" || !goal || !site || !budget || !timeline) return null;
    return recommend(goal, site, budget, timeline);
  }, [phase, goal, site, budget, timeline]);

  const animatePanel = useCallback(
    (dir: 1 | -1) => {
      const el = panelRef.current;
      if (!el || reduced) return;
      const { gsap } = ensureGSAP();
      gsap.fromTo(
        el,
        { opacity: 0, y: dir * 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    },
    [reduced]
  );

  useIsomorphicLayoutEffect(() => {
    if (!progressRef.current || reduced) return;
    const { gsap } = ensureGSAP();
    const progress = phase === "result" ? 1 : (stepIndex + 1) / steps.length;
    gsap.to(progressRef.current, {
      scaleX: progress,
      duration: 0.55,
      ease: "power2.out",
      transformOrigin: "left center"
    });
  }, [stepIndex, phase, reduced]);

  const current = steps[stepIndex];

  const canContinue = useMemo(() => {
    if (current.key === "goal") return !!goal;
    if (current.key === "site") return !!site;
    if (current.key === "budget") return !!budget;
    return !!timeline;
  }, [current.key, goal, site, budget, timeline]);

  const goNext = useCallback(() => {
    if (!canContinue) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((s) => s + 1);
      animatePanel(1);
      return;
    }
    if (goal && site && budget && timeline) {
      setPhase("result");
      animatePanel(1);
    }
  }, [animatePanel, canContinue, goal, site, budget, timeline, stepIndex]);

  const goPrev = useCallback(() => {
    if (phase === "result") {
      setPhase("quiz");
      setStepIndex(steps.length - 1);
      animatePanel(-1);
      return;
    }
    setStepIndex((s) => Math.max(s - 1, 0));
    animatePanel(-1);
  }, [animatePanel, phase]);

  const reset = useCallback(() => {
    setPhase("quiz");
    setStepIndex(0);
    setGoal(null);
    setSite(null);
    setBudget(null);
    setTimeline(null);
    animatePanel(1);
  }, [animatePanel]);

  return (
    <section id="strategy-quiz" className="cinematic-section section-tone-services border-t border-white/[0.06]">
      <div className="section-wrap">
        <p className="text-[11px] tracking-[0.22em] text-accent/90">STRATEGJI E SHPEJTË</p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.85rem,4.2vw,2.85rem)] leading-[0.98] text-white">
          Çfarë të duhet në të vërtetë?
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/62">
          Katër pyetje. Një rekomandim i qartë — pa formularë të rëndë.
        </p>

        <div className="mt-8 max-w-xl">
          <div className="h-px w-full overflow-hidden rounded-full bg-white/10">
            <div ref={progressRef} className="h-full w-full origin-left scale-x-[0.25] bg-accent/80" />
          </div>
          <p className="mt-2 text-[11px] tracking-[0.14em] text-white/40">
            {phase === "result" ? "REZULTAT" : `HAPI ${stepIndex + 1} / ${steps.length}`}
          </p>
        </div>

        <div ref={panelRef} className="mt-10 max-w-xl">
          {phase === "quiz" ? (
            <>
              <h3 className="font-display text-xl text-white md:text-2xl">{current.title}</h3>
              <div className="mt-6 space-y-3">
                {current.key === "goal" && (
                  <>
                    <Choice label="Shitje" active={goal === "sales"} onClick={() => setGoal("sales")} />
                    <Choice label="Brand" active={goal === "brand"} onClick={() => setGoal("brand")} />
                    <Choice label="Lead-e" active={goal === "leads"} onClick={() => setGoal("leads")} />
                  </>
                )}
                {current.key === "site" && (
                  <>
                    <Choice label="Po" active={site === "yes"} onClick={() => setSite("yes")} />
                    <Choice label="Jo" active={site === "no"} onClick={() => setSite("no")} />
                  </>
                )}
                {current.key === "budget" && (
                  <>
                    <Choice label="Fillesë" active={budget === "starter"} onClick={() => setBudget("starter")} />
                    <Choice label="Rritje" active={budget === "growth"} onClick={() => setBudget("growth")} />
                    <Choice label="Shkallëzim" active={budget === "scale"} onClick={() => setBudget("scale")} />
                  </>
                )}
                {current.key === "timeline" && (
                  <>
                    <Choice label="Sa më shpejt" active={timeline === "asap"} onClick={() => setTimeline("asap")} />
                    <Choice label="1–3 muaj" active={timeline === "quarter"} onClick={() => setTimeline("quarter")} />
                    <Choice label="Fleksibël" active={timeline === "flex"} onClick={() => setTimeline("flex")} />
                  </>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={stepIndex === 0}
                  onClick={goPrev}
                  className="rounded-full border border-white/16 px-4 py-2 text-[11px] tracking-[0.16em] text-white/70 transition hover:border-white/30 disabled:opacity-30"
                >
                  PRAPA
                </button>
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={goNext}
                  className="rounded-full border border-accent/70 bg-accent px-5 py-2 text-[11px] tracking-[0.16em] text-black transition hover:bg-[#d5ad4f] disabled:opacity-35"
                >
                  VAZHDO
                </button>
              </div>
            </>
          ) : (
            result && (
              <div className="rounded-[1.1rem] border border-white/12 bg-white/[0.03] p-6 backdrop-blur-md">
                <p className="text-[11px] tracking-[0.2em] text-accent/90">REKOMANDIM</p>
                <p className="mt-3 font-display text-2xl text-white md:text-3xl">{result}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Bazuar në përgjigjet e tua, fokusi më i fortë është te {result.toLowerCase()}. Hapi tjetër është një
                  thirrje e shkurtër për të përputhur pritshmëritë me realitetin e tregut.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry-modal"))}
                    data-magnetic="true"
                    className="rounded-full border border-accent/70 bg-accent px-5 py-2 text-[11px] tracking-[0.16em] text-black transition hover:bg-[#d5ad4f]"
                  >
                    REZERVO CALL
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-full border border-white/16 px-4 py-2 text-[11px] tracking-[0.16em] text-white/70 transition hover:border-white/30"
                  >
                    RIFillo
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <p className="mt-10 text-[11px] tracking-[0.12em] text-white/38">PLOTËSUAR: {filled}/4</p>
      </div>
    </section>
  );
}

function Choice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm tracking-wide transition ${
        active
          ? "border-accent/70 bg-accent/10 text-white"
          : "border-white/12 bg-white/[0.02] text-white/75 hover:border-white/22"
      }`}
    >
      <span>{label}</span>
      <span className="text-accent/80">{active ? "●" : "○"}</span>
    </button>
  );
}
