"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

const STORAGE_KEY = "ip_newsletter_popup_seen";
const DELAY_MS = 7500;

type State = "idle" | "loading" | "success" | "error";

export default function NewsletterPopup() {
  const t = useTranslations("common.newsletterPopup");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(
      ".newsletter-popup-panel",
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
    );
  }, [open]);

  function close() {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setCode(data.code);
        setState("success");
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        setErrorMsg(data.error ?? t("errGeneric"));
        setState("error");
      }
    } catch {
      setErrorMsg(t("errNetwork"));
      setState("error");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/62 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="newsletter-popup-panel relative w-full max-w-sm overflow-hidden rounded-[1.2rem] border border-white/12 bg-[#111111]/95 p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(171,131,57,0.1),transparent_60%)]"
        />

        <button
          onClick={close}
          aria-label={t("closeAria")}
          className="absolute right-4 top-4 z-[1] text-xl text-white/50 transition-colors hover:text-white"
        >
          ×
        </button>

        <div className="relative z-[1]">
          {state === "success" ? (
            <div className="py-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/70">
                {t("codeLabel")}
              </p>
              <p className="font-mono text-[2rem] font-bold tracking-[0.12em] text-accent">
                {code}
              </p>
              <p className="mt-4 text-[13px] leading-[1.65] text-white/50">
                {t("successLine1")}
                <br />
                {t("successLine2")}
              </p>
              <button onClick={close} className="interactive-button ip-cta-primary mt-6 inline-flex">
                {t("close")}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/8 px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t("badge")}
              </div>

              <h3 className="font-display text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-white">
                {t("title")}
              </h3>
              <p className="mt-3 text-[0.88rem] leading-[1.6] text-white/50">
                {t("body")}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-3">
                <input
                  ref={inputRef}
                  type="email"
                  required
                  placeholder={t("placeholder")}
                  disabled={state === "loading"}
                  className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.06] px-6 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors duration-200 focus:border-accent/60 focus:bg-white/[0.08] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="interactive-button ip-cta-primary h-12 w-full disabled:opacity-60"
                >
                  {state === "loading" ? t("sending") : t("submit")}
                </button>
              </form>

              {state === "error" && (
                <p className="mt-3 text-[13px] text-red-400/80">{errorMsg}</p>
              )}

              <p className="mt-4 text-[11px] text-white/25 tracking-[0.04em]">
                {t("noSpam")}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
