"use client";

import { useRef, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

function replyFor(text: string): string {
  const t = text.toLowerCase();
  if (/seo|google|organik/i.test(t)) return "SEO: fillojmë me kërkim intenti, strukturë faqesh dhe matje — jo “fjalë kyçe” pa kontekst.";
  if (/shop|dyqan|e-?commerce|shitje online/i.test(t)) return "E-commerce: rrjedhë blerjeje, shpejtësi, dhe ofertë e qartë në çdo hap.";
  if (/ads|meta|tiktok|reklam/i.test(t)) return "Marketing: teste të vogla, kreativë premium, dhe optimizim drejt CPA-së që dëshiron.";
  if (/website|faqe|web/i.test(t)) return "Website: hierarki, copy, dhe performancë që mbështet konvertimin — dizajn si pasojë e strategjisë.";
  if (/brand|identitet|logo/i.test(t)) return "Branding: sistem vizual + ton zanor që përputhet me çmimin dhe audiencën tuaj.";
  return "Fillojmë me një thirrje të shkurtër për të përputhur qëllimin me ofertën. Nëse më jep kontekst (treg, audiencë, KPI), të sugjeroj hapin më të pastër.";
}

export default function MiniAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "you" | "bot"; text: string }[]>([
    { role: "bot", text: "Përshëndetje. Shkruaj një fjali — unë sugjeroj shërbimin më të përshtatshëm." }
  ]);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!open || !panelRef.current || reduced) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(panelRef.current, { opacity: 0, y: 10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" });
  }, [open, reduced]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "you", text: trimmed }, { role: "bot", text: replyFor(trimmed) }]);
    setInput("");
  };

  if (reduced) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[96] md:bottom-24 md:right-6">
      {open ? (
        <div
          ref={panelRef}
          className="mb-3 w-[min(100vw-2rem,320px)] rounded-[1rem] border border-white/12 bg-[#0c0c0c]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[11px] tracking-[0.2em] text-accent/90">ASISTENT</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-proposal-mini"))}
                className="text-[10px] tracking-[0.14em] text-white/50 underline decoration-white/25 underline-offset-4 hover:text-accent/90"
              >
                Mini propozim
              </button>
              <button type="button" className="text-white/55 hover:text-white" aria-label="Mbyll" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
          </div>
          <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1 text-sm">
            {messages.map((msg, i) => (
              <p
                key={`m-${i}`}
                className={`rounded-lg border px-3 py-2 leading-relaxed ${
                  msg.role === "bot"
                    ? "border-white/10 bg-white/[0.03] text-white/75"
                    : "border-accent/25 bg-accent/[0.06] text-white/88"
                }`}
              >
                {msg.text}
              </p>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Çfarë po kërkon të zgjidhesh?"
              className="min-w-0 flex-1 rounded-full border border-white/12 bg-black/40 px-3 py-2 text-xs text-white outline-none ring-0 placeholder:text-white/35 focus:border-accent/45"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-full border border-accent/70 bg-accent px-3 py-2 text-[10px] tracking-[0.14em] text-black hover:bg-[#d5ad4f]"
            >
              DËRGO
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-magnetic="true"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-[#0b0b0b]/85 text-[11px] tracking-[0.12em] text-accent shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-accent/45"
        aria-expanded={open}
        aria-label="Hap asistentin"
      >
        IP
      </button>
    </div>
  );
}
