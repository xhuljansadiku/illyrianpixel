"use client";

import { useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

type Result = {
  design: number;
  seo: number;
  speed: number;
};

const SUGGESTIONS = ["Struktura nuk është e qartë", "SEO nuk është optimizuar", "Website është i ngadalshëm"];

export default function MiniWebsiteAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!result || reduced) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(
      ".audit-reveal",
      { opacity: 0, y: 14, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.08, ease: "power2.out" }
    );
  }, [result, reduced]);

  const onAnalyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setLoading(false);
      setResult({ design: 6, seo: 5, speed: 7 });
    }, 1300);
  };

  return (
    <section id="mini-audit" className="cinematic-section border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-22 md:py-28">
        <SectionMark label="AUDIT I SHPEJTË" />
        <h2 className="section-title mt-3 max-w-3xl">Merr një lexim të parë për website-in tënd.</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62">
          Simulim i shpejtë për orientim strategjik para call-it.
        </p>

        <div className="mt-8 rounded-[1.1rem] border border-white/10 bg-[#111111] p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Vendos URL e website-it tënd"
              className="h-11 flex-1 rounded-full border border-white/14 bg-black/35 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-accent/55"
            />
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading || !url.trim()}
              className="h-11 rounded-full border border-accent/70 bg-accent px-6 text-[11px] tracking-[0.16em] text-black transition hover:bg-[#d5ad4f] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Analizo
            </button>
          </div>

          {loading ? (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm text-white/65">Duke analizuar…</p>
              <div className="loading-shimmer mt-3 h-1.5 rounded-full bg-white/10" />
            </div>
          ) : null}

          {result ? (
            <div className="mt-6 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-2">
                <Score label="Design" value={result.design} />
                <Score label="SEO" value={result.seo} />
                <Score label="Speed" value={result.speed} />
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="audit-reveal text-[11px] tracking-[0.16em] text-accent/85">SUGJERIME TË SHPEJTA</p>
                <ul className="mt-3 space-y-2">
                  {SUGGESTIONS.map((item) => (
                    <li key={item} className="audit-reveal text-sm text-white/68">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="audit-reveal flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
      <p className="text-sm text-white/72">{label}</p>
      <p className="font-display text-2xl text-white">
        {value}
        <span className="text-accent/90">/10</span>
      </p>
    </div>
  );
}
