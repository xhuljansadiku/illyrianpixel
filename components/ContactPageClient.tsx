"use client";

import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

const services = ["Websites", "E-commerce", "Marketing", "SEO", "Branding"];
const budgets = ["< €1,000", "€1,000 – €3,000", "€3,000 – €7,000", "€7,000+"];
type DropdownOption = {
  value: string;
  label: string;
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_E164;

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[#262626] bg-[rgba(10,10,10,0.72)] backdrop-blur-[12px]";

function normalizeDropdownText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ContactPageClient() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const whatsappHref = buildWhatsAppChatHref(WHATSAPP_NUMBER, locale);
  const timelines = [
    t("timelines.asap"),
    t("timelines.weeks"),
    t("timelines.months"),
    t("timelines.flexible"),
  ];
  const heroRef = useRef<HTMLElement>(null);
  const [success, setSuccess] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".hero-eyebrow",
        { opacity: 0, y: 10, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
      )
      .fromTo(".hero-line1",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" }, "-=0.25"
      )
      .fromTo(".hero-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.out", transformOrigin: "left" }, "-=0.3"
      )
      .fromTo(".hero-subtext",
        { opacity: 0, y: 14, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, "-=0.25"
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    service: services[0],
    budget: budgets[1],
    timeline: timelines[2],
    message: "",
    website: "", // honeypot — duhet të mbetet bosh; e mbushin vetëm bot-et
  });

  const handleDiscountChange = (v: string) => {
    setDiscountCode(v);
    if (v.trim() === "") {
      setDiscountStatus("idle");
    } else if (v.trim().toUpperCase() === "ILLYRIAN10") {
      setDiscountStatus("valid");
    } else {
      setDiscountStatus("invalid");
    }
  };

  const canSubmit = useMemo(
    () =>
      form.name.trim().length > 1 &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.phone.trim().length > 5 &&
      form.message.trim().length > 6,
    [form]
  );

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [key]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError(t("errors.validation"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
          service: form.service,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message,
          discountCode: discountStatus === "valid" ? "ILLYRIAN10" : undefined,
          sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
          website: form.website,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);

        const gtag = typeof window !== "undefined"
          ? (window as { gtag?: (...args: unknown[]) => void }).gtag
          : undefined;
        if (typeof gtag === "function") {
          gtag("event", "generate_lead", {
            event_category: "contact_form",
            event_label: form.service,
            value: 1,
          });
        }

        setForm({
          name: "",
          email: "",
          phone: "",
          businessName: "",
          service: services[0],
          budget: budgets[1],
          timeline: timelines[2],
          message: "",
          website: "",
        });
        setDiscountCode("");
        setDiscountStatus("idle");
      } else {
        setError(t("errors.generic"));
      }
    } catch {
      setError(t("errors.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-bg pt-14 text-text md:pt-16">
        {/* Ambient radial gradients */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_8%_12%,rgba(171,131,57,0.09),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_90%_78%,rgba(171,131,57,0.06),transparent_38%)]" />

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative z-[1] overflow-hidden border-b border-white/[0.06] bg-[#070707]">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", mixBlendMode: "overlay" }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#ab8339]/[0.07] blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/18 to-transparent md:left-10 lg:left-14" />

          <div className="section-wrap relative py-28 md:py-40">
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{t("hero.eyebrow")}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="md:whitespace-pre-line font-display text-[clamp(2rem,4.5vw,4.2rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em] text-white">
                {t("hero.title")}
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 whitespace-pre-line font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {t("hero.subtext")}
            </p>
          </div>
        </section>

        {/* ── MAIN GRID ── */}
        <section className="mx-auto w-full max-w-[860px] px-5 py-14 md:px-10 md:py-18 lg:px-14">
          <div className="grid items-start gap-6">

            {/* ── Form card ── */}
            <article className={CARD}>
              {/* Gold halo glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(171,131,57,0.11) 0%, transparent 68%)",
                }}
              />

              <div className="relative z-[1] p-7 md:p-9">
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ab8339]/70">
                  project inquiry
                </p>

                {success ? (
                  <div className="mt-8 rounded-[3px] border border-[#ab8339]/30 bg-[#ab8339]/6 px-5 py-5">
                    <p className="font-display text-[1.2rem] font-medium tracking-[0.01em] text-[#ab8339]">
                      {t("success.title")}
                    </p>
                    <p className="font-ui mt-2 text-[13px] font-light leading-relaxed tracking-[0.3px] text-[#A0A0A0]">
                      {t("success.body")}
                    </p>
                  </div>
                ) : (
                  <form className="mt-7 space-y-6" onSubmit={onSubmit} noValidate>
                    {/* Honeypot — e padukshme për njerëzit, e mbushur vetëm nga bot-et */}
                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={(e) => set("website")(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                      <LuxInput
                        label={t("form.nameLabel")}
                        placeholder={t("form.namePlaceholder")}
                        value={form.name}
                        onChange={set("name")}
                      />
                      <LuxInput
                        label={t("form.emailLabel")}
                        placeholder={t("form.emailPlaceholder")}
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                      />
                    </div>

                    <LuxInput
                      label={t("form.phoneLabel")}
                      placeholder="+355 69 123 4567"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                    />

                    <LuxInput
                      label={t("form.businessNameLabel")}
                      placeholder={t("form.businessNamePlaceholder")}
                      value={form.businessName}
                      onChange={set("businessName")}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <LuxSelect
                        label={t("form.serviceLabel")}
                        value={form.service}
                        onChange={set("service")}
                        items={services}
                      />
                      <LuxSelect
                        label={t("form.budgetLabel")}
                        value={form.budget}
                        onChange={set("budget")}
                        items={budgets}
                      />
                    </div>

                    <LuxSelect
                      label={t("form.timelineLabel")}
                      value={form.timeline}
                      onChange={set("timeline")}
                      items={timelines}
                    />

                    <label className="block">
                      <span className="font-display mb-2.5 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
                        {t("form.messageLabel")}
                      </span>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => set("message")(e.target.value)}
                        placeholder={t("form.messagePlaceholder")}
                        className="font-ui w-full resize-none border-b border-[#262626] bg-transparent py-3 text-[14px] font-light leading-relaxed tracking-[0.3px] text-white outline-none transition-colors duration-300 placeholder:text-[#A0A0A0]/55 focus:border-[#ab8339]"
                      />
                    </label>

                    {/* Discount code field */}
                    <div className="block">
                      <span className="font-display mb-2.5 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
                        {t("form.discountLabel")}{" "}
                        <span className="text-white/30 font-light">{t("form.discountOptional")}</span>
                      </span>
                      <div className="relative">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => handleDiscountChange(e.target.value)}
                          placeholder={t("form.discountPlaceholder")}
                          className={`font-ui w-full border-b bg-transparent py-3 pr-8 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 placeholder:text-[#A0A0A0]/55 ${
                            discountStatus === "valid"
                              ? "border-emerald-500/70"
                              : discountStatus === "invalid"
                              ? "border-red-500/70"
                              : "border-[#262626] focus:border-[#ab8339]"
                          }`}
                        />
                        {discountStatus === "valid" && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-400 text-[16px]">✓</span>
                        )}
                        {discountStatus === "invalid" && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400 text-[16px]">✕</span>
                        )}
                      </div>
                      {discountStatus === "valid" && (
                        <p className="mt-1.5 text-[12px] text-emerald-400/80">{t("form.discountValid")}</p>
                      )}
                      {discountStatus === "invalid" && (
                        <p className="mt-1.5 text-[12px] text-red-400/75">{t("form.discountInvalid")}</p>
                      )}
                      {discountStatus === "idle" && (
                        <p className="mt-1.5 text-[12px] text-white/28">
                          {t("form.noDiscountCode")}{" "}&#8202;&#8202;
                          <Link
                            href="/newsletter"
                            className="text-accent/70 underline underline-offset-2 hover:text-accent transition-colors duration-200"
                          >
                            {t("form.getDiscountCta")}
                          </Link>
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="font-ui text-[12px] font-light tracking-[0.3px] text-red-400/75">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit || loading}
                      className="font-ui mt-2 w-full rounded-[2px] bg-[#ab8339] px-8 py-4 text-[12px] font-bold tracking-[1px] text-[#0a0a0a] transition-all duration-500 ease-in-out hover:shadow-[0_0_28px_rgba(171,131,57,0.45),0_0_56px_rgba(171,131,57,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? t("form.submitting") : t("form.submit")}
                    </button>
                  </form>
                )}

                {/* Contact links */}
                <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-[#262626] pt-6">
                  <a
                    href="mailto:info@illyrianpixel.com"
                    className="font-ui text-[12px] font-light tracking-[0.5px] text-[#A0A0A0] transition-colors duration-300 hover:text-[#ab8339]"
                  >
                    info@illyrianpixel.com
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ui text-[12px] font-light tracking-[0.5px] text-[#A0A0A0] transition-colors duration-300 hover:text-[#ab8339]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://www.instagram.com/illyrianpixel/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-ui text-[12px] font-light tracking-[0.5px] text-[#A0A0A0] transition-colors duration-300 hover:text-[#ab8339]"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ── Luxury ghost input ────────────────────────────────────────────────────────
function LuxInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-display mb-2.5 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="font-ui w-full border-b border-[#262626] bg-transparent py-3 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 placeholder:text-[#A0A0A0]/55 focus:border-[#ab8339]"
      />
    </label>
  );
}

function BrandDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selected?.value)
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const clearSearchBuffer = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    searchBufferRef.current = "";
  };

  const scrollOptionIntoView = (index: number) => {
    optionRefs.current[index]?.scrollIntoView({ block: "nearest" });
  };

  const updateActiveIndex = (index: number) => {
    setActiveIndex(index);

    if (open) {
      requestAnimationFrame(() => scrollOptionIntoView(index));
    }
  };

  const findMatchingOptionIndex = (query: string, startIndex: number) => {
    if (!query) return -1;

    const normalizedQuery = normalizeDropdownText(query);
    const isRepeatedCharacter =
      normalizedQuery.length > 1 &&
      normalizedQuery.split("").every((char) => char === normalizedQuery[0]);
    const effectiveQuery = isRepeatedCharacter ? normalizedQuery[0] : normalizedQuery;

    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (startIndex + offset) % options.length;
      const label = normalizeDropdownText(options[index].label);

      if (label.startsWith(effectiveQuery)) {
        return index;
      }
    }

    return -1;
  };

  const runTypeahead = (key: string) => {
    const nextBuffer = `${searchBufferRef.current}${key}`;
    searchBufferRef.current = nextBuffer;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchBufferRef.current = "";
      searchTimeoutRef.current = null;
    }, 650);

    const startIndex = open ? activeIndex + 1 : selectedIndex + 1;
    const matchIndex = findMatchingOptionIndex(nextBuffer, startIndex);

    if (matchIndex === -1) return;

    if (open) {
      updateActiveIndex(matchIndex);
      return;
    }

    onChange(options[matchIndex].value);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }

      updateActiveIndex((activeIndex + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }

      updateActiveIndex((activeIndex - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();

      if (!open) {
        onChange(options[0].value);
        return;
      }

      updateActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      if (!open) {
        onChange(options[options.length - 1].value);
        return;
      }

      updateActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }

      onChange(options[activeIndex].value);
      setOpen(false);
      return;
    }

    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (event.key === " " && !open) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(selectedIndex);
      return;
    }

    if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      runTypeahead(event.key);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(selectedIndex);
      return;
    }

    requestAnimationFrame(() => scrollOptionIntoView(activeIndex));
  }, [activeIndex, open, selectedIndex]);

  useEffect(() => () => clearSearchBuffer(), []);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((state) => !state)}
        onKeyDown={handleKeyDown}
        className={`font-ui flex w-full items-center gap-3 border-b bg-transparent py-3 text-left text-[14px] font-light tracking-[0.3px] outline-none transition-colors duration-300 ${
          open
            ? "border-[#ab8339]"
            : "border-[#262626] hover:border-[#ab8339]/45 focus:border-[#ab8339]"
        }`}
      >
        <span className="min-w-0 flex-1 truncate text-white">{selected?.label}</span>
        <span
          aria-hidden
          className={`shrink-0 text-[10px] transition-all duration-300 ${
            open ? "translate-y-[1px] rotate-180 text-[#ab8339]" : "text-[#A0A0A0]"
          }`}
        >
          ↓
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 pt-3">
          <div className="overflow-hidden rounded-[1rem] border border-[#ab8339]/20 bg-[rgba(10,10,10,0.98)] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div
              className="max-h-72 overflow-y-auto pr-1"
              role="listbox"
              aria-activedescendant={`dropdown-option-${activeIndex}`}
            >
              {options.map((option, index) => {
                const isSelected = option.value === selected?.value;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={option.value}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    id={`dropdown-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      clearSearchBuffer();
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`font-ui flex w-full items-center gap-3 rounded-[0.9rem] px-3 py-3 text-left text-[14px] tracking-[0.3px] transition-colors duration-200 ${
                      isActive
                        ? "bg-[#ab8339]/14 text-white"
                        : isSelected
                          ? "bg-[#ab8339]/8 text-white/90"
                          : "text-white/80 hover:bg-[#ab8339]/10 hover:text-white"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


// ── Luxury ghost select ───────────────────────────────────────────────────────
function LuxSelect({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: string[];
}) {
  const options = items.map((item) => ({ value: item, label: item }));

  return (
    <div className="block">
      <span className="font-display mb-2.5 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
        {label}
      </span>
      <BrandDropdown value={value} onChange={onChange} options={options} />
    </div>
  );
}
