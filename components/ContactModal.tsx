"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_BUDGETS } from "@/lib/leadScore";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackLead } from "@/lib/track";
import { getAttribution } from "@/lib/attribution";
import BrandDropdown from "@/components/BrandDropdown";

// Formular kontakti në dritare (2026-11-06) — hapet nga "Fillo sot" te navbar; të njëjtat fusha si /contact.
// Dërgon te i njëjti /api/contact, me pyetjen me 2 numra kundër bot-eve.
// Të njëjtat si te ContactPageClient
const SERVICES = ["Websites", "E-commerce", "Marketing", "SEO", "Branding"];

const COPY = {
  sq: {
    title: "Fillojmë sot?",
    sub: ["Na tregoni shkurt për biznesin tuaj.", "Ju kthejmë përgjigje brenda 24 orësh."],
    name: "Emri",
    email: "Email",
    phone: "Telefon / WhatsApp (opsional)",
    message: "Çfarë ju duhet?",
    check: "Verifikim i shpejtë:",
    answer: "Përgjigjja",
    submit: "Dërgo kërkesën",
    sending: "Duke dërguar…",
    full: "Formulari i plotë",
    choose: "Zgjidhni",
    next: "Vazhdo",
    back: "Pas",
    close: "Mbyll",
    okTitle: "Faleminderit!",
    okBody: "Kërkesa u dërgua. Ju kontaktojmë së shpejti.",
    wrong: "Përgjigjja nuk është e saktë. Provoni pyetjen e re.",
    error: "Diçka nuk shkoi. Provoni sërish ose na shkruani në WhatsApp.",
  },
  en: {
    title: "Shall we start today?",
    sub: ["Tell us briefly about your business.", "We reply within 24 hours."],
    name: "Name",
    email: "Email",
    phone: "Phone / WhatsApp (optional)",
    message: "What do you need?",
    check: "Quick check:",
    answer: "Your answer",
    submit: "Send request",
    sending: "Sending…",
    full: "Full form",
    choose: "Choose",
    next: "Continue",
    back: "Back",
    close: "Close",
    okTitle: "Thank you!",
    okBody: "Your request was sent. We will be in touch soon.",
    wrong: "The answer is not correct. Try the new question.",
    error: "Something went wrong. Try again or message us on WhatsApp.",
  },
};

const INPUT =
  "font-ui w-full border-b border-[#262626] bg-transparent py-2.5 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 placeholder:text-muted/55 focus:border-accent";
