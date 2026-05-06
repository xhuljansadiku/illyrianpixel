"use client";

import { FormEvent, useRef, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

const services = ["Websites", "E-commerce", "Marketing", "SEO", "Branding"];
const budgets = ["< €1,000", "€1,000 – €3,000", "€3,000 – €7,000", "€7,000+"];
const timelines = ["ASAP", "2-4 javë", "1-2 muaj", "Fleksibël"];

const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com";
const whatsappHref = buildWhatsAppChatHref(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_E164
);

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[#262626] bg-[rgba(10,10,10,0.72)] backdrop-blur-[12px]";

export default function ContactPageClient() {
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    service: services[0],
    budget: budgets[1],
    timeline: timelines[2],
    message: "",
  });

  const canSubmit = useMemo(
    () =>
      form.name.trim().length > 1 &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.businessName.trim().length > 1 &&
      form.message.trim().length > 6,
    [form]
  );

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [key]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Ju lutem plotësoni fushat kryesore.");
      return;
    }
    setError("");
    setSuccess(true);
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
            <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.32em] text-accent/55">{"KONTAKT"}</p>
            <div className="hero-line1 mt-8 overflow-hidden">
              <h1 className="whitespace-pre-line font-display text-[clamp(2rem,4.5vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
                {"Rezervo një konsultë falas\ndhe merr një plan konkret\npër biznesin tënd."}
              </h1>
            </div>
            <div className="hero-divider mt-10 h-px w-14 bg-gradient-to-r from-accent/60 to-transparent" />
            <p className="hero-subtext mt-6 font-body text-[1rem] font-light leading-[1.75] tracking-[0.01em] text-white/42">
              {"30 minuta pa detyrim. Do dalësh me ide të qarta për hapat e radhës."}
            </p>
          </div>
        </section>

        {/* ── MAIN GRID ── */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-14 md:px-10 md:py-18 lg:px-14">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.18fr]">

            {/* ── Booking card ── */}
            <article className={CARD}>
              <div className="p-6 md:p-7">
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ab8339]/70">
                  Rezervo konsultë falas (30 min)
                </p>
                <p className="font-ui mt-1.5 text-[13px] font-light tracking-[0.3px] text-[#A0A0A0]">
                  Diskutojmë projektin, qëllimet dhe si ta kthejmë në klientë realë.
                </p>
              </div>
              <div className="mx-6 mb-6 overflow-hidden rounded-xl border border-[#262626] md:mx-7 md:mb-7">
                <iframe
                  title="Calendly booking"
                  src={calendlyUrl}
                  className="h-[500px] w-full"
                  loading="lazy"
                />
              </div>
            </article>

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
                      Faleminderit.
                    </p>
                    <p className="font-ui mt-2 text-[13px] font-light leading-relaxed tracking-[0.3px] text-[#A0A0A0]">
                      Kërkesa u regjistrua — do t&apos;ju kontaktojmë me plan të qartë brenda 24 orësh.
                    </p>
                  </div>
                ) : (
                  <form className="mt-7 space-y-6" onSubmit={onSubmit} noValidate>
                    <div className="grid gap-6 md:grid-cols-2">
                      <LuxInput
                        label="Emri"
                        placeholder="Si quhesh?"
                        value={form.name}
                        onChange={set("name")}
                      />
                      <LuxInput
                        label="E-mail"
                        placeholder="Email profesional..."
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                      />
                    </div>

                    <LuxInput
                      label="Emri i biznesit"
                      placeholder="Emri i kompanisë..."
                      value={form.businessName}
                      onChange={set("businessName")}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <LuxSelect
                        label="Shërbimi"
                        value={form.service}
                        onChange={set("service")}
                        items={services}
                      />
                      <LuxSelect
                        label="Buxheti"
                        value={form.budget}
                        onChange={set("budget")}
                        items={budgets}
                      />
                    </div>

                    <LuxSelect
                      label="Afati kohor"
                      value={form.timeline}
                      onChange={set("timeline")}
                      items={timelines}
                    />

                    <label className="block">
                      <span className="font-display mb-2.5 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
                        Mesazhi
                      </span>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => set("message")(e.target.value)}
                        placeholder="Na trego pak se me çfarë ke nevojë..."
                        className="font-ui w-full resize-none border-b border-[#262626] bg-transparent py-3 text-[14px] font-light leading-relaxed tracking-[0.3px] text-white outline-none transition-colors duration-300 placeholder:text-[#A0A0A0]/55 focus:border-[#ab8339]"
                      />
                    </label>

                    {error && (
                      <p className="font-ui text-[12px] font-light tracking-[0.3px] text-red-400/75">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="font-ui mt-2 w-full rounded-[2px] bg-[#ab8339] px-8 py-4 text-[12px] font-bold tracking-[1px] text-[#0a0a0a] transition-all duration-500 ease-in-out hover:shadow-[0_0_28px_rgba(171,131,57,0.45),0_0_56px_rgba(171,131,57,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Dërgoje Kërkesën →
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
                    href="https://www.instagram.com/illyrianpixel"
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
  return (
    <label className="block">
      <span className="font-display mb-2.5 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-ui w-full appearance-none border-b border-[#262626] bg-transparent py-3 pr-5 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 focus:border-[#ab8339]"
        >
          {items.map((item) => (
            <option key={item} value={item} className="bg-[#0a0a0a] text-white">
              {item}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-[#A0A0A0]"
        >
          ↓
        </span>
      </div>
    </label>
  );
}
