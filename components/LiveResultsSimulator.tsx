"use client";

import { useMemo, useState } from "react";

/** Tangible “what if” metrics: traffic × conversion × depth → leads & revenue (mock). */
export default function LiveResultsSimulator() {
  const [traffic, setTraffic] = useState(4200);
  const [conversion, setConversion] = useState(2.4);
  const [pages, setPages] = useState(6);

  const metrics = useMemo(() => {
    const sessions = traffic;
    const cvr = conversion / 100;
    const depth = 0.88 + Math.min(pages, 20) * 0.012;
    const leads = Math.round(sessions * cvr * depth);
    const rev = Math.round(leads * 42 * (0.9 + conversion * 0.02));
    return { leads, rev };
  }, [traffic, conversion, pages]);

  const leadBarPct = Math.min(100, (metrics.leads / 520) * 100);

  return (
    <section id="live-results-sim" className="cinematic-section border-t border-white/[0.06] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-24 md:py-28">
        <p className="text-[11px] tracking-[0.22em] text-accent/90">SIMULIM REZULTATESH</p>
        <h2 className="mt-3 max-w-xl font-display text-[clamp(1.75rem,3.8vw,2.6rem)] leading-[0.98] text-white">
          Nëse përmirësohet eksperienca, numrat ndjekin.
        </h2>
        <p className="mt-3 max-w-lg text-sm text-white/58">Model i thjeshtuar — për orientim, jo premtim matematikor.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[11px] tracking-[0.16em] text-white/45">
                <span>TRAFIK MUJOR (SEANCA)</span>
                <span className="tabular-nums transition-opacity duration-300">{traffic.toLocaleString("de-DE")}</span>
              </div>
              <input type="range" min={800} max={12000} step={100} value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} className="mt-3 w-full accent-[#c89b2e]" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] tracking-[0.16em] text-white/45">
                <span>KONVERTIM (%)</span>
                <span className="tabular-nums transition-opacity duration-300">{conversion.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={6}
                step={0.1}
                value={conversion}
                onChange={(e) => setConversion(Number(e.target.value))}
                className="mt-3 w-full accent-[#c89b2e]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] tracking-[0.16em] text-white/45">
                <span>THELLËSI (FAQE + RRJEDHË)</span>
                <span className="tabular-nums">{pages}</span>
              </div>
              <input type="range" min={3} max={18} value={pages} onChange={(e) => setPages(Number(e.target.value))} className="mt-3 w-full accent-[#c89b2e]" />
            </div>
          </div>

          <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
            <p className="text-[11px] tracking-[0.2em] text-white/45">LEAD-E / MUJ</p>
            <p className="mt-2 font-display text-[clamp(2.2rem,4vw,3.2rem)] tabular-nums text-white transition-[opacity,transform] duration-300 ease-out">
              {metrics.leads}
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full origin-left rounded-full bg-gradient-to-r from-accent/35 via-accent to-accent/40 transition-[transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `scaleX(${leadBarPct / 100})` }}
              />
            </div>
            <p className="mt-6 text-[11px] tracking-[0.2em] text-white/45">VLERË E ESTIMUAR E KONVERTIMIT (MUJ)</p>
            <p className="mt-2 font-display text-2xl tabular-nums text-accent/95 transition-opacity duration-300">
              €{metrics.rev.toLocaleString("de-DE")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