const LABEL = "font-display mb-1.5 block text-[0.82rem] font-medium tracking-[0.02em] text-white/70";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const locale = useLocale();
  const t = COPY[locale === "en" ? "en" : "sq"];
  const tc = useTranslations("contact");
  const EMPTY = { name: "", email: "", phone: "", businessName: "", service: "", budget: "", message: "", website: "" };
  const [form, setForm] = useState(EMPTY);
  const [discount, setDiscount] = useState("");
  const discountValid = discount.trim().toUpperCase() === "ILLYRIAN10";
  const [check, setCheck] = useState<{ a: number; b: number; token: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const firstRef = useRef<HTMLTextAreaElement>(null);

  const loadCheck = () => {
    setAnswer("");
    fetch("/api/contact/challenge", { cache: "no-store" })
      .then((r) => r.json())
      .then(setCheck)
      .catch(() => {});
  };

  useEffect(() => {
    if (!open) return;
    trackEvent("contact_form_open", { form_type: "modal" });
    if (!check) loadCheck();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    setTimeout(() => firstRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));
  const step1Ok = form.message.trim().length > 6;
  const canSubmit = step1Ok && form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && answer !== "" && !!check;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountCode: discountValid ? "ILLYRIAN10" : undefined,
          sourcePath: window.location.pathname,
          attribution: getAttribution(),
          checkToken: check?.token,
          checkAnswer: answer,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        // Vetëm kur serveri e ruajti vërtet — honeypot-i kthen sukses të rremë pa `saved`
        if (data.saved) trackLead("modal", { service: form.service, budget: form.budget, locale });
        setForm(EMPTY);
        setDiscount("");
        setStep(1);
        loadCheck();
      } else if (data.code === "check") {
        setError(t.wrong);
        loadCheck();
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => setSent(false), 300);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button type="button" aria-label={t.close} onClick={close} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-h-[96vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-accent/25 bg-[linear-gradient(160deg,#141210_0%,#0d0d0d_60%)] p-6 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:rounded-2xl sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <button
          type="button"
          onClick={close}
          aria-label={t.close}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent/55 hover:text-accentLight"
        >
          ✕
        </button>

        {sent ? (
          <div className="py-10 text-center">
            <p className="text-3xl text-accent">✓</p>
            <h2 id="contact-modal-title" className="mt-4 font-display text-2xl font-bold text-white">{t.okTitle}</h2>
            <p className="mt-3 text-[15px] text-white/60">{t.okBody}</p>
          </div>
        ) : (
          <>
            <h2 id="contact-modal-title" className="pr-10 font-display text-[1.7rem] font-bold leading-tight tracking-[-0.02em] text-white">
              {t.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              {t.sub[0]}
              <br />
              {t.sub[1]}
            </p>

            {/* 2026-11-06: 2 hapa me dropdown — pa scroll. Hapi 1 projekti, hapi 2 kontakti */}
            <div className="mt-5 flex items-center gap-2" aria-hidden>
              {[1, 2].map((n) => (
                <span key={n} className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${step >= n ? "bg-accent" : "bg-white/10"}`} />
              ))}
              <span className="ml-1 font-mono text-[11px] text-white/40">{step}/2</span>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden />

              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label={tc("form.serviceLabel")}
                      placeholder={t.choose}
                      options={SERVICES.map((v) => ({ value: v, label: v }))}
                      value={form.service}
                      onChange={(v) => setForm((p) => ({ ...p, service: v }))}
                    />
                    <Select
                      label={tc("form.budgetLabel")}
                      placeholder={t.choose}
                      options={CONTACT_BUDGETS.map((b) => ({ value: b.value, label: tc(`budgets.${b.key}`) }))}
                      value={form.budget}
                      onChange={(v) => setForm((p) => ({ ...p, budget: v }))}
                    />
                  </div>
                  <label className="block">
                    <span className={LABEL}>{tc("form.businessNameLabel")}</span>
                    <input value={form.businessName} onChange={set("businessName")} maxLength={160} placeholder={tc("form.businessNamePlaceholder")} className={INPUT} />
                  </label>
                  <label className="block">
                    <span className={LABEL}>{t.message}</span>
                    <textarea ref={firstRef} rows={3} value={form.message} onChange={set("message")} maxLength={4000} className={`${INPUT} resize-none`} />
                  </label>
                  <button
                    type="button"
                    disabled={!step1Ok}
                    onClick={() => setStep(2)}
                    className="font-ui mt-2 w-full rounded-[2px] bg-accent px-8 py-3.5 text-[12px] font-bold tracking-[1px] text-bg transition-all duration-500 hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t.next} →
                  </button>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className={LABEL}>{t.name}</span>
                    {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                    <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={120} className={INPUT} autoFocus />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={LABEL}>{t.email}</span>
                      <input type="email" value={form.email} onChange={set("email")} autoComplete="email" maxLength={254} className={INPUT} />
                    </label>
                    <label className="block">
                      <span className={LABEL}>{t.phone}</span>
                      <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" maxLength={30} className={INPUT} />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={LABEL}>
                        {tc("form.discountLabel")} <span className="font-light text-white/30">{tc("form.discountOptional")}</span>
                      </span>
                      <input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        maxLength={40}
                        placeholder="ILLYRIAN10"
                        className={`${INPUT} ${discount.trim() ? (discountValid ? "!border-emerald-500/70" : "!border-red-500/70") : ""}`}
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL}>
                        {t.check} <span className="text-accent">{check ? `${check.a} + ${check.b} = ?` : "…"}</span>
                      </span>
                      <input
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={3}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
                        placeholder={t.answer}
                        className={INPUT}
                      />
                    </label>
                  </div>

                  {error && <p role="alert" className="text-[12px] text-red-400/80">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="font-ui rounded-[2px] border border-white/15 px-5 py-3.5 text-[12px] font-bold tracking-[1px] text-white/70 transition-colors hover:border-accent/55 hover:text-accentLight"
                    >
                      ← {t.back}
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit || loading}
                      className="font-ui flex-1 rounded-[2px] bg-accent px-8 py-3.5 text-[12px] font-bold tracking-[1px] text-bg transition-all duration-500 hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? t.sending : t.submit}
                    </button>
                  </div>
                </>
              )}

              <p className="text-center">
                <Link href="/contact" onClick={close} className="text-[12px] text-white/45 underline-offset-4 transition-colors hover:text-accent hover:underline">
                  {t.full} →
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Dropdown-i i markës (si te /contact), me etiketë kompakte */
function Select({ label, placeholder, options, value, onChange }: { label: string; placeholder: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="relative">
        <BrandDropdown value={value} onChange={onChange} options={options} placeholder={placeholder} label={label} />
      </div>
    </div>
  );
}
