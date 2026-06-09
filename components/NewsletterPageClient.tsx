"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type State = "idle" | "loading" | "success" | "error";

const perks = [
  { label: "Website & E-Commerce", icon: "◈" },
  { label: "SEO & Google Ads",     icon: "◈" },
  { label: "Branding & Dizajn",    icon: "◈" },
  { label: "Social Media",         icon: "◈" },
];

export default function NewsletterPageClient() {
  const [state, setState] = useState<State>("idle");
  const [code, setCode]   = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res  = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setCode(data.code);
        setState("success");
      } else {
        setErrorMsg(data.error ?? "Diçka nuk funksionoi. Provoni sërish.");
        setState("error");
      }
    } catch {
      setErrorMsg("Gabim lidhjeje. Kontrolloni internetin.");
      setState("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-bg pt-14 text-text md:pt-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(171,131,57,0.1),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_80%_80%,rgba(171,131,57,0.06),transparent_38%)]" />

        {/* Hero */}
        <section className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              mixBlendMode: "overlay",
            }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />

          <div className="section-wrap relative py-28 md:py-40">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Ofertë ekskluzive
            </div>
            <h1 className="mt-8 font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
              10% zbritje për<br className="hidden md:block" /> çdo shërbim
            </h1>
            <div className="mt-8 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="mt-6 max-w-md font-body text-[1rem] font-light leading-[1.75] text-white/42">
              Abonohu dhe merr kodin tënd ekskluziv direkt në email.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="section-wrap py-16 md:py-24">
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-16 items-start">

            {/* Left — perks */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/55 mb-7">Çfarë përfshihet</p>
              <ul className="space-y-4">
                {perks.map((p) => (
                  <li key={p.label} className="flex items-center gap-3">
                    <span className="text-accent/60 text-[12px]">{p.icon}</span>
                    <span className="font-body text-[0.95rem] font-light text-white/70">{p.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-6 py-6">
                <p className="font-display text-[1.05rem] font-semibold text-white leading-[1.4]">
                  Si funksionon?
                </p>
                <ol className="mt-4 space-y-3">
                  {[
                    "Shkruani email-in tuaj",
                    "Merrni kodin menjëherë në inbox",
                    "Citoni kodin kur kontaktoni",
                    "10% zbritje aplikohet automatikisht",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] font-light text-white/50 leading-[1.6]">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] text-accent/50">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right — form / success */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#262626] bg-[rgba(10,10,10,0.72)] p-8 backdrop-blur-[12px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-[18rem] w-[18rem] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(171,131,57,0.1) 0%, transparent 68%)" }}
              />

              <div className="relative z-[1]">
                {state === "success" ? (
                  <div className="text-center py-4">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/8 text-[22px] text-accent">
                      ✓
                    </div>
                    <p className="font-display text-[1.3rem] font-semibold text-white">Kodi juaj është gati!</p>
                    <p className="mt-2 text-[13px] text-white/40">U dërgua edhe në email.</p>

                    <div className="mt-7 rounded-xl border border-accent/30 bg-accent/8 px-6 py-5">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/60">Kodi juaj</p>
                      <p className="font-mono text-[2rem] font-bold tracking-[0.12em] text-accent">{code}</p>
                    </div>

                    <p className="mt-5 text-[12px] leading-[1.7] text-white/35">
                      Citoni kodin kur kontaktoni për çdo shërbim.
                    </p>

                    <a
                      href="/contact"
                      className="interactive-button ip-cta-primary mt-7 inline-flex"
                    >
                      Rezervo konsultë →
                    </a>
                  </div>
                ) : (
                  <>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/55 mb-6">
                      Merr kodin tënd
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="font-display mb-2 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
                          Email-i juaj
                        </label>
                        <input
                          ref={inputRef}
                          type="email"
                          required
                          placeholder="email@kompania.com"
                          disabled={state === "loading"}
                          className="font-ui w-full border-b border-[#262626] bg-transparent py-3 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 placeholder:text-[#A0A0A0]/55 focus:border-accent disabled:opacity-50"
                        />
                      </div>

                      {state === "error" && (
                        <p className="text-[12px] text-red-400/80">{errorMsg}</p>
                      )}

                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="font-ui mt-2 w-full rounded-[2px] bg-accent px-8 py-4 text-[12px] font-bold tracking-[1px] text-[#0a0a0a] transition-all duration-500 ease-in-out hover:shadow-[0_0_28px_rgba(171,131,57,0.45),0_0_56px_rgba(171,131,57,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {state === "loading" ? "Duke dërguar…" : "Merr 10% zbritje →"}
                      </button>
                    </form>

                    <p className="mt-5 text-[11px] text-white/20 tracking-[0.04em]">
                      Pa spam.
                    </p>
                  </>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
