"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type State = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const t = useTranslations("home.newsletter");
  const [state, setState] = useState<State>("idle");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      } else {
        setErrorMsg(data.error ?? t("genericError"));
        setState("error");
      }
    } catch {
      setErrorMsg(t("connectionError"));
      setState("error");
    }
  }

  return (
    <section id="newsletter" className="relative border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(171,131,57,0.07),transparent_60%)]" />

      <div className="section-wrap relative py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/8 px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t("badge")}
          </div>

          {/* Headline */}
          <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            {t("headline")}
          </h2>
          <p className="mt-4 text-[0.95rem] leading-[1.7] text-white/50">
            {t("introLine1")}{" "}
            <span className="text-white/70">{t("introLine2")}</span>
          </p>

          {/* Form / Success / Error */}
          <div className="mt-8">
            {state === "success" ? (
              <div className="mx-auto max-w-sm rounded-2xl border border-accent/30 bg-accent/8 px-6 py-8">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/70">
                  {t("yourCode")}
                </p>
                <p className="font-mono text-[2rem] font-bold tracking-[0.12em] text-accent">
                  {code}
                </p>
                <p className="mt-4 text-[13px] leading-[1.65] text-white/50">
                  {t("codeSentLine1")}<br />
                  {t("codeSentLine2")}
                </p>
                <Link
                  href="/contact"
                  className="interactive-button ip-cta-primary mt-6 inline-flex"
                >
                  {t("bookConsult")}
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row"
              >
                <input
                  ref={inputRef}
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  disabled={state === "loading"}
                  className="h-14 w-full flex-1 rounded-2xl border border-white/15 bg-white/[0.06] px-6 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors duration-200 focus:border-accent/60 focus:bg-white/[0.08] disabled:opacity-50 sm:h-12 sm:rounded-full sm:border-white/12 sm:bg-white/[0.04] sm:px-5 sm:text-[14px]"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="interactive-button ip-cta-primary h-12 shrink-0 disabled:opacity-60"
                >
                  {state === "loading" ? t("submitting") : t("submitCta")}
                </button>
              </form>
            )}

            {state === "error" && (
              <p className="mt-3 text-[13px] text-red-400/80">{errorMsg}</p>
            )}
          </div>

          <p className="mt-5 text-[11px] text-white/25 tracking-[0.04em]">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
